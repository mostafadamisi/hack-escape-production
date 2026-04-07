const db = require('../lib/db');
const nodemailer = require('nodemailer');

const getAllHelper = (collection) => async (req, res) => {
    try {
        const data = db.find(collection);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEvent = async (req, res) => {
    try {
        const events = db.find('events');
        res.json(events[0] || {});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const stats = db.find('stats');
        res.json(stats[0] || {});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSponsors = getAllHelper('sponsors');
exports.getTeam = getAllHelper('members');
exports.getGallery = getAllHelper('gallery');
exports.getMedia = getAllHelper('media');

// Email config
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify connection on startup
transporter.verify((error, success) => {
    if (error) {
        console.error('[Mail] Connection failed:', error.message);
    } else {
        console.log('[Mail] Server is ready to take our messages');
    }
});

exports.createInquiry = async (req, res) => {
    try {
        const inquiryData = req.body;
        const newInquiry = db.create('inquiries', inquiryData);

        const isSponsor = inquiryData.type === 'sponsor';
        const recipient = 'official@jordancyberclub.com';
        
        const mailOptions = {
            from: `"JCC Website" <${process.env.EMAIL_USER}>`,
            to: recipient,
            subject: isSponsor ? 'New Sponsorship Request' : 'New Contact Inquiry',
            text: `New Sponsorship Request:\n\n` +
                  `Company Name: ${inquiryData.companyName || 'N/A'}\n` +
                  `Contact Person: ${inquiryData.name}\n` +
                  `Email: ${inquiryData.email}\n` +
                  `Phone: ${inquiryData.phone || 'N/A'}\n` +
                  `Sponsorship Tier: ${inquiryData.tierInterest || inquiryData.details?.tierInterest || 'N/A'}\n` +
                  `Message: ${inquiryData.message}`
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (mailErr) {
            console.error("Mail dispatch to official failed (ignoring block):", mailErr.message);
        }

        try {
            await transporter.sendMail({
                from: `"Jordan Cyber Club" <${process.env.EMAIL_USER}>`,
                to: inquiryData.email,
                subject: 'Thank You - Jordan Cyber Club',
                text: `Hello ${inquiryData.name},\n\nThank you for contacting Jordan Cyber Club. We have received your request and our team will get back to you soon.\n\nBest regards,\nJordan Cyber Club Team`
            });
        } catch (confirmErr) {
            console.error('Confirmation email to user failed (ignoring):', confirmErr.message);
        }

        res.status(201).json({ message: 'Success', id: newInquiry._id });
    } catch (error) {
        console.error("INQUIRY ERROR:", error.message);
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

exports.getTimeline = async (req, res) => {
    try {
        const timeline = db.find('timeline');
        const sorted = [...timeline].sort((a,b) => a.order - b.order);
        res.json(sorted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTerminal = async (req, res) => {
    try {
        const terminal = db.find('terminal');
        const sorted = [...terminal].sort((a,b) => a.order - b.order);
        res.json(sorted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
