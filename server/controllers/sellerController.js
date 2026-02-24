const Seller = require('../models/sellerModel');
const { generateToken } = require('./authController');
const SellerWalletTransaction = require('../models/sellerWalletTransactionModel');
const crypto = require('crypto');
const { verifyGoogleCredential } = require('../utils/googleAuth');

// @desc    Register a new seller (with KYC documents)
// @route   POST /api/sellers
// @access  Public
const registerSeller = async (req, res) => {
  try {
    const {
      name, email, password, phoneNumber, nationalIdNumber,
      shopName, shopDescription, shopCategory,
      street, city, postalCode, country,
      googleCredential
    } = req.body;

    let resolvedName = name;
    let resolvedEmail = email;
    let resolvedPassword = password;

    if (googleCredential) {
      const googlePayload = await verifyGoogleCredential(googleCredential);
      resolvedName = googlePayload.name || resolvedName;
      resolvedEmail = googlePayload.email || resolvedEmail;
      // Google registration may not provide manual password.
      resolvedPassword = resolvedPassword || crypto.randomBytes(24).toString('hex');
    }

    if (!resolvedName || !resolvedEmail || !resolvedPassword) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // 1. Ensure Multer successfully caught the files
    if (!req.files || !req.files.idCardImage || !req.files.merchantLicenseImage || !req.files.taxReceiptImage) {
      return res.status(400).json({ message: 'All KYC documents are required (ID, License, Tax Receipt)' });
    }

    // 2. Extract the file paths to save to the database
    // Multer uses backslashes on Windows, so we replace them with forward slashes for web URLs
    const idCardImage = req.files.idCardImage[0].path.replace(/\\/g, '/');
    const merchantLicenseImage = req.files.merchantLicenseImage[0].path.replace(/\\/g, '/');
    const taxReceiptImage = req.files.taxReceiptImage[0].path.replace(/\\/g, '/');

    // 3. Check if seller already exists by email OR shop name
    const sellerExists = await Seller.findOne({ $or: [{ email: resolvedEmail }, { shopName }] });
    if (sellerExists) {
      return res.status(400).json({ message: 'A seller with that email or shop name already exists' });
    }

    // 4. Create the Seller
    const seller = await Seller.create({
      name: resolvedName,
      email: resolvedEmail,
      password: resolvedPassword,
      phoneNumber, nationalIdNumber,
      shopName, shopDescription, shopCategory,
      address: { street, city, postalCode, country },
      kycDocuments: { idCardImage, merchantLicenseImage, taxReceiptImage }
    });

    if (seller) {
      // 🛡️ Notice: We DO NOT send a JWT token here. 
      // They cannot log in yet. They must wait for Admin approval.
      res.status(201).json({
        message: 'Registration successful! Your application has been sent to the Admin for approval.',
        sellerId: seller._id
      });
    } else {
      res.status(400).json({ message: 'Invalid seller data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};


// @desc    Auth seller & get token (Login)
// @route   POST /api/sellers/login
// @access  Public
const authSeller = async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });

    if (seller && (await seller.matchPassword(password))) {
      
      // 🛡️ We keep the "Suspended" block, because suspended users shouldn't log in
      if (!seller.isActive) {
        return res.status(401).json({ message: 'Your account has been suspended. Please contact support.' });
      }

      // 👇 Notice we removed the `isApproved` block! We let them log in now.
      res.json({
        _id: seller._id,
        name: seller.name,
        email: seller.email,
        shopName: seller.shopName,
        isSeller: true, 
        isApproved: seller.isApproved, // 👈 CRUCIAL: Tell frontend their status
        token: generateToken(seller._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Google login for seller workspace
// @route   POST /api/sellers/google/login
// @access  Public
const googleLoginSeller = async (req, res) => {
  try {
    const { credential } = req.body;
    const { email } = await verifyGoogleCredential(credential);
    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.status(401).json({ message: 'No seller account found for this Google email' });
    }

    if (!seller.isActive) {
      return res.status(401).json({ message: 'Your account has been suspended. Please contact support.' });
    }

    return res.json({
      _id: seller._id,
      name: seller.name,
      email: seller.email,
      shopName: seller.shopName,
      isSeller: true,
      isApproved: seller.isApproved,
      token: generateToken(seller._id),
    });
  } catch (error) {
    return res.status(401).json({ message: error.message || 'Google authentication failed' });
  }
};

// @desc    Verify Google identity for seller registration prefill
// @route   POST /api/sellers/google/identity
// @access  Public
const googleIdentitySeller = async (req, res) => {
  try {
    const { credential } = req.body;
    const { email, name, googleId } = await verifyGoogleCredential(credential);
    return res.json({ email, name, googleId });
  } catch (error) {
    return res.status(401).json({ message: error.message || 'Google verification failed' });
  }
};

const logoutSeller = (req, res) => {
  // If you are using HTTP-only cookies for JWT later, this clears it:
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Seller logged out successfully' });
};

// @desc    Get seller wallet summary + recent transactions
// @route   GET /api/sellers/wallet
// @access  Private/Seller
const getSellerWallet = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller._id).select('walletBalance');

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const transactions = await SellerWalletTransaction.find({ seller: req.seller._id })
      .populate('order', '_id totalPrice paidAt createdAt')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      walletBalance: Number(seller.walletBalance || 0),
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
module.exports = {
  registerSeller,
  authSeller,
  googleLoginSeller,
  googleIdentitySeller,
  logoutSeller,
  getSellerWallet,
};
