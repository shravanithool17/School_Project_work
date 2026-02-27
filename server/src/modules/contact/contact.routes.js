const express = require('express');
const router = express.Router();
const { getAllMessages, submitMessage, replyToMessage, getMessageReplies, deleteMessage } = require('./contact.controller');
const { authenticateToken } = require('../../middleware/auth');

// Public route
router.post('/', submitMessage);

// Admin routes
router.get('/', authenticateToken, getAllMessages);
router.post('/:id/reply', authenticateToken, replyToMessage);
router.get('/:id/replies', authenticateToken, getMessageReplies);
router.delete('/:id', authenticateToken, deleteMessage);

module.exports = router;
