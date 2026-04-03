const express = require('express');
const router = express.Router();
const {register,login,updateUser} = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');


router.post('/register',register);
router.post('/login',login);
router.patch('/manage-user/:userId', authMiddleware, authorize('Admin'), updateUser);

module.exports = router;