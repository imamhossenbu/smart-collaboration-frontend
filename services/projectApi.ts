/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
import type { Project } from "../types";

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // সব প্রজেক্ট আনা
    getProjects: builder.query<Project[], void>({
      query: () => "/projects",
      providesTags: ["Project"],
    }),

    // নির্দিষ্ট প্রজেক্টের মেম্বারসহ ডিটেইলস আনা
    getProjectById: builder.query<any, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: "Project", id }],
    }),

    // নতুন প্রজেক্ট তৈরি
    createProject: builder.mutation<Project, Partial<Project>>({
      query: (newProject) => ({
        url: "/projects",
        method: "POST",
        body: newProject,
      }),
      invalidatesTags: ["Project", "Dashboard"],
    }),

    // প্রজেক্ট ডিলিট করা
    deleteProject: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project", "Dashboard"],
    }),

    // মেম্বার যোগ করা
    addMember: builder.mutation<
      { message: string },
      { projectId: string; userId: string }
    >({
      query: ({ projectId, userId }) => ({
        url: `/projects/${projectId}/members`,
        method: "POST",
        body: { userId },
      }),
      // মেম্বার যোগ করার পর নির্দিষ্ট প্রজেক্টের ট্যাগ ইনভ্যালিডেট হবে, ফলে UI অটো আপডেট হবে
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Project", id: projectId },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useAddMemberMutation,
} = projectApi;
