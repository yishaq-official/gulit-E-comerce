import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaMoneyBillWave,
  FaPowerOff,
  FaSearch,
  FaShieldAlt,
  FaSignOutAlt,
  FaSync,
  FaWallet,
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import logo from '../../assets/gulit.png';
import AdminSidebar from '../components/AdminSidebar';
import { adminLogout } from '../slices/adminAuthSlice';
import {
  useAdminGetSellerDetailsQuery,
  useAdminGetSellerOrdersQuery,
  useAdminGetSellerProductsQuery,
  useAdminGetSellerTransactionsQuery,
  useAdminUpdateSellerStatusMutation,
} from '../slices/adminApiSlice';
import { BASE_URL } from '../../store/slices/apiSlice';

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'kyc', label: 'KYC Docs' },
  { key: 'transactions', label: 'Transactions' },
  { key: 'products', label: 'Products' },
  { key: 'orders', label: 'Orders' },
];

const fileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BASE_URL}/${String(path).replace(/^\/+/, '')}`;
};

const currency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETB',
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const AdminSellerDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('overview');
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);
  const [ordersPage, setOrdersPage] = useState(1);
  const [productKeywordInput, setProductKeywordInput] = useState('');
  const [productKeyword, setProductKeyword] = useState('');
  const [productStock, setProductStock] = useState('all');
  const [ordersKeywordInput, setOrdersKeywordInput] = useState('');
  const [ordersKeyword, setOrdersKeyword] = useState('');
  const [ordersStatus, setOrdersStatus] = useState('all');

  const { data, isLoading, isError, refetch, isFetching } = useAdminGetSellerDetailsQuery(id);
  const [updateSellerStatus, { isLoading: updating }] = useAdminUpdateSellerStatusMutation();
  const { data: txData, isLoading: loadingTransactions } = useAdminGetSellerTransactionsQuery(
    { sellerId: id, page: transactionsPage, limit: 10 },
    { skip: activeTab !== 'transactions' }
  );
  const { data: productData, isLoading: loadingProducts } = useAdminGetSellerProductsQuery(
    { sellerId: id, page: productsPage, limit: 8, keyword: productKeyword, stock: productStock },
    { skip: activeTab !== 'products' }
  );
  const { data: orderData, isLoading: loadingOrders } = useAdminGetSellerOrdersQuery(
    { sellerId: id, page: ordersPage, limit: 10, keyword: ordersKeyword, status: ordersStatus },
    { skip: activeTab !== 'orders' }
  );

  const seller = data?.seller;
  const summary = data?.summary || {};
  const products = productData?.products || [];
  const orders = orderData?.orders || [];
  const transactions = txData?.transactions || [];

  const logoutHandler = () => {
    dispatch(adminLogout());
    navigate('/admin/login');
  };

  const applyStatusUpdate = async (payload, message) => {
    try {
      await updateSellerStatus({ sellerId: id, ...payload }).unwrap();
      toast.success(message);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to update seller status');
    }
  };

  const statusText = useMemo(() => {
    if (!seller) return '';
    if (!seller.isActive) return 'Suspended';
    if (!seller.isApproved) return 'Pending Approval';
    return 'Approved & Active';
  }, [seller]);

  return (
    <div className="min-h-screen bg-[#070c18] text-white flex flex-col">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#081122]/95 backdrop-blur">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <img src={logo} alt="Gulit" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300 font-bold">Gulit Admin</p>
              <p className="text-sm font-bold text-gray-100">Seller Detail Workspace</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logoutHandler}
            className="inline-flex items-center justify-center gap-2 bg-red-500/15 hover:bg-red-500/25 text-red-200 font-bold px-4 py-2.5 rounded-xl border border-red-500/30 transition-colors"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <AdminSidebar activeKey="seller-review" />

          <section className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/admin/sellers" className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 font-bold">
                <FaArrowLeft /> Back to Seller List
              </Link>
              <button
                type="button"
                onClick={refetch}
                className="px-4 py-2 rounded-lg border border-white/15 bg-white/[0.03] hover:bg-white/[0.06] text-gray-200 text-sm font-bold inline-flex items-center gap-2"
              >
                <FaSync className={isFetching ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>

            {isLoading ? <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 text-gray-300">Loading seller workspace...</div> : null}
            {isError ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-red-200">
                Failed to load seller details.
              </div>
            ) : null}

            {!isLoading && !isError && seller ? (
              <>
                <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-[#0f172a]/95 via-[#111827]/95 to-[#0b1324]/95 p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-300 font-bold mb-2">Seller Profile</p>
                  <h1 className="text-2xl sm:text-3xl font-black">{seller.shopName}</h1>
                  <p className="text-gray-300 mt-2">{seller.name} • {seller.email} • {seller.phoneNumber}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-black border ${seller.isApproved ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-amber-500/30 bg-amber-500/10 text-amber-200'}`}>
                      {seller.isApproved ? 'Approved' : 'Pending'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-black border ${seller.isActive ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200' : 'border-red-500/30 bg-red-500/10 text-red-200'}`}>
                      {seller.isActive ? 'Active' : 'Suspended'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-black border border-white/20 text-gray-200">{statusText}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {!seller.isApproved ? (
                      <button
                        type="button"
                        disabled={updating}
                        onClick={() => applyStatusUpdate({ isApproved: true, isActive: true }, `${seller.shopName} approved`)}
                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#04111f] text-sm font-black inline-flex items-center gap-2"
                      >
                        <FaCheckCircle /> Approve Seller
                      </button>
                    ) : null}
                    {seller.isActive ? (
                      <button
                        type="button"
                        disabled={updating}
                        onClick={() => applyStatusUpdate({ isActive: false }, `${seller.shopName} suspended`)}
                        className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white text-sm font-black inline-flex items-center gap-2"
                      >
                        <FaPowerOff /> Suspend
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={updating}
                        onClick={() => applyStatusUpdate({ isActive: true }, `${seller.shopName} reactivated`)}
                        className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#04111f] text-sm font-black inline-flex items-center gap-2"
                      >
                        <FaShieldAlt /> Reactivate
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Seller Revenue</p>
                    <p className="text-2xl font-black text-emerald-200 mt-1">{currency(summary.sellerRevenue)}</p>
                    <p className="text-xs text-gray-500 mt-1">Paid orders only</p>
                  </div>
                  <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Platform Contribution</p>
                    <p className="text-2xl font-black text-fuchsia-200 mt-1">{currency(summary.platformContribution)}</p>
                    <p className="text-xs text-gray-500 mt-1">Commission from this seller</p>
                  </div>
                  <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Orders</p>
                    <p className="text-2xl font-black text-cyan-200 mt-1">{summary.totalOrders || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">{summary.pendingOrdersCount || 0} pending delivery</p>
                  </div>
                  <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Wallet Balance</p>
                    <p className="text-2xl font-black text-amber-200 mt-1">{currency(summary.walletBalance)}</p>
                    <p className="text-xs text-gray-500 mt-1">Current seller wallet</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.key);
                        if (tab.key === 'transactions') setTransactionsPage(1);
                        if (tab.key === 'products') setProductsPage(1);
                        if (tab.key === 'orders') setOrdersPage(1);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border ${
                        activeTab === tab.key
                          ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200'
                          : 'border-white/10 bg-[#0f172a] text-gray-300 hover:bg-white/[0.03]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5">
                      <h2 className="font-black text-lg mb-3">Business Details</h2>
                      <div className="space-y-2 text-sm text-gray-300">
                        <p><span className="text-gray-500">Shop Category:</span> {seller.shopCategory || 'Other'}</p>
                        <p><span className="text-gray-500">National ID:</span> {seller.nationalIdNumber || '-'}</p>
                        <p><span className="text-gray-500">Address:</span> {seller.address?.street || '-'}, {seller.address?.city || '-'}, {seller.address?.country || '-'}</p>
                        <p><span className="text-gray-500">Registered:</span> {new Date(seller.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5">
                      <h2 className="font-black text-lg mb-3">Stock & Fulfillment</h2>
                      <div className="space-y-2 text-sm text-gray-300">
                        <p><span className="text-gray-500">Total Products:</span> {summary.totalProducts || 0}</p>
                        <p><span className="text-gray-500">Low Stock:</span> {summary.lowStockProducts || 0}</p>
                        <p><span className="text-gray-500">Out of Stock:</span> {summary.outOfStockProducts || 0}</p>
                        <p><span className="text-gray-500">Delivered Orders:</span> {summary.deliveredOrdersCount || 0}</p>
                        <p><span className="text-gray-500">Unpaid Orders:</span> {summary.unpaidOrdersCount || 0}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'kyc' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a href={fileUrl(seller.kycDocuments?.idCardImage)} target="_blank" rel="noreferrer" className="bg-[#0f172a] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.03]">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Identity Document</p>
                      <p className="font-black mt-1">National ID</p>
                    </a>
                    <a href={fileUrl(seller.kycDocuments?.merchantLicenseImage)} target="_blank" rel="noreferrer" className="bg-[#0f172a] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.03]">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Business Document</p>
                      <p className="font-black mt-1">Merchant License</p>
                    </a>
                    <a href={fileUrl(seller.kycDocuments?.taxReceiptImage)} target="_blank" rel="noreferrer" className="bg-[#0f172a] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.03]">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Tax Document</p>
                      <p className="font-black mt-1">Tax Receipt</p>
                    </a>
                  </div>
                )}

                {activeTab === 'transactions' && (
                  <div className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/10 font-black flex items-center gap-2">
                      <FaWallet /> Recent Transactions
                    </div>
                    {loadingTransactions ? <div className="px-4 py-4 text-gray-400 text-sm">Loading transactions...</div> : null}
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[760px]">
                        <thead className="bg-[#0a1224]">
                          <tr className="text-left text-xs uppercase tracking-wide text-gray-400">
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Order</th>
                            <th className="px-4 py-3">Note</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.length === 0 ? (
                            <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No transactions yet.</td></tr>
                          ) : (
                            transactions.map((tx) => (
                              <tr key={tx._id} className="border-t border-white/5">
                                <td className="px-4 py-3 text-sm text-gray-300">{new Date(tx.createdAt).toLocaleString()}</td>
                                <td className="px-4 py-3 text-sm text-cyan-200">{tx.type}</td>
                                <td className="px-4 py-3 text-sm font-bold text-emerald-200">{currency(tx.amount)}</td>
                                <td className="px-4 py-3 text-sm text-gray-300">{tx.order?._id || '-'}</td>
                                <td className="px-4 py-3 text-sm text-gray-400">{tx.note || '-'}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
                      <p className="text-xs text-gray-500">Page {txData?.page || 1} of {txData?.pages || 1}</p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={!txData?.hasPrevPage}
                          onClick={() => setTransactionsPage((prev) => Math.max(prev - 1, 1))}
                          className="px-3 py-1.5 rounded-lg border border-white/15 text-sm disabled:opacity-40"
                        >
                          <FaChevronLeft />
                        </button>
                        <button
                          type="button"
                          disabled={!txData?.hasNextPage}
                          onClick={() => setTransactionsPage((prev) => prev + 1)}
                          className="px-3 py-1.5 rounded-lg border border-white/15 text-sm disabled:opacity-40"
                        >
                          <FaChevronRight />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'products' && (
                  <div className="space-y-4">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setProductsPage(1);
                        setProductKeyword(productKeywordInput.trim());
                      }}
                      className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-3"
                    >
                      <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type="text"
                          value={productKeywordInput}
                          onChange={(e) => setProductKeywordInput(e.target.value)}
                          placeholder="Search product name/category/brand..."
                          className="w-full pl-10 pr-3 py-3 bg-[#020617]/80 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <select
                        value={productStock}
                        onChange={(e) => {
                          setProductsPage(1);
                          setProductStock(e.target.value);
                        }}
                        className="px-3 py-3 bg-[#020617]/80 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500"
                      >
                        <option value="all" className="bg-[#0b1220]">All Stock</option>
                        <option value="in" className="bg-[#0b1220]">In Stock</option>
                        <option value="low" className="bg-[#0b1220]">Low Stock</option>
                        <option value="out" className="bg-[#0b1220]">Out of Stock</option>
                      </select>
                      <button type="submit" className="px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#04111f] font-black">
                        Apply
                      </button>
                    </form>

                    {loadingProducts ? <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 text-sm text-gray-400">Loading products...</div> : null}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                      {products.length === 0 ? (
                        <div className="col-span-full bg-[#0f172a] border border-white/10 rounded-2xl p-6 text-gray-400">No products found.</div>
                      ) : (
                        products.map((product) => (
                          <div key={product._id} className="bg-[#0f172a] border border-white/10 rounded-2xl p-4">
                            <p className="font-black line-clamp-2">{product.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                            <p className="text-sm text-emerald-200 font-bold mt-2">{currency(product.price)}</p>
                            <p className="text-xs text-gray-400 mt-2">Stock: {product.countInStock}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="flex items-center justify-between bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3">
                      <p className="text-xs text-gray-500">Page {productData?.page || 1} of {productData?.pages || 1}</p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={!productData?.hasPrevPage}
                          onClick={() => setProductsPage((prev) => Math.max(prev - 1, 1))}
                          className="px-3 py-1.5 rounded-lg border border-white/15 text-sm disabled:opacity-40"
                        >
                          <FaChevronLeft />
                        </button>
                        <button
                          type="button"
                          disabled={!productData?.hasNextPage}
                          onClick={() => setProductsPage((prev) => prev + 1)}
                          className="px-3 py-1.5 rounded-lg border border-white/15 text-sm disabled:opacity-40"
                        >
                          <FaChevronRight />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="space-y-4">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setOrdersPage(1);
                        setOrdersKeyword(ordersKeywordInput.trim());
                      }}
                      className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-3"
                    >
                      <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type="text"
                          value={ordersKeywordInput}
                          onChange={(e) => setOrdersKeywordInput(e.target.value)}
                          placeholder="Search by order id or buyer..."
                          className="w-full pl-10 pr-3 py-3 bg-[#020617]/80 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <select
                        value={ordersStatus}
                        onChange={(e) => {
                          setOrdersPage(1);
                          setOrdersStatus(e.target.value);
                        }}
                        className="px-3 py-3 bg-[#020617]/80 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500"
                      >
                        <option value="all" className="bg-[#0b1220]">All Orders</option>
                        <option value="paid" className="bg-[#0b1220]">Paid</option>
                        <option value="unpaid" className="bg-[#0b1220]">Unpaid</option>
                        <option value="pendingDelivery" className="bg-[#0b1220]">Pending Delivery</option>
                        <option value="delivered" className="bg-[#0b1220]">Delivered</option>
                      </select>
                      <button type="submit" className="px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#04111f] font-black">
                        Apply
                      </button>
                    </form>

                    <div className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/10 font-black flex items-center gap-2">
                      <FaMoneyBillWave /> Recent Orders
                    </div>
                    {loadingOrders ? <div className="px-4 py-4 text-gray-400 text-sm">Loading orders...</div> : null}
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[860px]">
                        <thead className="bg-[#0a1224]">
                          <tr className="text-left text-xs uppercase tracking-wide text-gray-400">
                            <th className="px-4 py-3">Order</th>
                            <th className="px-4 py-3">Buyer</th>
                            <th className="px-4 py-3">Items</th>
                            <th className="px-4 py-3">Seller Revenue</th>
                            <th className="px-4 py-3">Paid</th>
                            <th className="px-4 py-3">Delivered</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.length === 0 ? (
                            <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No orders found.</td></tr>
                          ) : (
                            orders.map((order) => (
                              <tr key={order._id} className="border-t border-white/5">
                                <td className="px-4 py-3 text-sm text-gray-300">{order._id}</td>
                                <td className="px-4 py-3 text-sm text-gray-300">{order.buyerName || '-'}<p className="text-xs text-gray-500">{order.buyerEmail || '-'}</p></td>
                                <td className="px-4 py-3 text-sm text-gray-300">{order.sellerItems || 0}</td>
                                <td className="px-4 py-3 text-sm font-bold text-emerald-200">{currency(order.sellerRevenue)}</td>
                                <td className="px-4 py-3 text-sm">{order.isPaid ? <span className="text-emerald-200 inline-flex items-center gap-1"><FaCheckCircle /> Paid</span> : <span className="text-amber-200 inline-flex items-center gap-1"><FaClock /> Unpaid</span>}</td>
                                <td className="px-4 py-3 text-sm">{order.isDelivered ? <span className="text-cyan-200">Delivered</span> : <span className="text-amber-200">Pending</span>}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
                      <p className="text-xs text-gray-500">Page {orderData?.page || 1} of {orderData?.pages || 1}</p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={!orderData?.hasPrevPage}
                          onClick={() => setOrdersPage((prev) => Math.max(prev - 1, 1))}
                          className="px-3 py-1.5 rounded-lg border border-white/15 text-sm disabled:opacity-40"
                        >
                          <FaChevronLeft />
                        </button>
                        <button
                          type="button"
                          disabled={!orderData?.hasNextPage}
                          onClick={() => setOrdersPage((prev) => prev + 1)}
                          className="px-3 py-1.5 rounded-lg border border-white/15 text-sm disabled:opacity-40"
                        >
                          <FaChevronRight />
                        </button>
                      </div>
                    </div>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminSellerDetailsScreen;
