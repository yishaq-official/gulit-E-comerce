import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // This hook will be used to fetch all products
    getProducts: builder.query({
      query: ({ keyword }) => ({
        url: '/api/products',
        params: { keyword },
      }),
      keepUnusedDataFor: 5, // Caches data for 5 seconds
      providesTags: ['Product'],
    }),
    // Hook for single product details
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `/api/products/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

// RTK Query automatically generates these hooks based on the names above
export const { useGetProductsQuery, useGetProductDetailsQuery } = productsApiSlice;