const express = require('express');
const router = express.Router();

const { registerSeller, authSeller, logoutSeller } = require('../controllers/sellerController');
const { uploadSellerDocs } = require('../middleware/uploadMiddleware');
// 👇 1. Import the new controller and the protect middleware
const { getSellerOrders } = require('../controllers/sellerOrderController');
const { protectSeller } = require('../middleware/authMiddleware');

router.post('/', uploadSellerDocs, registerSeller);
router.post('/login', authSeller);
router.post('/logout', logoutSeller);

// 👇 2. Add the secure orders route
router.route('/orders').get(protectSeller, getSellerOrders);

module.exports = router;