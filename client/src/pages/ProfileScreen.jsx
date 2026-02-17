import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaUser, FaLock, FaSave, FaBoxOpen, FaMapMarkerAlt } from 'react-icons/fa';
// You'll need to create this API hook later for updating profile
// import { useUpdateUserProfileMutation } from '../store/slices/usersApiSlice'; 

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' or 'orders'

  const { userInfo } = useSelector((state) => state.auth);
  
  // Placeholder for order history data
  const myOrders = []; 

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
      console.log('Update profile logic goes here');
      // await updateProfile({ ... }).unwrap();
      toast.success('Profile updated successfully');
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
          <div className="md:col-span-1 space-y-2">
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
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 relative overflow-hidden">
               {/* Tibeb Background Accent */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-tibeb-pattern opacity-5 rounded-bl-[10rem] pointer-events-none"></div>

               {/* TAB: PROFILE SETTINGS */}
               {activeTab === 'settings' && (
                 <form onSubmit={submitHandler} className="relative z-10 max-w-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Profile</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Full Name</label>
                        <input 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:border-green-500 outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email Address</label>
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:border-green-500 outline-none"
                        />
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">New Password</label>
                        <div className="flex gap-4">
                           <input 
                             type="password" 
                             placeholder="New Password"
                             value={password}
                             onChange={(e) => setPassword(e.target.value)}
                             className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:border-green-500 outline-none"
                           />
                           <input 
                             type="password" 
                             placeholder="Confirm"
                             value={confirmPassword}
                             onChange={(e) => setConfirmPassword(e.target.value)}
                             className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:border-green-500 outline-none"
                           />
                        </div>
                      </div>

                      <button type="submit" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-colors mt-4">
                        <FaSave /> Save Changes
                      </button>
                    </div>
                 </form>
               )}

               {/* TAB: ORDERS */}
               {activeTab === 'orders' && (
                 <div className="relative z-10">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Order History</h2>
                    {myOrders.length === 0 ? (
                      <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <FaBoxOpen className="mx-auto text-gray-300 text-4xl mb-3" />
                        <p className="text-gray-500 font-medium">You haven't placed any orders yet.</p>
                      </div>
                    ) : (
                      <div>{/* List orders here later */}</div>
                    )}
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