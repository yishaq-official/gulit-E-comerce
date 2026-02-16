import React from 'react';
import { theme } from '../utils/theme';

const HomeScreen = () => {
  return (
    <div className="space-y-12">
      {/* 🏛️ HERO SECTION */}
      {/* 🏛️ GULIT HERO SECTION */}
<section className="relative h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl mb-12 group">
  {/* The Tibeb Pattern - Tiled across the background */}
  <div className="absolute inset-0 bg-tibeb-pattern bg-repeat opacity-40 group-hover:scale-105 transition-transform duration-700"></div>
  
  {/* Green Gradient Glassmorphism Overlay */}
  <div className="absolute inset-0 bg-gradient-to-tr from-gulit-green via-green-900/80 to-transparent"></div>
  
  <div className="relative h-full flex flex-col justify-center px-8 md:px-16 text-white z-10">
    <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 max-w-2xl">
      <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">
        Modern <span className="text-gulit-accent underline decoration-tibeb-pattern">Gulit</span>
      </h1>
      <p className="text-xl md:text-2xl font-light leading-relaxed mb-8 text-gray-100">
        Quality products from verified Ethiopian sellers, delivered with tradition and trust.
      </p>
      <button className="bg-gulit-accent text-green-900 px-8 py-4 rounded-full font-black text-lg hover:bg-white transition-colors shadow-lg">
        Start Shopping
      </button>
    </div>
  </div>
</section>

      {/* 📦 LATEST PRODUCTS */}
      <div>
        <h2 className={theme.heading}>Latest Arrivals</h2>
        
        {/* Temporary Placeholder Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className={theme.card + " p-4"}>
              <div className="h-48 bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-400">
                Product Image
              </div>
              <h3 className="font-bold text-lg text-gray-800">Sample Item {item}</h3>
              <p className="text-gulit-green font-black text-xl mb-4">500 ETB</p>
              <button className={theme.buttonPrimary + " w-full"}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;