const { pool } = require('../../config/db');

// Get all admission requests (admin only)
const getAllAdmissions = async (req, res, next) => {
    try {
        const { status } = req.query;

        let query = 'SELECT * FROM admissions';
        let params = [];

        if (status) {
            query += ' WHERE status = ?';
            params.push(status);
        }

        query += ' ORDER BY created_at DESC';

        const [admissions] = await pool.query(query, params);

        res.json({
            success: true,
            data: admissions
        });
    } catch (error) {
        next(error);
    }
};

// Submit admission request (public)
const submitAdmission = async (req, res, next) => {
    try {
        const { student_name, parent_name, mobile, email, class_applied, address } = req.body;

        // Validation
        if (!student_name || !parent_name || !mobile || !class_applied) {
            return res.status(400).json({
                success: false,
                message: 'Student name, parent name, mobile, and class are required'
            });
        }

        const [result] = await pool.query(
            'INSERT INTO admissions (student_name, parent_name, mobile, email, class_applied, address) VALUES (?, ?, ?, ?, ?, ?)',
            [student_name, parent_name, mobile, email, class_applied, address]
        );

        res.status(201).json({
            success: true,
            message: 'Admission request submitted successfully. We will contact you soon.',
            data: { id: result.insertId }
        });
    } catch (error) {
        next(error);
    }
};

// Update admission status (admin only)
const updateAdmissionStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Valid status is required (pending, approved, rejected)'
            });
        }

        const [result] = await pool.query(
            'UPDATE admissions SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Admission request not found'
            });
        }

        res.json({
            success: true,
            message: 'Admission status updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Delete admission request (admin only)
const deleteAdmission = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            'DELETE FROM admissions WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Admission request not found'
            });
        }

        res.json({
            success: true,
            message: 'Admission request deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllAdmissions,
    submitAdmission,
    updateAdmissionStatus,
    deleteAdmission
};
