const { pool } = require('../../config/db');

// Get all events (public - only published)
const getAllEvents = async (req, res, next) => {
    try {
        const { type } = req.query; // Filter by 'event' or 'news'

        let query = 'SELECT * FROM events WHERE is_published = true';
        let params = [];

        if (type) {
            query += ' AND type = ?';
            params.push(type);
        }

        query += ' ORDER BY event_date DESC, created_at DESC';

        const [events] = await pool.query(query, params);

        res.json({
            success: true,
            data: events
        });
    } catch (error) {
        next(error);
    }
};

// Get all events (admin - including unpublished)
const getAllEventsAdmin = async (req, res, next) => {
    try {
        const [events] = await pool.query(
            'SELECT * FROM events ORDER BY created_at DESC'
        );

        res.json({
            success: true,
            data: events
        });
    } catch (error) {
        next(error);
    }
};

// Get single event
const getEventById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [events] = await pool.query(
            'SELECT * FROM events WHERE id = ?',
            [id]
        );

        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            data: events[0]
        });
    } catch (error) {
        next(error);
    }
};

// Create event
const createEvent = async (req, res, next) => {
    try {
        const { title, description, type, event_date, is_published } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!title || !type) {
            return res.status(400).json({
                success: false,
                message: 'Title and type are required'
            });
        }

        const [result] = await pool.query(
            'INSERT INTO events (title, description, type, event_date, image, is_published) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, type, event_date, image, is_published !== undefined ? is_published : true]
        );

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        next(error);
    }
};

// Update event
const updateEvent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, type, event_date, is_published } = req.body;
        const image = req.file ? req.file.filename : undefined;

        let updateFields = [];
        let values = [];

        if (title) {
            updateFields.push('title = ?');
            values.push(title);
        }
        if (description !== undefined) {
            updateFields.push('description = ?');
            values.push(description);
        }
        if (type) {
            updateFields.push('type = ?');
            values.push(type);
        }
        if (event_date !== undefined) {
            updateFields.push('event_date = ?');
            values.push(event_date);
        }
        if (image) {
            updateFields.push('image = ?');
            values.push(image);
        }
        if (is_published !== undefined) {
            updateFields.push('is_published = ?');
            values.push(is_published);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        values.push(id);

        const [result] = await pool.query(
            `UPDATE events SET ${updateFields.join(', ')} WHERE id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            message: 'Event updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Delete event
const deleteEvent = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            'DELETE FROM events WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllEvents,
    getAllEventsAdmin,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};
