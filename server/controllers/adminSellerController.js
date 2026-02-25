const Seller = require('../models/sellerModel');

// @desc    Get sellers for admin review
// @route   GET /api/admin/sellers
// @access  Private/Admin
const getSellersForAdmin = async (req, res) => {
  const { status = 'all', keyword = '' } = req.query;

  const filter = {};
  const trimmedKeyword = String(keyword || '').trim();
  if (trimmedKeyword) {
    const regex = new RegExp(trimmedKeyword, 'i');
    filter.$or = [
      { name: regex },
      { email: regex },
      { shopName: regex },
      { phoneNumber: regex },
      { nationalIdNumber: regex },
    ];
  }

  if (status === 'pending') {
    filter.isApproved = false;
    filter.isActive = true;
  } else if (status === 'approved') {
    filter.isApproved = true;
    filter.isActive = true;
  } else if (status === 'suspended') {
    filter.isActive = false;
  }

  const sellers = await Seller.find(filter)
    .select('-password -resetPasswordToken -resetPasswordExpires')
    .sort({ createdAt: -1 });

  res.json(sellers);
};

// @desc    Update seller status (approve/suspend/reactivate)
// @route   PATCH /api/admin/sellers/:id/status
// @access  Private/Admin
const updateSellerStatusByAdmin = async (req, res) => {
  const { id } = req.params;
  const { isApproved, isActive } = req.body;

  const seller = await Seller.findById(id);
  if (!seller) {
    return res.status(404).json({ message: 'Seller not found' });
  }

  if (typeof isApproved === 'boolean') {
    seller.isApproved = isApproved;
  }
  if (typeof isActive === 'boolean') {
    seller.isActive = isActive;
  }

  const updated = await seller.save();

  return res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    shopName: updated.shopName,
    isApproved: updated.isApproved,
    isActive: updated.isActive,
    message: 'Seller status updated',
  });
};

module.exports = {
  getSellersForAdmin,
  updateSellerStatusByAdmin,
};
