import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaUsers, FaStore, FaExclamationTriangle, FaSignOutAlt } from 'react-icons/fa';
import { adminLogout } from '../slices/adminAuthSlice';

const AdminDashboardScreen = () => {
  const { adminInfo } = useSelector((state) => state.adminAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(adminLogout());
    navigate('/admin/login');
  };

  const cards = [
    { label: 'Total Users', value: '1,284', icon: FaUsers, color: 'text-cyan-300' },
    { label: 'Active Sellers', value: '342', icon: FaStore, color: 'text-green-300' },
    { label: 'Risk Alerts', value: '8', icon: FaExclamationTriangle, color: 'text-amber-300' },
  ];

  return (
    <div className="min-h-screen bg-[#0a1020] text-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-300 font-bold mb-2">Admin Workspace</p>
            <h1 className="text-3xl font-black">Welcome, {adminInfo?.name}</h1>
            <p className="text-gray-400 mt-2">Platform overview and operational controls.</p>
          </div>
          <button
            type="button"
            onClick={logoutHandler}
            className="inline-flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 font-bold px-5 py-3 rounded-xl border border-red-500/20"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {cards.map((card) => (
            <div key={card.label} className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
              <div className="w-11 h-11 rounded-xl bg-[#0b1220] border border-gray-700 flex items-center justify-center mb-4">
                <card.icon className={card.color} />
              </div>
              <p className="text-gray-400 text-sm">{card.label}</p>
              <p className="text-3xl font-black mt-1">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-[#111827] to-[#0f172a] border border-cyan-500/20 rounded-3xl p-8">
          <h2 className="text-2xl font-black flex items-center gap-3 mb-3">
            <FaShieldAlt className="text-cyan-300" /> Admin Center
          </h2>
          <p className="text-gray-300 max-w-3xl">
            This is the initial admin interface foundation. Next steps are management modules: seller approvals,
            violations, refund arbitration, dispute handling, and marketplace analytics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardScreen;
