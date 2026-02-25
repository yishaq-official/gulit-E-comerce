const Order = require('../models/orderModel');
const Seller = require('../models/sellerModel');
const SellerWalletTransaction = require('../models/sellerWalletTransactionModel');

// @desc    Get finance overview + transactions ledger for admin
// @route   GET /api/admin/finance
// @access  Private/Admin
const getAdminFinanceOverview = async (req, res) => {
  const { page = 1, limit = 12, keyword = '' } = req.query;

  const normalizedPage = Math.max(Number(page) || 1, 1);
  const normalizedLimit = Math.min(Math.max(Number(limit) || 12, 1), 100);
  const skip = (normalizedPage - 1) * normalizedLimit;
  const trimmedKeyword = String(keyword || '').trim();

  const now = new Date();
  const from30d = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30);

  const [financialAgg, paidOrdersCount, openDisputesCount, walletsAgg, trendAgg] = await Promise.all([
    Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: null,
          platformIncome: { $sum: { $ifNull: ['$orderItems.platformFee', 0] } },
          sellerIncome: { $sum: { $ifNull: ['$orderItems.sellerRevenue', 0] } },
        },
      },
    ]),
    Order.countDocuments({ isPaid: true }),
    Order.countDocuments({ disputeStatus: { $in: ['open', 'in_review'] } }),
    Seller.aggregate([{ $group: { _id: null, walletsOutstanding: { $sum: { $ifNull: ['$walletBalance', 0] } } } }]),
    Order.aggregate([
      { $match: { isPaid: true, paidAt: { $gte: from30d } } },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: null,
          revenuePulse30d: { $sum: { $ifNull: ['$totalPrice', 0] } },
          platformIncome30d: { $sum: { $ifNull: ['$orderItems.platformFee', 0] } },
          sellerIncome30d: { $sum: { $ifNull: ['$orderItems.sellerRevenue', 0] } },
        },
      },
    ]),
  ]);

  const financial = financialAgg[0] || { platformIncome: 0, sellerIncome: 0 };
  const walletsOutstanding = walletsAgg[0]?.walletsOutstanding || 0;
  const trend = trendAgg[0] || { revenuePulse30d: 0, platformIncome30d: 0, sellerIncome30d: 0 };

  const platformIncome = Number(financial.platformIncome || 0);
  const sellerIncome = Number(financial.sellerIncome || 0);
  const totalMarketIncome = platformIncome + sellerIncome;

  const pendingSettlementAgg = await Order.aggregate([
    { $match: { isPaid: true, isDelivered: false } },
    { $unwind: '$orderItems' },
    { $group: { _id: null, pendingSettlementValue: { $sum: { $ifNull: ['$orderItems.sellerRevenue', 0] } } } },
  ]);
  const pendingSettlementValue = Number(pendingSettlementAgg[0]?.pendingSettlementValue || 0);

  const txPipeline = [
    {
      $lookup: {
        from: 'sellers',
        localField: 'seller',
        foreignField: '_id',
        as: 'sellerDoc',
      },
    },
    { $unwind: { path: '$sellerDoc', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'orders',
        localField: 'order',
        foreignField: '_id',
        as: 'orderDoc',
      },
    },
    { $unwind: { path: '$orderDoc', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'users',
        localField: 'orderDoc.user',
        foreignField: '_id',
        as: 'buyerDoc',
      },
    },
    { $unwind: { path: '$buyerDoc', preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        sellerName: '$sellerDoc.shopName',
        sellerEmail: '$sellerDoc.email',
        orderIdStr: { $toString: '$order' },
        buyerName: '$buyerDoc.name',
      },
    },
  ];

  if (trimmedKeyword) {
    const regex = new RegExp(trimmedKeyword, 'i');
    txPipeline.push({
      $match: {
        $or: [{ orderIdStr: regex }, { sellerName: regex }, { sellerEmail: regex }, { buyerName: regex }],
      },
    });
  }

  txPipeline.push({ $sort: { createdAt: -1 } });
  txPipeline.push({
    $facet: {
      transactions: [{ $skip: skip }, { $limit: normalizedLimit }],
      metadata: [{ $count: 'total' }],
    },
  });

  const [txResult] = await SellerWalletTransaction.aggregate(txPipeline);
  const transactions = (txResult?.transactions || []).map((tx) => ({
    _id: tx._id,
    order: tx.order,
    amount: Number(tx.amount || 0),
    type: tx.type,
    note: tx.note,
    createdAt: tx.createdAt,
    sellerId: tx.seller,
    sellerName: tx.sellerName || '-',
    sellerEmail: tx.sellerEmail || '-',
    buyerName: tx.buyerName || '-',
    isDelivered: Boolean(tx.orderDoc?.isDelivered),
    isPaid: Boolean(tx.orderDoc?.isPaid),
    paymentMethod: tx.orderDoc?.paymentMethod || '-',
  }));
  const txTotal = txResult?.metadata?.[0]?.total || 0;
  const txPages = Math.max(Math.ceil(txTotal / normalizedLimit), 1);

  return res.json({
    summary: {
      platformIncome,
      sellerIncome,
      totalMarketIncome,
      walletsOutstanding: Number(walletsOutstanding || 0),
      pendingSettlementValue,
      paidOrdersCount,
      openDisputesCount,
    },
    trend30d: {
      revenuePulse30d: Number(trend.revenuePulse30d || 0),
      platformIncome30d: Number(trend.platformIncome30d || 0),
      sellerIncome30d: Number(trend.sellerIncome30d || 0),
    },
    transactions,
    page: normalizedPage,
    pages: txPages,
    total: txTotal,
    limit: normalizedLimit,
  });
};

module.exports = {
  getAdminFinanceOverview,
};
