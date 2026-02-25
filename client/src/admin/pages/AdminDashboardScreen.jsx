import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowRight,
  FaChartLine,
  FaClipboardList,
  FaExclamationTriangle,
  FaGavel,
  FaHome,
  FaLifeRing,
  FaMoneyCheckAlt,
  FaSearch,
  FaShieldAlt,
  FaSignOutAlt,
  FaStore,
  FaUserCheck,
  FaUsers,
} from 'react-icons/fa';
import { adminLogout } from '../slices/adminAuthSlice';
import logo from '../../assets/gulit.png';

const AdminDashboardScreen = () => {
  const { adminInfo } = useSelector((state) => state.adminAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(adminLogout());
    navigate('/admin/login');
  };

  const cards = [
    {
      label: 'Registered Users',
      value: '1,284',
      delta: '+6.2%',
      icon: FaUsers,
      iconColor: 'text-cyan-300',
      chip: 'vs last week',
    },
    {
      label: 'Active Sellers',
      value: '342',
      delta: '+3.1%',
      icon: FaStore,
      iconColor: 'text-emerald-300',
      chip: 'approval stable',
    },
    {
      label: 'Risk Alerts',
      value: '8',
      delta: '-2',
      icon: FaExclamationTriangle,
      iconColor: 'text-amber-300',
      chip: 'needs review',
    },
    {
      label: 'Revenue Pulse',
      value: 'ETB 2.4M',
      delta: '+12.8%',
      icon: FaChartLine,
      iconColor: 'text-fuchsia-300',
      chip: 'monthly trend',
    },
  ];

  const queues = [
    { title: 'Seller Approvals', count: 14, color: 'text-cyan-200' },
    { title: 'Dispute Tickets', count: 5, color: 'text-amber-200' },
    { title: 'Refund Requests', count: 11, color: 'text-red-200' },
    { title: 'Policy Violations', count: 3, color: 'text-orange-200' },
  ];

  const navItems = [
    { label: 'Dashboard', icon: FaHome, active: true },
    { label: 'Seller Review', icon: FaUserCheck, active: false },
    { label: 'User Management', icon: FaUsers, active: false },
    { label: 'Orders & Disputes', icon: FaGavel, active: false },
    { label: 'Finance', icon: FaMoneyCheckAlt, active: false },
    { label: 'Support Desk', icon: FaLifeRing, active: false },
  ];

  return (
    <div className="min-h-screen bg-[#070c18] text-white flex flex-col">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#081122]/95 backdrop-blur">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <img src={logo} alt="Gulit" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300 font-bold">Gulit Admin</p>
              <p className="text-sm font-bold text-gray-100">Marketplace Control Room</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-gray-300">
              <FaSearch className="text-gray-500" />
              <span>Search sellers, users, orders...</span>
            </div>
            <button
              type="button"
              onClick={logoutHandler}
              className="inline-flex items-center justify-center gap-2 bg-red-500/15 hover:bg-red-500/25 text-red-200 font-bold px-4 py-2.5 rounded-xl border border-red-500/30 transition-colors"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 h-fit lg:sticky lg:top-24">
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-300 font-bold mb-3 px-2">Navigation</p>
            <nav className="space-y-1.5">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
                    item.active
                      ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-200'
                      : 'border border-transparent hover:bg-white/[0.03] text-gray-300'
                  }`}
                >
                  <item.icon />
                  <span className="font-semibold">{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <section className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-[#0f172a]/95 via-[#111827]/95 to-[#0b1324]/95 p-6">
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-16 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />
              <div className="relative">
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300 font-bold mb-2">Dashboard</p>
                <h1 className="text-2xl sm:text-3xl font-black">Welcome, {adminInfo?.name}</h1>
                <p className="text-gray-300 mt-2">Control trust, growth, and marketplace safety from one dashboard.</p>
                <div className="md:hidden mt-4">
                  <button
                    type="button"
                    onClick={logoutHandler}
                    className="inline-flex items-center justify-center gap-2 bg-red-500/15 hover:bg-red-500/25 text-red-200 font-bold px-4 py-2.5 rounded-xl border border-red-500/30 transition-colors"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {cards.map((card) => (
                <div key={card.label} className="bg-[#0f172a]/90 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[#020617]/80 border border-white/10 flex items-center justify-center">
                      <card.icon className={card.iconColor} />
                    </div>
                    <span className="text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
                      {card.delta}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{card.label}</p>
                  <p className="text-3xl font-black mt-1">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.chip}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="xl:col-span-2 bg-[#0f172a]/90 border border-white/10 rounded-3xl p-6">
                <h2 className="text-xl font-black flex items-center gap-3 mb-2">
                  <FaShieldAlt className="text-cyan-300" /> Governance Priorities
                </h2>
                <p className="text-gray-300 mb-5">
                  Focus on verification integrity, dispute handling, and operational bottlenecks.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-[#020617]/80 border border-white/10 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FaClipboardList className="text-cyan-300" />
                      <p className="font-bold text-gray-100">Review newly submitted seller KYC documents</p>
                    </div>
                    <FaArrowRight className="text-cyan-300" />
                  </div>
                  <div className="flex items-center justify-between bg-[#020617]/80 border border-white/10 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FaClipboardList className="text-cyan-300" />
                      <p className="font-bold text-gray-100">Validate pending order disputes and escalation notes</p>
                    </div>
                    <FaArrowRight className="text-cyan-300" />
                  </div>
                  <div className="flex items-center justify-between bg-[#020617]/80 border border-white/10 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FaClipboardList className="text-cyan-300" />
                      <p className="font-bold text-gray-100">Audit suspicious transactions and repeat violation patterns</p>
                    </div>
                    <FaArrowRight className="text-cyan-300" />
                  </div>
                </div>
              </div>

              <div className="bg-[#0f172a]/90 border border-white/10 rounded-3xl p-6">
                <h2 className="text-xl font-black mb-4">Action Queue</h2>
                <div className="space-y-3">
                  {queues.map((queue) => (
                    <div key={queue.title} className="flex items-center justify-between bg-[#020617]/80 border border-white/10 rounded-xl px-4 py-3">
                      <p className="text-sm text-gray-300">{queue.title}</p>
                      <span className={`font-black ${queue.color}`}>{queue.count}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Next page can be the Seller Approval module linked from this queue.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-[#081122]">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Gulit Marketplace Admin</p>
          <p>Security-first operations panel</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboardScreen;
