import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSellerLoginMutation } from '../../store/slices/sellersApiSlice';
import { setSellerCredentials } from '../../store/slices/sellerAuthSlice';
import { toast } from 'react-toastify';
import { FaStore, FaLock, FaEnvelope, FaSpinner, FaArrowRight } from 'react-icons/fa';

const SellerLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sellerLogin, { isLoading }] = useSellerLoginMutation();

  // Check if seller is already logged in, redirect them to dashboard
  const { sellerInfo } = useSelector((state) => state.sellerAuth);

  useEffect(() => {
    if (sellerInfo) {
      if (sellerInfo.isApproved) {
        navigate('/seller/dashboard');
      } else {
        navigate('/seller/pending'); // 👈 Send to waiting room if not approved
      }
    }
  }, [navigate, sellerInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await sellerLogin({ email, password }).unwrap();
      dispatch(setSellerCredentials({ ...res }));
      
      // 👇 Check the backend response before redirecting!
      if (res.isApproved) {
        navigate('/seller/dashboard');
        toast.success('Welcome back to Seller Center!');
      } else {
        navigate('/seller/pending');
      }
      
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0f172a] relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-gray-900">
            <FaStore className="text-4xl text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-2">Welcome Back</h2>
          <p className="text-gray-400 font-medium">Log in to manage your Gulit store</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#1e293b]/80 backdrop-blur-md p-8 sm:p-10 rounded-[2rem] border border-gray-700 shadow-2xl">
          <form onSubmit={submitHandler} className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-500" />
                </div>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-green-500 transition-colors" 
                  placeholder="name@business.com" 
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-400">Password</label>
                <Link to="#" className="text-xs font-bold text-green-500 hover:text-green-400 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-green-500 transition-colors" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-400 text-[#0f172a] font-black text-lg py-4 rounded-xl transition-all shadow-[0_0_30px_-5px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_-5px_rgba(34,197,94,0.6)] disabled:bg-gray-600 disabled:text-gray-400 disabled:shadow-none flex items-center justify-center gap-3 mt-4"
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : (
                <>Sign In to Dashboard <FaArrowRight /></>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-8 text-center border-t border-gray-700 pt-6">
            <p className="text-gray-400 text-sm font-medium">
              Don't have a seller account?{' '}
              <Link to="/seller/register" className="text-green-500 hover:text-green-400 font-bold transition-colors">
                Apply to sell
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerLoginScreen;