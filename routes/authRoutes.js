const {Router}=require('express');
const router=Router();
const {signup,signin,verifySuccess,confirmationPage}=require('../controllers/authControllers');
const { verifyUser } = require('../utils/verifyUser');

router.post('/signup',verifyUser,signup);
router.get('/verifyUser',verifySuccess);
router.get('/confirmation',confirmationPage)
router.post('/signin',signin);



module.exports = router; 