const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    // Get token from header: "Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: 'Access denied. No token provided.',
            code: 'NO_TOKEN'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                error: 'Invalid or expired token',
                code: 'INVALID_TOKEN'
            });
        }

        // Add user info to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email
        };

        next();
    });
}

module.exports = { authenticateToken };