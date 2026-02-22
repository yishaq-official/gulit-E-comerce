import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '../assets/gulit.png';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import AccountMenu from './AccountMenu'; // 👈 Import the new component
import SearchBox from './SearchBox';
import SubHeader from './SubHeader';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth); // Get login state

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* 🇪🇹 Top Cultural Ribbon */}
      <div className="h-1.5 bg-tibeb-pattern bg-repeat-x w-full border-b border-black/10 opacity-80"></div>
      
      <div className="container mx-auto py-3 px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src={logo} 
            alt="Gulit Logo" 
            className="h-24 w-auto transition-transform group-hover:scale-105 drop-shadow-sm" 
          />
          <div className="flex flex-col justify-center">
            <span className="text-2xl font-black text-green-500 leading-none tracking-tight">GULIT</span>
            <span className="text-[10px] tracking-[0.2em] font-bold text-gray-400 uppercase">Modern Market</span>
          </div>
        </Link>

        {/* SEARCH BAR (Middle) */}
        <div className="flex-grow max-w-lg mx-12 hidden md:block">
           <SearchBox /> 
        </div>

        {/* ICONS (Right) */}
        <div className="flex items-center gap-6">
           <Link to="/cart" className="text-gray-600 hover:text-green-500 relative transition-colors">
              <FaShoppingCart size={24} />
              {cartItems.length > 0 && (
                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                 </span>
              )}
           </Link>
           
           {/* 👇 THE LOGIC SWITCH */}
           {userInfo ? (
             <AccountMenu /> // Show Dropdown if logged in
           ) : (
             <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-green-500 font-bold transition-colors bg-gray-50 px-4 py-2 rounded-full border border-gray-100 hover:border-green-300">
                <FaUser size={18} />
                <span>Login</span>
             </Link>
           )}
        </div>
      </div>
      <SubHeader />
    </header>
  );
};

export default Header;