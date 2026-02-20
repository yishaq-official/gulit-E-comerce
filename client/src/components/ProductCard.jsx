import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import { FaShoppingCart } from 'react-icons/fa';
import { BASE_URL } from '../store/slices/apiSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  // 1. Calculate Discount Percentage dynamically
  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // 2. Handle Add to Cart directly from the card
  const addToCartHandler = (e) => {
    e.preventDefault(); // Prevents the Link from clicking through to the detail page
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full relative">
      
      {/* Product Image Link */}
      <Link to={`/product/${product._id}`} className="relative block overflow-hidden aspect-square bg-gray-50">
        <img 
          src={`${BASE_URL}${product.image}`} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Out of Stock Overlay */}
        {product.countInStock === 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
             <span className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
               Sold Out
             </span>
          </div>
        )}
      </Link>

      {/* Product Details Block */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* Descriptive Title (Restricts to 2 lines like AliExpress) */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-green-600 transition-colors leading-tight mb-3 h-10">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto">
          {/* Current Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-gray-900">ETB</span>
            <span className="text-xl font-black text-gray-900 tracking-tight">
              {product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Original Price & Discount Badge */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2">
              {discountPercentage > 0 && (
                <>
                  <span className="text-xs text-gray-400 line-through font-medium">
                    ETB {product.originalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                    -{discountPercentage}%
                  </span>
                </>
              )}
            </div>

            {/* Quick Add to Cart Button */}
            <button 
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                product.countInStock === 0 
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                  : 'bg-green-50 text-green-600 hover:bg-green-500 hover:text-white'
              }`}
            >
              <FaShoppingCart size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;