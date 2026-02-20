import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const SellerHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-[#0f172a]/90 backdrop-blur-md border-b border-gray-800 shadow-xl shadow-gray-900/20">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
        
        {/* Logo */}
        <Link to="/sell" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-green-500/30 group-hover:scale-105 transition-transform">
            G
          </div>
          <span className="text-2xl font-black text-white tracking-tight">
            Gulit <span className="text-green-500 font-medium">Seller Center</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link to="#" className="text-gray-400 hover:text-green-400 transition-colors">Help Center</Link>
          <Link to="#" className="text-gray-400 hover:text-green-400 transition-colors">Rules Center</Link>
          <Link to="/seller/login" className="text-white hover:text-green-400 transition-colors font-bold">Seller Login</Link>
          <Link 
            to="/" 
            className="bg-white/10 border border-white/20 text-white px-6 py-2 rounded-full font-bold hover:bg-green-500 hover:border-green-500 hover:text-white transition-all shadow-md backdrop-blur-sm"
          >
            Start Shopping
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-2xl text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1e293b] border-b border-gray-800 p-4 flex flex-col gap-4 shadow-xl">
          <Link to="#" className="text-gray-300 font-medium hover:text-green-400">Help Center</Link>
          <Link to="#" className="text-gray-300 font-medium hover:text-green-400">Rules Center</Link>
          <Link to="/seller/login" className="text-white font-bold hover:text-green-400">Seller Login</Link>
          <Link to="/" className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg text-center font-bold">Start Shopping</Link>
        </div>
      )}
    </nav>
  );
};

export default SellerHeader;