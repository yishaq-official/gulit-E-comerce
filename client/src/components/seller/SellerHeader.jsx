import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useSellerLogoutApiMutation } from '../../store/slices/sellersApiSlice';
import { logoutSeller } from '../../store/slices/sellerAuthSlice';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../assets/gulit.png';

const SellerHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // 👇 1. Bring in Redux State and Logout tools
  const { sellerInfo } = useSelector((state) => state.sellerAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useSellerLogoutApiMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logoutSeller());
      navigate('/seller/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-[#0f172a]/90 backdrop-blur-md border-b border-gray-800 shadow-xl shadow-gray-900/20 transition-all duration-300">
      <div className="w-full px-6 md:px-12 h-20 flex items-center justify-between">
        
        {/* ==============================
            LEFT SIDE: Logo & Quick Links 
            ============================== */}
        <div className="flex items-center gap-8 md:gap-12">
          <Link to="/sell" className="flex items-center gap-3 group">
            <img 
              src={logo} 
              alt="Gulit Logo" 
              className="w-50 h-50 object-contain group-hover:scale-105 transition-transform duration-300" 
            />
            <span className="text-2xl font-black text-white tracking-tight">
              Gulit <span className="text-green-500 font-medium">Seller Center</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 font-medium">
            <Link to="/seller/help-center" className="text-gray-400 hover:text-green-400 transition-colors duration-300">Help Center</Link>
            <Link to="/seller/rules-center" className="text-gray-400 hover:text-green-400 transition-colors duration-300">Rules Center</Link>
            {sellerInfo?.isApproved ? <Link to="/seller/inbox" className="text-gray-400 hover:text-green-400 transition-colors duration-300">Inbox</Link> : null}
          </div>
        </div>

        {/* ==============================
            RIGHT SIDE: Dynamic Action Buttons 
            ============================== */}
        <div className="hidden md:flex items-center gap-6">
          
          {/* 👇 2. CONDITIONAL RENDERING: Logged In vs Logged Out */}
          {sellerInfo ? (
            // IF LOGGED IN: Show Shop Profile & Logout
            <div className="flex items-center gap-6">
              
              {/* If approved, show dashboard link */}
              {sellerInfo.isApproved && (
                <Link to="/seller/dashboard" className="text-gray-300 hover:text-green-400 font-bold transition-colors">
                  Dashboard
                </Link>
              )}
              
              <div className="flex items-center gap-2 text-white font-medium bg-[#1e293b] px-4 py-2 rounded-full border border-gray-700">
                <FaUserCircle className="text-green-500 text-xl" />
                <span>{sellerInfo.shopName}</span>
              </div>
              
              <button 
                onClick={logoutHandler}
                className="text-gray-400 hover:text-red-400 flex items-center gap-2 font-bold transition-colors"
              >
                <FaSignOutAlt /> Sign Out
              </button>
            </div>
          ) : (
            // IF NOT LOGGED IN: Show Login & Register
            <>
              <Link 
                to="/seller/login" 
                className="text-white hover:text-green-400 hover:bg-white/5 px-5 py-2.5 rounded-xl font-bold transition-all duration-300"
              >
                Seller Login
              </Link>
              <Link 
                to="/seller/register" 
                className="bg-green-500 hover:bg-green-400 text-[#0f172a] px-7 py-2.5 rounded-full font-black transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-0.5"
              >
                Start Selling
              </Link>
            </>
          )}

        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-2xl text-white hover:text-green-400 transition-colors duration-300" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* ==============================
          MOBILE DROPDOWN MENU 
          ============================== */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1e293b] border-b border-gray-800 p-4 flex flex-col gap-4 shadow-xl transition-all duration-300">
          <Link to="/seller/help-center" className="text-gray-300 font-medium hover:text-green-400 transition-colors duration-300">Help Center</Link>
          <Link to="/seller/rules-center" className="text-gray-300 font-medium hover:text-green-400 transition-colors duration-300">Rules Center</Link>
          {sellerInfo?.isApproved ? <Link to="/seller/inbox" className="text-gray-300 font-medium hover:text-green-400 transition-colors duration-300">Inbox</Link> : null}
          <hr className="border-gray-700" />
          
          {sellerInfo ? (
            <>
              <div className="text-green-400 font-bold flex items-center gap-2">
                <FaUserCircle /> {sellerInfo.shopName}
              </div>
              {sellerInfo.isApproved && (
                <Link to="/seller/dashboard" className="text-white font-bold hover:text-green-400 transition-colors">Dashboard</Link>
              )}
              <button onClick={logoutHandler} className="text-red-400 font-bold text-left flex items-center gap-2">
                <FaSignOutAlt /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/seller/login" className="text-white font-bold hover:text-green-400 transition-colors duration-300">Seller Login</Link>
              <Link to="/seller/register" className="bg-green-500 hover:bg-green-400 text-[#0f172a] px-4 py-3 rounded-xl text-center font-black transition-colors duration-300">Start Selling</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default SellerHeader;
