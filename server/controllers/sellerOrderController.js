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

// @desc    Get order by ID for seller
// @route   GET /api/sellers/orders/:id
// @access  Private/Seller
const getSellerOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update order status to delivered
// @route   PUT /api/sellers/orders/:id/deliver
// @access  Private/Seller
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getSellerOrders, getSellerOrderById, updateOrderToDelivered };