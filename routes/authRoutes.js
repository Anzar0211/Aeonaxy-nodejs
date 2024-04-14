const {Router}=require('express');
const router=Router();
const {signup,signin,resetPasswordReq,resetPasswordFunc}=require('../controllers/authControllers');
// verifySuccess,
const { verifyUser,verifySuccess, verifyToken } = require('../utils/verifyUser');

router.post('/signup',verifyUser,signup);
router.get('/verifyEmail',verifySuccess);
router.post('/signin',signin);
router.post('/resetPassword',verifyToken,resetPasswordReq);
router.put('/newPassword',resetPasswordFunc)



module.exports = router; 