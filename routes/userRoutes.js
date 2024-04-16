const {Router}=require('express');
const router=Router();
const {getUsers,updateUser,getUserById,signOut}=require('../controllers/userControllers');
const { verifyToken } = require('../utils/verifyUser');

router.get('/',verifyToken,getUsers);
router.get('/:id',getUserById);
router.put('/update/:id',verifyToken,updateUser);
router.post('/signout',verifyToken,signOut);

module.exports = router; 