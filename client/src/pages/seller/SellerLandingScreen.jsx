import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaStore, FaChartLine, FaShieldAlt, FaMoneyCheckAlt, 
  FaArrowRight, FaQuestionCircle, FaStar, FaQuoteLeft, FaBars, FaTimes
} from 'react-icons/fa';

const SellerLandingScreen = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const faqs = [
    { q: "How much does it cost to sell on Gulit?", a: "Registering and listing your products is completely free. We only charge a small commission fee when your item is successfully sold and delivered." },
    { q: "How do I get paid?", a: "Once an order is marked as delivered, the funds are added to your Seller Wallet. You can withdraw to your CBE or Telebirr account at any time." },
    { q: "What documents do I need?", a: "You will need a valid National ID, a renewed Merchant/Trade License, and your TIN (Tax Identification Number) certificate." },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-300 font-sans flex flex-col w-full absolute top-0 left-0">
      
      {/* 🌟 SELLER NAVBAR */}
      <nav className="fixed w-full z-50 bg-[#0f172a]/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
          <Link to="/sell" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-green-500/30">
              G
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              Gulit <span className="text-green-500 font-medium">Seller Center</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 font-medium">
            <Link to="#" className="text-gray-400 hover:text-green-500 transition-colors">Help Center</Link>
            <Link to="#" className="text-gray-400 hover:text-green-500 transition-colors">Rules Center</Link>
            <Link to="/seller/login" className="text-white hover:text-green-500 transition-colors font-bold">Seller Login</Link>
            <Link 
              to="/" 
              className="bg-white text-gray-900 px-6 py-2.5 rounded-full font-bold hover:bg-green-500 hover:text-white transition-all shadow-md"
            >
              Start Shopping
            </Link>
          </div>

          <button className="md:hidden text-2xl text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1e293b] border-b border-gray-800 p-4 flex flex-col gap-4 shadow-xl">
            <Link to="#" className="text-gray-300 font-medium">Help Center</Link>
            <Link to="#" className="text-gray-300 font-medium">Rules Center</Link>
            <Link to="/seller/login" className="text-white font-bold">Seller Login</Link>
            <Link to="/" className="bg-green-500 text-white px-4 py-2 rounded-lg text-center font-bold">Start Shopping</Link>
          </div>
        )}
      </nav>

      {/* 🌟 HERO SECTION */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        {/* Abstract Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto max-w-6xl relative z-10 flex flex-col items-center text-center">
          <span className="bg-green-500/10 text-green-400 font-bold px-5 py-2 rounded-full text-sm uppercase tracking-widest mb-8 border border-green-500/20">
            Join 5,000+ Ethiopian Merchants
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            Take Your Local Business <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              To The Next Level.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
            Reach millions of buyers from Addis Ababa to Dire Dawa. Set up your digital storefront, manage inventory effortlessly, and get paid directly to your local bank account.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              to="/seller/register" 
              className="bg-green-500 hover:bg-green-600 text-white font-black text-lg px-8 py-4 rounded-xl transition-all shadow-[0_0_30px_-5px_rgba(34,197,94,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Start Selling Today <FaArrowRight />
            </Link>
            <Link 
              to="/seller/login" 
              className="bg-[#1e293b] hover:bg-[#334155] border border-gray-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all flex items-center justify-center hover:-translate-y-1"
            >
              Seller Login
            </Link>
          </div>
        </div>
      </section>

      {/* 📈 STATS STRIP */}
      <section className="bg-[#1e293b] border-y border-gray-800 py-10">
        <div className="container mx-auto max-w-6xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-800">
          <div>
            <h4 className="text-3xl md:text-4xl font-black text-white">1M+</h4>
            <p className="text-sm text-gray-400 mt-1 font-medium">Active Shoppers</p>
          </div>
          <div>
            <h4 className="text-3xl md:text-4xl font-black text-white">5,000+</h4>
            <p className="text-sm text-gray-400 mt-1 font-medium">Verified Sellers</p>
          </div>
          <div>
            <h4 className="text-3xl md:text-4xl font-black text-white">48h</h4>
            <p className="text-sm text-gray-400 mt-1 font-medium">Average Payout Time</p>
          </div>
          <div>
            <h4 className="text-3xl md:text-4xl font-black text-green-500">0 ETB</h4>
            <p className="text-sm text-gray-400 mt-1 font-medium">Setup Fee</p>
          </div>
        </div>
      </section>

      {/* 🚀 WHY SELL ON GULIT SECTION */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Why Sell on Gulit?</h2>
            <p className="text-gray-400 font-medium max-w-2xl mx-auto">We provide the enterprise-grade tools you need to succeed in Ethiopia's growing digital economy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1e293b] p-8 rounded-3xl border border-gray-800 hover:border-green-500 transition-all hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
                <FaChartLine className="text-3xl text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Massive Reach</h3>
              <p className="text-gray-400 leading-relaxed">
                Expand your customer base beyond your physical store. Put your products in front of thousands of active daily shoppers across the country.
              </p>
            </div>

            <div className="bg-[#1e293b] p-8 rounded-3xl border border-gray-800 hover:border-green-500 transition-all hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-green-900/30 rounded-2xl flex items-center justify-center mb-6">
                <FaMoneyCheckAlt className="text-3xl text-green-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Secure Local Payments</h3>
              <p className="text-gray-400 leading-relaxed">
                With our integrated local wallet, payments from CBE, Telebirr, and Chapa are held securely and transferred directly to your bank account.
              </p>
            </div>

            <div className="bg-[#1e293b] p-8 rounded-3xl border border-gray-800 hover:border-green-500 transition-all hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6">
                <FaShieldAlt className="text-3xl text-purple-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Trusted Platform</h3>
              <p className="text-gray-400 leading-relaxed">
                Our strict KYC verification ensures a safe environment. Build trust with buyers through verified badges and genuine customer reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 📋 HOW IT WORKS SECTION */}
      <section className="py-24 px-6 bg-[#1e293b] border-y border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-black text-center text-white mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-[2.5rem] left-10 w-[calc(100%-5rem)] h-1 bg-gray-700 z-0"></div>

            {[
              { step: 1, title: 'Register', desc: 'Submit your business details, ID, and trade license for quick verification.' },
              { step: 2, title: 'List Products', desc: 'Upload your catalog with high-quality images, descriptions, and prices.' },
              { step: 3, title: 'Fulfill Orders', desc: 'Receive notifications, pack your items, and mark them as delivered.' },
              { step: 4, title: 'Get Paid', desc: 'Earnings are credited to your seller wallet for easy withdrawal.' }
            ].map((item) => (
              <div key={item.step} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-[#0f172a] border-4 border-green-500 text-green-500 font-black text-2xl flex items-center justify-center mb-6 shadow-xl shadow-green-500/20">
                  0{item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏁 BOTTOM CTA */}
      <section className="py-24 px-6 text-center">
        <div className="container mx-auto max-w-4xl bg-[#1e293b] rounded-[3rem] p-12 md:p-16 relative overflow-hidden shadow-2xl border border-gray-700">
           <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
           
           <FaStore className="text-6xl text-green-500 mx-auto mb-6 relative z-10" />
           <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10">Ready to grow your business?</h2>
           <p className="text-gray-400 text-lg mb-10 relative z-10 max-w-2xl mx-auto">Join the digital revolution. Create your store in minutes and start reaching customers nationwide today.</p>
           
           <Link 
              to="/seller/register" 
              className="inline-block bg-green-500 hover:bg-green-400 text-[#0f172a] font-black text-lg px-12 py-5 rounded-2xl transition-all shadow-[0_0_40px_-10px_rgba(34,197,94,0.6)] hover:-translate-y-1 relative z-10"
            >
              Create Your Free Account
            </Link>
        </div>
      </section>

      {/* 🦶 SELLER FOOTER */}
      <footer className="bg-[#1e293b] border-t border-gray-800 py-12 mt-auto">
        <div className="container mx-auto max-w-6xl px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Link to="/sell" className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white font-black text-sm">G</div>
              <span className="text-xl font-black text-white tracking-tight">
                Gulit <span className="text-gray-400 font-medium text-sm">Seller Center</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Gulit Marketplace. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-400">
            <Link to="#" className="hover:text-green-500 transition-colors">Help Center</Link>
            <Link to="#" className="hover:text-green-500 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-green-500 transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-green-500 transition-colors">Seller Agreement</Link>
          </div>
        </div>
      </footer>
      
    </div>
  );
};

export default SellerLandingScreen;