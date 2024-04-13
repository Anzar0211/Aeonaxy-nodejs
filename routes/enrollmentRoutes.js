const {Router}=require('express');
const{verifyToken}=require('../utils/verifyUser')
const router=Router();
const{enrollUser,showEnrolledCourses}=require('../controllers/enrollmentControllers')


router.post('/',verifyToken,enrollUser);
router.get('/enrolled_courses',verifyToken,showEnrolledCourses)

module.exports = router; 