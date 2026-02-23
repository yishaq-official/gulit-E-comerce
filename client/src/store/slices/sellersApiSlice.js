import { apiSlice } from './apiSlice';

export const sellersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // 1. Seller Login
    sellerLogin: builder.mutation({
      query: (data) => ({
        url: '/api/sellers/login',
        method: 'POST',
        body: data,
      }),
    }),

    // 2. Seller Registration (KYC Uploads)
    // Note: Because we are sending files, the 'data' here will be a native FormData object,
    // so we don't wrap it in another object like { ...data }
    sellerRegister: builder.mutation({
      query: (formData) => ({
        url: '/api/sellers',
        method: 'POST',
        body: formData,
      }),
    }),

    // 3. Seller Logout (Backend clear cookie if you use HTTP-only cookies later)
    sellerLogoutApi: builder.mutation({
      query: () => ({
        url: '/api/sellers/logout',
        method: 'POST',
      }),
    }),

    getSellerWallet: builder.query({
      query: () => ({
        url: '/api/sellers/wallet',
      }),
      keepUnusedDataFor: 5,
    }),
    
  }),
});

export const { 
  useSellerLoginMutation, 
  useSellerRegisterMutation, 
  useSellerLogoutApiMutation,
  useGetSellerWalletQuery,
} = sellersApiSlice;
