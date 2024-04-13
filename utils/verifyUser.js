const jwt=require( 'jsonwebtoken' );
const {errorHandler}=require('./error');
const nodeMailer=require("nodemailer");
const sendEmail = require('./sendMail');

const verifyToken=(req,res,next)=>{
    console.log(req.cookies);
    const token=req.cookies.access_token;
    if(!token){
        return next(errorHandler(401,'Unauthorized'));
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err) return next(errorHandler(401,"Unauthorized"));
        req.user=user;
        next();
        console.log('abcdefg');
    })
    
}

const verifyUser=async (req, res, next) =>{
    const{email}=req.body;
    try {
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const mailSubject=`Please Verify your account`;
        const verificationLink = `http://localhost:3000/auth/verifyEmail?token=${verificationToken}`;
        await sendEmail(email,mailSubject,verificationLink);
        console.log('Verification email sent successfully');
        const updateUserEmailVerificationStatus =  await sql`UPDATE users SET email_verified = false WHERE email = ${email}`;
        // res.redirect('/auth/confirmation')
        next();
    } catch (error) {
        console.error('Error sending verification email:', error.message, email);
        res.status(500).send('Internal server error');
    }
}



module.exports={
    verifyToken,
    verifyUser
}