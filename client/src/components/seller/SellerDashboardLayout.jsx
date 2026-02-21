import React from 'react';
import { Outlet } from 'react-router-dom';
import SellerDashboardHeader from './SellerDashboardHeader';
import SellerFooter from './SellerFooter';

const SellerDashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-gray-300 font-sans w-full">
      <SellerDashboardHeader />
      
      {/* pt-28 gives breathing room below the fixed header for the workspace */}
      <main className="flex-grow pt-28 pb-12 px-6 container mx-auto max-w-7xl"> 
        <Outlet />
      </main>
      
      <SellerFooter />
    </div>
  );
};

export default SellerDashboardLayout;