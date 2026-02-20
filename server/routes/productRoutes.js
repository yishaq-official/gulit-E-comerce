const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProductById, 
    createProduct,
    createProductReview
} = require('../controllers/productController');
const { protect, seller } = require('../middleware/authMiddleware'); // Import our guards


// Public Routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected Route (Only Sellers can create!)
router.post('/', protect, seller, createProduct);

//create  review functionality for buyers after they recieve ordered item.
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;