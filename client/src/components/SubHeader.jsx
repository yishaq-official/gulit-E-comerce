import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaBars } from 'react-icons/fa';

const SubHeader = () => {
  const categories = ["Electronics", "Clothes", "Home Utility", "Fashion", "Agriculture", "Handicrafts"];
  
  // State to manage dropdown visibility
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200 hidden md:block shadow-sm">
      <div className="container mx-auto max-w-7xl px-4 py-2 flex items-center gap-8">
        
        {/* Dropdown Container */}
        <div className="relative z-50">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Closes automatically when clicking away
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-colors text-white px-5 py-2 rounded-lg font-bold text-sm shadow-md shadow-red-200"
          >
             <FaBars /> Categories 
             <FaChevronDown size={10} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* The Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in-up">
              
              {/* This is the magic "Show All Products" button! */}
              <Link 
                to="/" 
                className="block px-5 py-3 text-sm font-black text-gray-900 hover:bg-red-50 hover:text-red-600 border-b border-gray-100 transition-colors"
              >
                View All Products
              </Link>

              {/* List out the categories in the dropdown too */}
              <div className="py-2">
                {categories.map((cat) => (
                  <Link 
                    key={cat} 
                    to={`/category/${cat.toLowerCase()}`} 
                    className="block px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Horizontal Scroll Categories (Quick Links) */}
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <Link 
              key={cat} 
              to={`/category/${cat.toLowerCase()}`} 
              className="text-sm font-bold text-gray-600 hover:text-red-600 transition-colors whitespace-nowrap"
            >
              {cat}
            </Link>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default SubHeader;