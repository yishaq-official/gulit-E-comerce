
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '../assets/gulit.png';
import { FaShoppingCart, FaUser } from 'react-icons/fa';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);


  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* 🇪🇹 Top Cultural Ribbon - Made slightly thinner */}
      <div className="h-1.5 bg-tibeb-pattern bg-repeat-x w-full border-b border-black/10 opacity-80"></div>
      
      <div className="container mx-auto py-3 px-6 flex items-center justify-between">
        
        {/* LOGO SECTION - UPDATED */}
        <Link to="/" className="flex items-center gap-3 group">
          {/* 🌟 CHANGE 1: Increased logo height from h-16 to h-24 (BIGGER G) */}
          <img 
            src={logo} 
            alt="Gulit Logo" 
            className="h-24 w-auto transition-transform group-hover:scale-105 drop-shadow-sm" 
          />
          {/* Text stays relatively smaller so the G pops */}
          <div className="flex flex-col justify-center">
            <span className="text-2xl font-black text-green-500 leading-none tracking-tight">GULIT</span>
            <span className="text-[10px] tracking-[0.2em] font-bold text-gray-400 uppercase">Modern Market</span>
          </div>
        </Link>

        {/* Search Bar (Hidden on small screens) */}
        <div className="flex-grow max-w-lg mx-12 hidden md:block">
           <div className="relative">
              <input 
                type="text" 
                placeholder="Search for items..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 focus:border-green-400 focus:bg-white focus:ring-2 focus:ring-green-100 transition-all outline-none text-sm"
              />
           </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6">
           <Link to="/cart" className="text-gray-600 hover:text-green-500 relative transition-colors">
              <FaShoppingCart size={24} />
              {/* Add cart count badge here later */}
           </Link>
           <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-green-500 font-bold transition-colors bg-gray-50 px-4 py-2 rounded-full border border-gray-100 hover:border-green-300">
              <FaUser size={18} />
              <span>Login</span>
           </Link>
        </div>
      </div>
    </header>
  );
};



export default Header;

