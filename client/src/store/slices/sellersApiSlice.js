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
    sellerGoogleLogin: builder.mutation({
      query: (data) => ({
        url: '/api/sellers/google/login',
        method: 'POST',
        body: data,
      }),
    }),
    sellerGoogleIdentity: builder.mutation({
      query: (data) => ({
        url: '/api/sellers/google/identity',
        method: 'POST',
        body: data,
      }),
    }),
    sellerForgotPassword: builder.mutation({
      query: (data) => ({
        url: '/api/sellers/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    sellerResetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `/api/sellers/reset-password/${token}`,
        method: 'POST',
        body: { password },
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

    getSellerSettings: builder.query({
      query: () => ({
        url: '/api/sellers/settings',
      }),
      keepUnusedDataFor: 5,
    }),

    updateSellerSettings: builder.mutation({
      query: (data) => ({
        url: '/api/sellers/settings',
        method: 'PUT',
        body: data,
      }),
    }),
    
  }),
});

export const { 
  useSellerLoginMutation, 
  useSellerGoogleLoginMutation,
  useSellerGoogleIdentityMutation,
  useSellerForgotPasswordMutation,
  useSellerResetPasswordMutation,
  useSellerRegisterMutation, 
  useSellerLogoutApiMutation,
  useGetSellerWalletQuery,
  useGetSellerSettingsQuery,
  useUpdateSellerSettingsMutation,
} = sellersApiSlice;
