const bcryptjs=require('bcryptjs');
const{registerUser}=require('../queries/authQueries')
const jwt=require("jsonwebtoken");
const sql = require("../db");
const {sendEmail} = require('../utils/sendMail');


//Register User
const signup = async (req, res, next) => {
    const { name, email, password, profile_picture, phone } = req.body;  
    try {
        const hashedPass=bcryptjs.hashSync(password,10);
        const user=await registerUser(name, email, hashedPass, profile_picture, phone);
        return res.status(201).json({message:"Please verify your email by clicking on the link sent to your email account"})   
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(500).send('Internal server error');
    }
};

// Login User

const signin = async (req, res, next) => {
    if(req.cookies.access_token){
        return res.status(403).send({ auth : false, message: "A User is Already logged in,Please logout first to login with an other account" });
    }
    
    const { email, password } = req.body;
    if (!email || !password || email === '' || password === '') {
        return res.status(400).json({ message: 'Please provide an email and a password' });
    };
    try {
        const userData = await sql`
            SELECT * FROM users
            WHERE email = ${email}
        `;
        if(userData[0].email_verified===false){
            console.log('Please verify your email to login to your account');
            return res.status(403).json({message:'Please verify your email to login to your account by clicking on the verification link'});
        }
        if (!userData || userData.length === 0) {
            return res.status(401).json({ message: "Authentication failed" })
        }
        const validPassword = bcryptjs.compareSync(password, userData[0].password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: userData[0].id, isadmin: userData[0].isadmin },
            process.env.JWT_SECRET,
            { expiresIn: '2d' }
        );
        const { password: pass, ...rest } = userData[0];
        res.status(200).cookie('access_token', token, { httpOnly: true }).json(rest);
    } catch (e) {
        console.error('Error during signin:', e.message);
        res.status(500).send('Internal server error');
    }
};

//Request sent to the server for password reset

const resetPasswordReq=async(req,res,next)=>{
    if(!req.cookies.access_token){
        return res.status(403).send("You are not authorized to perform this action");
    }
    try {
        const{email}=req.body;
        const query=await sql `SELECT * FROM users WHERE email=${email}`;
        if(!query){
            return res.status(404).send('Email not found');    
        }
        const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetLink = `https://aeonaxy-nodejs-41m4.onrender.com/api/v1/auth/newPassword?token=${resetToken}`;
        await sendEmail(email, 'Reset Your Password', resetLink);
        res.status(200).send('Reset password email sent');
        
    } catch (error) {
        console.error('Error resetting password:', error.message);
        res.status(500).send('Internal server error');
    }
}

//password verification and user updation

const resetPasswordFunc=async(req,res,next)=>{
    const { token } = req.query;
    const { newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;
        if (decoded.exp < Date.now() / 1000) {
            return res.status(400).send('Reset password link has expired');
        }
        const hashedPassword = bcryptjs.hashSync(newPassword, 10);
        await sql`UPDATE users SET password=${hashedPassword} WHERE email=${email};`;
        res.status(200).send('Password reset successful');
    } catch (error) {
        console.error('Error resetting password:', error.message);
        res.status(500).send('Internal server error');
    }
}


module.exports={signup,signin,resetPasswordReq,resetPasswordFunc};
