import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FaChevronLeft,
  FaChevronRight,
  FaLifeRing,
  FaSearch,
  FaSignOutAlt,
  FaSync,
  FaTasks,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import logo from '../../assets/gulit.png';
import AdminSidebar from '../components/AdminSidebar';
import { adminLogout } from '../slices/adminAuthSlice';
import { useAdminGetSupportQueueQuery, useAdminUpdateSupportCaseMutation } from '../slices/adminApiSlice';

const sourceBadge = (source) => {
  if (source === 'dispute') return 'border-rose-500/30 bg-rose-500/10 text-rose-200';
  if (source === 'delivery') return 'border-amber-500/30 bg-amber-500/10 text-amber-200';
  return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200';
};

const priorityBadge = (priority) => {
  if (priority === 'high') return 'border-red-500/30 bg-red-500/10 text-red-200';
  if (priority === 'medium') return 'border-orange-500/30 bg-orange-500/10 text-orange-200';
  return 'border-gray-500/30 bg-gray-500/10 text-gray-300';
};

const statusBadge = (status) => {
  if (status === 'resolved' || status === 'active') return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200';
  if (status === 'suspended' || status === 'rejected') return 'border-red-500/30 bg-red-500/10 text-red-200';
  if (status === 'in_review') return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200';
  return 'border-amber-500/30 bg-amber-500/10 text-amber-200';
};

const AdminSupportDeskScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [source, setSource] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const { data, isLoading, isError, isFetching, refetch } = useAdminGetSupportQueueQuery({
    page,
    limit,
    keyword,
    source,
    status,
  });
  const [updateCase, { isLoading: updatingCase }] = useAdminUpdateSupportCaseMutation();

  const summary = data?.summary || {};
  const cases = data?.cases || [];
  const pages = data?.pages || 1;

  const statusOptions = useMemo(
    () => ['all', 'open', 'in_review', 'resolved', 'rejected', 'pending', 'suspended', 'active'],
    []
  );

  const logoutHandler = () => {
    dispatch(adminLogout());
    navigate('/admin/login');
  };

  const submitSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setKeyword(searchInput.trim());
  };

  const handleAction = async (item, action) => {
    const note = window.prompt(`Optional note for action "${action}"`, '') ?? '';
    try {
      await updateCase({ source: item.source, id: item.sourceId, action, note: note.trim() }).unwrap();
      toast.success(`Case ${item.sourceId} updated: ${action}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to update case');
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
              <p className="text-sm font-bold text-gray-100">Support Desk</p>
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
          <AdminSidebar activeKey="support" />
          <section className="space-y-6">
            <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-[#0f172a]/95 via-[#111827]/95 to-[#0b1324]/95 p-6">
              <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-3">
                <FaLifeRing className="text-cyan-300" /> Support Desk
              </h1>
              <p className="text-gray-300 mt-2">Unified queue for disputes, delayed deliveries, and seller compliance operations.</p>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
                <p className="text-xs text-rose-200 uppercase tracking-wide">Open Disputes</p>
                <p className="text-2xl font-black text-rose-100 mt-1">{summary.openDisputes || 0}</p>
              </div>
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                <p className="text-xs text-amber-200 uppercase tracking-wide">Delayed Deliveries</p>
                <p className="text-2xl font-black text-amber-100 mt-1">{summary.delayedDeliveries || 0}</p>
              </div>
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <p className="text-xs text-red-200 uppercase tracking-wide">Suspended Sellers</p>
                <p className="text-2xl font-black text-red-100 mt-1">{summary.suspendedSellers || 0}</p>
              </div>
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4">
                <p className="text-xs text-cyan-200 uppercase tracking-wide">Pending Sellers</p>
                <p className="text-2xl font-black text-cyan-100 mt-1">{summary.pendingSellers || 0}</p>
              </div>
              <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-4">
                <p className="text-xs text-violet-200 uppercase tracking-wide">Total Cases</p>
                <p className="text-2xl font-black text-violet-100 mt-1">{summary.totalCases || 0}</p>
              </div>
            </div>

            <form onSubmit={submitSearch} className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                <div className="relative md:col-span-2">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search case by ID, seller, buyer..."
                    className="w-full pl-10 pr-3 py-3 bg-[#020617]/80 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <select
                  value={source}
                  onChange={(e) => {
                    setPage(1);
                    setSource(e.target.value);
                  }}
                  className="px-3 py-3 bg-[#020617]/80 border border-white/10 rounded-xl"
                >
                  <option value="all" className="bg-[#0b1220]">Source: All</option>
                  <option value="dispute" className="bg-[#0b1220]">Disputes</option>
                  <option value="delivery" className="bg-[#0b1220]">Delivery</option>
                  <option value="seller" className="bg-[#0b1220]">Seller</option>
                </select>
                <select
                  value={status}
                  onChange={(e) => {
                    setPage(1);
                    setStatus(e.target.value);
                  }}
                  className="px-3 py-3 bg-[#020617]/80 border border-white/10 rounded-xl"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#0b1220]">
                      Status: {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-2">
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
              </div>
            </form>

            {isLoading ? <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 text-gray-300">Loading support queue...</div> : null}
            {isError ? <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-red-200">Failed to load support queue.</div> : null}

            {!isLoading && !isError && (
              <div className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-sm font-black text-gray-200 flex items-center gap-2">
                    <FaTasks className="text-cyan-300" /> Case Queue
                  </h2>
                  <p className="text-xs text-gray-500">{data?.total || 0} records</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1200px]">
                    <thead className="bg-[#0a1224] border-b border-white/10">
                      <tr className="text-left text-xs uppercase tracking-wider text-gray-400">
                        <th className="px-4 py-3">Case</th>
                        <th className="px-4 py-3">Actor</th>
                        <th className="px-4 py-3">Source</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Priority</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Updated</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cases.length === 0 ? (
                        <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No cases found.</td></tr>
                      ) : (
                        cases.map((item) => (
                          <tr key={item.caseKey} className="border-b border-white/5 hover:bg-white/[0.03]">
                            <td className="px-4 py-4 text-sm text-gray-200">
                              <p className="font-black">{item.subject}</p>
                              <p className="text-xs text-gray-500">{item.sourceId}</p>
                              {item.note ? <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.note}</p> : null}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-300">
                              <p>{item.actorName}</p>
                              <p className="text-xs text-gray-500">{item.actorEmail}</p>
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-black border ${sourceBadge(item.source)}`}>
                                {String(item.source).toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-black border ${statusBadge(item.status)}`}>
                                {String(item.status).toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-black border ${priorityBadge(item.priority)}`}>
                                {String(item.priority).toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-300">
                              {Number(item.amount || 0).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}{' '}
                              ETB
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-300">{new Date(item.updatedAt).toLocaleString()}</td>
                            <td className="px-4 py-4">
                              <div className="flex flex-wrap gap-2">
                                {item.source === 'seller' ? (
                                  <>
                                    <button
                                      type="button"
                                      disabled={updatingCase}
                                      onClick={() => handleAction(item, 'approve')}
                                      className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#04111f] text-xs font-black"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      type="button"
                                      disabled={updatingCase}
                                      onClick={() => handleAction(item, 'suspend')}
                                      className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-[#160707] text-xs font-black"
                                    >
                                      Suspend
                                    </button>
                                    <button
                                      type="button"
                                      disabled={updatingCase}
                                      onClick={() => handleAction(item, 'activate')}
                                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#04110a] text-xs font-black"
                                    >
                                      Activate
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      disabled={updatingCase}
                                      onClick={() => handleAction(item, 'review')}
                                      className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#04111f] text-xs font-black"
                                    >
                                      Review
                                    </button>
                                    <button
                                      type="button"
                                      disabled={updatingCase}
                                      onClick={() => handleAction(item, 'resolve')}
                                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#04110a] text-xs font-black"
                                    >
                                      Resolve
                                    </button>
                                    <button
                                      type="button"
                                      disabled={updatingCase}
                                      onClick={() => handleAction(item, 'reject')}
                                      className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-[#160707] text-xs font-black"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
                  <p className="text-xs text-gray-500">Page {data?.page || 1} of {pages}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      className="px-3 py-1.5 rounded-lg border border-white/15 text-sm disabled:opacity-40"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      type="button"
                      disabled={page >= pages}
                      onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
                      className="px-3 py-1.5 rounded-lg border border-white/15 text-sm disabled:opacity-40"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminSupportDeskScreen;
