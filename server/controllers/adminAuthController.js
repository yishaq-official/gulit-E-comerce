const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { generateToken } = require('./authController');

// @desc    Admin login
// @route   POST /api/admin/auth/login
// @access  Public
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });
  const hasAdminAccess = Boolean(user && user.role === 'admin');
  if (!hasAdminAccess) {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  return res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

// @desc    Admin forgot password
// @route   POST /api/admin/auth/forgot-password
// @access  Public
const adminForgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const user = await User.findOne({ email });
  // Always return generic success-like response to avoid account enumeration.
  if (!user || user.role !== 'admin') {
    return res.json({ message: 'If the account exists, reset instructions have been sent.' });
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
  await user.save();

  // Demo behavior: return token since no email provider is configured yet.
  return res.json({
    message: 'Password reset token generated',
    resetToken: rawToken,
    expiresInMinutes: 30,
  });
};

// @desc    Admin reset password
// @route   POST /api/admin/auth/reset-password/:token
// @access  Public
const adminResetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
    role: 'admin',
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }

  user.password = password;
  user.resetPasswordToken = '';
  user.resetPasswordExpires = undefined;
  await user.save();

  return res.json({ message: 'Password reset successful' });
};

// @desc    Admin login with Google (demo)
// @route   POST /api/admin/auth/google
// @access  Public
const adminGoogleLogin = async (req, res) => {
  const { email, name, googleId } = req.body;
  if (!email || !googleId) {
    return res.status(400).json({ message: 'Google credentials are required' });
  }

  const user = await User.findOne({ email });
  const hasAdminAccess = Boolean(user && user.role === 'admin');
  if (!hasAdminAccess) {
    return res.status(401).json({ message: 'This Google account is not linked to an admin profile' });
  }

  user.googleId = user.googleId || googleId;
  if (!user.name && name) user.name = name;
  await user.save();

  return res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

// @desc    Get authenticated admin profile
// @route   GET /api/admin/auth/me
// @access  Private/Admin
const getAdminProfile = async (req, res) => {
  return res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
};

module.exports = {
  adminLogin,
  adminForgotPassword,
  adminResetPassword,
  adminGoogleLogin,
  getAdminProfile,
};
