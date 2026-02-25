const Seller = require('../models/sellerModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const SellerWalletTransaction = require('../models/sellerWalletTransactionModel');
const mongoose = require('mongoose');

// @desc    Get sellers for admin review
// @route   GET /api/admin/sellers
// @access  Private/Admin
const getSellersForAdmin = async (req, res) => {
  const {
    status = 'all',
    keyword = '',
    category = 'all',
    country = 'all',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = req.query;

  const normalizedPage = Math.max(Number(page) || 1, 1);
  const normalizedLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const skip = (normalizedPage - 1) * normalizedLimit;

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

  if (category !== 'all') {
    filter.shopCategory = category;
  }
  if (country !== 'all') {
    filter['address.country'] = country;
  }

  const sortableFields = {
    createdAt: 'createdAt',
    shopName: 'shopName',
    ownerName: 'name',
    paidOrders: 'paidOrdersCount',
    pendingOrders: 'pendingOrdersCount',
    revenue: 'totalRevenue',
    products: 'totalProducts',
  };
  const sortField = sortableFields[sortBy] || 'createdAt';
  const direction = String(sortOrder).toLowerCase() === 'asc' ? 1 : -1;
  const sortStage = { [sortField]: direction, _id: 1 };

  const [result] = await Seller.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: 'products',
        let: { sellerId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$seller', '$$sellerId'] } } },
          { $count: 'totalProducts' },
        ],
        as: 'productStats',
      },
    },
    {
      $lookup: {
        from: 'orders',
        let: { sellerId: '$_id' },
        pipeline: [
          { $unwind: '$orderItems' },
          { $match: { $expr: { $eq: ['$orderItems.seller', '$$sellerId'] } } },
          {
            $group: {
              _id: '$_id',
              isPaid: { $first: '$isPaid' },
              isDelivered: { $first: '$isDelivered' },
              sellerRevenue: { $sum: { $ifNull: ['$orderItems.sellerRevenue', 0] } },
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: {
                $sum: {
                  $cond: [{ $eq: ['$isPaid', true] }, '$sellerRevenue', 0],
                },
              },
              paidOrdersCount: {
                $sum: { $cond: [{ $eq: ['$isPaid', true] }, 1, 0] },
              },
              pendingOrdersCount: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ['$isPaid', true] },
                        { $eq: ['$isDelivered', false] },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ],
        as: 'orderStats',
      },
    },
    {
      $addFields: {
        totalProducts: { $ifNull: [{ $arrayElemAt: ['$productStats.totalProducts', 0] }, 0] },
        totalRevenue: { $ifNull: [{ $arrayElemAt: ['$orderStats.totalRevenue', 0] }, 0] },
        paidOrdersCount: { $ifNull: [{ $arrayElemAt: ['$orderStats.paidOrdersCount', 0] }, 0] },
        pendingOrdersCount: { $ifNull: [{ $arrayElemAt: ['$orderStats.pendingOrdersCount', 0] }, 0] },
      },
    },
    {
      $project: {
        password: 0,
        resetPasswordToken: 0,
        resetPasswordExpires: 0,
        productStats: 0,
        orderStats: 0,
      },
    },
    { $sort: sortStage },
    {
      $facet: {
        sellers: [{ $skip: skip }, { $limit: normalizedLimit }],
        metadata: [{ $count: 'total' }],
      },
    },
  ]);

  const sellers = result?.sellers || [];
  const total = result?.metadata?.[0]?.total || 0;
  const pages = Math.max(Math.ceil(total / normalizedLimit), 1);

  res.json({
    sellers,
    page: normalizedPage,
    pages,
    total,
    limit: normalizedLimit,
    hasPrevPage: normalizedPage > 1,
    hasNextPage: normalizedPage < pages,
  });
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

