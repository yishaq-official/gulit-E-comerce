import { apiSlice } from './apiSlice';
import { BASE_URL } from './apiSlice'; 

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    createOrder: builder.mutation({
      query: (order) => ({
        url: '/api/orders',
        method: 'POST',
        body: { ...order },
      }),
    // Hook to fetch my orders
    getMyOrders: builder.query({
      query: () => ({
        url: '/api/orders/myorders',
      }),
      keepUnusedDataFor: 5,
    }),
  }),
}),
});

export const { useCreateOrderMutation, useGetMyOrdersQuery } = ordersApiSlice;