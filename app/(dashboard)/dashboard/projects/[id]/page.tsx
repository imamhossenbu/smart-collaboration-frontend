/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  BarChart3,
  RefreshCw,
  Edit3,
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
    try {
      await updateProject({ id, ...data }).unwrap();
      toast.success("Project updated successfully!");
      setIsEditModalOpen(false);
      refetch();
    } catch {
      toast.error("Failed to update project.");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <RefreshCw className="w-10 h-10 animate-spin text-brand-royal-blue" />
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Navigation */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-brand-royal-blue transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-semibold">Back to Matrix</span>
      </button>

      {/* Hero Section */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
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

        {/* Dynamic KPI Row */}
        <div className="grid grid-cols-4 gap-6 mt-8 pt-8 border-t border-slate-50">
          {[
            {
              label: "Budget",
              value: `$${project?.budget?.toLocaleString() || "0"}`,
              icon: DollarSign,
              color: "text-blue-500",
            },
            {
              label: "Deadline",
              value: project?.deadline
                ? new Date(project.deadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A",
              icon: Calendar,
              color: "text-amber-500",
            },
            {
              label: "Team Size",
              value: `${(project as any)?.teamSize || 0} Members`,
              icon: Users,
              color: "text-purple-500",
            },
            {
              label: "Completion",
              value: `${(project as any)?.progress || 0}%`,
              icon: BarChart3,
              color: "text-emerald-500",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl bg-slate-50 ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {item.label}
                </p>
                <p className="font-bold text-slate-900">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <h3 className="font-bold text-lg mb-6 text-slate-900">
            Strategic Milestones
          </h3>
          <MilestoneList milestones={project?.milestones || []} />
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg mb-2">Manager Controls</h3>
            <p className="text-slate-400 text-sm mb-6">
              Modify project constraints or archive this asset.
            </p>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all"
          >
            Update Baseline
          </button>
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
