const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/authMiddleware');
const {
  getSellersForAdmin,
  getSellerDetailsForAdmin,
  getSellerTransactionsForAdmin,
  getSellerProductsForAdmin,
  getSellerOrdersForAdmin,
  updateSellerStatusByAdmin,
} = require('../controllers/adminSellerController');

router.get('/', protect, admin, getSellersForAdmin);
router.get('/:id/transactions', protect, admin, getSellerTransactionsForAdmin);
router.get('/:id/products', protect, admin, getSellerProductsForAdmin);
router.get('/:id/orders', protect, admin, getSellerOrdersForAdmin);
router.patch('/:id/status', protect, admin, updateSellerStatusByAdmin);
router.get('/:id', protect, admin, getSellerDetailsForAdmin);

module.exports = router;
