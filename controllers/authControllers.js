const bcryptjs=require('bcryptjs');
const {errorHandler}=require('../utils/error');
const{checkEmailExists,registerUser, checkPhoneExists, findUserDetails}=require('../queries/authQueries')
const jwt=require("jsonwebtoken");
const sql = require("../db");
const { verifyUser } = require('../utils/verifyUser');

//Register User
const signup = async (req, res, next) => {
  const { name, email, password, profile_picture, phone } = req.body;
  
  // Check if all required fields are provided
  if (!name || !email || !password || !profile_picture || !phone) {
    return res.status(400).send("ALL FIELDS REQUIRED");
  }
  
  try {
    // Check if email already exists
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
    //  
    const hashedPass=bcryptjs.hashSync(password,10);

    // Register user
    await registerUser(name, email, hashedPass, profile_picture, phone);

    // const resp=await sql `
    //     SELECT id,isadmin from  users WHERE email='${email}';
    // `
    // const emailVerificationToken = jwt.sign(
    //         { id: resp, isadmin: isadmin },
    //         process.env.JWT_SECRET,
    //         { expiresIn: '2d' }
    //     );
    
    // res.status(201).cookie('emailverification_token',emailVerificationToken,{
    //     httpOnly:true
    // });
  } catch (error) {
    console.error('Error during signup:', error.message);
    res.status(500).send('Internal server error');
  }
};

// Login User

const signin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email === '' || password === '') {
        next(errorHandler(400, 'All Fields are Required'));
    }
    try {
        const userData = await sql`
            SELECT * FROM users
            WHERE email = ${email}
        `;
        if (!userData || userData.length === 0) {
            return next(errorHandler(404, 'Invalid Email or Password'));
        }

        
        const validPassword = bcryptjs.compareSync(password, userData[0].password);
        if (!validPassword) {
            return next(errorHandler(401, 'Invalid Email or Password'));
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

const verifySuccess=async(req,res)=>{
    try {
        const{token}=req.query;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = decoded;
        const user=await sql `SELECT * FROM users WHERE email=${email}`;
        if(user){
            await sql`UPDATE users set email_verified=true; where email=${email}}`;
            res.status(200).send("Email verified successfully!");
            res.redirect('/auth/confirmation');
        }
        else{
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error('Error during email verification:', error.message);
        res.status(500).send('Internal server error');
    }
}

const confirmationPage=(req,res)=>{
    res.status(201).json('Confirmation Page');
}

module.exports={signup,signin,verifySuccess,confirmationPage}