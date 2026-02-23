import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetOrderDetailsQuery, usePayOrderMutation, useDeliverOrderMutation } from '../store/slices/ordersApiSlice';
import { useCreateReviewMutation } from '../store/slices/productsApiSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaCreditCard, FaShoppingBag, FaBoxOpen, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { BASE_URL } from '../store/slices/apiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const formatDate = (value) => (value ? String(value).substring(0, 10) : 'N/A');
  const [reviewInputs, setReviewInputs] = useState({});

  // 1. Fetch Data
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

  // 2. Pay Mutation
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const [createReview, { isLoading: loadingReview }] = useCreateReviewMutation();

  // 3. Fake Payment Handler
  const successPaymentHandler = async () => {
    try {
      // Simulate Chapa response
      await payOrder({ 
        orderId, 
        details: { id: 'FAKE_CHAPA_ID', status: 'COMPLETED', email_address: order.user.email, update_time: Date.now() } 
      });
      refetch(); // Reload page data to show "Paid" status
      toast.success('Payment Successful!');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const markDeliveredHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
      toast.success('Order marked as delivered');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const setReviewField = (productId, field, value) => {
    setReviewInputs((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const submitReviewHandler = async (productId) => {
    const review = reviewInputs[productId] || {};
    if (!review.rating || !review.comment?.trim()) {
      toast.error('Please add both rating and comment');
      return;
    }

    try {
      await createReview({
        productId,
        rating: Number(review.rating),
        comment: review.comment.trim(),
      }).unwrap();
      toast.success('Review submitted');
      setReviewInputs((prev) => ({
        ...prev,
        [productId]: { rating: '', comment: '' },
      }));
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="p-10 text-red-500 font-bold">{error?.data?.message || error.error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          Order ID: <span className="text-gray-500 font-mono text-lg font-normal">#{order._id}</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT COLUMN: DETAILS */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Shipping Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-green-500"/> Shipping
               </h2>
               <p className="text-gray-600 mb-4">
                 <strong className="text-gray-900">Name:</strong> {order.user.name} <br/>
                 <strong className="text-gray-900">Email:</strong> <a href={`mailto:${order.user.email}`} className="underline">{order.user.email}</a> <br/>
                 <strong className="text-gray-900">Phone:</strong> {order.shippingAddress.phoneNumber} <br/>
                 <strong className="text-gray-900">Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}
               </p>
               {order.isDelivered ? (
                 <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl font-bold flex items-center gap-2">
                    <FaCheckCircle /> Delivered on {formatDate(order.deliveredAt)}
                 </div>
               ) : (
                 <div className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-xl font-bold flex items-center gap-2">
                    <FaBoxOpen /> Not Delivered
                 </div>
               )}
            </div>

            {/* Payment Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaCreditCard className="text-green-500"/> Payment Method
               </h2>
               <p className="text-gray-600 mb-4">
                 <strong>Method: </strong> {order.paymentMethod}
               </p>
               {order.isPaid ? (
                 <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl font-bold flex items-center gap-2">
                    <FaCheckCircle /> Paid on {formatDate(order.paidAt)}
                 </div>
               ) : (
                 <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl font-bold flex items-center gap-2">
                    <FaTimesCircle /> Not Paid
                 </div>
               )}
            </div>

            {/* Order Items */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaShoppingBag className="text-green-500"/> Order Items
               </h2>
               <div className="space-y-4">
                 {order.orderItems.map((item, index) => (
                   <div key={index} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0">
                      <div className="flex items-start gap-4 w-full">
                         <img 
                           src={`${BASE_URL}${item.image}`} 
                           alt={item.name} 
                           className="w-16 h-16 object-cover rounded-lg" 
                         />
                         <div className="flex-1">
                           <Link to={`/product/${item.product}`} className="font-bold text-gray-700 hover:text-green-500">
                             {item.name}
                           </Link>
                           <div className="text-sm font-mono text-gray-500 mt-1">
                             {item.qty} x {item.price} = <span className="font-bold text-gray-800">{(item.qty * item.price).toFixed(2)}</span>
                           </div>

                           {order.isDelivered && (
                             <div className="mt-4 bg-gray-50 border border-gray-100 rounded-xl p-4">
                               <p className="text-sm font-bold text-gray-700 mb-3">Rate this product</p>
                               <div className="grid grid-cols-1 gap-3">
                                 <select
                                   value={reviewInputs[item.product]?.rating || ''}
                                   onChange={(e) => setReviewField(item.product, 'rating', e.target.value)}
                                   className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                 >
                                   <option value="">Select rating</option>
                                   <option value="1">1 - Poor</option>
                                   <option value="2">2 - Fair</option>
                                   <option value="3">3 - Good</option>
                                   <option value="4">4 - Very Good</option>
                                   <option value="5">5 - Excellent</option>
                                 </select>
                                 <textarea
                                   rows="3"
                                   value={reviewInputs[item.product]?.comment || ''}
                                   onChange={(e) => setReviewField(item.product, 'comment', e.target.value)}
                                   placeholder="Write your comment"
                                   className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
                                 />
                                 <button
                                   type="button"
                                   onClick={() => submitReviewHandler(item.product)}
                                   disabled={loadingReview}
                                   className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black disabled:bg-gray-400"
                                 >
                                   Submit Review
                                 </button>
                               </div>
                             </div>
                           )}
                         </div>
                      </div>
                    </div>
                 ))}
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SUMMARY & PAY ACTION */}
          <div className="md:col-span-1">
             <div className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-200 border border-gray-100 sticky top-24">
                <h2 className="text-2xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
                
                <div className="space-y-3 text-sm">
                   <div className="flex justify-between">
                      <span className="text-gray-600">Items</span>
                      <span className="font-bold">{order.itemsPrice} ETB</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-bold">{order.shippingPrice} ETB</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-bold">{order.taxPrice} ETB</span>
                   </div>
                   <div className="border-t border-gray-100 pt-3 flex justify-between text-lg">
                      <span className="font-bold text-gray-800">Total</span>
                      <span className="font-black text-green-600">{order.totalPrice} ETB</span>
                   </div>
                </div>

                {/* PAY BUTTON (Only if not paid) */}
                {!order.isPaid && (
                  <div className="mt-8">
                     {loadingPay && <Loader />}
                     <button 
                       onClick={successPaymentHandler}
                       className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-green-200 transition-all active:scale-95"
                     >
                       PAY NOW (Simulate Chapa)
                     </button>
                     <p className="text-center text-xs text-gray-400 mt-3">
                        * This is a simulation. No real money is deducted.
                     </p>
                  </div>
                )}
                {order.isPaid && !order.isDelivered && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={markDeliveredHandler}
                      disabled={loadingDeliver}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-black text-base shadow-lg shadow-blue-200 transition-all disabled:bg-blue-300"
                    >
                      {loadingDeliver ? 'Updating...' : 'Mark As Delivered'}
                    </button>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;
