import React from 'react';
import { theme } from '../utils/theme';

const HomeScreen = () => {
  return (
    <div className="space-y-12">
      {/* 🏛️ HERO SECTION */}
      <section className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-xl">
        {/* The Pattern Background */}
        <div className="absolute inset-0 bg-tibeb-pattern opacity-20"></div>
        {/* Green Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gulit-green to-transparent opacity-90"></div>
        
        <div className="relative h-full flex flex-col justify-center px-12 text-white">
          <h1 className="text-4xl md:text-6xl font-black mb-2">Welcome to Gulit</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-lg">
            Ethiopia's modern marketplace. Quality items from verified sellers, 
            delivered straight to your door.
          </p>
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