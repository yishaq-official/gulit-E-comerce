const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/authMiddleware');
const { getSellersForAdmin, updateSellerStatusByAdmin } = require('../controllers/adminSellerController');

router.get('/', protect, admin, getSellersForAdmin);
router.patch('/:id/status', protect, admin, updateSellerStatusByAdmin);

module.exports = router;
