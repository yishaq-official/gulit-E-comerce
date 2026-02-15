const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['buyer', 'seller', 'admin'],
        default: 'buyer'
    },
    // 🛍️ Seller Specific Info (Only used if role is 'seller')
    sellerProfile: {
        shopName: { type: String },
        shopDescription: { type: String },
        address: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);