import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaLifeRing, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../assets/gulit.png';
import AdminSidebar from '../components/AdminSidebar';
import { adminLogout } from '../slices/adminAuthSlice';

const AdminSupportDeskScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(adminLogout());
    navigate('/admin/login');
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
              <p className="text-gray-300 mt-2">Centralized handling for seller and buyer support operations.</p>
            </div>
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 text-gray-300">
              Ticket queues, SLA tracking, and agent workflows can be implemented in this section.
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminSupportDeskScreen;
