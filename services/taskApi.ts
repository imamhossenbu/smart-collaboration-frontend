import { baseApi } from "./baseApi";

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: (params) => ({
        url: "/tasks",
        method: "GET",
        params,
      }),
      providesTags: ["Task"],
    }),
    updateTaskStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/tasks/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Task", "Dashboard"],
    }),
  }),
});

export const { useGetTasksQuery, useUpdateTaskStatusMutation } = taskApi;
