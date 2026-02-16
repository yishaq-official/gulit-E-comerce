
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '../assets/gulit.png';
import { FaShoppingCart, FaUser } from 'react-icons/fa';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);


  return (
    <header className="bg-white sticky top-0 z-50 shadow-md">
      {/* 🇪🇹 Top Cultural Ribbon */}
      <div className="h-2 bg-tibeb-pattern bg-repeat-x w-full border-b border-black/10"></div>
      
      <div className="container mx-auto py-4 px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          {/* Logo size increased to h-16 (64px) */}
          <img src={logo} alt="Gulit" className="h-16 w-auto transition-transform group-hover:scale-110" />
          <div className="flex flex-col">
            <span className="text-3xl font-black text-green-500 leading-none">GULIT</span>
            <span className="text-[10px] tracking-[0.2em] font-bold text-gray-400 uppercase">Modern Market</span>
          </div>
        </Link>

        {/* Search Bar with Green Focus */}
        <div className="flex-grow max-w-xl mx-12 hidden md:block">
           <div className="relative">
              <input 
                type="text" 
                placeholder="Find fresh products..." 
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-3 focus:border-green-400 focus:bg-white transition-all outline-none"
              />
           </div>
        </div>

        <div className="flex items-center gap-8">
           <Link to="/cart" className="text-gray-700 hover:text-green-500 relative">
              <FaShoppingCart size={26} />
              <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">3</span>
           </Link>
           <Link to="/login" className="bg-green-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-600 shadow-lg shadow-green-200 transition-all">
              Login
           </Link>
        </div>
      </div>
    </header>
  );
};



export default Header;

