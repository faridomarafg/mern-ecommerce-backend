const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAdmin,protect } = require('../middleWares/authMiddleware');



router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/isAdmin', protect,isAdmin,userController.checkAdmin);

module.exports = router;