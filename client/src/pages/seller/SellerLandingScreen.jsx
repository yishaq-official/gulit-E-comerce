import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaStore, 
  FaChartLine, 
  FaShieldAlt, 
  FaMoneyCheckAlt, 
  FaCheckCircle, 
  FaArrowRight 
} from 'react-icons/fa';

const SellerLandingScreen = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* 🌟 HERO SECTION */}
      <section className="relative bg-gray-900 text-white overflow-hidden pt-20 pb-32 px-4">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-tibeb-pattern opacity-5 pointer-events-none"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10 flex flex-col items-center text-center">
          <span className="bg-green-500/20 text-green-400 font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-wider mb-6 border border-green-500/30">
            Gulit Seller Center
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Take Your Local Business <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              To The Next Level.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
            Reach millions of buyers across Ethiopia. Set up your digital storefront, manage inventory effortlessly, and get paid directly to your local bank account.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              to="/seller/register" 
              className="bg-green-500 hover:bg-green-600 text-white font-black text-lg px-8 py-4 rounded-xl transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
            >
              Start Selling Today <FaArrowRight />
            </Link>
            <Link 
              to="/seller/login" 
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all flex items-center justify-center"
            >
              Seller Login
            </Link>
          </div>
        </div>
      </section>

      {/* 🚀 WHY SELL ON GULIT SECTION */}
      <section className="py-20 px-4 bg-white relative -mt-10 rounded-t-[3rem] shadow-xl shadow-gray-200/50 z-20 border-t border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Why Sell on Gulit?</h2>
            <p className="text-gray-500 font-medium">We provide the tools you need to succeed in the digital economy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 hover:border-green-200 transition-colors group">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FaChartLine className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Massive Reach</h3>
              <p className="text-gray-600 leading-relaxed">
                Expand your customer base beyond your physical store. Put your products in front of thousands of active daily shoppers across the country.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 hover:border-green-200 transition-colors group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FaMoneyCheckAlt className="text-3xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Local Payments</h3>
              <p className="text-gray-600 leading-relaxed">
                With our integrated local wallet, payments from CBE, Telebirr, and Chapa are held securely and transferred directly to your bank account.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 hover:border-green-200 transition-colors group">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FaShieldAlt className="text-3xl text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trusted Platform</h3>
              <p className="text-gray-600 leading-relaxed">
                Our KYC verification ensures a safe environment. Build trust with buyers through verified badges and genuine customer reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 📋 HOW IT WORKS SECTION */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-black text-center text-gray-900 mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>

            {[
              { step: 1, title: 'Register', desc: 'Submit your business details, ID, and trade license for quick verification.' },
              { step: 2, title: 'List Products', desc: 'Upload your catalog with high-quality images, descriptions, and prices.' },
              { step: 3, title: 'Fulfill Orders', desc: 'Receive notifications, pack your items, and mark them as delivered.' },
              { step: 4, title: 'Get Paid', desc: 'Earnings are credited to your seller wallet for easy withdrawal.' }
            ].map((item) => (
              <div key={item.step} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-white border-4 border-green-500 text-green-600 font-black text-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-100">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏁 BOTTOM CTA */}
      <section className="py-20 px-4 bg-white text-center">
        <div className="container mx-auto max-w-3xl bg-gray-900 rounded-[3rem] p-12 relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 bg-tibeb-pattern opacity-10 pointer-events-none"></div>
           <FaStore className="text-6xl text-green-500 mx-auto mb-6 relative z-10" />
           <h2 className="text-3xl md:text-4xl font-black text-white mb-6 relative z-10">Ready to grow your business?</h2>
           <p className="text-gray-400 mb-8 relative z-10">Join thousands of Ethiopian merchants already selling on Gulit.</p>
           <Link 
              to="/seller/register" 
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-black text-lg px-10 py-4 rounded-xl transition-all shadow-lg shadow-green-500/30 relative z-10"
            >
              Create Your Seller Account
            </Link>
        </div>
      </section>
    </div>
  );
};

export default SellerLandingScreen;