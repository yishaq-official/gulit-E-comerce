import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FaCheckCircle,
  FaClock,
  FaPowerOff,
  FaSearch,
  FaShieldAlt,
  FaSignOutAlt,
  FaStore,
  FaSync,
  FaTimesCircle,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import logo from '../../assets/gulit.png';
import { adminLogout } from '../slices/adminAuthSlice';
import { useAdminGetSellersQuery, useAdminUpdateSellerStatusMutation } from '../slices/adminApiSlice';
import { BASE_URL } from '../../store/slices/apiSlice';
import AdminSidebar from '../components/AdminSidebar';

const statusOptions = [
  { key: 'all', label: 'All Sellers', icon: FaStore },
  { key: 'pending', label: 'Pending', icon: FaClock },
  { key: 'approved', label: 'Approved', icon: FaCheckCircle },
  { key: 'suspended', label: 'Suspended', icon: FaTimesCircle },
];

const fileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BASE_URL}/${String(path).replace(/^\/+/, '')}`;
};

const AdminSellerReviewScreen = () => {
  const { adminInfo } = useSelector((state) => state.adminAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [status, setStatus] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');

  const { data: sellers = [], isLoading, isError, refetch, isFetching } = useAdminGetSellersQuery({
    status,
    keyword,
  });
  const [updateSellerStatus, { isLoading: updating }] = useAdminUpdateSellerStatusMutation();

  const logoutHandler = () => {
    dispatch(adminLogout());
    navigate('/admin/login');
  };

  const counts = useMemo(() => {
    const summary = { pending: 0, approved: 0, suspended: 0, all: sellers.length };
    sellers.forEach((seller) => {
      if (!seller.isActive) summary.suspended += 1;
      else if (!seller.isApproved) summary.pending += 1;
      else summary.approved += 1;
    });
    return summary;
  }, [sellers]);

  const submitSearch = (e) => {
    e.preventDefault();
    setKeyword(searchInput.trim());
  };

  const applyStatusUpdate = async (sellerId, payload, successMessage) => {
    try {
      await updateSellerStatus({ sellerId, ...payload }).unwrap();
      toast.success(successMessage);
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to update seller status');
    }
  };

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
              <p className="text-sm font-bold text-gray-100">Seller Review Center</p>
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
            <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-[#0f172a]/95 via-[#111827]/95 to-[#0b1324]/95 p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300 font-bold mb-2">Admin Review</p>
              <h1 className="text-2xl sm:text-3xl font-black">Seller Verification & Risk Controls</h1>
              <p className="text-gray-300 mt-2">
                Review onboarding submissions, approve legitimate stores, and suspend risky accounts.
              </p>
              <p className="text-xs text-gray-500 mt-3">
                Signed in as {adminInfo?.name} ({adminInfo?.email})
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {statusOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setStatus(option.key)}
                  className={`rounded-xl border px-4 py-3 text-left ${
                    status === option.key
                      ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200'
                      : 'border-white/10 bg-[#0f172a] text-gray-300 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <option.icon /> {option.label}
                  </div>
                  <p className="text-xl font-black mt-1">{counts[option.key]}</p>
                </button>
              ))}
            </div>

            <form onSubmit={submitSearch} className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by shop name, email, phone, ID..."
                  className="w-full pl-10 pr-3 py-3 bg-[#020617]/80 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button type="submit" className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#04111f] font-black">
                Search
              </button>
              <button
                type="button"
                onClick={refetch}
                className="px-5 py-3 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.06] text-gray-200 font-bold inline-flex items-center gap-2"
              >
                <FaSync className={isFetching ? 'animate-spin' : ''} /> Refresh
              </button>
            </form>

            {isLoading ? <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 text-gray-300">Loading sellers...</div> : null}
            {isError ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-red-200">
                Failed to load sellers. Try refresh.
              </div>
            ) : null}

            <div className="space-y-4">
              {!isLoading && !isError && sellers.length === 0 ? (
                <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 text-gray-400">No sellers found for this filter.</div>
              ) : null}

              {sellers.map((seller) => (
                <div key={seller._id} className="bg-[#0f172a] border border-white/10 rounded-2xl p-5">
                  <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black">{seller.shopName}</h3>
                      <p className="text-gray-400">{seller.name} • {seller.email}</p>
                      <p className="text-gray-500 text-sm mt-1">Category: {seller.shopCategory || 'Other'} • Phone: {seller.phoneNumber}</p>
                      <p className="text-gray-500 text-xs mt-1">Registered: {new Date(seller.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-black border ${seller.isApproved ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-amber-500/30 bg-amber-500/10 text-amber-200'}`}>
                        {seller.isApproved ? 'Approved' : 'Pending'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-black border ${seller.isActive ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200' : 'border-red-500/30 bg-red-500/10 text-red-200'}`}>
                        {seller.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <a href={fileUrl(seller.kycDocuments?.idCardImage)} target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-[#020617]/80 px-4 py-3 hover:bg-white/[0.03]">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">KYC Document</p>
                      <p className="font-bold">National ID</p>
                    </a>
                    <a href={fileUrl(seller.kycDocuments?.merchantLicenseImage)} target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-[#020617]/80 px-4 py-3 hover:bg-white/[0.03]">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">KYC Document</p>
                      <p className="font-bold">Merchant License</p>
                    </a>
                    <a href={fileUrl(seller.kycDocuments?.taxReceiptImage)} target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-[#020617]/80 px-4 py-3 hover:bg-white/[0.03]">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">KYC Document</p>
                      <p className="font-bold">Tax Receipt</p>
                    </a>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {!seller.isApproved ? (
                      <button
                        type="button"
                        disabled={updating}
                        onClick={() => applyStatusUpdate(seller._id, { isApproved: true, isActive: true }, `${seller.shopName} approved`)}
                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#04111f] font-black inline-flex items-center gap-2"
                      >
                        <FaCheckCircle /> Approve Seller
                      </button>
                    ) : null}
                    {seller.isActive ? (
                      <button
                        type="button"
                        disabled={updating}
                        onClick={() => applyStatusUpdate(seller._id, { isActive: false }, `${seller.shopName} suspended`)}
                        className="px-4 py-2 rounded-lg bg-red-500/90 hover:bg-red-500 text-white font-black inline-flex items-center gap-2"
                      >
                        <FaPowerOff /> Suspend
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={updating}
                        onClick={() => applyStatusUpdate(seller._id, { isActive: true }, `${seller.shopName} reactivated`)}
                        className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#04111f] font-black inline-flex items-center gap-2"
                      >
                        <FaShieldAlt /> Reactivate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-[#081122]">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-sm text-gray-400">
          <p>Seller Review Center • Compliance and KYC Operations</p>
          <p>© {new Date().getFullYear()} Gulit Marketplace Admin</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminSellerReviewScreen;
