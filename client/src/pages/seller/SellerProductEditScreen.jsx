import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave, FaBoxOpen, FaImage, FaSpinner } from 'react-icons/fa';
import { 
  useCreateSellerProductMutation, 
  useUpdateSellerProductMutation,
  useGetSellerProductsQuery 
} from '../../store/slices/sellerProductsApiSlice';

const SellerProductEditScreen = () => {
  // Check the URL to see if we are editing an existing product
  const { id: productId } = useParams();
  const isEditMode = Boolean(productId);
  const navigate = useNavigate();

  // 1. Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  // 2. RTK Query Hooks
  const [createProduct, { isLoading: loadingCreate }] = useCreateSellerProductMutation();
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateSellerProductMutation();

  // Fetch the seller's products (RTK caches this, so it's instant if they just came from the table)
  const { data: products } = useGetSellerProductsQuery(undefined, {
    skip: !isEditMode, // Only run this query if we are in Edit Mode
  });

  // 3. Populate form if in Edit Mode
  useEffect(() => {
    if (isEditMode && products) {
      const productToEdit = products.find((p) => p._id === productId);
      if (productToEdit) {
        setName(productToEdit.name);
        setPrice(productToEdit.price);
        setImage(productToEdit.image);
        setBrand(productToEdit.brand);
        setCategory(productToEdit.category);
        setCountInStock(productToEdit.countInStock);
        setDescription(productToEdit.description);
      } else {
        toast.error('Product not found in your inventory');
        navigate('/seller/products');
      }
    }
  }, [isEditMode, products, productId, navigate]);

  // 4. Handle Form Submission
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateProduct({
          productId, name, price, image, brand, category, countInStock, description,
        }).unwrap();
        toast.success('Product updated successfully!');
      } else {
        await createProduct({
          name, price, image, brand, category, countInStock, description,
        }).unwrap();
        toast.success('Product created successfully!');
      }
      navigate('/seller/products'); // Redirect back to inventory table
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const isLoading = loadingCreate || loadingUpdate;

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
      
      {/* 🌟 Top Navigation */}
      <div className="mb-8">
        <Link 
          to="/seller/products" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-green-400 font-bold transition-colors mb-4"
        >
          <FaArrowLeft /> Back to Inventory
        </Link>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <FaBoxOpen className="text-green-500" /> 
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-gray-400 mt-1">
          {isEditMode ? 'Update your product details below.' : 'List a new item in your store to start selling.'}
        </p>
      </div>

      {/* 📝 The Form */}
      <form onSubmit={submitHandler} className="bg-[#1e293b] p-8 md:p-10 rounded-3xl border border-gray-700 shadow-xl space-y-8">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-400 mb-2">Product Name</label>
            <input 
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-green-500 transition-colors" 
              placeholder="e.g., iPhone 15 Pro Max" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Price (ETB)</label>
            <input 
              type="number" required min="0" value={price} onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-green-500 transition-colors" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Stock Count</label>
            <input 
              type="number" required min="0" value={countInStock} onChange={(e) => setCountInStock(Number(e.target.value))}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-green-500 transition-colors" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Brand</label>
            <input 
              type="text" required value={brand} onChange={(e) => setBrand(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-green-500 transition-colors" 
              placeholder="e.g., Apple, Samsung, Nike" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Category</label>
            <select 
              value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-green-500 transition-colors"
            >
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Books">Books</option>
              <option value="Beauty">Beauty</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Image Input (Currently Text URL - We can add an upload button later) */}
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2 flex items-center gap-2">
            <FaImage className="text-gray-500" /> Product Image URL
          </label>
          <input 
            type="text" required value={image} onChange={(e) => setImage(e.target.value)}
            className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-green-500 transition-colors" 
            placeholder="/images/sample.jpg or https://..." 
          />
          <p className="text-xs text-gray-500 mt-2">
            *(Note: In a future update, we will replace this with a direct image upload button)*
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2">Product Description</label>
          <textarea 
            required rows="5" value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-green-500 transition-colors resize-none" 
            placeholder="Write a detailed description of the product..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-700">
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full md:w-auto bg-green-500 hover:bg-green-400 text-[#0f172a] font-black text-lg px-10 py-4 rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.6)] hover:-translate-y-0.5 disabled:bg-gray-600 disabled:text-gray-400 disabled:shadow-none flex items-center justify-center gap-3 ml-auto"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : (
              <><FaSave /> {isEditMode ? 'Save Changes' : 'Publish Product'}</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default SellerProductEditScreen;