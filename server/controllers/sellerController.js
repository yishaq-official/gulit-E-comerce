const Seller = require('../models/sellerModel');
const generateToken = require('./authController'); 

// @desc    Register a new seller (with KYC documents)
// @route   POST /api/sellers
// @access  Public
const registerSeller = async (req, res) => {
  try {
    const {
      name, email, password, phoneNumber, nationalIdNumber,
      shopName, shopDescription, shopCategory,
      street, city, postalCode, country
    } = req.body;

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
    const sellerExists = await Seller.findOne({ $or: [{ email }, { shopName }] });
    if (sellerExists) {
      return res.status(400).json({ message: 'A seller with that email or shop name already exists' });
    }

    // 4. Create the Seller
    const seller = await Seller.create({
      name, email, password, phoneNumber, nationalIdNumber,
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
      
      // 🛡️ BLOCK 1: Check if the Admin has approved them yet
      if (!seller.isApproved) {
        return res.status(401).json({ message: 'Your account is still pending admin approval. Please check back later.' });
      }
      
      // 🛡️ BLOCK 2: Check if the Admin suspended them
      if (!seller.isActive) {
        return res.status(401).json({ message: 'Your account has been suspended. Please contact support.' });
      }

      // If approved and active, log them in!
      res.json({
        _id: seller._id,
        name: seller.name,
        email: seller.email,
        shopName: seller.shopName,
        isSeller: true, // Let the frontend know this is a seller context
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

module.exports = {
  registerSeller,
  authSeller
};