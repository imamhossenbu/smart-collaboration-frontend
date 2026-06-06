import { baseApi } from "./baseApi";

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // সব টাস্ক আনা
    getTasks: builder.query({
      query: (params) => ({
        url: "/tasks",
        method: "GET",
        params,
      }),
      providesTags: ["Task"],
    }),
    // নতুন টাস্ক তৈরি
    createTask: builder.mutation({
      query: (body) => ({
        url: "/tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Task", "Dashboard"],
    }),
    // টাস্কের স্ট্যাটাস আপডেট
    updateTaskStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/tasks/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Task", "Dashboard"],
    }),

    updateProgress: builder.mutation({
      query: ({ id, progress }) => ({
        url: `/tasks/${id}/progress`,
        method: "PATCH",
        body: { progress },
      }),
      invalidatesTags: ["Task", "Dashboard"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useUpdateProgressMutation,
} = taskApi;
