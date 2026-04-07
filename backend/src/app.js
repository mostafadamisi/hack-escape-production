const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const STORAGE_ROOT = process.env.NODE_ENV === 'production' ? '/app/storage' : path.join(process.cwd(), '../storage');
const UPLOADS_DIR = process.env.UPLOADS_PATH || path.join(STORAGE_ROOT, 'uploads');
const DATA_DIR = process.env.DATA_PATH || path.join(STORAGE_ROOT, 'data');

// Auto-seed uploads if empty
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

try {
    const files = fs.readdirSync(UPLOADS_DIR);
    if (files.length === 0) {
        const defaultsUploads = path.join(__dirname, 'defaults/uploads');
        if (fs.existsSync(defaultsUploads)) {
            const defaultFiles = fs.readdirSync(defaultsUploads);
            defaultFiles.forEach(file => {
                fs.copyFileSync(path.join(defaultsUploads, file), path.join(UPLOADS_DIR, file));
            });
            console.log(`[App] Seeded ${defaultFiles.length} images from defaults.`);
        }
    }
} catch (e) {
    console.error('[App] Failed to seed uploads:', e);
}

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
