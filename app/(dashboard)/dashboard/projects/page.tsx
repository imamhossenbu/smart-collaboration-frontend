"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Loader2, FolderOpen, AlertCircle } from "lucide-react";
import ProjectCard from "@/components/projects/ProjectCard";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
} from "@/services/projectApi"; // নিশ্চিত করুন এটি আপনার সঠিক পাথ

export default function ProjectsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // RTK Query Hooks
  const { data: projects, isLoading, error, refetch } = useGetProjectsQuery();
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  useEffect(() => {
    const role = localStorage.getItem("role");
    // চেক করুন ইউজার কি ADMIN নাকি PROJECT_MANAGER
    if (role !== "PROJECT_MANAGER" && role !== "ADMIN") {
      toast.error("Access denied. Admin/Managers only.");
      router.push("/dashboard");
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const handleCreateProjectSubmit = async (formData: any) => {
    const toastId = toast.loading("Deploying...");
    try {
      await createProject({
        ...formData,
        budget: Number(formData.budget),
        deadline: new Date(formData.deadline).toISOString(),
      }).unwrap();
      toast.success("Project created!", { id: toastId });
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create", { id: toastId });
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteProject(id).unwrap();
      toast.success("Project deleted.");
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Project Matrix
          </h1>
          <p className="text-slate-500">Manage all infrastructure projects.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-semibold hover:bg-slate-800"
        >
          <Plus className="w-4 h-4" /> Create New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects?.map((project: any) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={() => handleDeleteProject(project.id)}
          />
        ))}
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProjectSubmit}
        isSubmitting={isCreating}
      />
    </div>
  );
}
