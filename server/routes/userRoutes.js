const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');


// Define the paths
router.post('/register', registerUser);
router.post('/login', loginUser);

// 🔒 Protected Route (Test)
router.get('/profile', protect, (req, res) => {
    res.json(req.user); // Should return Abebe's info if token is valid
});

module.exports = router;