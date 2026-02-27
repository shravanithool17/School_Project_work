const express = require('express');
const router = express.Router();
const {
    getAllAdmissions,
    submitAdmission,
    updateAdmissionStatus,
    deleteAdmission
} = require('./admissions.controller');
const { authenticateToken } = require('../../middleware/auth');

// Public route
router.post('/', submitAdmission);

// Protected routes (admin only)
router.get('/', authenticateToken, getAllAdmissions);
router.put('/:id', authenticateToken, updateAdmissionStatus);
router.delete('/:id', authenticateToken, deleteAdmission);

module.exports = router;
