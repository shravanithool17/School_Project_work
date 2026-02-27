const express = require('express');
const router = express.Router();
const {
    getAllImages,
    getCategories,
    uploadImage,
    deleteImage
} = require('./gallery.controller');
const { authenticateToken } = require('../../middleware/auth');
const { upload } = require('../../middleware/upload');

// Public routes
router.get('/', getAllImages);
router.get('/categories', getCategories);

// Protected routes (admin only)
router.post('/', authenticateToken, upload.single('image'), uploadImage);
router.delete('/:id', authenticateToken, deleteImage);

module.exports = router;
