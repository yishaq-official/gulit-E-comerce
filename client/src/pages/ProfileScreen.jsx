import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaUser, FaSave, FaBoxOpen, FaMapMarkerAlt, FaLock } from 'react-icons/fa';
import { useGetMyOrdersQuery } from '../store/slices/ordersApiSlice';
import { FaTimes } from 'react-icons/fa'; // For 'X' icon if not paid
// 👇 Import the API hook and Redux action
import { useProfileMutation } from '../store/slices/usersApiSlice';
import { setCredentials } from '../store/slices/authSlice';
import Loader from '../components/Loader';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeTab, setActiveTab] = useState('settings'); // 'settings', 'orders', 'address'
  const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetMyOrdersQuery();

  const { userInfo } = useSelector((state) => state.auth);
  
  // 👇 Initialize the update mutation
  const [updateProfile, { isLoading }] = useProfileMutation();
  const dispatch = useDispatch();

  // Placeholder for future order history data
  const myOrders = []; 

  // Populate form with existing user data on load
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        // 👇 Call the API endpoint
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();
        
        // 👇 Update local Redux state (Header updates immediately)
        dispatch(setCredentials({ ...res }));
        
        toast.success('Profile updated successfully');
        
        // Clear password fields for security
        setPassword('');
        setConfirmPassword('');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
          <span className="bg-green-100 p-3 rounded-full text-green-600"><FaUser size={24}/></span>
          My Account
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 👈 LEFT SIDEBAR */}
          <div className="md:col-span-1 space-y-3">
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all ${activeTab === 'settings' ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-white text-gray-600 hover:bg-green-50'}`}
            >
              <FaUser /> Profile Settings
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all ${activeTab === 'orders' ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-white text-gray-600 hover:bg-green-50'}`}
            >
              <FaBoxOpen /> My Orders
            </button>
            <button 
              onClick={() => setActiveTab('address')}
              className={`w-full text-left px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all ${activeTab === 'address' ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-white text-gray-600 hover:bg-green-50'}`}
            >
              <FaMapMarkerAlt /> Address Book
            </button>
          </div>

          {/* 👉 RIGHT CONTENT AREA */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 relative overflow-hidden min-h-[400px]">
               {/* Tibeb Background Accent */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-tibeb-pattern opacity-5 rounded-bl-[10rem] pointer-events-none"></div>

               {/* TAB: PROFILE SETTINGS */}
               {activeTab === 'settings' && (
                 <form onSubmit={submitHandler} className="relative z-10 max-w-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Edit Profile</h2>
                    
                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Name</label>
                        <div className="relative">
                          <FaUser className="absolute left-4 top-4 text-gray-300" />
                          <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-medium focus:border-green-500 focus:bg-white outline-none transition-colors"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address</label>
                        <div className="relative">
                          <span className="absolute left-4 top-4 text-gray-300">@</span>
                          <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-medium focus:border-green-500 focus:bg-white outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Change Password</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="relative">
                             <FaLock className="absolute left-4 top-4 text-gray-300" />
                             <input 
                               type="password" 
                               placeholder="New Password"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-medium focus:border-green-500 focus:bg-white outline-none transition-colors"
                             />
                           </div>
                           <div className="relative">
                             <FaLock className="absolute left-4 top-4 text-gray-300" />
                             <input 
                               type="password" 
                               placeholder="Confirm New"
                               value={confirmPassword}
                               onChange={(e) => setConfirmPassword(e.target.value)}
                               className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-medium focus:border-green-500 focus:bg-white outline-none transition-colors"
                             />
                           </div>
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all active:scale-95 disabled:bg-gray-400 mt-4 shadow-xl shadow-gray-200"
                      >
                        {isLoading ? (
                          'Updating...'
                        ) : (
                          <>
                            <FaSave /> Save Changes
                          </>
                        )}
                      </button>
                    </div>
                 </form>
               )}

               {/* TAB: ORDERS */}
{activeTab === 'orders' && (
  <div className="relative z-10">
    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Order History</h2>
    
    {loadingOrders ? (
      <Loader />
    ) : errorOrders ? (
      <div className="bg-red-50 text-red-500 p-4 rounded-xl">{errorOrders?.data?.message || errorOrders.error}</div>
    ) : orders.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
        <FaBoxOpen className="text-gray-300 text-4xl mb-3" />
        <p className="text-gray-500 font-medium">No orders yet.</p>
        <button className="bg-green-500 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-green-600 transition-colors mt-4">
          Start Shopping
        </button>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
              <th className="p-3">ID</th>
              <th className="p-3">Date</th>
              <th className="p-3">Total</th>
              <th className="p-3">Paid</th>
              <th className="p-3">Delivered</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-3 font-mono text-xs">{order._id.substring(0, 10)}...</td>
                <td className="p-3">{order.createdAt.substring(0, 10)}</td>
                <td className="p-3 font-bold">{order.totalPrice} ETB</td>
                <td className="p-3">
                  {order.isPaid ? (
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md text-xs font-bold">
                      {order.paidAt.substring(0, 10)}
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-500 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 w-fit">
                      <FaTimes /> Not Paid
                    </span>
                  )}
                </td>
                <td className="p-3">
                  {order.isDelivered ? (
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md text-xs font-bold">
                      Delivered
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs font-bold">Processing</span>
                  )}
                </td>
                <td className="p-3">
                  <button className="text-green-600 hover:underline font-bold text-xs">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}

               {/* TAB: ADDRESS BOOK (Placeholder) */}
               {activeTab === 'address' && (
                  <div className="relative z-10">
                     <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Address Book</h2>
                     <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <FaMapMarkerAlt className="text-gray-300 text-4xl mb-3" />
                        <p className="text-gray-500 font-medium">No addresses saved.</p>
                        <p className="text-xs text-gray-400 mt-1">Addresses are saved automatically during checkout.</p>
                     </div>
                  </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;