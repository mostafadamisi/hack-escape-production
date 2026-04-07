const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
const UPLOADS_DIR = process.env.UPLOADS_PATH || path.join(__dirname, '../../storage/uploads');
app.use('/uploads', express.static(UPLOADS_DIR));

// Basic Route
app.get('/', (req, res) => {
    res.json({
        message: 'Hack & Escape API — Secure, Scalable, and Bilingual.',
        status: 'UP'
    });
});

// APIs
app.use('/api', require('./routes/publicRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

module.exports = app;
