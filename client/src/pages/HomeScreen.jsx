import React from 'react';
import { useGetProductsQuery } from '../store/slices/productsApiSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader'; 
import { useParams, Link } from 'react-router-dom';

const HomeScreen = () => {
  const { keyword } = useParams();
  // 📥 Fetching real data from backend!
  const { data: products, isLoading, error } = useGetProductsQuery({ keyword });

  return (
    <div className="space-y-16 pb-20">
      {/* ... (Keep your Hero Section code from before) ... */}

      {/* 📦 DYNAMIC PRODUCT GRID */}
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-green-500 font-black text-sm uppercase tracking-[0.3em]">Fresh Market</span>
            <h2 className="text-4xl font-black text-gray-900">Latest Arrivals</h2>
          </div>
          <button className="text-gray-400 font-bold hover:text-green-500 transition-colors">View All</button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader /></div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-6 rounded-2xl border border-red-100 font-bold">
            {error?.data?.message || error.error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;