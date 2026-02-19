import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';
import { BASE_URL } from '../store/slices/apiSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get cart items from Redux state
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // Change quantity of an item already in the cart
  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  // Remove an item entirely
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  // Proceed to Checkout
  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
          <FaShoppingBag className="text-green-500" /> Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* 👈 LEFT: CART ITEMS (Col Span 8) */}
          <div className="lg:col-span-8">
            {cartItems.length === 0 ? (
              <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                   <FaShoppingBag className="text-gray-300 text-4xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Link 
                  to="/" 
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-green-200"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8 space-y-6">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex flex-col md:flex-row items-center justify-between border-b border-gray-50 pb-6 last:border-0 last:pb-0 gap-6">
                      
                      {/* Product Info */}
                      <div className="flex items-center gap-6 w-full md:w-auto">
                        <img 
                          src={`${BASE_URL}${item.image}`} 
                          alt={item.name} 
                          className="w-24 h-24 object-cover rounded-2xl bg-gray-50 border border-gray-100"
                        />
                        <div>
                          <Link to={`/product/${item._id}`} className="text-lg font-bold text-gray-800 hover:text-green-500 transition-colors block mb-1">
                            {item.name}
                          </Link>
                          <div className="text-sm text-gray-400 font-medium">Unit Price: <span className="text-gray-600 font-bold">{item.price} ETB</span></div>
                        </div>
                      </div>

                      {/* Controls (Qty & Delete) */}
                      <div className="flex items-center justify-between w-full md:w-auto gap-8">
                        <select 
                          value={item.qty} 
                          onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-bold text-gray-700 focus:outline-none focus:border-green-500"
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                        
                        <div className="text-lg font-black text-gray-900 w-24 text-right">
                          {(item.price * item.qty).toFixed(2)} ETB
                        </div>

                        <button 
                          onClick={() => removeFromCartHandler(item._id)}
                          className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-500 font-bold transition-colors mt-6 ml-2">
              <FaArrowLeft size={12} /> Continue Shopping
            </Link>
          </div>

          {/* 👉 RIGHT: CART SUMMARY (Col Span 4) */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100 sticky top-24">
              <h2 className="text-2xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
              
              <div className="space-y-4 text-sm mb-6">
                 <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                    <span className="text-2xl font-black text-gray-900">
                      {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)} ETB
                    </span>
                 </div>
                 <p className="text-xs text-gray-400">Taxes and shipping calculated at checkout.</p>
              </div>

              <button 
                type="button" 
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
                className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-black text-lg transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartScreen;