import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaSignOutAlt,
  FaSync,
  FaUserShield,
  FaUsers,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import logo from '../../assets/gulit.png';
import AdminSidebar from '../components/AdminSidebar';
import { adminLogout } from '../slices/adminAuthSlice';
import { useAdminGetUsersQuery, useAdminUpdateUserRoleMutation } from '../slices/adminApiSlice';

const sortOptions = [
  { value: 'createdAt_desc', label: 'Newest' },
  { value: 'createdAt_asc', label: 'Oldest' },
  { value: 'name_asc', label: 'Name A-Z' },
  { value: 'email_asc', label: 'Email A-Z' },
  { value: 'role_asc', label: 'Role A-Z' },
  { value: 'paidOrders_desc', label: 'Top Orders' },
  { value: 'totalSpent_desc', label: 'Top Spend' },
];

const currency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETB',
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const AdminUserManagementScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [role, setRole] = useState('all');
  const [page, setPage] = useState(1);
  const [sortValue, setSortValue] = useState('createdAt_desc');
  const [limit] = useState(10);

  const [sortBy, sortOrder] = sortValue.split('_');

  const { data, isLoading, isError, isFetching, refetch } = useAdminGetUsersQuery({
    keyword,
    role,
    sortBy,
    sortOrder,
    page,
    limit,
  });

  const users = data?.users || [];
  const pages = data?.pages || 1;
  const total = data?.total || 0;

  const [updateUserRole, { isLoading: updatingRole }] = useAdminUpdateUserRoleMutation();

  const roleCounts = useMemo(() => {
    const counts = { all: users.length, buyer: 0, admin: 0, seller: 0 };
    users.forEach((user) => {
      counts[user.role] = (counts[user.role] || 0) + 1;
    });
    return counts;
  }, [users]);

  const logoutHandler = () => {
    dispatch(adminLogout());
    navigate('/admin/login');
  };

  const submitSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setKeyword(searchInput.trim());
  };

  const updateRole = async (userId, nextRole) => {
    try {
      await updateUserRole({ userId, role: nextRole }).unwrap();
      toast.success(`Role updated to ${nextRole}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to update role');
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
              <p className="text-sm font-bold text-gray-100">User Management</p>
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
          <AdminSidebar activeKey="user-management" />
          <section className="space-y-6">
            <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-[#0f172a]/95 via-[#111827]/95 to-[#0b1324]/95 p-6">
              <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-3">
                <FaUsers className="text-cyan-300" /> User Accounts
              </h1>
              <p className="text-gray-300 mt-2">Manage buyer/admin user accounts with role filters and action controls.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['all', 'buyer', 'admin', 'seller'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setPage(1);
                    setRole(r);
                  }}
                  className={`rounded-xl border px-4 py-3 text-left ${
                    role === r
                      ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200'
                      : 'border-white/10 bg-[#0f172a] text-gray-300 hover:bg-white/[0.03]'
                  }`}
                >
                  <p className="text-sm font-bold capitalize">{r}</p>
                  <p className="text-xl font-black mt-1">{roleCounts[r] || 0}</p>
                </button>
              ))}
            </div>

            <form onSubmit={submitSearch} className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="relative md:col-span-2">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-3 py-3 bg-[#020617]/80 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <select
                  value={sortValue}
                  onChange={(e) => {
                    setPage(1);
                    setSortValue(e.target.value);
                  }}
                  className="px-3 py-3 bg-[#020617]/80 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-[#0b1220]">
                      Sort: {option.label}
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
                <span className="px-4 py-3 rounded-xl border border-white/10 bg-[#020617]/80 text-sm text-gray-300 inline-flex items-center gap-2">
                  <FaUserShield /> {total} users found
                </span>
              </div>
            </form>

            {isLoading ? <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 text-gray-300">Loading users...</div> : null}
            {isError ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-red-200">
                Failed to load users.
              </div>
            ) : null}

            {!isLoading && !isError && (
              <div className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1050px]">
                    <thead className="bg-[#0a1224] border-b border-white/10">
                      <tr className="text-left text-xs uppercase tracking-wider text-gray-400">
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Google</th>
                        <th className="px-4 py-3">Paid Orders</th>
                        <th className="px-4 py-3">Total Spent</th>
                        <th className="px-4 py-3">Created</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                            No users found for this filter.
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user._id} className="border-b border-white/5 hover:bg-white/[0.03]">
                            <td className="px-4 py-4">
                              <p className="font-black text-gray-100">{user.name}</p>
                              <p className="text-sm text-gray-400">{user.email}</p>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-black border ${
                                  user.role === 'admin'
                                    ? 'border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-200'
                                    : user.role === 'seller'
                                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
                                    : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200'
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-300">{user.googleId ? 'Linked' : 'No'}</td>
                            <td className="px-4 py-4 text-sm font-bold text-gray-200">{user.paidOrdersCount || 0}</td>
                            <td className="px-4 py-4 text-sm font-black text-emerald-200">{currency(user.totalSpent)}</td>
                            <td className="px-4 py-4 text-sm text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-4">
                              <div className="flex flex-wrap gap-2">
                                {user.role !== 'admin' ? (
                                  <button
                                    type="button"
                                    disabled={updatingRole}
                                    onClick={() => updateRole(user._id, 'admin')}
                                    className="px-3 py-1.5 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-400 text-[#1b1024] text-xs font-black"
                                  >
                                    Make Admin
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={updatingRole}
                                    onClick={() => updateRole(user._id, 'buyer')}
                                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#201404] text-xs font-black"
                                  >
                                    Make Buyer
                                  </button>
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

export default AdminUserManagementScreen;
