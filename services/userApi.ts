// services/userApi.ts
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<any[], void>({
      query: () => "/users",
    }),
    updateUserRole: builder.mutation({
      // নিশ্চিত করুন নাম একই আছে
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
    }),
  }),
});

// এই এক্সপোর্ট লাইনটি ঠিক আছে কি না দেখুন:
export const { useGetAllUsersQuery, useUpdateUserRoleMutation } = userApi;
