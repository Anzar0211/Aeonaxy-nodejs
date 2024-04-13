const {Router}=require('express');
const router=Router();
const {getUsers,updateUser,getUserById}=require('../controllers/userControllers');
const { verifyToken } = require('../utils/verifyUser');

router.get('/',verifyToken,getUsers);
router.get('/:id',getUserById);
router.put('/update/:id',verifyToken,updateUser);

module.exports = router; 