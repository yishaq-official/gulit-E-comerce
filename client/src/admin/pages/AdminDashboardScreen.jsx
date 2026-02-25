import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowRight,
  FaChartLine,
  FaExclamationTriangle,
  FaShieldAlt,
  FaSignOutAlt,
  FaStore,
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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#172554_0%,_#0b1220_38%,_#050816_100%)] text-white px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-[#0f172a]/95 via-[#111827]/95 to-[#0b1324]/95 p-6 sm:p-8">
          <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <img src={logo} alt="Gulit" className="w-9 h-9 object-contain" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300 font-bold mb-2">Gulit Command Center</p>
                <h1 className="text-2xl sm:text-3xl font-black">Welcome, {adminInfo?.name}</h1>
                <p className="text-gray-300 mt-2">Control trust, growth, and marketplace safety from one dashboard.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={logoutHandler}
              className="inline-flex items-center justify-center gap-2 bg-red-500/15 hover:bg-red-500/25 text-red-200 font-bold px-5 py-3 rounded-xl border border-red-500/30 transition-colors"
            >
              <FaSignOutAlt /> Logout
            </button>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-[#0f172a]/90 border border-white/10 rounded-3xl p-6">
            <h2 className="text-xl font-black flex items-center gap-3 mb-2">
              <FaShieldAlt className="text-cyan-300" /> Governance Priorities
            </h2>
            <p className="text-gray-300 mb-5">
              Focus on verification integrity, dispute handling, and operational bottlenecks.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-[#020617]/80 border border-white/10 rounded-xl px-4 py-3">
                <p className="font-bold text-gray-100">Review newly submitted seller KYC documents</p>
                <FaArrowRight className="text-cyan-300" />
              </div>
              <div className="flex items-center justify-between bg-[#020617]/80 border border-white/10 rounded-xl px-4 py-3">
                <p className="font-bold text-gray-100">Validate pending order disputes and escalation notes</p>
                <FaArrowRight className="text-cyan-300" />
              </div>
              <div className="flex items-center justify-between bg-[#020617]/80 border border-white/10 rounded-xl px-4 py-3">
                <p className="font-bold text-gray-100">Audit suspicious transactions and repeat violation patterns</p>
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
      </div>
    </div>
  );
};

export default AdminDashboardScreen;
