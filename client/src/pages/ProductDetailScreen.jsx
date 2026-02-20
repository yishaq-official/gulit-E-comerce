import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../store/slices/productsApiSlice';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { 
  FaStar, 
  FaShoppingCart, 
  FaArrowLeft, 
  FaCheckCircle, 
  FaUserCircle, 
  FaInfoCircle, 
  FaTimes 
} from 'react-icons/fa'; // 👈 Added FaInfoCircle and FaTimes
import { BASE_URL } from '../store/slices/apiSlice';

const ProductDetailScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(''); 
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // 👇 Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success('Review Submitted!');
      setRating(0);
      setComment('');
    } catch (err) {
      const errorMessage = err?.data?.message || err.error;
      
      // 👇 Catch specific eligibility errors and show the beautiful popup instead of a toast
      if (errorMessage.includes('delivered') || errorMessage.includes('already reviewed')) {
        setModalMessage(errorMessage);
        setShowModal(true);
      } else {
        toast.error(errorMessage); // For other random server errors
      }
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-500 font-bold p-10">{error?.data?.message || error.error}</div>;

  const allImages = [product.image, ...(product.images || [])];
  const currentDisplayImage = activeImage || product.image;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-500 font-bold mb-8 transition-colors">
          <FaArrowLeft size={12} /> Back to Market
        </Link>

        {/* TOP SECTION: Product Info & Slider */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            
            {/* LEFT: Image Slider */}
            <div className="p-8 bg-gray-50 flex flex-col items-center border-r border-gray-100">
              <div className="w-full aspect-square bg-white rounded-2xl border border-gray-200 overflow-hidden mb-4 shadow-sm">
                 <img 
                   src={`${BASE_URL}${currentDisplayImage}`} 
                   alt={product.name} 
                   className="w-full h-full object-contain p-4"
                 />
              </div>
              
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 w-full justify-center">
                  {allImages.map((img, index) => (
                    <button 
                      key={index} 
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all ${currentDisplayImage === img ? 'border-green-500 shadow-md scale-105' : 'border-transparent hover:border-green-200'}`}
                    >
                       <img src={`${BASE_URL}${img}`} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Details & Actions */}
            <div className="p-8 md:p-12 flex flex-col">
              <span className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2">{product.brand}</span>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mb-6">
                 <div className="flex text-yellow-400 text-sm">
                   {[...Array(5)].map((_, i) => (
                     <FaStar key={i} className={i < product.rating ? 'text-yellow-400' : 'text-gray-200'} />
                   ))}
                 </div>
                 <span className="text-sm font-bold text-gray-500">
                   {product.rating.toFixed(1)} ({product.numReviews} Reviews)
                 </span>
              </div>

              <div className="text-3xl font-black text-gray-900 mb-6">
                {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })} ETB
              </div>

              <p className="text-gray-600 leading-relaxed mb-8 flex-grow">
                {product.description}
              </p>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mt-auto">
                 <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-gray-700">Status:</span>
                    {product.countInStock > 0 ? (
                      <span className="text-green-600 font-bold flex items-center gap-1"><FaCheckCircle/> In Stock</span>
                    ) : (
                      <span className="text-red-500 font-bold">Out of Stock</span>
                    )}
                 </div>

                 {product.countInStock > 0 && (
                   <div className="flex items-center gap-4 mb-6">
                      <span className="font-bold text-gray-700">Qty:</span>
                      <select 
                        value={qty} 
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 font-bold focus:outline-none focus:border-green-500"
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
                   className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-black text-lg transition-all shadow-lg shadow-green-200 disabled:bg-gray-300 disabled:shadow-none flex items-center justify-center gap-2"
                 >
                   <FaShoppingCart /> {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                 </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">Customer Reviews</h2>
            
            {product.reviews.length === 0 && <p className="text-gray-500 bg-gray-50 p-4 rounded-xl">No reviews yet. Be the first!</p>}
            
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-50 pb-6 last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <FaUserCircle className="text-gray-300 text-3xl" />
                    <div>
                      <strong className="block text-sm text-gray-800">{review.name}</strong>
                      <div className="flex text-yellow-400 text-[10px] mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-200'} />
                        ))}
                      </div>
                    </div>
                    <span className="ml-auto text-xs text-gray-400">{review.createdAt.substring(0, 10)}</span>
                  </div>
                  <p className="text-gray-600 text-sm pl-11">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 h-fit">
            <h2 className="text-2xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">Write a Review</h2>
            
            {userInfo ? (
              <form onSubmit={submitReviewHandler} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Rating</label>
                  <select 
                    value={rating} 
                    onChange={(e) => setRating(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-green-500"
                  >
                    <option value="">Select...</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Comment</label>
                  <textarea 
                    row="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-green-500 resize-none h-32"
                    placeholder="What did you think about the product?"
                  ></textarea>
                </div>
                <button 
                  disabled={loadingProductReview}
                  type="submit" 
                  className="w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-bold transition-all disabled:bg-gray-400"
                >
                  {loadingProductReview ? <Loader /> : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="bg-blue-50 text-blue-700 p-6 rounded-2xl text-center">
                <p className="mb-3 font-medium">Please sign in to write a review</p>
                <Link to="/login" className="inline-block bg-white text-blue-600 font-bold px-6 py-2 rounded-lg shadow-sm">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 👇 BEAUTIFUL POPUP MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm relative z-10 transform transition-all scale-100 p-8 text-center animate-fade-in-up">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FaTimes />
            </button>
            
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaInfoCircle className="text-4xl text-blue-500" />
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 mb-3">Notice</h3>
            <p className="text-gray-600 font-medium leading-relaxed mb-8">
              {modalMessage}
            </p>
            
            <button 
              onClick={() => setShowModal(false)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-200"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailScreen;