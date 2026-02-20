import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../../assets/gulit.png'; // 👈 Imported your real logo

const SellerHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-[#0f172a]/90 backdrop-blur-md border-b border-gray-800 shadow-xl shadow-gray-900/20 transition-all duration-300">
      
      {/* 1. Adjusted container to span wider (w-full px-8) to reduce the left/right margins */}
      <div className="w-full px-6 md:px-12 h-20 flex items-center justify-between">
        
        {/* ==============================
            LEFT SIDE: Logo & Quick Links 
            ============================== */}
        <div className="flex items-center gap-8 md:gap-12">
          
          {/* Logo Section */}
          <Link to="/sell" className="flex items-center gap-3 group">
            {/* 3. Replaced placeholder with the real image */}
            <img 
              src={logo} 
              alt="Gulit Logo" 
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-300" 
            />
            <span className="text-2xl font-black text-white tracking-tight">
              Gulit <span className="text-green-500 font-medium">Seller Center</span>
            </span>
          </Link>

          {/* 2. Moved Help & Rules Centers right next to the logo */}
          <div className="hidden md:flex items-center gap-6 font-medium">
            <Link to="#" className="text-gray-400 hover:text-green-400 transition-colors duration-300">Help Center</Link>
            <Link to="#" className="text-gray-400 hover:text-green-400 transition-colors duration-300">Rules Center</Link>
          </div>
        </div>

        {/* ==============================
            RIGHT SIDE: Action Buttons 
            ============================== */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* 5. Login turned into a subtle button with hover effects */}
          <Link 
            to="/seller/login" 
            className="text-white hover:text-green-400 hover:bg-white/5 px-5 py-2.5 rounded-xl font-bold transition-all duration-300"
          >
            Seller Login
          </Link>
          
          {/* 4. Start Shopping replaced with Start Selling */}
          <Link 
            to="/seller/register" 
            className="bg-green-500 hover:bg-green-400 text-[#0f172a] px-7 py-2.5 rounded-full font-black transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-0.5"
          >
            Start Selling
          </Link>
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
          <Link to="#" className="text-gray-300 font-medium hover:text-green-400 transition-colors duration-300">Help Center</Link>
          <Link to="#" className="text-gray-300 font-medium hover:text-green-400 transition-colors duration-300">Rules Center</Link>
          <hr className="border-gray-700" />
          <Link to="/seller/login" className="text-white font-bold hover:text-green-400 transition-colors duration-300">Seller Login</Link>
          <Link to="/seller/register" className="bg-green-500 hover:bg-green-400 text-[#0f172a] px-4 py-3 rounded-xl text-center font-black transition-colors duration-300">Start Selling</Link>
        </div>
      )}
    </nav>
  );
};

export default SellerHeader;