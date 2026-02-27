const express = require('express');
const router = express.Router();
const {
    getAllEvents,
    getAllEventsAdmin,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} = require('./events.controller');
const { authenticateToken } = require('../../middleware/auth');
const { upload } = require('../../middleware/upload');

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Protected routes (admin only)
router.get('/admin/all', authenticateToken, getAllEventsAdmin);
router.post('/', authenticateToken, upload.single('image'), createEvent);
router.put('/:id', authenticateToken, upload.single('image'), updateEvent);
router.delete('/:id', authenticateToken, deleteEvent);

module.exports = router;
