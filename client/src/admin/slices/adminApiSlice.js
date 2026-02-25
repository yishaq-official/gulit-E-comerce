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
    adminGetSellerDetails: builder.query({
      query: (sellerId) => ({
        url: `/api/admin/sellers/${sellerId}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['AdminSeller'],
    }),
    adminGetSellerTransactions: builder.query({
      query: ({ sellerId, page = 1, limit = 10 } = {}) => ({
        url: `/api/admin/sellers/${sellerId}/transactions?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['AdminSeller'],
    }),
    adminGetSellerProducts: builder.query({
      query: ({ sellerId, page = 1, limit = 8, keyword = '', stock = 'all' } = {}) => ({
        url: `/api/admin/sellers/${sellerId}/products?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(
          limit
        )}&keyword=${encodeURIComponent(keyword)}&stock=${encodeURIComponent(stock)}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['AdminSeller'],
    }),
    adminGetSellerOrders: builder.query({
      query: ({ sellerId, page = 1, limit = 10, keyword = '', status = 'all', risk = 'all' } = {}) => ({
        url: `/api/admin/sellers/${sellerId}/orders?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(
          limit
        )}&keyword=${encodeURIComponent(keyword)}&status=${encodeURIComponent(status)}&risk=${encodeURIComponent(risk)}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['AdminSeller'],
    }),
    adminGetSellerActivity: builder.query({
      query: ({
        sellerId,
        page = 1,
        limit = 10,
        action = 'all',
        severity = 'all',
        dateFrom = '',
        dateTo = '',
      } = {}) => ({
        url: `/api/admin/sellers/${sellerId}/activity?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(
          limit
        )}&action=${encodeURIComponent(action)}&severity=${encodeURIComponent(severity)}&dateFrom=${encodeURIComponent(
          dateFrom
        )}&dateTo=${encodeURIComponent(dateTo)}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['AdminSeller'],
    }),
    adminAddSellerNote: builder.mutation({
      query: ({ sellerId, note, severity }) => ({
        url: `/api/admin/sellers/${sellerId}/notes`,
        method: 'POST',
        body: { note, severity },
      }),
      invalidatesTags: ['AdminSeller'],
    }),
    adminGetUsers: builder.query({
      query: ({
        keyword = '',
        role = 'all',
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10,
      } = {}) => ({
        url: `/api/admin/users?keyword=${encodeURIComponent(keyword)}&role=${encodeURIComponent(role)}&sortBy=${encodeURIComponent(
          sortBy
        )}&sortOrder=${encodeURIComponent(sortOrder)}&page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['AdminUser'],
    }),
    adminUpdateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/api/admin/users/${userId}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['AdminUser'],
    }),
    adminGetOrders: builder.query({
      query: ({
        page = 1,
        limit = 12,
        keyword = '',
        payment = 'all',
        delivery = 'all',
        dispute = 'all',
        risk = 'all',
      } = {}) => ({
        url: `/api/admin/orders?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}&keyword=${encodeURIComponent(
          keyword
        )}&payment=${encodeURIComponent(payment)}&delivery=${encodeURIComponent(delivery)}&dispute=${encodeURIComponent(
          dispute
        )}&risk=${encodeURIComponent(risk)}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['AdminOrder'],
    }),
    adminUpdateOrderDispute: builder.mutation({
      query: ({ orderId, disputeStatus, disputeNote }) => ({
        url: `/api/admin/orders/${orderId}/dispute`,
        method: 'PATCH',
        body: { disputeStatus, disputeNote },
      }),
      invalidatesTags: ['AdminOrder'],
    }),
    adminGetFinanceOverview: builder.query({
      query: ({ page = 1, limit = 12, keyword = '' } = {}) => ({
        url: `/api/admin/finance?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}&keyword=${encodeURIComponent(
          keyword
        )}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['AdminFinance'],
    }),
    adminGetSupportQueue: builder.query({
      query: ({ page = 1, limit = 12, keyword = '', source = 'all', status = 'all' } = {}) => ({
        url: `/api/admin/support?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}&keyword=${encodeURIComponent(
          keyword
        )}&source=${encodeURIComponent(source)}&status=${encodeURIComponent(status)}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['AdminSupport'],
    }),
    adminUpdateSupportCase: builder.mutation({
      query: ({ source, id, action, note = '' }) => ({
        url: `/api/admin/support/cases/${source}/${id}`,
        method: 'PATCH',
        body: { action, note },
      }),
      invalidatesTags: ['AdminSupport', 'AdminOrder', 'AdminSeller'],
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
  useAdminGetSellerDetailsQuery,
  useAdminGetSellerTransactionsQuery,
  useAdminGetSellerProductsQuery,
  useAdminGetSellerOrdersQuery,
  useAdminGetSellerActivityQuery,
  useAdminAddSellerNoteMutation,
  useAdminGetUsersQuery,
  useAdminUpdateUserRoleMutation,
  useAdminGetOrdersQuery,
  useAdminUpdateOrderDisputeMutation,
  useAdminGetFinanceOverviewQuery,
  useAdminGetSupportQueueQuery,
  useAdminUpdateSupportCaseMutation,
} = adminApiSlice;
