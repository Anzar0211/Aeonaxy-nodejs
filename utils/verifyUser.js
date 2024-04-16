const jwt=require( 'jsonwebtoken' );
const sql = require("../db");
const nodeMailer=require("nodemailer");
const {sendEmail} = require('./sendMail');
const {checkEmailExists,checkPhoneExists}=require('../queries/authQueries')



//Generate session token after Login
const verifyToken=(req,res,next)=>{
    console.log(req.cookies);
    const token=req.cookies.access_token;
    if(!token){
        console.log('UNAUTHORIZED!');
        return res.status(401).json({msg:'YOU ARE NOT AUTHORIZED TO DO THIS ACTION!'});
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            console.log('UNAUTHORIZED');
            return res.status(401).json({ msg: "Unauthorized!" });
        }
        req.user=user;
        next();
    })
    
}


//Resend a verification link to user's email if requested by the user
const resendEmail=async(req,res,next)=>{
    const{email}=req.body;
    try{
    const verifiedEmailRequest=await sql `SELECT email from users where id=${req.user.id}`;
    //Checking whether the provided email is same as registered one or not 
    if (verifiedEmailRequest[0].email !== email) {
      return res.status(400).json({ msg: "The Email you entered does not match with your account." });
    }
    if(!email){
        return  res.status(400).json({msg:"Please provide an email"})
    }
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '6h' });
        const mailSubject=`Please Verify your account`;
        const verificationLink = `https://aeonaxy-nodejs-41m4.onrender.com/api/v1/auth/verifyEmail?token=${verificationToken}`;
        await sendEmail(email,mailSubject,verificationLink);
        return res.status(200).send('Verification link sent to your email')
    }catch(e){
        return res.status(404).send('Could not send email')
    }
}

//Send  email to user for verification of account
const verifyUser=async (req, res, next) =>{
    if(req.cookies.access_token){
        return res.status(403).send({ auth : false, message: "A User is Already logged in,Please logout first to Register an other user" });
    }
    const { name, email, password, profile_picture, phone } = req.body;
  
  // Check if all required fields are provided
    if (!name || !email || !password || !profile_picture || !phone) {
        return res.status(400).send("ALL FIELDS REQUIRED");
    }
    if(phone.length!=10){
        return res.status(400).send('Phone number should be exactly 10 digits');
    }
    try {
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
        return res.status(400).send("Email already exists");
        }
        const phoneExists=await checkPhoneExists(phone);
        if(phoneExists){
            return res.status(400).send('This Phone Number is already in use. Use another phone number')
        }
        if (password.length < 8 || !/^[a-zA-Z0-9]+$/.test(password)) {
        return res.status(400).send("Password should be at least 8 characters long and have alphanumeric characters!!!");
        }

        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '6h' });
        const mailSubject=`Please Verify your account`;
        const verificationLink = `https://aeonaxy-nodejs-41m4.onrender.com/api/v1/auth/verifyEmail?token=${verificationToken}`;
        await sendEmail(email,mailSubject,verificationLink);
        console.log('Verification email sent successfully');
        next();
    } catch (error) {
        console.error('Error sending verification email:', error.message, email);
        res.status(500).send('Internal server error');
    }
}


//SEND VERIFICATION SUCCESS AFTER EMAIL IS VERIFIED
const verifySuccess=async(req,res)=>{
    try {
        const{token}=req.query;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = decoded;
        if (decoded.exp < Date.now() / 1000) {
            return res.status(400).send('Verification link has expired. Please request a new one.');
        }
        const user=await sql`SELECT * FROM users WHERE email=${email}`;
        if(user){
            await sql`UPDATE users set email_verified=true where email=${email}`;
            console.log('User registered successfully');
            res.status(200).send("Email verified successfully!");
        }
        else{
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error('Error during email verification:', error.message);
        res.status(500).send('Internal server error');
    }
}



module.exports={
    verifyToken,
    verifyUser,
    verifySuccess,
    resendEmail
}