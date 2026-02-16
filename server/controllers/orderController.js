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
            const amount = item.price * item.qty;
            return {
                ...item, // Keep name, image, etc.
                product: item.product,
                seller: item.seller, // Ensure frontend sends this!
                platformFee: amount * 0.10, // 10% for You
                sellerRevenue: amount * 0.90 // 90% for Seller
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

module.exports = {
    addOrderItems,
    getOrderById,
};