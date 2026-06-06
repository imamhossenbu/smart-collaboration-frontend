// services/adminApi.ts
import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query({
      query: () => "/admin/stats",
      providesTags: ["Dashboard"],
    }),
    getAllUsers: builder.query({
      query: () => "/admin/users",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetStatsQuery, useGetAllUsersQuery } = adminApi;
