const Product = require('../models/productModel');

// @desc    Get all products for the logged-in seller
// @route   GET /api/sellers/products
// @access  Private/Seller
const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.seller._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/sellers/products
// @access  Private/Seller
const createSellerProduct = async (req, res) => {
  try {
    // 👇 Added 'images' (array) to the destructuring
    const { name, price, originalPrice, description, image, images, brand, category, countInStock } = req.body;

    const product = new Product({
      name,
      price,
      originalPrice: originalPrice || 0,
      user: req.seller._id, 
      seller: req.seller._id, 
      image, // Main thumbnail image
      images: images || [], // 👇 Save the array of additional images
      brand,
      category,
      countInStock,
      numReviews: 0,
      description,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create product', error: error.message });
  }
};

// @desc    Update an existing product
// @route   PUT /api/sellers/products/:id
// @access  Private/Seller
const updateSellerProduct = async (req, res) => {
  try {
    // 👇 Added 'images' to the destructuring
    const { name, price, originalPrice, description, image, images, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      if (product.seller.toString() !== req.seller._id.toString()) {
        return res.status(403).json({ message: 'You do not have permission to edit this product' });
      }

      product.name = name || product.name;
      product.price = price || product.price;
      product.originalPrice = originalPrice !== undefined ? originalPrice : product.originalPrice;
      product.description = description || product.description;
      product.image = image || product.image;
      product.images = images || product.images; // 👇 Update the secondary images array
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Failed to update product', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/sellers/products/:id
// @access  Private/Seller
const deleteSellerProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (product.seller.toString() !== req.seller._id.toString()) {
        return res.status(403).json({ message: 'You do not have permission to delete this product' });
      }

      await product.deleteOne();
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};

module.exports = {
  getSellerProducts,
  createSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
};