require('dotenv').config();
const app = require('./src/app');
const { testConnection } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Test database connection before starting server
const startServer = async () => {
    try {
        await testConnection();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📁 API endpoints available at http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
