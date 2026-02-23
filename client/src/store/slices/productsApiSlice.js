import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // This hook will be used to fetch all products
    getProducts: builder.query({
      query: ({ keyword, category }) => ({
        url: '/api/products',
        params: { keyword, category },
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
    createReview: builder.mutation({
      query: (data) => ({
        url: `/api/products/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'], // Refresh product data after review
    }),
  }),
});

// RTK Query automatically generates these hooks based on the names above
export const { useGetProductsQuery, useGetProductDetailsQuery, useCreateReviewMutation } = productsApiSlice;