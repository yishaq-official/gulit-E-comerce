import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../store/slices/productsApiSlice';
import ProductCard from '../components/ProductCard'; // Ensure this path is correct
import Loader from '../components/Loader';
import { FaArrowLeft, FaBoxOpen } from 'react-icons/fa';

const CategoryScreen = () => {
  // 1. Get the category name from the URL (e.g., 'electronics')
  const { categoryName } = useParams();

  // 2. Fetch products, passing the category to our updated API slice
  const { data: products, isLoading, error } = useGetProductsQuery({ category: categoryName });

  // Capitalize the first letter for the title
  const formattedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-red-500 font-bold mb-4 transition-colors">
              <FaArrowLeft size={12} /> Back to Market
            </Link>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
               <span className="text-red-600 capitalize">{formattedCategory}</span> Products
            </h1>
          </div>
          <p className="text-gray-500 font-medium">
            {products ? `${products.length} Items Found` : 'Loading...'}
          </p>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-6 rounded-2xl font-bold text-center border border-red-100">
            {error?.data?.message || error.error}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-16 text-center shadow-sm border border-gray-100 flex flex-col items-center">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <FaBoxOpen className="text-gray-300 text-5xl" />
             </div>
             <h2 className="text-2xl font-bold text-gray-800 mb-2">No products found</h2>
             <p className="text-gray-500 mb-8 max-w-md mx-auto">We currently don't have any items listed in the {formattedCategory} category. Please check back later!</p>
             <Link to="/" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-red-200">
               Browse All Categories
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoryScreen;