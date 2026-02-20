import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';


const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* The Tibeb strip below the navbar */}
      <div className="h-1.5 bg-tibeb-pattern bg-repeat-x w-full"></div>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Another Tibeb strip above the footer */}
      <div className="h-1.5 bg-tibeb-pattern bg-repeat-x w-full"></div>
      <Footer />
    </div>
  );
};

export default Layout;