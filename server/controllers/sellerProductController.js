const Product = require('../models/productModel');

// @desc    Get all products for the logged-in seller
// @route   GET /api/sellers/products
// @access  Private/Seller
const getSellerProducts = async (req, res) => {
  try {
    // Fetch only the products where the 'seller' field matches the logged-in seller's ID
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
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = new Product({
      name,
      price,
      user: req.seller._id, // Notice we assign the logged-in seller's ID
      seller: req.seller._id, // Keeping both if your schema still has 'user', but 'seller' is the new standard
      image,
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
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // 🛡️ Security Check: Make sure the logged-in seller actually owns this product!
      if (product.seller.toString() !== req.seller._id.toString()) {
        return res.status(403).json({ message: 'You do not have permission to edit this product' });
      }

      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = image || product.image;
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
      // 🛡️ Security Check: Ensure ownership before deleting
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