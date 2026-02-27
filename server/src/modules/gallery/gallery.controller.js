const { pool } = require('../../config/db');

// Get all gallery images
const getAllImages = async (req, res, next) => {
    try {
        const { category } = req.query;

        let query = 'SELECT * FROM gallery';
        let params = [];

        if (category) {
            query += ' WHERE category = ?';
            params.push(category);
        }

        query += ' ORDER BY uploaded_at DESC';

        const [images] = await pool.query(query, params);

        res.json({
            success: true,
            data: images
        });
    } catch (error) {
        next(error);
    }
};

// Get gallery categories
const getCategories = async (req, res, next) => {
    try {
        const [categories] = await pool.query(
            'SELECT DISTINCT category FROM gallery WHERE category IS NOT NULL ORDER BY category'
        );

        res.json({
            success: true,
            data: categories.map(c => c.category)
        });
    } catch (error) {
        next(error);
    }
};

// Upload image
const uploadImage = async (req, res, next) => {
    try {
        const { title, category } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Image file is required'
            });
        }

        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Title is required'
            });
        }

        const image_path = req.file.filename;

        const [result] = await pool.query(
            'INSERT INTO gallery (title, image_path, category) VALUES (?, ?, ?)',
            [title, image_path, category]
        );

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        next(error);
    }
};

// Delete image
const deleteImage = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            'DELETE FROM gallery WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        res.json({
            success: true,
            message: 'Image deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllImages,
    getCategories,
    uploadImage,
    deleteImage
};