// @desc    Get seller detail workspace data for admin
// @route   GET /api/admin/sellers/:id
// @access  Private/Admin
const getSellerDetailsForAdmin = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid seller id' });
  }

  const sellerId = new mongoose.Types.ObjectId(id);

  const seller = await Seller.findById(sellerId).select('-password -resetPasswordToken -resetPasswordExpires');
  if (!seller) {
    return res.status(404).json({ message: 'Seller not found' });
  }

  const [summaryAgg, recentProducts, recentOrdersRaw, recentTransactions] = await Promise.all([
    Order.aggregate([
      { $unwind: '$orderItems' },
      { $match: { 'orderItems.seller': sellerId } },
      {
        $group: {
          _id: '$_id',
          isPaid: { $first: '$isPaid' },
          isDelivered: { $first: '$isDelivered' },
          paidAt: { $first: '$paidAt' },
          deliveredAt: { $first: '$deliveredAt' },
          createdAt: { $first: '$createdAt' },
          sellerRevenue: { $sum: { $ifNull: ['$orderItems.sellerRevenue', 0] } },
          platformFee: { $sum: { $ifNull: ['$orderItems.platformFee', 0] } },
          itemCount: { $sum: '$orderItems.qty' },
        },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          paidOrdersCount: { $sum: { $cond: [{ $eq: ['$isPaid', true] }, 1, 0] } },
          pendingOrdersCount: {
            $sum: {
              $cond: [
                {
                  $and: [{ $eq: ['$isPaid', true] }, { $eq: ['$isDelivered', false] }],
                },
                1,
                0,
              ],
            },
          },
          deliveredOrdersCount: { $sum: { $cond: [{ $eq: ['$isDelivered', true] }, 1, 0] } },
          unpaidOrdersCount: { $sum: { $cond: [{ $eq: ['$isPaid', false] }, 1, 0] } },
          sellerRevenue: {
            $sum: {
              $cond: [{ $eq: ['$isPaid', true] }, '$sellerRevenue', 0],
            },
          },
          platformContribution: {
            $sum: {
              $cond: [{ $eq: ['$isPaid', true] }, '$platformFee', 0],
            },
          },
        },
      },
    ]),
    Product.find({ seller: sellerId })
      .select('name category price countInStock image rating numReviews createdAt')
      .sort({ createdAt: -1 })
      .limit(8),
    Order.find({ 'orderItems.seller': sellerId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(12),
    SellerWalletTransaction.find({ seller: sellerId })
      .populate('order', '_id totalPrice isPaid isDelivered paidAt createdAt')
      .sort({ createdAt: -1 })
      .limit(12),
  ]);

  const summary = summaryAgg[0] || {
    totalOrders: 0,
    paidOrdersCount: 0,
    pendingOrdersCount: 0,
    deliveredOrdersCount: 0,
    unpaidOrdersCount: 0,
    sellerRevenue: 0,
    platformContribution: 0,
  };

  const recentOrders = recentOrdersRaw.map((order) => {
    let sellerRevenue = 0;
    let sellerItems = 0;
    order.orderItems.forEach((item) => {
      if (String(item.seller) === String(sellerId)) {
        sellerRevenue += Number(item.sellerRevenue || 0);
        sellerItems += Number(item.qty || 0);
      }
    });

    return {
      _id: order._id,
      user: order.user,
      isPaid: order.isPaid,
      isDelivered: order.isDelivered,
      paidAt: order.paidAt,
      deliveredAt: order.deliveredAt,
      createdAt: order.createdAt,
      sellerRevenue,
      sellerItems,
      totalPrice: order.totalPrice,
    };
  });

  const totalProducts = await Product.countDocuments({ seller: sellerId });
  const lowStockProducts = await Product.countDocuments({ seller: sellerId, countInStock: { $gt: 0, $lte: 5 } });
  const outOfStockProducts = await Product.countDocuments({ seller: sellerId, countInStock: { $lte: 0 } });

  return res.json({
    seller,
    summary: {
      ...summary,
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      walletBalance: Number(seller.walletBalance || 0),
    },
    recentProducts,
    recentOrders,
    recentTransactions,
  });
};

module.exports = {
  getSellersForAdmin,
  getSellerDetailsForAdmin,
  updateSellerStatusByAdmin,
};
