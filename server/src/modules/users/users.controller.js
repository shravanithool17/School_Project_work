const { pool } = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register new user
const register = async (req, res, next) => {
    try {
        const { email, password, full_name } = req.body;

        // Validation
        if (!email || !password || !full_name) {
            return res.status(400).json({
                success: false,
                message: 'Email, password, and full name are required'
            });
        }

        // Check if user already exists
        const [existingUsers] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Create user
        const [result] = await pool.query(
            'INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)',
            [email, password_hash, full_name]
        );

        // Generate JWT token
        const token = jwt.sign(
            { id: result.insertId, email, type: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                token,
                user: {
                    id: result.insertId,
                    email,
                    full_name
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Login user
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = users[0];

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, type: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name,
                    profile_picture: user.profile_picture
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get user profile
const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const [users] = await pool.query(
            'SELECT id, email, full_name, profile_picture, created_at FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: users[0]
        });
    } catch (error) {
        next(error);
    }
};

// Update user profile
const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { full_name } = req.body;
        let profile_picture = null;

        if (req.file) {
            profile_picture = req.file.filename;
        }

        // Build update query dynamically
        let updateFields = [];
        let updateValues = [];

        if (full_name) {
            updateFields.push('full_name = ?');
            updateValues.push(full_name);
        }

        if (profile_picture) {
            updateFields.push('profile_picture = ?');
            updateValues.push(profile_picture);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        updateValues.push(userId);

        await pool.query(
            `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );

        // Get updated user
        const [users] = await pool.query(
            'SELECT id, email, full_name, profile_picture FROM users WHERE id = ?',
            [userId]
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: users[0]
        });
    } catch (error) {
        next(error);
    }
};

// Change password
const changePassword = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { current_password, new_password } = req.body;

        if (!current_password || !new_password) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        // Get user
        const [users] = await pool.query(
            'SELECT * FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = users[0];

        // Verify current password
        const isValidPassword = await bcrypt.compare(current_password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const new_password_hash = await bcrypt.hash(new_password, 10);

        // Update password
        await pool.query(
            'UPDATE users SET password_hash = ? WHERE id = ?',
            [new_password_hash, userId]
        );

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
};
