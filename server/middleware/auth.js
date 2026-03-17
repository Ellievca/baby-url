const jwt = require('jsonwebtoken');

// strict middleware that blocks request if no valid token
const requireAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) return res.status(401).json({ error: 'Not authenticated >:(' });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid or expired token !' });
    }
};

// less strict middleware, attaches user if token is valid, doesn't block anonymous requests
const optionalAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET);
        }
        catch {}
    }
    next();
};

module.exports = { requireAuth, optionalAuth };