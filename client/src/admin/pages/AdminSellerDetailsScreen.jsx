import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft, FaStore } from 'react-icons/fa';

const AdminSellerDetailsScreen = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-[#070c18] text-white px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-5xl mx-auto bg-[#0f172a] border border-white/10 rounded-2xl p-8">
        <Link to="/admin/sellers" className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 font-bold mb-5">
          <FaArrowLeft /> Back to Seller List
        </Link>
        <h1 className="text-3xl font-black flex items-center gap-3">
          <FaStore className="text-cyan-300" /> Seller Detail Workspace
        </h1>
        <p className="text-gray-400 mt-2">
          Seller ID: <span className="font-mono text-gray-300">{id}</span>
        </p>
        <p className="text-gray-400 mt-4">
          Phase 2 will populate full seller overview, transactions, products, orders, and compliance timeline here.
        </p>
      </div>
    </div>
  );
};

export default AdminSellerDetailsScreen;
