const express = require('express');
const router = express.Router();

// Import controllers
const { registerSeller, authSeller } = require('../controllers/sellerController');

// Import the Multer middleware we created
const { uploadSellerDocs } = require('../middleware/uploadMiddleware');

// @route   POST /api/sellers
// @desc    Register a new seller
// @access  Public
// 🛡️ Notice how we place `uploadSellerDocs` BEFORE `registerSeller`. 
// This forces Express to parse the files first, save them, and THEN run your controller.
router.post('/', uploadSellerDocs, registerSeller);

// @route   POST /api/sellers/login
// @desc    Auth seller & get token
// @access  Public
router.post('/login', authSeller);
router.post('/logout', logoutSeller);

module.exports = router;