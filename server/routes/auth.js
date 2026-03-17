const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// helper function to create jwt tokens
const signToken = (user) =>
    jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

// registration route
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password required.'
            });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).json({ error: 'Email already registered.' });
        }

        const user = await User.create({ email, password });
        res.status(201).json({ token: signToken(user), user: { id: user._id, email: user.email } });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        res.json({ token: signToken(user), user: { id: user._id, email: user.email } });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;