
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '../assets/gulit.png';
import { FaShoppingCart, FaUser } from 'react-icons/fa';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <header className="bg-white shadow-sm py-3 px-6 flex items-center justify-between">
      {/* 1. LOGO SECTION */}
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="Gulit Logo" className="h-12 w-auto" />
        <span className="text-2xl font-black text-gulit-green hidden md:block">GULIT</span>
      </Link>

      {/* 2. SEARCH BAR */}
      <div className="flex-grow max-w-md mx-8 hidden sm:block">
        <input 
          type="text" 
          placeholder="Search for items, sellers..." 
          className="w-full border-2 border-gray-100 rounded-full px-4 py-1.5 focus:border-gulit-green outline-none"
        />
      </div>

      {/* 3. NAV ICONS */}
      <div className="flex items-center gap-6 text-gray-600">
        <Link to="/cart" className="relative hover:text-gulit-green">
          <FaShoppingCart size={22} />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-gulit-red text-white text-xs rounded-full px-1.5 py-0.5">
              {cartItems.length}
            </span>
          )}
        </Link>

        {userInfo ? (
          <Link to="/profile" className="flex items-center gap-1 hover:text-gulit-green font-medium">
            <FaUser size={20} />
            <span>{userInfo.name}</span>
          </Link>
        ) : (
          <Link to="/login" className="hover:text-gulit-green font-medium">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header;

