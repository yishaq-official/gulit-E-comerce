import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SellerRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // 👇 Check if they are logged in AND their role is 'seller'
  return userInfo && userInfo.role === 'seller' ? (
    <Outlet /> 
  ) : (
    <Navigate to="/login" replace />
  );
};

export default SellerRoute;