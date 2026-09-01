const db = require('../lib/db');
const https = require('https');

// ─── Generic GET helpers ────────────────────────────────────────────────────

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
exports.getTeam     = getAllHelper('members');
exports.getGallery  = getAllHelper('gallery');
exports.getMedia    = getAllHelper('media');

exports.getTimeline = async (req, res) => {
    try {
        const timeline = db.find('timeline');
        res.json([...timeline].sort((a, b) => a.order - b.order));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTerminal = async (req, res) => {
    try {
        const terminal = db.find('terminal');
        res.json([...terminal].sort((a, b) => a.order - b.order));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── Telegram ───────────────────────────────────────────────────────────────

const clean = (val) => val ? val.replace(/^["']|["']$/g, '').trim() : '';

const TELEGRAM_TOKEN   = clean(process.env.TELEGRAM_BOT_TOKEN);
const TELEGRAM_CHAT_ID = clean(process.env.TELEGRAM_CHAT_ID);

// Escape user text so Telegram HTML parse_mode never chokes
const safeHtml = (str) => {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};

const sendTelegramMessage = (message) => {
    if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn('[Telegram] Missing credentials — skipping.');
        return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            chat_id:    TELEGRAM_CHAT_ID,
            text:       message,
            parse_mode: 'HTML',
        });

        const options = {
            hostname: 'api.telegram.org',
            port:     443,
            path:     `/bot${TELEGRAM_TOKEN}/sendMessage`,
            method:   'POST',
            headers:  {
                'Content-Type':   'application/json',
                'Content-Length': Buffer.byteLength(payload),
            },
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => { body += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    if (!parsed.ok) {
                        console.error('[Telegram] API rejected:', parsed.description);
                        return reject(new Error(parsed.description));
                    }
                    resolve(parsed);
                } catch (e) {
                    console.error('[Telegram] Bad response:', body);
                    reject(new Error('Invalid JSON from Telegram'));
                }
            });
        });

        req.on('error', (e) => {
            console.error('[Telegram] Network error:', e.message);
            reject(e);
        });

        req.write(payload);
        req.end();
    });
};

// ─── Inquiry / Form Submission ───────────────────────────────────────────────

exports.createInquiry = async (req, res) => {
    try {
        const data = req.body || {};
        console.log(`[Inquiry] New submission — type: ${data.type}`);

        // Persist (best-effort; never blocks the response)
        let savedId = 'temp-' + Date.now();
        try {
            const saved = db.create('inquiries', data);
            savedId = saved._id;
        } catch (dbErr) {
            console.error('[Inquiry] DB write failed:', dbErr.message);
        }

        // Build Telegram message
        const isSponsor = data.type === 'sponsor';
        let msg = `<b>🚀 New ${isSponsor ? 'Sponsorship Request' : 'Team Registration'}</b>\n\n` +
                  `<b>Name:</b>  ${safeHtml(data.name)}\n` +
                  `<b>Email:</b> ${safeHtml(data.email)}\n`;

        if (isSponsor) {
            msg += `<b>Company:</b> ${safeHtml(data.companyName || 'N/A')}\n` +
                   `<b>Tier:</b>    ${safeHtml(data.tierInterest || data.details?.tierInterest || 'N/A')}\n`;
        } else {
            const d = data.details || {};
            msg += `<b>Team:</b> ${safeHtml(data.teamName || d.teamName || 'N/A')}\n` +
                   `<b>Uni:</b>  ${safeHtml(data.university || d.university || 'N/A')}\n`;
        }

        msg += `<b>Phone:</b>   ${safeHtml(data.phone || 'N/A')}\n` +
               `<b>Message:</b> <i>${safeHtml(data.message || '—')}</i>`;

        // Send — errors are caught so the user still gets a success response
        try {
            await sendTelegramMessage(msg);
            console.log('[Inquiry] Telegram delivered ✓');
        } catch (tgErr) {
            console.error('[Inquiry] Telegram failed:', tgErr.message);
        }

        res.status(201).json({ message: 'Success', id: savedId });

    } catch (error) {
        console.error('[Inquiry] FATAL:', error.stack);
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

// ─── Diagnostic ─────────────────────────────────────────────────────────────

exports.testTelegram = async (req, res) => {
    try {
        const result = await sendTelegramMessage('📡 <b>Hack &amp; Escape</b> — Telegram connection test successful!');
        res.json({ status: 'SUCCESS', telegramResponse: result });
    } catch (error) {
        res.status(500).json({ status: 'FAILED', error: error.message });
    }
};
