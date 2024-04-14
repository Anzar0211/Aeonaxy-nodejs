const sql=require('../db.js')



//Enroll an  user in a course
const enrollUser=async(req,res,next)=>{
    const userId=req.user.id;
    const{courseId}=req.body;
    try{
        await sql `
            INSERT INTO user_course_enrollment(user_id,course_id) VALUES (${userId},${courseId})
        `
        console.log('Enrolled in course successfully');
        next();
    }catch(error){
        console.error('Error enrolling user:');
        res.status(500).json({ message: 'user already enrolled in course/INTERNAL SERVER ERROR' });
    }
}

//Show users the list of their enrolled courses
const showEnrolledCourses=async(req,res,next)=>{
    try{
        const userId=req.user.id;
        const enrolledCourses=await sql`
        SELECT courses.* FROM courses INNER JOIN user_course_enrollment ON courses.id=user_course_enrollment.course_id WHERE user_course_enrollment.user_id = ${userId};
        `
        res.status(200).json(enrolledCourses);
    }catch(error){
        console.error('Error fetching enrolled courses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    
}

module.exports={
    enrollUser,
    showEnrolledCourses
}