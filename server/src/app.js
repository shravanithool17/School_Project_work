const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const facultyRoutes = require('./modules/faculty/faculty.routes');
const eventsRoutes = require('./modules/events/events.routes');
const galleryRoutes = require('./modules/gallery/gallery.routes');
const admissionsRoutes = require('./modules/admissions/admissions.routes');
const contactRoutes = require('./modules/contact/contact.routes');
const announcementsRoutes = require('./modules/announcements/announcements.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/admissions', admissionsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/announcements', announcementsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;

