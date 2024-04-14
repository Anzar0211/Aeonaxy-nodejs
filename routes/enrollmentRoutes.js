const {Router}=require('express');
const{verifyToken}=require('../utils/verifyUser')
const router=Router();
const{enrollUser,showEnrolledCourses}=require('../controllers/enrollmentControllers')
const {enrollmentDetails}=require('../utils/enrollmentDetails')


router.post('/',verifyToken,enrollUser,enrollmentDetails);
router.get('/enrolled_courses',verifyToken,showEnrolledCourses)

module.exports = router; 