const express = require('express');
const router = express.Router();
const {
    getAllFaculty,
    getFacultyById,
    createFaculty,
    updateFaculty,
    deleteFaculty
} = require('./faculty.controller');
const { authenticateToken } = require('../../middleware/auth');
const { upload } = require('../../middleware/upload');

// Public routes
router.get('/', getAllFaculty);
router.get('/:id', getFacultyById);

// Protected routes (admin only)
router.post('/', authenticateToken, upload.single('profile_image'), createFaculty);
router.put('/:id', authenticateToken, upload.single('profile_image'), updateFaculty);
router.delete('/:id', authenticateToken, deleteFaculty);

module.exports = router;
