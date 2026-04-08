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

// Helper to escape HTML for Telegram
const safeHtml = (str) => {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};

// Telegram config
const TELEGRAM_TOKEN = clean(process.env.TELEGRAM_BOT_TOKEN);
const TELEGRAM_CHAT_ID = clean(process.env.TELEGRAM_CHAT_ID);

const sendTelegramMessage = (message) => {
    if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn("[Telegram] Missing credentials, skipping...");
        return Promise.resolve();
    }
    
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
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    if (!parsed.ok) {
                        console.error("[Telegram] API Error:", parsed.description);
                        return reject(new Error(parsed.description));
                    }
                    resolve(parsed);
                } catch (e) {
                    console.error("[Telegram] Parse Error:", e.message, "Body:", body);
                    reject(new Error("Invalid response from Telegram"));
                }
            });
        });

        req.on('error', (e) => {
            console.error('[Telegram] Request Error:', e.message);
            reject(e);
        });

        req.write(data);
        req.end();
    });
};


exports.createInquiry = async (req, res) => {
    try {
        const inquiryData = req.body || {};
        console.log(`[Inquiry] Processing for type: ${inquiryData.type}`);
        
        let newInquiryId = 'temp-' + Date.now();
        
        // 1. Persist to Storage
        try {
            const newInquiry = db.create('inquiries', inquiryData);
            newInquiryId = newInquiry._id;
            console.log(`[Inquiry] Saved to DB with ID: ${newInquiryId}`);
        } catch (dbErr) {
            console.error("[Inquiry] DB Write failed:", dbErr.message);
        }

        const isSponsor = inquiryData.type === 'sponsor';
        const recipient = 'official@jordancyberclub.com';
        
        // Generate Telegram Message safely
        let telegramMsg = `<b>🚀 New ${isSponsor ? 'Sponsorship Request' : 'Team Registration'}</b>\n\n` +
            `<b>Name:</b> ${safeHtml(inquiryData.name)}\n` +
            `<b>Email:</b> ${safeHtml(inquiryData.email)}\n`;

        if (isSponsor) {
            telegramMsg += `<b>Company:</b> ${safeHtml(inquiryData.companyName || 'N/A')}\n` +
                           `<b>Tier:</b> ${safeHtml(inquiryData.tierInterest || inquiryData.details?.tierInterest || 'N/A')}\n`;
        } else if (inquiryData.type === 'team') {
            const teamDetails = inquiryData.details || {};
            telegramMsg += `<b>Team:</b> ${safeHtml(inquiryData.teamName || teamDetails.teamName || 'N/A')}\n` +
                           `<b>Uni:</b> ${safeHtml(inquiryData.university || teamDetails.university || 'N/A')}\n`;
        }
        
        telegramMsg += `<b>Phone:</b> ${safeHtml(inquiryData.phone || 'N/A')}\n` +
                       `<b>Message:</b>\n<i>${safeHtml(inquiryData.message || 'N/A')}</i>`;

        // 2. Dispatch Notifications
        try {
            await sendTelegramMessage(telegramMsg);
            console.log("[Inquiry] Telegram dispatched.");
        } catch (tgErr) {
            console.error("[Inquiry] Telegram failed:", tgErr.message);
        }

        if (resend) {
            try {
                await resend.emails.send({
                    from: RESEND_FROM,
                    to: recipient,
                    subject: isSponsor ? 'New Sponsorship Request' : 'New Contact Inquiry',
                    text: `New ${isSponsor ? 'Sponsorship' : 'Contact'} Inquiry received.`
                });
                await resend.emails.send({
                    from: RESEND_FROM,
                    to: inquiryData.email,
                    subject: 'Thank You - Jordan Cyber Club',
                    text: `Hello ${inquiryData.name},\n\nWe have received your request and our team will get back to you soon.`
                });
                console.log("[Inquiry] Resend emails dispatched.");
            } catch (mailErr) {
                console.error("[Inquiry] Email fail:", mailErr.message);
            }
        }

        res.status(201).json({ message: 'Success', id: newInquiryId });
    } catch (error) {
        console.error("[Inquiry] CRIT ERROR:", error.stack);
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
