import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoutes';
import SellerRoute from './components/SellerRoute';

// Pages (We will create these next)
import HomeScreen from './pages/HomeScreen';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeScreen />} index />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />

          {/* 🔒 Protected Buyer Routes */}
          <Route path="" element={<PrivateRoute />}>
            {/* Add profile, shipping, orders here later */}
          </Route>

          {/* 🏪 Protected Seller Routes */}
          <Route path="" element={<SellerRoute />}>
            {/* Add product management here later */}
          </Route>

          {/* 🛡️ Protected Admin Routes */}
          <Route path="" element={<AdminRoute />}>
            {/* Add user management and analytics here later */}
          </Route>
        </Routes>
      </Layout>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
};

export default App;