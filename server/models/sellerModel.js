const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const sellerSchema = new mongoose.Schema(
  {
    // 1. Personal / Login Information
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },

    // 2. Business / Shop Details
    shopName: { type: String, required: true, unique: true },
    shopDescription: { type: String, required: true },
    shopCategory: { 
      type: String, 
      required: true,
      // You can add more categories here
      enum: ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Beauty', 'Other'],
      default: 'Other'
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String },
      country: { type: String, required: true, default: 'Ethiopia' },
    },

    // 3. KYC Verifications (These will store the file paths/URLs of the uploaded PDFs/Images)
    merchantLicense: { type: String, required: true }, 
    idCard: { type: String, required: true },

    // 4. Financial / Local Wallet System
    walletBalance: { type: Number, required: true, default: 0.00 }, // Holds money from delivered orders
    bankDetails: {
      bankName: { type: String },
      accountNumber: { type: String },
      accountHolderName: { type: String },
    },

    // 5. Admin Control Flags
    isApproved: { type: Boolean, required: true, default: false }, // Must be true to login/add products
    isActive: { type: Boolean, required: true, default: true }, // Admin can set to false to suspend a seller
  },
  { timestamps: true }
);

// Match password for login
sellerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving
sellerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Seller = mongoose.model('Seller', sellerSchema);
module.exports = Seller;