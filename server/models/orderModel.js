const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // The Buyer
    },
    // 🚚 STRICT SHIPPING INFO
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true }, // Zip Code
        country: { type: String, required: true },
        phoneNumber: { type: String, required: true }, // Crucial for Delivery!
    },
    // 🛒 ORDER ITEMS (The Cart)
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product',
            },
            // 🔗 LINK TO SELLER (So they can see this order)
            seller: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User',
            },
            // 💰 MONEY SPLIT (Saved at time of purchase)
            platformFee: { type: Number, default: 0 }, // Your 10%
            sellerRevenue: { type: Number, default: 0 } // Seller's 90%
        },
    ],
    // 💳 PAYMENT INFO
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentResult: { // Data from Chapa/Stripe goes here later
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
    // 🧾 TOTALS
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);