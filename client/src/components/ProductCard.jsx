import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaEye } from 'react-icons/fa'; // 👈 Added FaEye here!
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
    if (product.countInStock > 0) {
      dispatch(addToCart({ ...product, qty: 1 }));
      toast.success(`${product.name} added to cart!`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 group flex flex-col h-full relative">
      
      {/* 🖼️ Image Container with Hover Overlay */}
      {/* 'group/image' allows us to trigger the hover effect only when hovering the image area */}
      <div className="relative overflow-hidden aspect-square bg-gray-50 group/image">
        <img 
          src={`${BASE_URL}${product.image}`} 
          alt={product.name} 
          className="w-full h-full object-contain mix-blend-multiply p-4 group-hover/image:scale-105 transition-transform duration-500"
        />
        
        {/* Floating Discount Badge */}
        {discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-black px-2 py-1 rounded-lg shadow-sm z-10">
              -{discountPercentage}%
            </div>
        )}

        {/* 👁️ Hover Overlay & See Preview Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
          <Link 
            to={`/product/${product._id}`} 
            className="bg-white/95 backdrop-blur-sm text-gray-900 px-5 py-2.5 rounded-full font-bold text-sm transform translate-y-4 group-hover/image:translate-y-0 transition-all duration-300 shadow-xl flex items-center gap-2 hover:bg-red-500 hover:text-white"
          >
            <FaEye /> See Preview
          </Link>
        </div>

        {/* Out of Stock Overlay (Overrides hover if empty) */}
        {product.countInStock === 0 && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-30">
             <span className="bg-gray-900 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
               Sold Out
             </span>
          </div>
        )}
      </div>

      {/* 📝 Product Details Block */}
      <div className="p-5 flex flex-col flex-grow bg-white z-10">
        
        {/* Descriptive Title (Restricts to 2 lines) */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-red-500 transition-colors leading-snug mb-3 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-2 border-t border-gray-50">
          
          {/* Current Price */}
          <div className="flex items-end gap-2 mb-1">
            <span className="text-xl font-black text-red-600 tracking-tight">
              <span className="text-xs font-bold mr-0.5">ETB</span>
              {product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Original Price & Add to Cart Container */}
          <div className="flex items-center justify-between">
            <div className="h-4"> {/* Fixed height prevents the layout from jumping if there is no discount */}
              {discountPercentage > 0 ? (
                <span className="text-[11px] text-gray-400 line-through font-medium">
                  ETB {product.originalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              ) : null}
            </div>

            {/* Quick Add to Cart Button */}
            <button 
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              title="Add to Cart"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${
                product.countInStock === 0 
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                  : 'bg-red-50 text-red-500 hover:bg-red-600 hover:text-white hover:shadow-red-200 hover:shadow-md'
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