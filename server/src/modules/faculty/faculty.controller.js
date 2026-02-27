const { pool } = require('../../config/db');

// Get all faculty members
const getAllFaculty = async (req, res, next) => {
    try {
        const [faculty] = await pool.query(
            'SELECT * FROM faculty ORDER BY created_at DESC'
        );

        res.json({
            success: true,
            data: faculty
        });
    } catch (error) {
        next(error);
    }
};

// Get single faculty member
const getFacultyById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [faculty] = await pool.query(
            'SELECT * FROM faculty WHERE id = ?',
            [id]
        );

        if (faculty.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Faculty member not found'
            });
        }

        res.json({
            success: true,
            data: faculty[0]
        });
    } catch (error) {
        next(error);
    }
};

// Create faculty member
const createFaculty = async (req, res, next) => {
    try {
        const { name, designation, department, qualification, experience } = req.body;
        const profile_image = req.file ? req.file.filename : null;

        // Validation
        if (!name || !designation || !department) {
            return res.status(400).json({
                success: false,
                message: 'Name, designation, and department are required'
            });
        }

        const [result] = await pool.query(
            'INSERT INTO faculty (name, designation, department, qualification, experience, profile_image) VALUES (?, ?, ?, ?, ?, ?)',
            [name, designation, department, qualification, experience, profile_image]
        );

        res.status(201).json({
            success: true,
            message: 'Faculty member created successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        next(error);
    }
};

// Update faculty member
const updateFaculty = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, designation, department, qualification, experience } = req.body;
        const profile_image = req.file ? req.file.filename : undefined;

        // Build update query dynamically
        let updateFields = [];
        let values = [];

        if (name) {
            updateFields.push('name = ?');
            values.push(name);
        }
        if (designation) {
            updateFields.push('designation = ?');
            values.push(designation);
        }
        if (department) {
            updateFields.push('department = ?');
            values.push(department);
        }
        if (qualification !== undefined) {
            updateFields.push('qualification = ?');
            values.push(qualification);
        }
        if (experience !== undefined) {
            updateFields.push('experience = ?');
            values.push(experience);
        }
        if (profile_image) {
            updateFields.push('profile_image = ?');
            values.push(profile_image);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        values.push(id);

        const [result] = await pool.query(
            `UPDATE faculty SET ${updateFields.join(', ')} WHERE id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Faculty member not found'
            });
        }

        res.json({
            success: true,
            message: 'Faculty member updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Delete faculty member
const deleteFaculty = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            'DELETE FROM faculty WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Faculty member not found'
            });
        }

        res.json({
            success: true,
            message: 'Faculty member deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllFaculty,
    getFacultyById,
    createFaculty,
    updateFaculty,
    deleteFaculty
};
