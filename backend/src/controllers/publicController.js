const db = require('../lib/db');
const { Resend } = require('resend');
const https = require('https');

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
const resendApiKey = clean(process.env.RESEND_API_KEY);
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const RESEND_FROM = clean(process.env.RESEND_FROM_EMAIL) || 'onboarding@resend.dev';

// Telegram config
const TELEGRAM_TOKEN = clean(process.env.TELEGRAM_BOT_TOKEN);
const TELEGRAM_CHAT_ID = clean(process.env.TELEGRAM_CHAT_ID);

const sendTelegramMessage = (message) => {
    if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });

        const options = {
            hostname: 'api.telegram.org',
            port: 443,
            path: `/bot${TELEGRAM_TOKEN}/sendMessage`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve(JSON.parse(body)));
        });

        req.on('error', (e) => {
            console.error('[Telegram] Error:', e.message);
            reject(e);
        });

        req.write(data);
        req.end();
    });
};


exports.createInquiry = async (req, res) => {
    try {
        const inquiryData = req.body;
        const newInquiry = db.create('inquiries', inquiryData);

        const isSponsor = inquiryData.type === 'sponsor';
        const recipient = 'official@jordancyberclub.com';
        
        // Generate Telegram Message
        const telegramMsg = `<b>🚀 New ${isSponsor ? 'Sponsorship Request' : 'Contact Inquiry'}</b>\n\n` +
            `<b>Name:</b> ${inquiryData.name}\n` +
            `<b>Email:</b> ${inquiryData.email}\n` +
            `<b>Phone:</b> ${inquiryData.phone || 'N/A'}\n` +
            (isSponsor ? `<b>Company:</b> ${inquiryData.companyName || 'N/A'}\n` : '') +
            (isSponsor ? `<b>Tier Interest:</b> ${inquiryData.tierInterest || inquiryData.details?.tierInterest || 'N/A'}\n` : '') +
            `<b>Message:</b>\n<i>${inquiryData.message}</i>`;

        // 1. Send Telegram Notification (Primary)
        try {
            await sendTelegramMessage(telegramMsg);
        } catch (tgErr) {
            console.error("[Telegram] Dispatch failed:", tgErr.message);
        }

        // 2. Send Resend Email (Secondary/Internal)
        if (resend) {
            try {
                await resend.emails.send({
                    from: RESEND_FROM,
                    to: recipient,
                    subject: isSponsor ? 'New Sponsorship Request' : 'New Contact Inquiry',
                    text: `New ${isSponsor ? 'Sponsorship' : 'Contact'} Inquiry received via website.`
                });
            } catch (mailErr) {
                console.error("[Resend] Notification failed (ignoring):", mailErr.message);
            }

            // 3. Send Confirmation to User
            try {
                await resend.emails.send({
                    from: RESEND_FROM,
                    to: inquiryData.email,
                    subject: 'Thank You - Jordan Cyber Club',
                    text: `Hello ${inquiryData.name},\n\nThank you for contacting Jordan Cyber Club. We have received your request and our team will get back to you soon.\n\nBest regards,\nJordan Cyber Club Team`
                });
            } catch (confirmErr) {
                console.error('[Resend] Confirmation failed (ignoring):', confirmErr.message);
            }
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

exports.testTelegram = async (req, res) => {
    try {
        console.log("[Telegram] Starting manual diagnostic test...");
        const result = await sendTelegramMessage("📡 <b>Hack & Escape</b> diagnostic test successful!");
        
        res.json({ 
            status: 'SUCCESS', 
            message: 'Telegram API is connected and test message sent.',
            telegramResponse: result
        });
    } catch (error) {
        console.error("[Telegram] Diagnostic failed:", error);
        res.status(500).json({ 
            status: 'FAILED', 
            error: error.message
        });
    }
};

exports.testEmail = async (req, res) => {
    try {
        if (!resend) throw new Error("RESEND_API_KEY is not configured.");
        console.log("[Resend] Starting manual diagnostic test...");
// ...
        
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
