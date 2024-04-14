const {Router}=require('express');
const {getAllCourses,createCourse,deleteCourse,getCourseById,updateCourse}=require('../controllers/courseControllers.js');
const{verifyToken}=require('../utils/verifyUser')
const { route } = require('./userRoutes.js');
const router=Router();


router.get('/',getAllCourses);
router.get('/:id',getCourseById);
router.post('/create',verifyToken,createCourse);
router.put('/update/:id',verifyToken,updateCourse);
router.delete('/:id',verifyToken,deleteCourse);


module.exports=router