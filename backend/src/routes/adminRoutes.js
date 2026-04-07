const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const fs = require('fs');
const path = require('path');

// Base protection wrapper for all admin routes.
router.use(protect);

// Utility for deleting orphaned images from the disk
const deleteFileIfExists = (fileUrl) => {
    if (!fileUrl) return;
    try {
        const normalizedUrl = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl;
        const filePath = path.join(__dirname, '../../public', normalizedUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (err) {
        console.error("Error deleting file:", err);
    }
};

// Utility for deeply parsing multipart form formData objects
const parseNestedObj = (field) => {
    try { return typeof field === 'string' ? JSON.parse(field) : field; } catch (e) { return field; }
};

// ==========================================
// TEAM MODULE (Collection: members)
// ==========================================
router.post('/team', upload.single('image'), (req, res) => {
    try {
        const data = { ...req.body };
        if (data.name) data.name = parseNestedObj(data.name);
        if (data.role) data.role = parseNestedObj(data.role);
        if (data.bio) data.bio = parseNestedObj(data.bio);
        if (data.position) data.position = parseNestedObj(data.position);
        
        if (req.file) {
            data.image = `/uploads/${req.file.filename}`;
        }
        
        const item = db.create('members', data);
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/team/:id', upload.single('image'), (req, res) => {
    try {
        const data = { ...req.body };
        if (data.name) data.name = parseNestedObj(data.name);
        if (data.role) data.role = parseNestedObj(data.role);
        if (data.bio) data.bio = parseNestedObj(data.bio);
        if (data.position) data.position = parseNestedObj(data.position);
        
        if (req.file) {
            const existing = db.findOne('members', { _id: req.params.id });
            if (existing && existing.image) deleteFileIfExists(existing.image);
            data.image = `/uploads/${req.file.filename}`;
        }
        
        const updated = db.update('members', { _id: req.params.id }, data);
        if (!updated) return res.status(404).json({ message: 'Not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/team/:id', (req, res) => {
    try {
        const existing = db.findOne('members', { _id: req.params.id });
        if (existing && existing.image) deleteFileIfExists(existing.image);
        db.delete('members', { _id: req.params.id });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ==========================================
// MEDIA MODULE (Collection: media)
// ==========================================
router.post('/media', (req, res) => {
    try {
        const item = db.create('media', req.body);
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/media/:id', (req, res) => {
    try {
        const updated = db.update('media', { _id: req.params.id }, req.body);
        if (!updated) return res.status(404).json({ message: 'Not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/media/:id', (req, res) => {
    try {
        db.delete('media', { _id: req.params.id });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ==========================================
// GALLERY MODULE (Collection: gallery)
// ==========================================
router.post('/gallery', upload.single('image'), (req, res) => {
    try {
        const data = { ...req.body };
        if (data.title) data.title = parseNestedObj(data.title);
        if (data.category) data.category = parseNestedObj(data.category);
        if (req.file) {
            data.image = `/uploads/${req.file.filename}`;
        }
        const item = db.create('gallery', data);
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/gallery/:id', upload.single('image'), (req, res) => {
    try {
        const data = { ...req.body };
        if (data.title) data.title = parseNestedObj(data.title);
        if (data.category) data.category = parseNestedObj(data.category);
        if (req.file) {
            const existing = db.findOne('gallery', { _id: req.params.id });
            if (existing && existing.image) deleteFileIfExists(existing.image);
            data.image = `/uploads/${req.file.filename}`;
        }
        const updated = db.update('gallery', { _id: req.params.id }, data);
        if (!updated) return res.status(404).json({ message: 'Not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/gallery/:id', (req, res) => {
    try {
        const existing = db.findOne('gallery', { _id: req.params.id });
        if (existing && existing.image) deleteFileIfExists(existing.image);
        db.delete('gallery', { _id: req.params.id });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ==========================================
// SPONSORS MODULE (Collection: sponsors)
// ==========================================
router.post('/sponsors', upload.single('image'), (req, res) => {
    try {
        const data = { ...req.body };
        if (data.name) data.name = parseNestedObj(data.name);
        if (req.file) {
            data.image = `/uploads/${req.file.filename}`;
        }
        const item = db.create('sponsors', data);
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/sponsors/:id', upload.single('image'), (req, res) => {
    try {
        const data = { ...req.body };
        if (data.name) data.name = parseNestedObj(data.name);
        if (req.file) {
            const existing = db.findOne('sponsors', { _id: req.params.id });
            if (existing && existing.image) deleteFileIfExists(existing.image);
            data.image = `/uploads/${req.file.filename}`;
        }
        const updated = db.update('sponsors', { _id: req.params.id }, data);
        if (!updated) return res.status(404).json({ message: 'Not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/sponsors/:id', (req, res) => {
    try {
        const existing = db.findOne('sponsors', { _id: req.params.id });
        if (existing && existing.image) deleteFileIfExists(existing.image);
        db.delete('sponsors', { _id: req.params.id });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ==========================================
// STATS MODULE (Collection: stats)
// ==========================================
router.get('/stats', (req, res) => {
    try {
        const stats = db.find('stats');
        res.json(stats[0] || {});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/stats/:id', (req, res) => {
    try {
        const updated = db.update('stats', { _id: req.params.id }, req.body);
        if (!updated) return res.status(404).json({ message: 'Not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ==========================================
// TIMELINE MODULE (Collection: timeline)
// ==========================================
router.post('/timeline', (req, res) => {
    try {
        const data = { ...req.body };
        if (data.title) data.title = parseNestedObj(data.title);
        if (data.description) data.description = parseNestedObj(data.description);
        
        const item = db.create('timeline', data);
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/timeline/:id', (req, res) => {
    try {
        const data = { ...req.body };
        if (data.title) data.title = parseNestedObj(data.title);
        if (data.description) data.description = parseNestedObj(data.description);
        
        const updated = db.update('timeline', { _id: req.params.id }, data);
        if (!updated) return res.status(404).json({ message: 'Not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/timeline/:id', (req, res) => {
    try {
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ==========================================
// TERMINAL MODULE (Collection: terminal)
// ==========================================
router.post('/terminal', (req, res) => {
    try {
        const data = { ...req.body };
        if (data.text) data.text = parseNestedObj(data.text);
        const item = db.create('terminal', data);
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/terminal/:id', (req, res) => {
    try {
        const data = { ...req.body };
        if (data.text) data.text = parseNestedObj(data.text);
        const updated = db.update('terminal', { _id: req.params.id }, data);
        if (!updated) return res.status(404).json({ message: 'Not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/terminal/:id', (req, res) => {
    try {
        db.delete('terminal', { _id: req.params.id });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/terminal/reorder', (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) throw new Error("Invalid IDs array");
        ids.forEach((id, index) => {
            db.update('terminal', { _id: id }, { order: index });
        });
        res.json({ message: 'Reordered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ==========================================
// INQUIRIES MODULE (Collection: inquiries)
// ==========================================
router.get('/inquiries', (req, res) => {
    try {
        const inquiries = db.find('inquiries');
        const sorted = [...inquiries].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(sorted);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/inquiries/:id', (req, res) => {
    try {
        db.delete('inquiries', { _id: req.params.id });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ==========================================
// SPONSORS REORDER (Restored)
// ==========================================
router.post('/sponsors/reorder', (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) throw new Error("Invalid IDs array");
        ids.forEach((id, index) => {
            db.update('sponsors', { _id: id }, { order: index });
        });
        res.json({ message: 'Reordered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/timeline/reorder', (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) throw new Error("Invalid IDs array");
        ids.forEach((id, index) => {
            db.update('timeline', { _id: id }, { order: index });
        });
        res.json({ message: 'Reordered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ==========================================
// SECURITY MODULE
// ==========================================
const { changePassword } = require('../controllers/authController');
router.post('/change-password', changePassword);

module.exports = router;
