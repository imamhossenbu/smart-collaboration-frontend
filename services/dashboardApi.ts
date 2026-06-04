/* eslint-disable @typescript-eslint/no-explicit-any */
import { Project } from "@/types";
import { baseApi } from "./baseApi";


export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => "/projects",
      providesTags: ["Project"],
    }),
    getProjectById: builder.query<Project, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Project", id }],
    }),
    createProject: builder.mutation<Project, Partial<Project>>({
      query: (body) => ({ url: "/projects", method: "POST", body }),
      invalidatesTags: ["Project"],
    }),
    updateProject: builder.mutation<
      Project,
      { id: string; [key: string]: any }
    >({
      query: ({ id, ...patch }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Project", id },
        "Project",
      ],
    }),
    deleteProject: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/projects/${id}`, method: "DELETE" }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = dashboardApi;
