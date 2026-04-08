const db = require('../lib/db');
const { Resend } = require('resend');

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

// Helper to clean env variables (strips quotes if present)
const clean = (val) => val ? val.replace(/^["']|["']$/g, '').trim() : '';

// Email config - Migrated to Resend (HTTP based) for 100% reliability on Railway
const resend = new Resend(clean(process.env.RESEND_API_KEY));
const RESEND_FROM = clean(process.env.RESEND_FROM_EMAIL) || 'onboarding@resend.dev';


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
            await resend.emails.send({
                from: RESEND_FROM,
                to: recipient,
                subject: isSponsor ? 'New Sponsorship Request' : 'New Contact Inquiry',
                text: `New Sponsorship Request:\n\n` +
                      `Company Name: ${inquiryData.companyName || 'N/A'}\n` +
                      `Contact Person: ${inquiryData.name}\n` +
                      `Email: ${inquiryData.email}\n` +
                      `Phone: ${inquiryData.phone || 'N/A'}\n` +
                      `Sponsorship Tier: ${inquiryData.tierInterest || inquiryData.details?.tierInterest || 'N/A'}\n` +
                      `Message: ${inquiryData.message}`
            });
        } catch (mailErr) {
            console.error("Mail dispatch to official failed (ignoring block):", mailErr.message);
        }

        try {
            await resend.emails.send({
                from: RESEND_FROM,
                to: inquiryData.email,
                subject: 'Thank You - Jordan Cyber Club',
                text: `Hello ${inquiryData.name},\n\nThank you for contacting Jordan Cyber Club. We have received your request and our team will get back to you soon.\n\nBest regards,\nJordan Cyber Club Team`
            });
        } catch (confirmErr) {
            console.error('Confirmation email to user failed (ignoring):', confirmErr.message);
        }

        res.status(201).json({ message: 'Success', id: newInquiry._id });
    } catch (error) {
        console.error("INQUIRY CREATE ERROR:", error.message);
        // Provide more context in logs
        if (error.code === 'EACCES' || error.message.includes('permission denied')) {
            console.error("HINT: Database write failed. Ensure Railway volume is mounted at /app/storage");
        }
        res.status(500).json({ 
            message: 'Something went wrong. Please try again later.',
            error: process.env.NODE_ENV === 'production' ? null : error.message 
        });
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

exports.testEmail = async (req, res) => {
    try {
        console.log("[Resend] Starting manual diagnostic test...");
        
        const testMail = await resend.emails.send({
            from: RESEND_FROM,
            to: clean(process.env.EMAIL_USER) || 'official@jordancyberclub.com',
            subject: 'Resend Diagnostic Test',
            text: 'If you receive this, Resend HTTP API is working correctly on Railway.'
        });
        
        res.json({ 
            status: 'SUCCESS', 
            message: 'Resend API is connected and test email sent.',
            resendResponse: testMail,
            config: {
                from: RESEND_FROM,
                target: clean(process.env.EMAIL_USER) || 'official@jordancyberclub.com'
            }
        });
    } catch (error) {
        console.error("[Resend] Diagnostic failed:", error);
        res.status(500).json({ 
            status: 'FAILED', 
            error: error.message,
            code: error.code,
            stack: error.stack
        });
    }
};
