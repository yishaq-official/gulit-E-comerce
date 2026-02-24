const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { verifyGoogleCredential, normalizeNameFromEmail } = require('../utils/googleAuth');

// 🔒 Helper function to generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, shopName } = req.body;

        // 1. Check if all fields are present
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // 2. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const normalizedRole = role === 'admin' ? 'admin' : (role === 'seller' ? 'seller' : 'buyer');

        // 4. Create the user
        const user = await User.create({
            name,
            email,
            password,
            role: normalizedRole,
            sellerProfile: role === 'seller' ? { shopName } : {} 
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role || 'buyer',
                token: generateToken(user._id), // Send the token immediately
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate a user (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check for user email
        const user = await User.findOne({ email });

        // 2. Check password
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role || 'buyer',
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate/Register user with Google
// @route   POST /api/users/google
// @access  Public
const googleAuthUser = async (req, res) => {
    try {
        const { credential } = req.body;
        const { email, name, googleId } = await verifyGoogleCredential(credential);

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name: name || normalizeNameFromEmail(email),
                email,
                password: crypto.randomBytes(24).toString('hex'),
                role: 'buyer',
                googleId,
            });
        } else if (!user.googleId) {
            user.googleId = googleId;
            if (!user.name) user.name = name || normalizeNameFromEmail(email);
            await user.save();
        }

        return res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || 'buyer',
            token: generateToken(user._id),
        });
    } catch (error) {
        return res.status(401).json({ message: error.message || 'Google authentication failed' });
    }
};


const logoutUser = (req, res) => {
    // If you were using cookies, you would clear them here:
    // res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    
    res.status(200).json({ message: 'Logged out successfully' });
};



const updateUserProfile = async (req, res) => {
    // req.user is already there because of the 'protect' middleware
    const user = await User.findById(req.user._id);

    if (user) {
        // Update fields OR keep existing ones
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // Only hash/update password if the user actually sent a new one
        if (req.body.password) {
            user.password = req.body.password; 
            // Note: Your User model's "pre-save" hook will automatically hash this!
        }

        const updatedUser = await user.save();

        // Send back the fresh data (so the frontend updates immediately)
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role || 'buyer',
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};



module.exports = {
    generateToken,
    registerUser,
    loginUser,
    googleAuthUser,
    logoutUser,
    updateUserProfile,
};
