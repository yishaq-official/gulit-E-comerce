const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, getMyOrders, } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// All order routes are protected (You must be logged in to buy)
router.route('/').post(protect, addOrderItems);
router.route('/:id').get(protect, getOrderById);
router.route('/myorders').get(protect, getMyOrders);

module.exports = router;