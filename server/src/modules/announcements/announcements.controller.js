const { pool } = require('../../config/db');

// Get active announcements (public)
const getActiveAnnouncements = async (req, res, next) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const [announcements] = await pool.query(
            'SELECT * FROM announcements WHERE is_active = true AND start_date <= ? AND end_date >= ? ORDER BY created_at DESC',
            [today, today]
        );

        res.json({
            success: true,
            data: announcements
        });
    } catch (error) {
        next(error);
    }
};

// Get all announcements (admin)
const getAllAnnouncements = async (req, res, next) => {
    try {
        const [announcements] = await pool.query(
            'SELECT * FROM announcements ORDER BY created_at DESC'
        );

        res.json({
            success: true,
            data: announcements
        });
    } catch (error) {
        next(error);
    }
};

// Create announcement
const createAnnouncement = async (req, res, next) => {
    try {
        const { title, description, start_date, end_date, is_active } = req.body;

        if (!title || !description || !start_date || !end_date) {
            return res.status(400).json({
                success: false,
                message: 'Title, description, start date, and end date are required'
            });
        }

        const [result] = await pool.query(
            'INSERT INTO announcements (title, description, start_date, end_date, is_active) VALUES (?, ?, ?, ?, ?)',
            [title, description, start_date, end_date, is_active !== undefined ? is_active : true]
        );

        res.status(201).json({
            success: true,
            message: 'Announcement created successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        next(error);
    }
};

// Update announcement
const updateAnnouncement = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, start_date, end_date, is_active } = req.body;

        let updateFields = [];
        let values = [];

        if (title) {
            updateFields.push('title = ?');
            values.push(title);
        }
        if (description) {
            updateFields.push('description = ?');
            values.push(description);
        }
        if (start_date) {
            updateFields.push('start_date = ?');
            values.push(start_date);
        }
        if (end_date) {
            updateFields.push('end_date = ?');
            values.push(end_date);
        }
        if (is_active !== undefined) {
            updateFields.push('is_active = ?');
            values.push(is_active);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        values.push(id);

        const [result] = await pool.query(
            `UPDATE announcements SET ${updateFields.join(', ')} WHERE id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        res.json({
            success: true,
            message: 'Announcement updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Delete announcement
const deleteAnnouncement = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            'DELETE FROM announcements WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        res.json({
            success: true,
            message: 'Announcement deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getActiveAnnouncements,
    getAllAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
};
