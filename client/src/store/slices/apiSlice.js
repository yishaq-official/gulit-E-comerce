import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const BASE_URL = 'http://localhost:3000'; // Your Backend URL

const baseQuery = fetchBaseQuery({ 
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // 1. Get the 'userInfo' from your Redux auth state
    const token = getState().auth.userInfo?.token;

    // 2. If a token exists, attach it to the headers
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User'], // For automatic re-fetching
  endpoints: (builder) => ({}),
});

