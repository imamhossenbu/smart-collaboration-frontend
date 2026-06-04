"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Loader2, FolderOpen, AlertCircle } from "lucide-react";
import ProjectCard from "@/components/projects/ProjectCard";
import CreateProjectModal from "@/components/projects/CreateProjectModal";

// 🔌 RTK Query থেকে ডিলিট মিউটেশন হুকসহ ইমপোর্ট
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  // যদি আপনার dashboardApi-তে এডিট/ডিলিট এন্ডপয়েন্ট থাকে, সেগুলোকে এখানে ইমপোর্ট করুন:
  // useDeleteProjectMutation
} from "@/services/dashboardApi";

export default function ProjectsPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: projects, isLoading, error, refetch } = useGetProjectsQuery();
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();

  useEffect(() => {
    setIsMounted(true);
    const role = localStorage.getItem("role");
    if (role !== "PROJECT_MANAGER") {
      toast.error("Access denied. Project Managers only.");
      router.push("/dashboard");
    }
  }, [router]);

  if (!isMounted || isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-brand-royal-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h3 className="text-lg font-bold text-brand-dark-navy">
          Failed to load projects
        </h3>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-brand-royal-blue text-white rounded-xl text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ➕ প্রজেক্ট ক্রিয়েট হ্যান্ডেলার
  const handleCreateProjectSubmit = async (formData: any) => {
    const toastId = toast.loading("Deploying new project cluster...");
    try {
      // 🎯 এখানে দেখুন milestones গুলোকেও spread করে দেওয়া হয়েছে
      const formattedData = {
        ...formData,
        budget: formData.budget ? Number(formData.budget) : 0,
        deadline: formData.deadline
          ? new Date(formData.deadline).toISOString()
          : undefined,
        // এখানে milestones গুলো formData থেকে অটোমেটিক্যালি চলে আসবে
        // কারণ formData তে অলরেডি milestones অ্যারেটি আছে।
      };

      console.log("Sending data to backend:", formattedData); 

      await createProject(formattedData).unwrap();
      toast.success("Project launched successfully!", { id: toastId });
      setIsModalOpen(false);
    } catch (err: any) {
      let errorMessage = "Failed to create project system node.";
      if (err?.data?.errors && Array.isArray(err.data.errors)) {
        errorMessage = err.data.errors.join(" | ");
      } else if (err?.data?.message) {
        errorMessage = err.data.message;
      }
      toast.error(errorMessage, { id: toastId });
    }
  };

  // 🗑️ 🆕 প্রজেক্ট ডিলিট হ্যান্ডেলার (ProjectCard থেকে কল করা যাবে)
  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const toastId = toast.loading("Removing project asset...");
    try {
      // await deleteProject(id).unwrap(); // 🔌 আপনার ডিলিট এপিআই ট্রিগার করুন
      toast.success("Project successfully wiped.", { id: toastId });
    } catch (err) {
      toast.error("Failed to delete the project blueprint.", { id: toastId });
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-dark-navy tracking-tight">
            Project Matrix
          </h1>
          <p className="text-sm text-brand-steel-blue mt-1">
            Monitor infrastructure pipelines and parameters.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-brand-royal-blue text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-brand-dark-navy transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create New Project
        </button>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={() => handleDeleteProject(project.id)} // 👈 ডিলিট অ্যাকশন পাস করা হলো
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-2xl p-16 text-center">
          <FolderOpen className="w-8 h-8 text-slate-400 mb-4" />
          <h3 className="text-lg font-bold text-brand-dark-navy">
            No projects discovered
          </h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-brand-royal-blue text-white px-4 py-2 rounded-xl text-sm"
          >
            Build First Project
          </button>
        </div>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProjectSubmit}
        isSubmitting={isCreating}
      />
    </div>
  );
}
