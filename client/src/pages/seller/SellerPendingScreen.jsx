import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSellerLogoutApiMutation } from '../../store/slices/sellersApiSlice';
import { logoutSeller } from '../../store/slices/sellerAuthSlice';
import { FaClock, FaCheckCircle, FaShieldAlt, FaSignOutAlt } from 'react-icons/fa';

const SellerPendingScreen = () => {
  const { sellerInfo } = useSelector((state) => state.sellerAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useSellerLogoutApiMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logoutSeller());
      navigate('/seller/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 bg-[#0f172a] relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-2xl w-full bg-[#1e293b]/80 backdrop-blur-md p-10 md:p-16 rounded-[3rem] border border-gray-700 shadow-2xl relative z-10 text-center">
        
        {/* Animated Hourglass / Clock Icon */}
        <div className="w-28 h-28 bg-[#0f172a] border border-gray-700 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
          <FaClock className="text-6xl text-blue-400 relative z-10" />
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Application Under Review</h2>
        <p className="text-lg text-gray-400 mb-10 leading-relaxed">
          Hello <span className="text-white font-bold">{sellerInfo?.name}</span>! Thank you for choosing to build your business with Gulit. Our compliance team is currently reviewing your submitted KYC documents for <span className="text-white font-bold">{sellerInfo?.shopName}</span>.
        </p>

        {/* Progress Checklist */}
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-gray-800 text-left space-y-4 mb-10">
          <div className="flex items-center gap-4 text-gray-300">
            <FaCheckCircle className="text-xl text-green-500 flex-shrink-0" />
            <span className="font-medium">Account details submitted successfully</span>
          </div>
          <div className="flex items-center gap-4 text-gray-300">
            <FaCheckCircle className="text-xl text-green-500 flex-shrink-0" />
            <span className="font-medium">KYC Documents securely uploaded</span>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <FaClock className="text-xl text-blue-400 flex-shrink-0 animate-pulse" />
            <span className="font-medium">Pending manual verification by Admin (Usually takes 24-48 hours)</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold text-lg px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            Check Status Again
          </button>
          <button 
            onClick={logoutHandler}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 font-bold text-lg px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>

        <p className="mt-10 text-sm text-gray-500 flex items-center justify-center gap-2">
          <FaShieldAlt className="text-gray-600" /> Your data is securely encrypted and protected.
        </p>
      </div>
    </div>
  );
};

export default SellerPendingScreen;