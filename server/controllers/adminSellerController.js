const Seller = require('../models/sellerModel');

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

module.exports = {
  getSellersForAdmin,
  updateSellerStatusByAdmin,
};
