const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, changePassword } = require('./users.controller');
const { authenticateToken } = require('../../middleware/auth');
const { upload } = require('../../middleware/upload');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, upload.single('profile_picture'), updateProfile);
router.post('/change-password', authenticateToken, changePassword);

module.exports = router;
