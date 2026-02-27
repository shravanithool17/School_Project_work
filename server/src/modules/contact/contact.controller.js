const { pool } = require('../../config/db');
const { sendContactReply } = require('../../config/email');

// Get all contact messages (admin only)
const getAllMessages = async (req, res, next) => {
    try {
        const [messages] = await pool.query(
            'SELECT * FROM contact_messages ORDER BY created_at DESC'
        );

        res.json({
            success: true,
            data: messages
        });
    } catch (error) {
        next(error);
    }
};

// Submit contact message (public)
const submitMessage = async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required'
            });
        }

        const [result] = await pool.query(
            'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject, message]
        );

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully. We will get back to you soon.',
            data: { id: result.insertId }
        });
    } catch (error) {
        next(error);
    }
};

// Reply to contact message (admin only)
const replyToMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { reply_message } = req.body;
        const adminId = req.user.id; // From auth middleware

        if (!reply_message) {
            return res.status(400).json({
                success: false,
                message: 'Reply message is required'
            });
        }

        // Get original message
        const [messages] = await pool.query(
            'SELECT * FROM contact_messages WHERE id = ?',
            [id]
        );

        if (messages.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        const originalMessage = messages[0];

        // Send email reply
        try {
            await sendContactReply({
                recipientEmail: originalMessage.email,
                recipientName: originalMessage.name,
                replyMessage: reply_message,
                originalMessage: originalMessage.message
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Failed to send email. Please check email configuration.'
            });
        }

        // Save reply to database
        await pool.query(
            'INSERT INTO contact_replies (contact_message_id, admin_id, reply_message) VALUES (?, ?, ?)',
            [id, adminId, reply_message]
        );

        res.json({
            success: true,
            message: 'Reply sent successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get replies for a message (admin only)
const getMessageReplies = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [replies] = await pool.query(
            `SELECT cr.*, a.username as admin_username 
             FROM contact_replies cr 
             JOIN admins a ON cr.admin_id = a.id 
             WHERE cr.contact_message_id = ? 
             ORDER BY cr.sent_at DESC`,
            [id]
        );

        res.json({
            success: true,
            data: replies
        });
    } catch (error) {
        next(error);
    }
};

// Delete contact message (admin only)
const deleteMessage = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            'DELETE FROM contact_messages WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllMessages,
    submitMessage,
    replyToMessage,
    getMessageReplies,
    deleteMessage
};

