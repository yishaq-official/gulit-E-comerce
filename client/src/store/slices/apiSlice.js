import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const BASE_URL = 'http://localhost:3000'; // Your Backend URL

const baseQuery = fetchBaseQuery({ 
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState, endpoint }) => {
    // 1. Safely grab both tokens (added ? after auth to prevent crashes)
    const userToken = getState().auth?.userInfo?.token;
    const sellerToken = getState().sellerAuth?.sellerInfo?.token;
    const adminToken = getState().adminAuth?.adminInfo?.token;

    // 2. 🧠 SMART TOKEN ROUTING
    // By default, use the buyer token
    let token = userToken; 

    // If the endpoint we are calling has 'Seller' or 'upload' in its name, switch to the seller token
    const endpointLower = endpoint?.toLowerCase() || '';
    const isSellerAction = endpointLower.includes('seller') || endpointLower.includes('upload');
    const isAdminAction = endpointLower.includes('admin');
    
    if (isAdminAction && adminToken) {
      token = adminToken;
    } else if (isSellerAction && sellerToken) {
      token = sellerToken;
    } else if (sellerToken && !userToken) {
      // Fallback: If they are ONLY logged in as a seller, use that
      token = sellerToken; 
    } else if (adminToken && !userToken && !sellerToken) {
      token = adminToken;
    }

    // 3. If a token exists, attach it to the headers
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  // 👇 Added 'SellerProduct' so your inventory table auto-refreshes!
  tagTypes: ['Product', 'Order', 'User', 'seller', 'SellerProduct', 'AdminSeller', 'AdminUser', 'AdminOrder', 'AdminFinance'],
  endpoints: (builder) => ({}),
});
