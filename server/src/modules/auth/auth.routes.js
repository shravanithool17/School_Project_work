const express = require('express');
const router = express.Router();
const { login, verifyToken } = require('./auth.controller');
const { authenticateToken } = require('../../middleware/auth');

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/verify (protected route)
router.get('/verify', authenticateToken, verifyToken);

module.exports = router;
