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
import SellerDashboardLayout from './components/seller/SellerDashboardLayout';

// Buyer Pages
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
import CategoryScreen from './pages/CategoryScreen';

// Seller Pages
import SellerLandingScreen from './pages/seller/SellerLandingScreen'; 
import SellerRegisterScreen from './pages/seller/SellerRegisterScreen';
import SellerLoginScreen from './pages/seller/SellerLoginScreen';
import SellerPendingScreen from './pages/seller/SellerPendingScreen';
import SellerDashboardScreen from './pages/seller/SellerDashboardScreen';
import SellerProductListScreen from './pages/seller/SellerProductListScreen';
import SellerProductEditScreen from './pages/seller/SellerProductEditScreen';
import SellerOrderListScreen from './pages/seller/SellerOrderListScreen';
import SellerOrderDetailsScreen from './pages/seller/SellerOrderDetailsScreen';
import SellerWalletScreen from './pages/seller/SellerWalletScreen';


const App = () => {
  return (
    <Router>
      <Routes>
        
        {/* =======================================
            🛍️ BUYER ROUTES (Uses standard Layout) 
            ======================================= */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomeScreen />} index />
          <Route path="/search/:keyword" element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/product/:id" element={<ProductDetailScreen />} />

          {/* 🔒 Protected Buyer Routes */}
          <Route path="" element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/order/:id" element={<OrderScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/category/:categoryName" element={<CategoryScreen />} />
          </Route>

          {/* 🛡️ Protected Admin Routes */}
          <Route path="" element={<AdminRoute />}>
            {/* Add user management and analytics here later */}
          </Route>
        </Route>


        {/* =======================================
            🏪 SELLER ROUTES (Uses SellerLayout) 
            ======================================= */}
        <Route element={<SellerLayout />}>
          <Route path="/sell" element={<SellerLandingScreen />} />
          <Route path="/seller/register" element={<SellerRegisterScreen />} />
          <Route path="/seller/login" element={<SellerLoginScreen />} />
          <Route path="/seller/pending" element={<SellerPendingScreen />} />
        </Route>

        {/* =======================================
            💼 APPROVED SELLER WORKSPACE ROUTES 
            ======================================= */}
        <Route element={<SellerDashboardLayout />}>
          <Route path="" element={<SellerRoute />}>
          <Route path="/seller/dashboard" element={<SellerDashboardScreen />} />
          <Route path="/seller/products" element={<SellerProductListScreen />} />
          <Route path="/seller/products/add" element={<SellerProductEditScreen />} />
          <Route path="/seller/products/:id/edit" element={<SellerProductEditScreen />} />
          <Route path="/seller/orders" element={<SellerOrderListScreen />} />
          <Route path="/seller/order/:id" element={<SellerOrderDetailsScreen />} />
          <Route path="/seller/wallet" element={<SellerWalletScreen />} />
          </Route>
        </Route>

      </Routes>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </Router>
  );
};

export default App;
