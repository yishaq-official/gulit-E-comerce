import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import { BASE_URL } from '../store/slices/apiSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const addToCartHandler = (e) => {
    e.preventDefault(); 
    if (product.countInStock > 0) {
      dispatch(addToCart({ ...product, qty: 1 }));
      toast.success(`${product.name} added to cart!`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col h-full group">
      
      {/* 🖼️ Image Section */}
      <Link to={`/product/${product._id}`} className="relative block aspect-square bg-gray-50 overflow-hidden">
        <img 
          src={`${BASE_URL}${product.image}`} 
          alt={product.name} 
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
        />
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-[#ff0036] text-white text-xs font-bold px-2 py-0.5 rounded-md">
            -{discountPercentage}%
          </div>
        )}

        {/* Out of Stock Badge */}
        {product.countInStock === 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
             <span className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
               Sold Out
             </span>
          </div>
        )}
      </Link>

      {/* 📝 Details Section */}
      <div className="p-3.5 flex flex-col flex-grow bg-white">
        
        {/* Title (Readable text-sm) */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-[#ff0036] transition-colors leading-snug mb-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Rating Section */}
        <div className="flex items-center gap-1 mb-3">
          <FaStar className="text-yellow-400 text-xs" />
          <span className="text-xs font-bold text-gray-700">
            {product.rating ? product.rating.toFixed(1) : '0.0'}
          </span>
          <span className="text-xs text-gray-400">({product.numReviews})</span>
        </div>

        {/* Price & Action Row */}
        <div className="mt-auto flex items-end justify-between">
          
          {/* Price Block */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-bold text-[#ff0036]">ETB</span>
              <span className="text-xl font-black text-[#ff0036] leading-none">
                {product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            
            {/* Original Price (Maintains spacing even if no discount) */}
            <div className="h-4 mt-0.5">
              {discountPercentage > 0 && (
                <span className="text-xs text-gray-400 line-through">
                  ETB {product.originalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              )}
            </div>
          </div>

          {/* Clean Cart Button */}
          <button 
            onClick={addToCartHandler}
            disabled={product.countInStock === 0}
            title="Add to Cart"
            className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              product.countInStock === 0 
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                : 'bg-red-50 text-[#ff0036] hover:bg-[#ff0036] hover:text-white'
            }`}
          >
            <FaShoppingCart size={14} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default ProductCard;