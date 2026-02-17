import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { FaUserCircle, FaBox, FaCog, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';

const AccountMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-700 hover:text-green-500 font-bold transition-all"
      >
        <FaUserCircle size={28} className="text-gray-400" />
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Welcome</span>
          <span className="text-sm">{userInfo ? userInfo.name.split(' ')[0] : 'Sign In'}</span>
        </div>
        <FaChevronDown size={10} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] overflow-hidden">
          {!userInfo ? (
            <div className="p-4 bg-gray-50 text-center">
              <Link to="/login" className="block w-full bg-green-500 text-white py-2 rounded-xl font-bold mb-2">Sign In</Link>
              <p className="text-xs text-gray-500">New to Gulit? <Link to="/register" className="text-green-600 font-bold">Join now</Link></p>
            </div>
          ) : (
            <div className="py-2">
              <Link to="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 text-gray-700">
                <FaUserCircle className="text-green-500" /> My Profile
              </Link>
              <Link to="/my-orders" className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 text-gray-700">
                <FaBox className="text-green-500" /> My Orders
              </Link>
              <Link to="/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 text-gray-700">
                <FaCog className="text-green-500" /> Settings
              </Link>
              <hr className="my-1 border-gray-50" />
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors">
                <FaSignOutAlt /> Log Out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountMenu;