import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaCog,
  FaGavel,
  FaHome,
  FaLifeRing,
  FaMoneyCheckAlt,
  FaUserCheck,
  FaUsers,
} from 'react-icons/fa';
import logo from '../../assets/gulit.png';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: FaHome, to: '/admin/dashboard' },
  { key: 'seller-review', label: 'Seller Review', icon: FaUserCheck, to: '/admin/sellers' },
  { key: 'user-management', label: 'User Management', icon: FaUsers, to: '/admin/users' },
  { key: 'orders-disputes', label: 'Orders & Disputes', icon: FaGavel, to: '/admin/disputes' },
  { key: 'finance', label: 'Finance', icon: FaMoneyCheckAlt, to: '/admin/finance' },
  { key: 'support', label: 'Support Inbox', icon: FaLifeRing, to: '/admin/support' },
  { key: 'system-settings', label: 'System Settings', icon: FaCog, to: '/admin/settings' },
];

const AdminSidebar = ({ activeKey }) => {
  return (
    <aside className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 h-fit lg:sticky lg:top-24">
      <div className="flex items-center justify-center mb-4 py-2">
        <img src={logo} alt="Gulit" className="w-40 h-40 object-contain" />
      </div>
      <p className="text-xs uppercase tracking-[0.16em] text-cyan-300 font-bold mb-3 px-2">Navigation</p>
      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const ItemIcon = item.icon;
          const isActive = activeKey === item.key;
          const baseClass = `w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
            isActive
              ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-200'
              : 'border border-transparent text-gray-300'
          }`;

          return (
            <Link
              key={item.key}
              to={item.to}
              className={`${baseClass} ${isActive ? '' : 'hover:bg-white/[0.03]'}`}
            >
              <ItemIcon />
              <span className="font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
