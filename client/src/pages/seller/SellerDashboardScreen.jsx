import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  FaDollarSign, FaShoppingBag, FaBoxOpen, FaWallet, 
  FaArrowRight, FaPlus, FaChartLine, FaEllipsisH
} from 'react-icons/fa';

const SellerDashboardScreen = () => {
  const { sellerInfo } = useSelector((state) => state.sellerAuth);

  // MOCK DATA: We will replace this with real API data later
  const mockOrders = [
    { _id: 'ORD-7829', date: '2026-02-21', customer: 'Abebe Kebede', total: 4500, status: 'Pending' },
    { _id: 'ORD-7828', date: '2026-02-20', customer: 'Sara Tadesse', total: 1250, status: 'Shipped' },
    { _id: 'ORD-7827', date: '2026-02-19', customer: 'Dawit Mekonnen', total: 8900, status: 'Delivered' },
    { _id: 'ORD-7826', date: '2026-02-18', customer: 'Helen Hailu', total: 320, status: 'Delivered' },
  ];

  return (
    <div className="w-full animate-fade-in-up">
      
      {/* 🌟 Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Welcome back, <span className="text-green-400">{sellerInfo?.shopName}</span>!
          </h1>
          <p className="text-gray-400 mt-1">Here is what's happening in your store today.</p>
        </div>
        
        <Link 
          to="/seller/products/add" 
          className="bg-green-500 hover:bg-green-400 text-[#0f172a] font-bold px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.6)] hover:-translate-y-0.5 flex items-center gap-2"
        >
          <FaPlus /> Add New Product
        </Link>
      </div>

      {/* 📈 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        <div className="bg-[#1e293b] p-6 rounded-3xl border border-gray-700 hover:border-green-500/50 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
              <FaDollarSign className="text-xl text-blue-400" />
            </div>
            <span className="bg-green-500/10 text-green-400 text-xs font-bold px-2.5 py-1 rounded-full">+12.5%</span>
          </div>
          <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Sales</h3>
          <p className="text-3xl font-black text-white">24,500 <span className="text-lg text-gray-500 font-medium">ETB</span></p>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-3xl border border-gray-700 hover:border-green-500/50 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
              <FaShoppingBag className="text-xl text-purple-400" />
            </div>
            <span className="bg-green-500/10 text-green-400 text-xs font-bold px-2.5 py-1 rounded-full">+5.2%</span>
          </div>
          <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Orders</h3>
          <p className="text-3xl font-black text-white">128</p>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-3xl border border-gray-700 hover:border-green-500/50 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20">
              <FaBoxOpen className="text-xl text-orange-400" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Active Products</h3>
          <p className="text-3xl font-black text-white">45</p>
        </div>

        <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-6 rounded-3xl border border-green-500/30 relative overflow-hidden group shadow-[0_0_30px_-10px_rgba(34,197,94,0.2)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-500/30">
              <FaWallet className="text-xl text-green-400" />
            </div>
            <button className="text-gray-400 hover:text-white transition-colors"><FaEllipsisH /></button>
          </div>
          <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1 relative z-10">Wallet Balance</h3>
          <p className="text-3xl font-black text-white relative z-10">8,200 <span className="text-lg text-green-500 font-medium">ETB</span></p>
        </div>

      </div>

      {/* 📦 Bottom Section: 2 Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Col: Recent Orders (Takes up 2/3 space) */}
        <div className="xl:col-span-2 bg-[#1e293b] rounded-3xl border border-gray-700 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-[#0f172a]/30">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaShoppingBag className="text-green-500" /> Recent Orders
            </h2>
            <Link to="/seller/orders" className="text-sm font-bold text-green-500 hover:text-green-400 flex items-center gap-1 transition-colors">
              View All <FaArrowRight />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f172a]/80 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-bold border-b border-gray-700">Order ID</th>
                  <th className="p-4 font-bold border-b border-gray-700">Date</th>
                  <th className="p-4 font-bold border-b border-gray-700">Customer</th>
                  <th className="p-4 font-bold border-b border-gray-700">Total</th>
                  <th className="p-4 font-bold border-b border-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {mockOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                    <td className="p-4 text-white font-medium group-hover:text-green-400 transition-colors">{order._id}</td>
                    <td className="p-4 text-gray-400">{order.date}</td>
                    <td className="p-4 text-gray-300">{order.customer}</td>
                    <td className="p-4 text-white font-bold">{order.total} ETB</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Quick Actions & Alerts (Takes up 1/3 space) */}
        <div className="space-y-6">
          
          {/* Quick Actions Card */}
          <div className="bg-[#1e293b] p-6 rounded-3xl border border-gray-700 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/seller/products/add" className="w-full bg-[#0f172a] hover:bg-gray-800 border border-gray-700 hover:border-green-500/50 text-white p-4 rounded-2xl flex items-center justify-between transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center text-green-400"><FaBoxOpen /></div>
                  <span className="font-bold">List New Product</span>
                </div>
                <FaArrowRight className="text-gray-500 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
              </Link>
              
              <Link to="/seller/wallet" className="w-full bg-[#0f172a] hover:bg-gray-800 border border-gray-700 hover:border-green-500/50 text-white p-4 rounded-2xl flex items-center justify-between transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400"><FaWallet /></div>
                  <span className="font-bold">Withdraw Funds</span>
                </div>
                <FaArrowRight className="text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </Link>
              
              <Link to="/seller/settings" className="w-full bg-[#0f172a] hover:bg-gray-800 border border-gray-700 hover:border-green-500/50 text-white p-4 rounded-2xl flex items-center justify-between transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400"><FaChartLine /></div>
                  <span className="font-bold">Store Analytics</span>
                </div>
                <FaArrowRight className="text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 rounded-3xl border border-orange-500/20 shadow-xl">
            <h2 className="text-lg font-bold text-orange-400 mb-2 flex items-center gap-2">
              Action Required
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              You have <strong className="text-white">1 pending order</strong> that needs to be shipped within the next 24 hours to maintain your seller rating.
            </p>
            <Link to="/seller/orders" className="text-sm font-bold text-orange-400 hover:text-orange-300 underline underline-offset-4 transition-colors">
              Fulfill Order Now
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SellerDashboardScreen;