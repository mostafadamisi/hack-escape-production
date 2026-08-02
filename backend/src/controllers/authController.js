const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../lib/db');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const userExists = db.findOne('users', { email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = db.create('users', { 
            name, 
            email, 
            password: hashedPassword, 
            role: role || 'organizer' 
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = db.findOne('users', { email });
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        // Check for lockout
        if (user.lockUntil && user.lockUntil > Date.now()) {
            const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
            return res.status(403).json({ message: `Account locked. Try again in ${minutesLeft} minutes.` });
        }
        
        if (await bcrypt.compare(password, user.password)) {
            // Reset failed attempts on success
            db.update('users', user._id, { 
                failedAttempts: 0, 
                lockUntil: null 
            });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            // Handle failed attempt
            const failedAttempts = (user.failedAttempts || 0) + 1;
            const updateData = { failedAttempts };
            
            if (failedAttempts >= 5) {
                updateData.lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
                updateData.failedAttempts = 0; // Reset counter for next cycle
            }

            db.update('users', user._id, updateData);

            const message = failedAttempts >= 5 
                ? 'Too many failed attempts. Account locked for 15 minutes.' 
                : 'Invalid email or password';
                
            res.status(401).json({ message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
        const user = db.findOne('users', { _id: userId });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password incorrect' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        db.update('users', userId, { password: hashedPassword });
        
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
