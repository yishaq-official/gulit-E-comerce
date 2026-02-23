const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
        enum: ['buyer', 'admin', 'seller'],
        default: 'buyer',
    },
    googleId: { type: String, default: '' },
    resetPasswordToken: { type: String, default: '' },
    resetPasswordExpires: { type: Date },

}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// 👇 2. Middleware to Hash Password on Register/Update
userSchema.pre('save', async function () {
    if (!this.role) {
        this.role = 'buyer';
    }

    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return;
    }

    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
