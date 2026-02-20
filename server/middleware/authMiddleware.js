const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// 🛡️ 1. Protect Route (Verify Token)
const protect = async (req, res, next) => {
    let token;

    // Check if header has "Bearer eyJhbGci..."
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header (remove "Bearer " space)
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token ID & attach to request
            // .select('-password') removes the password from the data
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Move to the next function
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// 👑 2. Admin Only Middleware
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

// 🏪 3. Seller Only Middleware
const seller = (req, res, next) => {
    if (req.user && (req.user.role === 'seller')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as a seller' });
    }
};


module.exports = { protect, admin, seller };