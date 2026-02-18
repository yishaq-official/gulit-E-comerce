import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useCreateOrderMutation } from '../store/slices/ordersApiSlice';
import { clearCartItems } from '../store/slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaCreditCard, FaShoppingBag } from 'react-icons/fa';
import Loader from '../components/Loader';
import { BASE_URL } from '../store/slices/apiSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`); // We will build this page next!
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <CheckoutSteps step1 step2 step3 step4 />
      
      <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT COLUMN: DETAILS */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Shipping Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-green-500"/> Shipping
             </h2>
             <p className="text-gray-600">
               <strong>Address: </strong>
               {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.country}
             </p>
             <p className="text-gray-600 mt-1">
                <strong>Phone: </strong> {cart.shippingAddress.phoneNumber}
            </p>
          </div>

          {/* Payment Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCreditCard className="text-green-500"/> Payment Method
             </h2>
             <p className="text-gray-600">
               <strong>Method: </strong>
               {cart.paymentMethod}
             </p>
          </div>

          {/* Order Items */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaShoppingBag className="text-green-500"/> Order Items
             </h2>
             {cart.cartItems.length === 0 ? (
               <div className="text-red-500">Your cart is empty</div>
             ) : (
               <div className="space-y-4">
                 {cart.cartItems.map((item, index) => (
                   <div key={index} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0">
                      <div className="flex items-center gap-4">
                         <img 
                           src={`${BASE_URL}${item.image}`} 
                           alt={item.name} 
                           className="w-16 h-16 object-cover rounded-lg" 
                         />
                         <Link to={`/product/${item._id}`} className="font-bold text-gray-700 hover:text-green-500">
                           {item.name}
                         </Link>
                      </div>
                      <div className="text-sm font-mono text-gray-500">
                         {item.qty} x {item.price} = <span className="font-bold text-gray-800">{(item.qty * item.price).toFixed(2)}</span>
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>

        {/* RIGHT COLUMN: SUMMARY */}
        <div className="md:col-span-1">
           <div className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-200 border border-gray-100 sticky top-24">
              <h2 className="text-2xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm">
                 <div className="flex justify-between">
                    <span className="text-gray-600">Items</span>
                    <span className="font-bold">{cart.itemsPrice} ETB</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-bold">{cart.shippingPrice} ETB</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-gray-600">Tax (15%)</span>
                    <span className="font-bold">{cart.taxPrice} ETB</span>
                 </div>
                 <div className="border-t border-gray-100 pt-3 flex justify-between text-lg">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-black text-green-600">{cart.totalPrice} ETB</span>
                 </div>
              </div>

              {error && <div className="mt-4 bg-red-50 text-red-500 p-3 rounded-lg text-xs">{error?.data?.message || error.error}</div>}

              <button 
                type="button"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-green-200 mt-6 transition-all disabled:bg-gray-300"
                disabled={cart.cartItems === 0 || isLoading}
                onClick={placeOrderHandler}
              >
                 {isLoading ? <Loader /> : 'Place Order'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;