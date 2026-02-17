import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductDetailsQuery } from '../store/slices/productsApiSlice';
import { addToCart } from '../store/slices/cartSlice';
import { FaChevronLeft, FaShoppingCart, FaBolt, FaTruck, FaBoxOpen, FaInfoCircle } from 'react-icons/fa';
import Loader from '../components/Loader';
import Rating from '../components/Rating';
import { BASE_URL } from '../store/slices/apiSlice';

const ProductDetailScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('desc'); // Tabs: 'desc' or 'reviews'

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);
  const { userInfo } = useSelector((state) => state.auth);

  // 🛒 Standard Add to Cart
  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    // Optional: Show success toast here
  };

  // ⚡ Order Now (Skips Cart, goes to Login/Shipping)
  const orderNowHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    // If logged in, go to shipping. If not, go to login then shipping.
    navigate('/login?redirect=/shipping');
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="p-10 text-red-500 font-bold">{error?.data?.message || error.error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Breadcrumb / Back */}
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-500 font-bold transition-colors mb-4">
          <FaChevronLeft size={12} /> Back to Market
        </Link>
      </div>

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* 🖼️ LEFT: IMAGE GALLERY (Col Span 5) */}
        <div className="lg:col-span-5">
          <div className="bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100 relative group overflow-hidden">
             {/* Tibeb Accent Overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-tibeb-pattern opacity-20 rounded-bl-full z-10 pointer-events-none"></div>
            
            <img 
              src={`${BASE_URL}${product.image}`} 
              alt={product.name} 
              className="w-full h-[400px] md:h-[500px] object-cover rounded-[1.8rem] group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* 📝 MIDDLE: PRODUCT INFO (Col Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                 {product.category}
               </span>
               {product.countInStock > 0 ? (
                 <span className="text-green-600 text-xs font-bold flex items-center gap-1"><FaBoxOpen/> In Stock</span>
               ) : (
                 <span className="text-red-500 text-xs font-bold">Out of Stock</span>
               )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-2">
              {product.name}
            </h1>
            
            {/* Rating Component */}
            <div className="flex items-center gap-4 mb-4">
               <Rating value={product.rating} text={`${product.numReviews} reviews`} />
               <span className="text-gray-300">|</span>
               <span className="text-sm text-gray-500">Sold by <strong className="text-green-600 underline">Gulit Official</strong></span>
            </div>

            <div className="flex items-baseline gap-3">
               <span className="text-4xl font-black text-gray-900">{product.price} <span className="text-lg">ETB</span></span>
               {/* Mock "Old Price" for psychological effect */}
               <span className="text-lg text-gray-400 line-through font-bold">{Math.round(product.price * 1.15)} ETB</span>
            </div>
          </div>

          <div className="border-t border-b border-gray-200 py-6">
            <p className="text-gray-600 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          {/* 🚚 DELIVERY & POSTAL INFO */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-4 items-start">
             <div className="bg-white p-2 rounded-full text-blue-500 shadow-sm"><FaTruck /></div>
             <div>
                <h4 className="font-bold text-gray-800 text-sm">Postal Delivery (EMS)</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                   Delivered via <strong>Ethiopian Postal Service</strong> to your nearest post office. 
                   Tracking number provided upon dispatch. Estimated time: <strong>3-5 Days</strong>.
                </p>
             </div>
          </div>
        </div>

        {/* 🛒 RIGHT: ACTION CARD (Col Span 3) */}
        <div className="lg:col-span-3">
           <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                 <span className="font-bold text-gray-600">Total Price:</span>
                 <span className="text-2xl font-black text-gray-900">{(product.price * qty).toFixed(2)}</span>
              </div>

              {product.countInStock > 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Quantity</label>
                  <select 
                    value={qty} 
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-700 focus:outline-none focus:border-green-500"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-3">
                 {/* ⚡ ORDER NOW BUTTON */}
                 <button 
                   onClick={orderNowHandler}
                   disabled={product.countInStock === 0}
                   className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all active:scale-95 disabled:bg-gray-300"
                 >
                    <FaBolt /> ORDER NOW
                 </button>

                 {/* 🛒 ADD TO CART BUTTON */}
                 <button 
                   onClick={addToCartHandler}
                   disabled={product.countInStock === 0}
                   className="w-full bg-white border-2 border-green-100 hover:border-green-500 text-green-600 hover:bg-green-50 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200"
                 >
                    <FaShoppingCart /> Add to Cart
                 </button>
              </div>

              <div className="mt-6 text-center">
                 <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                    <FaInfoCircle /> Secure transaction via Chapa
                 </p>
              </div>
           </div>
        </div>

      </div>

      {/* ⭐ REVIEWS SECTION */}
      <div className="container mx-auto px-4 mt-20">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
           <div className="flex items-center gap-8 border-b border-gray-100 pb-4 mb-8">
              <button 
                className={`text-lg font-black pb-4 border-b-4 transition-all ${activeTab === 'reviews' ? 'border-green-500 text-green-500' : 'border-transparent text-gray-400'}`}
                onClick={() => setActiveTab('reviews')}
              >
                Customer Reviews ({product.numReviews})
              </button>
              <button 
                className={`text-lg font-black pb-4 border-b-4 transition-all ${activeTab === 'desc' ? 'border-green-500 text-green-500' : 'border-transparent text-gray-400'}`}
                onClick={() => setActiveTab('desc')}
              >
                Specifications
              </button>
           </div>

           {activeTab === 'reviews' && (
             <div className="grid md:grid-cols-2 gap-12">
                {/* LIST OF REVIEWS */}
                <div className="space-y-6">
                   {product.reviews.length === 0 && <div className="bg-blue-50 text-blue-600 p-4 rounded-xl text-sm font-bold">No reviews yet. Be the first to rate!</div>}
                   {product.reviews.map((review) => (
                     <div key={review._id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                           <strong className="text-gray-800">{review.name}</strong>
                           <Rating value={review.rating} />
                        </div>
                        <p className="text-gray-500 text-sm mb-2">{review.createdAt.substring(0, 10)}</p>
                        <p className="text-gray-600 italic">"{review.comment}"</p>
                     </div>
                   ))}
                </div>

                {/* WRITE A REVIEW FORM */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 h-fit">
                   <h3 className="font-bold text-gray-800 mb-4">Write a Customer Review</h3>
                   {userInfo ? (
                     <form>
                        <div className="mb-4">
                           <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Rating</label>
                           <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-green-500">
                              <option value="">Select...</option>
                              <option value="5">5 - Excellent</option>
                              <option value="4">4 - Very Good</option>
                              <option value="3">3 - Good</option>
                              <option value="2">2 - Fair</option>
                              <option value="1">1 - Poor</option>
                           </select>
                        </div>
                        <div className="mb-4">
                           <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Comment</label>
                           <textarea className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 h-24"></textarea>
                        </div>
                        <button className="bg-gray-800 text-white px-6 py-2 rounded-xl font-bold text-sm w-full hover:bg-black transition-colors">
                           Submit Review
                        </button>
                     </form>
                   ) : (
                     <div className="bg-yellow-50 text-yellow-700 p-4 rounded-xl text-sm font-bold">
                        Please <Link to="/login" className="underline text-black">sign in</Link> to write a review.
                     </div>
                   )}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailScreen;