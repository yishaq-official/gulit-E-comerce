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
  }),
});

export const {
  useAdminLoginMutation,
  useAdminForgotPasswordMutation,
  useAdminResetPasswordMutation,
  useAdminGoogleLoginMutation,
  useAdminMeQuery,
  useAdminStatsQuery,
} = adminApiSlice;
