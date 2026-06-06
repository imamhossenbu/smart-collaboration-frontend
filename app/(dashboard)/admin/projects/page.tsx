"use client";

import { useState } from "react";
import { Loader2, Trash2, Eye, Pencil, Briefcase, Plus } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import ProjectDetailsModal from "@/components/admin/ProjectDetailsModal";
import EditProjectModal from "@/components/admin/EditProjectModal";

import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
  useCreateProjectMutation,
} from "@/services/dashboardApi";
import CreateProjectModal from "@/components/projects/CreateProjectModal";

export default function AdminProjectsPage() {
  const { data: projects, isLoading, refetch } = useGetProjectsQuery();
  const [deleteProject] = useDeleteProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();

  // মোডাল স্টেট
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // ডিলিট হ্যান্ডলার (SweetAlert2)
  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You won't be able to revert the project: "${name}"!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
      background: "#ffffff",
      color: "#0f172a",
      customClass: { popup: "rounded-3xl" },
    });

    if (result.isConfirmed) {
      try {
        await deleteProject(id).unwrap();
        toast.success("Project permanently removed.");
        refetch();
      } catch (err) {
        toast.error("Failed to delete project.");
      }
    }
  };

  // আপডেট হ্যান্ডলার
  const handleUpdate = async (id: string, data: any) => {
    try {
      await updateProject({ id, ...data }).unwrap();
      toast.success("Project updated successfully!");
      refetch();
    } catch (err) {
      toast.error("Update failed.");
    }
  };

  // ক্রিয়েট হ্যান্ডলার
  const handleCreate = async (data: any) => {
    try {
      await createProject({
        ...data,
        deadline: new Date(data.deadline).toISOString(),
      }).unwrap();
      toast.success("Project created successfully!");
      setIsCreateOpen(false);
      refetch();
    } catch (err) {
      toast.error("Failed to create project.");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
      </div>
    );

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Project Command Center
          </h1>
          <p className="text-slate-500">
            Manage, monitor, and oversee all system projects.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project: any) => (
          <div
            key={project.id}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                <Briefcase size={24} />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedProject(project);
                    setIsViewOpen(true);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => {
                    setSelectedProject(project);
                    setIsEditOpen(true);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(project.id, project.name)}
                  className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {project.name}
            </h3>
            <p className="text-sm text-slate-500 mb-4 truncate">
              {project.description || "No description provided."}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
                {project.status}
              </span>
              <span className="text-sm font-semibold text-slate-900">
                ${project.budget?.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        isSubmitting={isCreating}
      />

      {selectedProject && (
        <>
          <ProjectDetailsModal
            isOpen={isViewOpen}
            onClose={() => setIsViewOpen(false)}
            project={selectedProject}
          />
          <EditProjectModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            project={selectedProject}
            onUpdate={handleUpdate}
            isSubmitting={isUpdating}
          />
        </>
      )}
    </div>
  );
}