const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

// Send email function
const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"${process.env.SCHOOL_NAME || 'Kendriya Vidyalaya Yavatmal'}" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html: html || text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

// Send reply to contact message
const sendContactReply = async ({ recipientEmail, recipientName, replyMessage, originalMessage }) => {
    const subject = 'Reply to Your Message - Kendriya Vidyalaya Yavatmal';

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Kendriya Vidyalaya Yavatmal</h2>
      <p>Dear ${recipientName},</p>
      <p>Thank you for contacting us. Here is our response to your message:</p>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; white-space: pre-wrap;">${replyMessage}</p>
      </div>
      
      <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
      
      <p style="color: #6b7280; font-size: 14px;"><strong>Your Original Message:</strong></p>
      <div style="background-color: #f9fafb; padding: 15px; border-left: 4px solid #2563eb; margin: 10px 0;">
        <p style="margin: 0; white-space: pre-wrap;">${originalMessage}</p>
      </div>
      
      <p style="margin-top: 30px;">Best regards,<br>Kendriya Vidyalaya<br>Yavatmal</p>
      
      <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
      <p style="color: #9ca3af; font-size: 12px;">
        This is an automated email. Please do not reply to this email address.
      </p>
    </div>
  `;

    return sendEmail({
        to: recipientEmail,
        subject,
        html,
    });
};

module.exports = {
    sendEmail,
    sendContactReply,
};
