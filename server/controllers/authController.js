const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

        // 3. Hash the password (Security Best Practice)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create the user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'buyer', // Default to buyer if no role sent
            sellerProfile: role === 'seller' ? { shopName } : {} 
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
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
                role: user.role,
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
            isAdmin: updatedUser.isAdmin, // or role
            role: updatedUser.role,       // Keep role consistent
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
    logoutUser,
    updateUserProfile,
};
