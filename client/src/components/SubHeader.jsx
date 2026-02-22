import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';

const SubHeader = () => {
  const categories = ["Electronics", "Clothes", "Home Utility", "Fashion", "Agriculture", "Handicrafts"];

  return (
    // Note: 'hidden md:block' means it will hide on mobile so it doesn't clutter small screens.
    <div className="bg-white border-b border-gray-200 hidden md:block shadow-sm">
      <div className="container mx-auto max-w-7xl px-4 py-2 flex items-center gap-8">
        
        {/* Dropdown for All Categories */}
        <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-colors text-white px-5 py-2 rounded-lg font-bold text-sm shadow-md shadow-red-200">
           All Categories <FaChevronDown size={10} />
        </button>

        {/* Horizontal Scroll Categories */}
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