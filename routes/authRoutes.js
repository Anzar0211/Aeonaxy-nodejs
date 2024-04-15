const {Router}=require('express');
const router=Router();
const {signup,signin,resetPasswordReq,resetPasswordFunc}=require('../controllers/authControllers');
const {limiter} = require('../utils/rateLimiter');
const { verifyUser,verifySuccess, verifyToken, resendEmail } = require('../utils/verifyUser');

router.post('/signup',limiter,verifyUser,signup);
router.post('/requestEmailVerification',limiter,resendEmail)
router.get('/verifyEmail',verifySuccess);
router.post('/signin',signin);
router.post('/resetPassword',verifyToken,resetPasswordReq);
router.put('/newPassword',resetPasswordFunc)



module.exports = router; 