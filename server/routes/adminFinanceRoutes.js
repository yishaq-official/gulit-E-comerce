const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/authMiddleware');
const { getAdminFinanceOverview } = require('../controllers/adminFinanceController');

router.get('/', protect, admin, getAdminFinanceOverview);

module.exports = router;
