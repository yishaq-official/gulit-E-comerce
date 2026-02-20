import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Buyer Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoutes';

// Seller Components
import SellerLayout from './components/seller/SellerLayout'; // 👈 NEW
import SellerRoute from './components/SellerRoute';


// Buyer Pages (We will create these next)
import HomeScreen from './pages/HomeScreen';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import ProductDetailScreen from './pages/ProductDetailScreen';
import ProfileScreen from './pages/ProfileScreen';
import ShippingScreen from './pages/ShippingScreen';
import PaymentScreen from './pages/PaymentScreen';
import PlaceOrderScreen from './pages/PlaceOrderScreen';
import OrderScreen from './pages/OrderScreen';
import CartScreen from './pages/CartScreen';

// Seller Pages
import SellerLandingScreen from './pages/seller/SellerLandingScreen';


const App = () => {
  return (
    <Router>
      
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout/>}>
            <Route path="/" element={<HomeScreen />} index />
            <Route path="/search/:keyword" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />

            {/* 🔒 Protected Buyer Routes */}
            <Route path="" element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/order/:id" element={<OrderScreen />} />
            <Route path="/cart" element={<CartScreen />} />
              {/* Add profile, shipping, orders here later */}
            </Route>

            {/* 🛡️ Protected Admin Routes */}
            <Route path="" element={<AdminRoute />}>
              {/* Add user management and analytics here later */}
            </Route>
            <Route path="/product/:id" element={<ProductDetailScreen />} />
          </Route>

            {/* 🏪 Protected Seller Routes */}
            
          <Route path="" element={<SellerLayout />}>
              <Route path="/sell" element={<SellerLandingScreen />} />
          </Route>

          {/* 🔒 Protected Seller Routes (Dashboard, Products, etc.) */}
          <Route path="" element={<SellerRoute />}>
            {/* Add product management here later */}
          </Route>
        </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
};

export default App;