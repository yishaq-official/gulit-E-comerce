const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    googleAuthUser,
    forgotPassword,
    resetPassword,
    logoutUser,
    updateUserProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');


// Define the paths
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuthUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/logout', logoutUser);

// 🔒 Protected Route (Test)
router.get('/profile', protect, (req, res) => {
    res.json(req.user); // Should return Abebe's info if token is valid
});


router.route('/profile')
    .get(protect, (req, res) => res.json(req.user)) // GET: View Profile
    .put(protect, updateUserProfile);


module.exports = router;
