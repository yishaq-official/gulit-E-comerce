const Product = require('../models/productModel');
const Order = require('../models/orderModel');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    // 1. Check if the frontend sent a search word
    const keyword = req.query.keyword 
        ? { name: { $regex: req.query.keyword, $options: 'i' } } // 'i' means case-insensitive
        : {};

    // 2. Find products that match the keyword (or all if no keyword)
    const products = await Product.find({ ...keyword });
    
    res.json(products);
};
// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
const createProduct = async (req, res) => {
    try {
        // 1. Get data from the request body
        const { name, price, description, image, brand, category, countInStock } = req.body;

        // 2. Create the product
        const product = new Product({
            name,
            price,
            user: req.user._id,   // 👈 The User ID (Standard)
            seller: req.user._id, // 👈 THE MAGIC: Link to the logged-in Seller
            image,
            brand,
            category,
            countInStock,
            numReviews: 0,
            description,
        });

        // 3. Save to database
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Product creation failed' });
    }
};

const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    // 1. Check if the user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('You have already reviewed this product');
    }

    // 2. 🛡️ VERIFY DELIVERY: Check if user bought it AND it was delivered
    const hasBoughtAndDelivered = await Order.findOne({
      user: req.user._id,
      isDelivered: true, // Must be delivered!
      'orderItems.product': product._id,
    });

    if (!hasBoughtAndDelivered) {
      res.status(400);
      throw new Error('You can only review products after they have been delivered to you.');
    }

        // 3. Create and push the review
        const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
        };

        product.reviews.push(review);

        // 4. Update product stats
        product.numReviews = product.reviews.length;
        product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added successfully' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
    };

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    createProductReview,
};