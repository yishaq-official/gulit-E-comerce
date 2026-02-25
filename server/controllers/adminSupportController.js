const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const Seller = require('../models/sellerModel');

const toDate = (value) => {
  const date = value ? new Date(value) : null;
  return Number.isNaN(date?.getTime?.()) ? new Date(0) : date;
};

const normalize = (value) => String(value || '').trim().toLowerCase();

// @desc    Get support operations queue for admin
// @route   GET /api/admin/support
// @access  Private/Admin
const getAdminSupportQueue = async (req, res) => {
  const { page = 1, limit = 12, keyword = '', source = 'all', status = 'all' } = req.query;

  const normalizedPage = Math.max(Number(page) || 1, 1);
  const normalizedLimit = Math.min(Math.max(Number(limit) || 12, 1), 100);
  const skip = (normalizedPage - 1) * normalizedLimit;

  const overdue7 = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);

  const [disputeOrders, delayedOrders, flaggedSellers] = await Promise.all([
    Order.find({ disputeStatus: { $ne: 'none' } })
      .populate('user', 'name email')
      .sort({ disputeUpdatedAt: -1, updatedAt: -1 })
      .limit(300)
      .lean(),
    Order.find({ isPaid: true, isDelivered: false, paidAt: { $lte: overdue7 } })
      .populate('user', 'name email')
      .sort({ paidAt: 1 })
      .limit(300)
      .lean(),
    Seller.find({ $or: [{ isApproved: false }, { isActive: false }] })
      .sort({ updatedAt: -1 })
      .limit(300)
      .lean(),
  ]);

  const disputeCases = disputeOrders.map((order) => {
    const daysSincePaid = order.paidAt
      ? Math.floor((Date.now() - new Date(order.paidAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    const priority = daysSincePaid >= 14 ? 'high' : daysSincePaid >= 7 ? 'medium' : 'low';

    return {
      caseKey: `dispute:${order._id}`,
      source: 'dispute',
      sourceId: String(order._id),
      status: order.disputeStatus || 'open',
      priority,
      subject: `Order dispute #${order._id}`,
      actorName: order.user?.name || 'Unknown buyer',
      actorEmail: order.user?.email || '-',
      amount: Number(order.totalPrice || 0),
      note: order.disputeNote || '',
      updatedAt: order.disputeUpdatedAt || order.updatedAt || order.createdAt,
    };
  });

  const delayedCases = delayedOrders.map((order) => {
    const daysSincePaid = order.paidAt
      ? Math.floor((Date.now() - new Date(order.paidAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    const priority = daysSincePaid >= 14 ? 'high' : 'medium';

    return {
      caseKey: `delivery:${order._id}`,
      source: 'delivery',
      sourceId: String(order._id),
      status: order.disputeStatus && order.disputeStatus !== 'none' ? order.disputeStatus : 'open',
      priority,
      subject: `Delayed delivery #${order._id}`,
      actorName: order.user?.name || 'Unknown buyer',
      actorEmail: order.user?.email || '-',
      amount: Number(order.totalPrice || 0),
      note: order.disputeNote || '',
      updatedAt: order.disputeUpdatedAt || order.updatedAt || order.paidAt || order.createdAt,
    };
  });

  const sellerCases = flaggedSellers.map((seller) => {
    let caseStatus = 'pending';
    let priority = 'medium';
    if (!seller.isActive) {
      caseStatus = 'suspended';
      priority = 'high';
    } else if (!seller.isApproved) {
      caseStatus = 'pending';
      priority = 'medium';
    }

    return {
      caseKey: `seller:${seller._id}`,
      source: 'seller',
      sourceId: String(seller._id),
      status: caseStatus,
      priority,
      subject: `Seller compliance: ${seller.shopName || seller.name || seller.email}`,
      actorName: seller.name || seller.shopName || '-',
      actorEmail: seller.email || '-',
      amount: Number(seller.walletBalance || 0),
      note: '',
      updatedAt: seller.updatedAt || seller.createdAt,
    };
  });

  const sourceFilter = normalize(source);
  const statusFilter = normalize(status);
  const keywordFilter = normalize(keyword);

  let cases = [...disputeCases, ...delayedCases, ...sellerCases];

  if (sourceFilter !== 'all') {
    cases = cases.filter((item) => item.source === sourceFilter);
  }
  if (statusFilter !== 'all') {
    cases = cases.filter((item) => normalize(item.status) === statusFilter);
  }
  if (keywordFilter) {
    cases = cases.filter((item) => {
      const haystack = normalize(
        `${item.subject} ${item.actorName} ${item.actorEmail} ${item.sourceId} ${item.note}`
      );
      return haystack.includes(keywordFilter);
    });
  }

  cases.sort((a, b) => toDate(b.updatedAt).getTime() - toDate(a.updatedAt).getTime());

  const total = cases.length;
  const pages = Math.max(Math.ceil(total / normalizedLimit), 1);
  const paged = cases.slice(skip, skip + normalizedLimit);

  return res.json({
    summary: {
      openDisputes: disputeCases.filter((item) => ['open', 'in_review'].includes(item.status)).length,
      delayedDeliveries: delayedCases.length,
      suspendedSellers: sellerCases.filter((item) => item.status === 'suspended').length,
      pendingSellers: sellerCases.filter((item) => item.status === 'pending').length,
      totalCases: disputeCases.length + delayedCases.length + sellerCases.length,
    },
    cases: paged,
    page: normalizedPage,
    pages,
    total,
    limit: normalizedLimit,
  });
};

// @desc    Update support case status/action by admin
// @route   PATCH /api/admin/support/cases/:source/:id
// @access  Private/Admin
const updateSupportCaseByAdmin = async (req, res) => {
  const { source, id } = req.params;
  const { action = '', note = '' } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid case id' });
  }

  if (source === 'dispute' || source === 'delivery') {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const actionMap = {
      open: 'open',
      review: 'in_review',
      resolve: 'resolved',
      reject: 'rejected',
      reset: 'none',
    };
    const nextStatus = actionMap[String(action)] || null;
    if (!nextStatus) return res.status(400).json({ message: 'Invalid action for order case' });

    order.disputeStatus = nextStatus;
    if (note) order.disputeNote = String(note).trim();
    order.disputeUpdatedAt = new Date();
    await order.save();

    return res.json({
      source,
      sourceId: order._id,
      status: order.disputeStatus,
      note: order.disputeNote || '',
      message: 'Order support case updated',
    });
  }

  if (source === 'seller') {
    const seller = await Seller.findById(id);
    if (!seller) return res.status(404).json({ message: 'Seller not found' });

    if (action === 'approve') {
      seller.isApproved = true;
      seller.isActive = true;
    } else if (action === 'suspend') {
      seller.isActive = false;
    } else if (action === 'activate') {
      seller.isActive = true;
    } else {
      return res.status(400).json({ message: 'Invalid action for seller case' });
    }

    await seller.save();
    return res.json({
      source,
      sourceId: seller._id,
      status: !seller.isActive ? 'suspended' : seller.isApproved ? 'active' : 'pending',
      message: 'Seller support case updated',
    });
  }

  return res.status(400).json({ message: 'Invalid case source' });
};

module.exports = {
  getAdminSupportQueue,
  updateSupportCaseByAdmin,
};
