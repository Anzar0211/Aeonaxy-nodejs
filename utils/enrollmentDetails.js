const sendEmail = require("./sendMail");
const sql = require("../db");
const enrollmentDetails=async(req,res,next)=>{
    try {
        const fetchEmail=await sql`SELECT email from users where id=${req.user.id}`
        
        const{courseId}=req.body;
        if(!courseId){
            return res.status(400).json({error:"Course ID is required"});
        }
        const enrolledCourse=await sql`SELECT title,description,category from courses where id=${courseId}`;

        const content= `You have successfully Enrolled in the course ${enrolledCourse[0].title} in category ${enrolledCourse[0].category}with course id=${courseId}`;

        const enrolledCourseLink=`https://aeonaxy-nodejs-8des.onrender.com/api/v1/courses/${courseId}`;

        await sendEmail(`${fetchEmail[0].email}`,content,enrolledCourseLink)

        console.log('email sent successfully');

        return res.status(200).json({message:'Enrollment details has been mailed to your registered Email Id'});
    } catch (error) {
        console.log('Error in sending Email', error);
        return res.status(500).json({error:'Server Error'})
    }
}

module.exports={enrollmentDetails};