/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<any[], void>({
      query: () => "/users",
      providesTags: ["Project"],
    }),
  }),
});

export const { useGetUsersQuery } = userApi;
