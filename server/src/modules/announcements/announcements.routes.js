const express = require('express');
const router = express.Router();
const {
    getActiveAnnouncements,
    getAllAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
} = require('./announcements.controller');
const { authenticateToken } = require('../../middleware/auth');

// Public route
router.get('/active', getActiveAnnouncements);

// Protected routes (admin only)
router.get('/', authenticateToken, getAllAnnouncements);
router.post('/', authenticateToken, createAnnouncement);
router.put('/:id', authenticateToken, updateAnnouncement);
router.delete('/:id', authenticateToken, deleteAnnouncement);

module.exports = router;
