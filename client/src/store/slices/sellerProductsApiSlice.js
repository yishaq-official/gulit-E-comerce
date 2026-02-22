import { apiSlice } from './apiSlice';

const SELLER_PRODUCTS_URL = '/api/sellers/products';

export const sellerProductsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // 1. Fetch all products owned by the logged-in seller
    getSellerProducts: builder.query({
      query: () => ({
        url: SELLER_PRODUCTS_URL,
      }),
      // providesTags tells Redux to cache this specific list of products
      providesTags: ['SellerProduct'], 
      keepUnusedDataFor: 5,
    }),

    // 2. Create a new product
    createSellerProduct: builder.mutation({
      query: (data) => ({
        url: SELLER_PRODUCTS_URL,
        method: 'POST',
        body: data,
      }),
      // invalidatesTags tells Redux: "Hey, the data changed! Throw away the old cache and fetch the new list automatically!"
      invalidatesTags: ['SellerProduct'], 
    }),

    // 3. Update an existing product
    updateSellerProduct: builder.mutation({
      query: (data) => ({
        url: `${SELLER_PRODUCTS_URL}/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['SellerProduct'],
    }),

    // 4. Delete a product
    deleteSellerProduct: builder.mutation({
      query: (productId) => ({
        url: `${SELLER_PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SellerProduct'],
    }),

  }),
});

export const {
  useGetSellerProductsQuery,
  useCreateSellerProductMutation,
  useUpdateSellerProductMutation,
  useDeleteSellerProductMutation,
} = sellerProductsApiSlice;