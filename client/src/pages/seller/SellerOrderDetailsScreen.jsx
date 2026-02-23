import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaUser, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import { useGetSellerOrderDetailsQuery, useDeliverSellerOrderMutation } from '../../store/slices/sellerProductsApiSlice';
import Loader from '../../components/Loader';
import { BASE_URL } from '../../store/slices/apiSlice';

const SellerOrderDetailsScreen = () => {
  const { id: orderId } = useParams();

  const { data: order, isLoading, error, refetch } = useGetSellerOrderDetailsQuery(orderId);
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverSellerOrderMutation();
  const formatDate = (value) => (value ? String(value).substring(0, 10) : 'N/A');

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch(); // Refresh the page data
      toast.success('Order marked as delivered!');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-500 text-center font-bold p-10">{error?.data?.message || error.error}</div>;
  if (!order) return <div className="text-gray-400 text-center font-bold p-10">Order data is unavailable.</div>;

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in-up pb-20">
      
      <Link to="/seller/orders" className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-400 font-bold mb-6 transition-colors">
        <FaArrowLeft /> Back to Orders
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
           <FaBox className="text-blue-500" /> Order Details
        </h1>
        <div className="text-gray-400 font-medium">Order ID: <span className="text-white font-bold">{order._id}</span></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Customer, Shipping, Items */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Customer & Shipping Info */}
          <div className="bg-[#1e293b] p-8 rounded-3xl border border-gray-700 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-gray-700 pb-2">
                <FaUser className="text-blue-500" /> Customer Info
              </h2>
              <p className="text-gray-300 font-medium">{order.user?.name}</p>
              <p className="text-gray-400 text-sm mt-1">
                <a href={`mailto:${order.user?.email}`} className="hover:text-blue-400">{order.user?.email}</a>
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-gray-700 pb-2">
                <FaMapMarkerAlt className="text-green-500" /> Shipping Address
              </h2>
              <p className="text-gray-300 font-medium">{order.shippingAddress?.address || 'N/A'}</p>
              <p className="text-gray-400 text-sm mt-1">
                {order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.postalCode || 'N/A'}, {order.shippingAddress?.country || 'N/A'}
              </p>
            </div>
          </div>

          {/* Status Banners */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl border ${order.isPaid ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
               <h3 className="font-bold flex items-center gap-2 mb-1">
                 {order.isPaid ? <FaCheckCircle /> : <FaTimesCircle />} Payment Status
               </h3>
               <p className="text-sm font-medium">{order.isPaid ? `Paid on ${formatDate(order.paidAt)}` : 'Not Paid'}</p>
            </div>
            <div className={`p-4 rounded-2xl border ${order.isDelivered ? 'bg-blue-500/10 border-blue-500/30 text-blue-500' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'}`}>
               <h3 className="font-bold flex items-center gap-2 mb-1">
                 {order.isDelivered ? <FaCheckCircle /> : <FaTimesCircle />} Delivery Status
               </h3>
               <p className="text-sm font-medium">{order.isDelivered ? `Delivered on ${formatDate(order.deliveredAt)}` : 'Pending Delivery'}</p>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="bg-[#1e293b] p-8 rounded-3xl border border-gray-700 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Ordered Items</h2>
            <div className="space-y-4">
              {(order.orderItems || []).map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-[#0f172a] p-4 rounded-2xl border border-gray-700/50">
                  <img src={`${BASE_URL}${item.image}`} alt={item.name} className="w-16 h-16 object-contain mix-blend-multiply bg-gray-50 rounded-xl" />
                  <div className="flex-grow">
                    <Link to={`/product/${item.product}`} className="text-white font-bold hover:text-blue-400 transition-colors line-clamp-1">
                      {item.name}
                    </Link>
                    <div className="text-sm text-gray-400 mt-1">
                      {item.qty} x {Number(item.price || 0).toLocaleString()} ETB
                    </div>
                  </div>
                  <div className="text-lg font-black text-green-400 whitespace-nowrap">
                    {Number((item.qty || 0) * (item.price || 0)).toLocaleString()} ETB
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Summary & Actions */}
        <div className="lg:col-span-1">
          <div className="bg-[#1e293b] p-6 rounded-3xl border border-gray-700 shadow-xl sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Order Summary</h2>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between items-center text-gray-400">
                <span>Items Total:</span>
                <span className="text-white font-medium">{Number(order.itemsPrice || 0).toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>Shipping:</span>
                <span className="text-white font-medium">{Number(order.shippingPrice || 0).toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>Tax:</span>
                <span className="text-white font-medium">{Number(order.taxPrice || 0).toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                <span className="text-lg font-bold text-white">Grand Total:</span>
                <span className="text-2xl font-black text-green-400">{Number(order.totalPrice || 0).toLocaleString()} ETB</span>
              </div>
            </div>

            {/* ONLY show the deliver button if the order is paid AND not yet delivered */}
            {!order.isDelivered && (
              <button
                type="button"
                className={`w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 ${
                  order.isPaid 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-95' 
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
                onClick={deliverHandler}
                disabled={!order.isPaid || loadingDeliver}
                title={!order.isPaid ? 'Customer must pay before delivery' : 'Mark as Delivered'}
              >
                {loadingDeliver ? <FaSpinner className="animate-spin" /> : <><FaTruck /> Mark As Delivered</>}
              </button>
            )}
            
            {!order.isPaid && !order.isDelivered && (
               <p className="text-xs text-red-400 text-center mt-3">
                 Waiting for customer payment before shipping is allowed.
               </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SellerOrderDetailsScreen;
