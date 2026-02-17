import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaStar } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  return (
    <div className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Image Area */}
      <Link to={`/product/${product._id}`} className="relative h-64 overflow-hidden block">
        {/* Subtle Pattern Overlay on image */}
        <div className="absolute inset-0 bg-tibeb-pattern opacity-5 group-hover:opacity-10 transition-opacity z-10"></div>
        
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Category Tag */}
        <span className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
          {product.category}
        </span>
      </Link>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-grow">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-gray-800 font-bold text-lg mb-1 group-hover:text-green-500 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 text-yellow-400 mb-3">
          <FaStar size={12} />
          <span className="text-xs text-gray-400 font-bold">{product.rating} ({product.numReviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Price</span>
            <span className="text-2xl font-black text-gray-900 leading-none">
              {product.price} <span className="text-sm font-medium">ETB</span>
            </span>
          </div>
          
          <button className="bg-gray-50 text-gray-800 p-3.5 rounded-2xl hover:bg-green-500 hover:text-white hover:shadow-lg hover:shadow-green-200 transition-all duration-300">
            <FaShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;