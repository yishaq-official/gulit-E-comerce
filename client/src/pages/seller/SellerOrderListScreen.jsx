import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaCheck, FaEye, FaBox } from 'react-icons/fa';
import { useGetSellerOrdersQuery } from '../../store/slices/sellerProductsApiSlice'; // Adjust path if needed
import Loader from '../../components/Loader';

const SellerOrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetSellerOrdersQuery();

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in-up pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
             <FaBox className="text-blue-500" /> Customer Orders
          </h1>
          <p className="text-gray-400 mt-2">Manage and track items purchased from your store.</p>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl font-bold">
          {error?.data?.message || error.error}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[#1e293b] p-12 rounded-3xl border border-gray-700 text-center">
          <FaBox className="text-gray-600 text-6xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Orders Yet</h2>
          <p className="text-gray-400">When customers buy your products, they will appear here.</p>
        </div>
      ) : (
        <div className="bg-[#1e293b] rounded-3xl border border-gray-700 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f172a] border-b border-gray-700 text-xs uppercase tracking-widest text-gray-400 font-black">
                  <th className="p-5">Order ID</th>
                  <th className="p-5">Date</th>
                  <th className="p-5">Customer</th>
                  <th className="p-5">Total</th>
                  <th className="p-5">Paid</th>
                  <th className="p-5">Delivered</th>
                  <th className="p-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-5 text-sm font-bold text-gray-300">...{order._id.substring(order._id.length - 6)}</td>
                    <td className="p-5 text-sm text-gray-400">{order.createdAt.substring(0, 10)}</td>
                    <td className="p-5 text-sm font-medium text-white">{order.user ? order.user.name : 'Deleted User'}</td>
                    <td className="p-5 text-sm font-black text-green-400">
                      ETB {order.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-5">
                      {order.isPaid ? (
                        <div className="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-md text-xs font-bold inline-flex items-center gap-1.5">
                          <FaCheck /> {order.paidAt.substring(0, 10)}
                        </div>
                      ) : (
                        <div className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-md text-xs font-bold inline-flex items-center gap-1.5">
                          <FaTimes /> Not Paid
                        </div>
                      )}
                    </td>
                    <td className="p-5">
                      {order.isDelivered ? (
                        <div className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1 rounded-md text-xs font-bold inline-flex items-center gap-1.5">
                          <FaCheck /> {order.deliveredAt.substring(0, 10)}
                        </div>
                      ) : (
                        <div className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-md text-xs font-bold inline-flex items-center gap-1.5">
                          <FaTimes /> Pending
                        </div>
                      )}
                    </td>
                    <td className="p-5 text-center">
                      <Link 
                        to={`/seller/order/${order._id}`} 
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                        title="View Order Details"
                      >
                        <FaEye />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrderListScreen;