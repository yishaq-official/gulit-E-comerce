const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/authMiddleware');
const { getAdminSupportQueue, updateSupportCaseByAdmin } = require('../controllers/adminSupportController');

router.get('/', protect, admin, getAdminSupportQueue);
router.patch('/cases/:source/:id', protect, admin, updateSupportCaseByAdmin);

module.exports = router;
