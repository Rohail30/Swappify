const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: true, message: 'User not authenticated' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, data) => {
        if (error) {
            return res.status(401).json({ error: true, message: 'User not authenticated' });
        }

        req.userId = data.userId;
        req.isAdmin = data.isAdmin;

        next();
    }
    );
}

module.exports = verifyToken;