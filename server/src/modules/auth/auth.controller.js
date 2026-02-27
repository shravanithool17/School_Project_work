const { pool } = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin Login
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Find admin user
        const [users] = await pool.query(
            'SELECT * FROM admins WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = users[0];

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// Verify Token (for frontend to check if token is valid)
const verifyToken = async (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
};

module.exports = { login, verifyToken };
