import { apiSlice } from '../../store/slices/apiSlice';

const ADMIN_AUTH_URL = '/api/admin/auth';

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_AUTH_URL}/login`,
        method: 'POST',
        body: data,
      }),
    }),
    adminForgotPassword: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_AUTH_URL}/forgot-password`,
        method: 'POST',
        body: data,
      }),
    }),
    adminResetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `${ADMIN_AUTH_URL}/reset-password/${token}`,
        method: 'POST',
        body: { password },
      }),
    }),
    adminGoogleLogin: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_AUTH_URL}/google`,
        method: 'POST',
        body: data,
      }),
    }),
    adminMe: builder.query({
      query: () => ({
        url: `${ADMIN_AUTH_URL}/me`,
      }),
      keepUnusedDataFor: 5,
    }),
    adminStats: builder.query({
      query: () => ({
        url: `${ADMIN_AUTH_URL}/stats`,
      }),
      keepUnusedDataFor: 10,
    }),
    adminGetSellers: builder.query({
      query: ({
        status = 'all',
        keyword = '',
        category = 'all',
        country = 'all',
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10,
      } = {}) => ({
        url: `/api/admin/sellers?status=${encodeURIComponent(status)}&keyword=${encodeURIComponent(keyword)}&category=${encodeURIComponent(
          category
        )}&country=${encodeURIComponent(country)}&sortBy=${encodeURIComponent(sortBy)}&sortOrder=${encodeURIComponent(
          sortOrder
        )}&page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['AdminSeller'],
    }),
    adminUpdateSellerStatus: builder.mutation({
      query: ({ sellerId, ...body }) => ({
        url: `/api/admin/sellers/${sellerId}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['AdminSeller', 'Order'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAdminLoginMutation,
  useAdminForgotPasswordMutation,
  useAdminResetPasswordMutation,
  useAdminGoogleLoginMutation,
  useAdminMeQuery,
  useAdminStatsQuery,
  useAdminGetSellersQuery,
  useAdminUpdateSellerStatusMutation,
} = adminApiSlice;
