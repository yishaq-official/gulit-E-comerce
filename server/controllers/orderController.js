const Order = require('../models/orderModel');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Buyer)
const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    // 1. Validation: Is the cart empty?
    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        // 2. 🧮 CALCULATE COMMISSION PER ITEM
        // We map through the items to add the financial split
        const calculatedItems = orderItems.map((item) => {
      return {
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        // 1. Map '_id' from cart to 'product' for Order Schema
        product: item._id, 
        // 2. Map 'user' (or 'seller') from cart to 'seller' for Order Schema
        // We use || to be safe in case your product object names it differently
        seller: item.user || item.seller, 
        
        // 3. Calculate fees (Safety check: ensure numbers exist)
        platformFee: (item.price * item.qty) * 0.10,
        sellerRevenue: (item.price * item.qty) * 0.90
      };
    });

        // 3. Create the Order
        const order = new Order({
            user: req.user._id, // Buyer ID from Token
            orderItems: calculatedItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    // Populate adds the user's name and email to the result
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};


const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    // Simulate payment result (like what Chapa would send back)
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

module.exports = {
    addOrderItems,
    getOrderById,
    getMyOrders,
    updateOrderToPaid,
};