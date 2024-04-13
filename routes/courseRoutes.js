const {Router}=require('express');
const {getAllCourses,createCourse,deleteCourse}=require('../controllers/courseControllers.js');
const{verifyToken}=require('../utils/verifyUser')
const { route } = require('./userRoutes.js');
const router=Router();


router.get('/',getAllCourses);
router.post('/create',verifyToken,createCourse);
router.delete('/:id',verifyToken,deleteCourse);


module.exports=router