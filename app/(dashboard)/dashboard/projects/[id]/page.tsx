"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  BarChart3,
  RefreshCw,
  Edit3,
  CheckCircle2,
  Clock,
} from "lucide-react";

import {
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
} from "@/services/dashboardApi";
import MilestoneList from "@/components/projects/MilestoneList";
import EditProjectModal from "@/components/projects/EditProjectModal";

export default function ProjectDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: project, isLoading, refetch } = useGetProjectByIdQuery(id);
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  const handleUpdate = async (data: any) => {
    // নিশ্চিত করুন যে ডেডলাইনটি ISO ফরম্যাটে কনভার্ট হচ্ছে
    const payload = {
      ...data,
      budget: Number(data.budget),
      // এই লাইনটিই আসল সমাধান:
      deadline: new Date(data.deadline).toISOString(),
    };

    try {
      await updateProject({ id, ...payload }).unwrap();
      toast.success("Project updated successfully!");
      setIsEditModalOpen(false);
      refetch();
    } catch (err: any) {
      console.error("Update failed:", err);
      toast.error(err?.data?.message || "Failed to update project.");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <RefreshCw className="w-10 h-10 animate-spin text-brand-royal-blue" />
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <Toaster />

      {/* Navigation */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 hover:text-brand-royal-blue transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />{" "}
        <span className="text-sm font-semibold">Back to Matrix</span>
      </button>

      {/* Hero Section */}
      <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-100">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
              {project?.status || "ACTIVE"}
            </span>
            <h1 className="text-4xl font-extrabold text-slate-900">
              {project?.name}
            </h1>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"
          >
            <Edit3 className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <p className="mt-4 text-slate-600 max-w-3xl leading-relaxed">
          {project?.description}
        </p>

        {/* KPI Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-slate-50">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-500">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Budget
              </p>
              <p className="font-bold text-slate-900 text-sm">
                ${project?.budget?.toLocaleString() || "0"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-500">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Deadline
              </p>
              <p className="font-bold text-slate-900 text-sm">
                {project?.deadline
                  ? new Date(project.deadline).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-500">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Team Size
              </p>
              <p className="font-bold text-slate-900 text-sm">
                {project?.members?.length || 0} Members
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Total Tasks
              </p>
              <p className="font-bold text-slate-900 text-sm">
                {project?.tasks?.length || 0} Tasks
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Milestones */}
          <div className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-100">
            <h3 className="font-bold text-lg mb-6 text-slate-900">
              Strategic Milestones
            </h3>
            <MilestoneList milestones={project?.milestones || []} />
          </div>

          {/* Tasks */}
          <div className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-100">
            <h3 className="font-bold text-lg mb-6 text-slate-900">
              Current Tasks
            </h3>
            <div className="space-y-4">
              {project?.tasks?.map((task: any) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl"
                >
                  <div className="flex items-center gap-3">
                    {task.status === "COMPLETED" ? (
                      <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                    ) : (
                      <Clock className="text-amber-500 w-5 h-5" />
                    )}
                    <span className="font-semibold text-sm text-slate-700">
                      {task.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-white px-3 py-1 rounded-full text-slate-500">
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Team */}
        <div className="bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-300">
          <h3 className="font-bold text-lg text-white mb-6">Team Members</h3>
          <div className="space-y-4">
            {project?.members?.map((m: any) => (
              <div
                key={m.userId}
                className="flex items-center gap-3 bg-slate-800 p-3 rounded-2xl"
              >
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-white text-xs">
                  {m.user.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{m.user.name}</p>
                  <p className="text-[10px] text-slate-400">{m.user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
        onUpdate={handleUpdate}
        isSubmitting={isUpdating}
      />
    </div>
  );
}
