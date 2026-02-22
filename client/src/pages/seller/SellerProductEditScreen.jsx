import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave, FaBoxOpen, FaImage, FaSpinner, FaCloudUploadAlt, FaTimesCircle } from 'react-icons/fa';
import { 
  useCreateSellerProductMutation, 
  useUpdateSellerProductMutation,
  useGetSellerProductsQuery,
  useUploadProductImagesMutation // 👈 Import new hook
} from '../../store/slices/sellerProductsApiSlice';

const SellerProductEditScreen = () => {
  const { id: productId } = useParams();
  const isEditMode = Boolean(productId);
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  
  // 🆕 IMAGE STATE
  const [selectedFiles, setSelectedFiles] = useState([]); // Raw file objects to upload
  const [previewUrls, setPreviewUrls] = useState([]); // Local object URLs for preview
  const [uploadedImagePaths, setUploadedImagePaths] = useState([]); // Final paths from server on edit
  const [isUploading, setIsUploading] = useState(false); // Local loading state for upload button

  // RTK Query Hooks
  const [createProduct, { isLoading: loadingCreate }] = useCreateSellerProductMutation();
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateSellerProductMutation();
  const [uploadImagesApi] = useUploadProductImagesMutation(); // 👈 Use the hook

  const { data: products } = useGetSellerProductsQuery(undefined, {
    skip: !isEditMode,
  });

  // Populate form in Edit Mode
  useEffect(() => {
    if (isEditMode && products) {
      const productToEdit = products.find((p) => p._id === productId);
      if (productToEdit) {
        setName(productToEdit.name);
        setPrice(productToEdit.price);
        setBrand(productToEdit.brand);
        setCategory(productToEdit.category);
        setCountInStock(productToEdit.countInStock);
        setDescription(productToEdit.description);
        // 🆕 Load existing images into state
        // Combine main 'image' and secondary 'images' array for preview
        const combinedImages = [productToEdit.image, ...(productToEdit.images || [])];
        // Filter out duplicates just in case
        const uniqueImages = [...new Set(combinedImages)];
        setUploadedImagePaths(uniqueImages);
      }
    }
  }, [isEditMode, products, productId]);

  // 🆕 Handle File Selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 6 images total (existing + new selection)
    const totalImages = uploadedImagePaths.length + selectedFiles.length + files.length;
    if (totalImages > 6) {
      toast.error('You can only have a maximum of 6 images per product.');
      return;
    }

    // Create local preview URLs for newly selected files
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    
    setSelectedFiles([...selectedFiles, ...files]);
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  // 🆕 Handle removing a selected file from preview
  const removeSelectedFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newPreviews = [...previewUrls];
    URL.revokeObjectURL(newPreviews[index]); // Clean up memory
    newPreviews.splice(index, 1);
    setPreviewUrls(newPreviews);
  };

   // 🆕 Handle removing an already uploaded image (in Edit Mode)
  const removeUploadedImage = (index) => {
      const newPaths = [...uploadedImagePaths];
      newPaths.splice(index, 1);
      setUploadedImagePaths(newPaths);
  };


  // 4. Handle Form Submission
  const submitHandler = async (e) => {
    e.preventDefault();
    let finalImagePaths = [...uploadedImagePaths];

    // 🆕 Step 1: Upload new files if any exist
    if (selectedFiles.length > 0) {
      setIsUploading(true);
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      try {
        // Call the upload API endpoint first
        const uploadedPaths = await uploadImagesApi(formData).unwrap();
        // Combine newly uploaded paths with existing ones
        finalImagePaths = [...finalImagePaths, ...uploadedPaths];
      } catch (err) {
        setIsUploading(false);
        toast.error(err?.data?.message || 'Image upload failed');
        return; // Stop submission if upload fails
      }
      setIsUploading(false);
    }

    // Validation: Must have at least one image
    if (finalImagePaths.length === 0) {
      toast.error('Please upload at least one product image.');
      return;
    }

    // 🆕 Step 2: Submit product data with image paths
    try {
      const productData = {
        name, price, brand, category, countInStock, description,
        image: finalImagePaths[0], // First image is main thumbnail
        images: finalImagePaths.slice(1) // Rest are secondary images
      };

      if (isEditMode) {
        await updateProduct({ productId, ...productData }).unwrap();
        toast.success('Product updated successfully!');
      } else {
        await createProduct(productData).unwrap();
        toast.success('Product created successfully!');
      }
      navigate('/seller/products');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const isLoading = loadingCreate || loadingUpdate || isUploading;

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up pb-20">
      
      {/* Header (Same as before) */}
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
      </div>

      <form onSubmit={submitHandler} className="bg-[#1e293b] p-8 md:p-10 rounded-3xl border border-gray-700 shadow-xl space-y-8">
        
        {/* Basic Info Fields (Same as before) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ... (Name, Price, Stock, Brand, Category inputs remain the same) ... */}
            <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-400 mb-2">Product Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-green-500 transition-colors" placeholder="e.g., iPhone 15 Pro Max" />
            </div>
            <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Price (ETB)</label>
            <input type="number" required min="0" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-green-500 transition-colors" />
            </div>
            <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Stock Count</label>
            <input type="number" required min="0" value={countInStock} onChange={(e) => setCountInStock(Number(e.target.value))} className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-green-500 transition-colors" />
            </div>
            <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Brand</label>
            <input type="text" required value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-green-500 transition-colors" placeholder="e.g., Apple, Samsung" />
            </div>
            <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-green-500 transition-colors">
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Books">Books</option>
                <option value="Beauty">Beauty</option>
                <option value="Other">Other</option>
            </select>
            </div>
        </div>

        {/* 🆕 NEW IMAGE UPLOAD SECTION */}
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-4 flex items-center gap-2">
            <FaImage className="text-gray-500" /> Product Images (Max 6)
          </label>
          
          {/* Image Preview Grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-4">
            {/* 1. Show already uploaded images (Edit Mode) */}
            {uploadedImagePaths.map((path, index) => (
                 <div key={`uploaded-${index}`} className="relative group aspect-square bg-[#0f172a] rounded-xl border border-gray-700 overflow-hidden">
                 <img src={path} alt="Product" className="w-full h-full object-cover" />
                 {index === 0 && <span className="absolute bottom-0 left-0 right-0 bg-green-500/80 text-white text-xs font-bold text-center py-1">Main Image</span>}
                 <button type="button" onClick={() => removeUploadedImage(index)} className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <FaTimesCircle />
                 </button>
               </div>
            ))}

             {/* 2. Show locally selected previews */}
            {previewUrls.map((url, index) => (
              <div key={`preview-${index}`} className="relative group aspect-square bg-[#0f172a] rounded-xl border border-green-500/50 overflow-hidden">
                <img src={url} alt="Preview" className="w-full h-full object-cover opacity-80" />
                <button type="button" onClick={() => removeSelectedFile(index)} className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaTimesCircle />
                </button>
              </div>
            ))}

            {/* 3. Upload Button (if less than 6 images) */}
            {(uploadedImagePaths.length + previewUrls.length) < 6 && (
                 <label className="aspect-square bg-[#0f172a] hover:bg-gray-800 border-2 border-dashed border-gray-700 hover:border-green-500 text-gray-500 hover:text-green-500 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all">
                 <FaCloudUploadAlt className="text-3xl mb-2" />
                 <span className="text-xs font-bold">Add Image</span>
                 <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
               </label>
            )}
           
          </div>
          <p className="text-xs text-gray-500">
            The first image will be your main product thumbnail. You can upload up to 6 images in total.
          </p>
        </div>

        {/* Description Field (Same as before) */}
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2">Product Description</label>
          <textarea required rows="5" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-green-500 transition-colors resize-none" placeholder="Write a detailed description..."></textarea>
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