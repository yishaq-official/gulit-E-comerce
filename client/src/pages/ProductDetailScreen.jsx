import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductDetailsQuery } from '../store/slices/productsApiSlice';
import { addToCart } from '../store/slices/cartSlice';
import { FaChevronLeft, FaShoppingCart, FaTruck, FaShieldAlt } from 'react-icons/fa';
import Loader from '../components/Loader';
import { BASE_URL } from '../store/slices/apiSlice';

const ProductDetailScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-500 font-bold p-10">{error?.data?.message || error.error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 🔙 Back Button */}
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-500 font-bold mb-8 transition-colors">
        <FaChevronLeft size={14} /> Back to Market
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* 🖼️ Product Image with Tibeb Accent */}
        <div className="relative group">
          <div className="absolute inset-0 bg-tibeb-pattern opacity-10 rounded-[2.5rem] -rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
          <div className="relative bg-white p-4 rounded-[2.5rem] shadow-2xl border border-gray-100">
            <img 
              src={`${BASE_URL}${product.image}`} 
              alt={product.name} 
              className="w-full h-[500px] object-cover rounded-[2rem]"
            />
          </div>
        </div>

        {/* 📝 Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="text-green-500 font-black text-sm uppercase tracking-widest">{product.category}</span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mt-2">{product.name}</h1>
            <p className="text-gray-400 mt-2 text-sm">Brand: <span className="text-gray-600 font-bold">{product.brand}</span></p>
          </div>

          <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100 mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 font-bold">Price per unit</span>
              <span className="text-3xl font-black text-gray-900">{product.price} <span className="text-sm">ETB</span></span>
            </div>
            <p className="text-xs text-green-600 font-bold uppercase tracking-tighter">* All taxes and platform fees included</p>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8 text-lg">
            {product.description}
          </p>

          {/* 🛒 Add to Cart Logic */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-700">Stock Status:</span>
              <span className={`font-black uppercase text-sm ${product.countInStock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {product.countInStock > 0 && (
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-700">Quantity:</span>
                <select 
                  value={qty} 
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:border-green-400 outline-none font-bold"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                  ))}
                </select>
              </div>
            )}

            <button 
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-green-100 transition-all active:scale-95"
            >
              <FaShoppingCart /> Add to Cart
            </button>
          </div>

          {/* 🚚 Trust & Shipping badges */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <FaTruck className="text-green-500" />
              <div className="leading-none">
                <p className="text-xs font-black text-gray-800 uppercase">Fast Delivery</p>
                <p className="text-[10px] text-gray-400">Addis Ababa & Regions</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <FaShieldAlt className="text-green-500" />
              <div className="leading-none">
                <p className="text-xs font-black text-gray-800 uppercase">Secure Gulit</p>
                <p className="text-[10px] text-gray-400">Verified Sellers Only</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailScreen;