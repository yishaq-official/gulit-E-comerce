import React from 'react';
import { Outlet } from 'react-router-dom';
import SellerHeader from './SellerHeader';
import SellerFooter from './SellerFooter';

const SellerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-gray-300 font-sans w-full">
      <SellerHeader />
      <main className="flex-grow pt-20"> {/* pt-20 pushes content below the fixed header */}
        <Outlet />
      </main>
      <SellerFooter />
    </div>
  );
};

export default SellerLayout;