const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// @desc    Get all orders containing the logged-in seller's products
// @route   GET /api/sellers/orders
// @access  Private/Seller
const getSellerOrders = async (req, res) => {
  try {
    // 1. Find all product IDs that belong to this specific seller
    const sellerProducts = await Product.find({ seller: req.seller._id }).select('_id');
    const sellerProductIds = sellerProducts.map(product => product._id);

    // 2. Find all orders that contain at least one of those product IDs
    // We populate 'user' to get the buyer's name and email
    const orders = await Order.find({
      'orderItems.product': { $in: sellerProductIds }
    })
    .populate('user', 'id name email')
    .sort({ createdAt: -1 }); // Newest orders first

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch seller orders', error: error.message });
  }
};

module.exports = { getSellerOrders };