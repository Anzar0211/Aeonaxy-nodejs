const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL, // Your email address
    pass: process.env.PASSWORD, // Your password
  },
});

// async function to send email
const sendEmail=async(mailRecipient,mailSubject,verificationLink)=> {
  try {
    // send mail with defined transport object    
    const info = await transporter.sendMail({
      from: '"Anzar Khan" <anzarkhan790@gmail.com>', // sender address
      to: [mailRecipient], // list of receivers
      subject: mailSubject, // Subject line
      text: "System Generated Mail ", // plain text body
      html: `<p>${mailSubject}:</p>
             <a href="${verificationLink}">${verificationLink}</a>`, // html body
    });
    console.log("Message sent: %s", info.messageId);
   
  } catch (error) {
    console.error("Error occurred:", error);
    
  }
}


module.exports={sendEmail}

