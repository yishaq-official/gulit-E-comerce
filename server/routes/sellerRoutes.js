const express = require('express');
const router = express.Router();

const { registerSeller, authSeller, logoutSeller, getSellerWallet } = require('../controllers/sellerController');
const { uploadSellerDocs } = require('../middleware/uploadMiddleware');
// 👇 1. Import the new controller and the protect middleware
const { getSellerOrders, getSellerOrderById, updateOrderToDelivered } = require('../controllers/sellerOrderController');
const { protectSeller } = require('../middleware/authMiddleware');

router.post('/', uploadSellerDocs, registerSeller);
router.post('/login', authSeller);
router.post('/logout', logoutSeller);
router.get('/wallet', protectSeller, getSellerWallet);

// 👇 2. Add the secure orders route
router.route('/orders').get(protectSeller, getSellerOrders);
router.route('/orders/:id').get(protectSeller, getSellerOrderById);
router.route('/orders/:id/deliver').put(protectSeller, updateOrderToDelivered);

module.exports = router;
