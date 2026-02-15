const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProductById, 
    createProduct 
} = require('../controllers/productController');
const { protect, seller } = require('../middleware/authMiddleware'); // Import our guards

// Public Routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected Route (Only Sellers can create!)
router.post('/', protect, seller, createProduct);

module.exports = router;