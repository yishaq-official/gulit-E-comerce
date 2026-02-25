const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/authMiddleware');
const {
  getSellersForAdmin,
  getSellerDetailsForAdmin,
  updateSellerStatusByAdmin,
} = require('../controllers/adminSellerController');

router.get('/', protect, admin, getSellersForAdmin);
router.patch('/:id/status', protect, admin, updateSellerStatusByAdmin);
router.get('/:id', protect, admin, getSellerDetailsForAdmin);

module.exports = router;
