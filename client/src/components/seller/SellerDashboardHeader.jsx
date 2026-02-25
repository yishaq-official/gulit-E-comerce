import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useSellerLogoutApiMutation } from '../../store/slices/sellersApiSlice';
import { logoutSeller } from '../../store/slices/sellerAuthSlice';
import { 
  FaUserCircle, FaSignOutAlt, FaCaretDown, FaChartPie, 
  FaBoxOpen, FaClipboardList, FaWallet, FaCog, FaInbox
} from 'react-icons/fa';
import logo from '../../assets/gulit.png';

const SellerDashboardHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const { sellerInfo } = useSelector((state) => state.sellerAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useSellerLogoutApiMutation();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <nav className="fixed w-full z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-gray-800 shadow-xl shadow-gray-900/20">
      <div className="w-full px-6 md:px-12 h-20 flex items-center justify-between">
        
        {/* ==============================
            LEFT SIDE: Logo & Quick Links 
            ============================== */}
        <div className="flex items-center gap-8 md:gap-12">
          <Link to="/seller/dashboard" className="flex items-center gap-3 group">
            <img 
              src={logo} 
              alt="Gulit Logo" 
              className="w-50 h-50 object-contain group-hover:scale-105 transition-transform duration-300" 
            />
            <span className="text-2xl font-black text-white tracking-tight">
              Gulit <span className="text-green-500 font-medium">Workspace</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 font-medium">
            <Link to="/seller/help-center" className="text-gray-400 hover:text-green-400 transition-colors duration-300">Help Center</Link>
            <Link to="/seller/rules-center" className="text-gray-400 hover:text-green-400 transition-colors duration-300">Rules Center</Link>
            <Link to="/seller/inbox" className="text-gray-400 hover:text-green-400 transition-colors duration-300">Inbox</Link>
          </div>
        </div>

        {/* ==============================
            RIGHT SIDE: Dropdown & Logout
            ============================== */}
        <div className="flex items-center gap-6">
          
          {/* Profile Dropdown Container */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-white font-medium bg-[#1e293b] hover:bg-gray-800 px-4 py-2.5 rounded-xl border border-gray-700 transition-all focus:outline-none focus:border-green-500"
            >
              <FaUserCircle className="text-green-500 text-xl" />
              <span>{sellerInfo?.shopName || 'My Store'}</span>
              <FaCaretDown className={`text-gray-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-[#1e293b] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50 animate-fade-in-up">
                <div className="px-5 py-4 border-b border-gray-700 bg-[#0f172a]/50">
                  <p className="text-sm text-gray-400">Signed in as</p>
                  <p className="text-sm font-bold text-white truncate">{sellerInfo?.email}</p>
                </div>
                
                <div className="py-2 flex flex-col">
                  <Link to="/seller/dashboard" onClick={() => setDropdownOpen(false)} className="px-5 py-3 text-gray-300 hover:text-green-400 hover:bg-white/5 flex items-center gap-3 transition-colors">
                    <FaChartPie className="text-lg" /> Dashboard Analytics
                  </Link>
                  <Link to="/seller/products" onClick={() => setDropdownOpen(false)} className="px-5 py-3 text-gray-300 hover:text-green-400 hover:bg-white/5 flex items-center gap-3 transition-colors">
                    <FaBoxOpen className="text-lg" /> Manage Products
                  </Link>
                  <Link to="/seller/orders" onClick={() => setDropdownOpen(false)} className="px-5 py-3 text-gray-300 hover:text-green-400 hover:bg-white/5 flex items-center gap-3 transition-colors">
                    <FaClipboardList className="text-lg" /> Orders & Fulfillment
                  </Link>
                  <Link to="/seller/wallet" onClick={() => setDropdownOpen(false)} className="px-5 py-3 text-gray-300 hover:text-green-400 hover:bg-white/5 flex items-center gap-3 transition-colors">
                    <FaWallet className="text-lg" /> Seller Wallet
                  </Link>
                  <Link to="/seller/inbox" onClick={() => setDropdownOpen(false)} className="px-5 py-3 text-gray-300 hover:text-green-400 hover:bg-white/5 flex items-center gap-3 transition-colors">
                    <FaInbox className="text-lg" /> Support Inbox
                  </Link>
                  <Link to="/seller/settings" onClick={() => setDropdownOpen(false)} className="px-5 py-3 text-gray-300 hover:text-green-400 hover:bg-white/5 flex items-center gap-3 transition-colors">
                    <FaCog className="text-lg" /> Shop Settings
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Dedicated Navbar Logout Button */}
          <button 
            onClick={logoutHandler}
            className="hidden md:flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-bold px-5 py-2.5 rounded-xl transition-colors border border-red-500/20"
          >
            <FaSignOutAlt /> Logout
          </button>
          
        </div>
      </div>
    </nav>
  );
};

export default SellerDashboardHeader;
