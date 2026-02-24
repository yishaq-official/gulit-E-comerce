import { apiSlice } from './apiSlice';

const USERS_URL = '/api/users'; // Helper constant

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔐 Login
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        body: data,
      }),
    }),
    // 📝 Register (Default is Buyer)
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: 'POST',
        body: data,
      }),
    }),
    googleAuth: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/google`,
        method: 'POST',
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/forgot-password`,
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `${USERS_URL}/reset-password/${token}`,
        method: 'POST',
        body: { password },
      }),
    }),
    // 🚪 Logout (Server-side clear cookie if needed, but mostly client-side)
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),

    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleAuthMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useProfileMutation,
} = usersApiSlice;
