import React from 'react';
import { theme } from '../utils/theme';
import image from '../assets/gulit.png'

const HomeScreen = () => {
  return (
    <div className="space-y-12">
      {/* 🏛️ HERO SECTION */}
      {/* 🏛️ GULIT HERO SECTION */}
{/* 🏛️ MODERN GULIT HERO */}
<section className="relative h-[450px] flex items-center px-8 md:px-12 overflow-hidden rounded-[2.5rem] my-6 shadow-xl group">
        {/* Layer 1: Pattern (Slightly more visible now) */}
        <div className="absolute inset-0 bg-tibeb-pattern bg-repeat opacity-15 group-hover:opacity-20 transition-opacity duration-700"></div>
        
        {/* Layer 2: Vibrant Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/90 via-white/60 to-white/95"></div>

        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center w-full font-sans">
          {/* Text Content - Spacing reduced to fit better */}
          <div className="space-y-5">
            <span className="inline-block bg-white/90 text-green-600 px-4 py-1.5 rounded-full text-sm font-black tracking-wider shadow-sm border border-green-100">
              ✨ TRADITION MEETS TECH
            </span>
            
            {/* 🌟 CHANGE 2: Main Headline reduced from 8xl to 6xl */}
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight">
              Experience <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-yellow-400">
                Modern Gulit
              </span>
            </h1>
            
            {/* 🌟 CHANGE 3: Paragraph text reduced to text-lg */}
            <p className="text-lg text-gray-700 font-medium max-w-md leading-relaxed">
              Ethiopia's finest products, sourced from the heart of the community and delivered with a touch of gold.
            </p>
            
            {/* Buttons - Now clearly visible */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-green-200/50 transition-all transform hover:-translate-y-1">
                Shop Now
              </button>
              <button className="bg-white border-2 border-green-100 text-green-600 px-8 py-3.5 rounded-xl font-bold text-lg hover:border-green-400 hover:bg-green-50 transition-all">
                Sell Items
              </button>
            </div>
          </div>
          
          {/* Visual Accent Circle */}
          <div className="hidden md:flex justify-center relative">
            <div className="w-72 h-72 rounded-full border-[12px] border-white/80 shadow-2xl overflow-hidden relative z-10">
               <div className="w-full h-full bg-tibeb-pattern bg-center scale-125 opacity-80"></div>
            </div>
            {/* A subtle glow behind the circle */}
            <div className="absolute inset-0 bg-green-300 blur-3xl opacity-30 rounded-full z-0 transform scale-110"></div>
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
                <img src={image} alt="product image" />
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