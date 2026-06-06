/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
} from "@/services/projectApi";
import { useCreateTaskMutation } from "@/services/taskApi";
import { Loader2, X } from "lucide-react";

export default function CreateTaskModal({ isOpen, onClose }: any) {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const { data: projects } = useGetProjectsQuery();

  const [form, setForm] = useState({
    title: "",
    projectId: "",
    milestoneId: "",
    assignedToId: "",
    dueDate: "",
    priority: "MEDIUM",
  });

  const { data: fullProjectData } = useGetProjectByIdQuery(form.projectId, {
    skip: !form.projectId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { ...form };
    if (!payload.milestoneId) delete payload.milestoneId;
    if (!payload.assignedToId) delete payload.assignedToId;

    try {
      await createTask({
        ...payload,
        dueDate: new Date(form.dueDate).toISOString(),
      }).unwrap();
      onClose();
    } catch (err: any) {
      alert(err?.data?.message || "Error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl relative">
        <button onClick={onClose} className="absolute right-6 top-6 p-2 rounded-full hover:bg-slate-100 transition text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-xl mb-6">Create New Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Selection */}
          <select
            required
            className="w-full bg-slate-50 p-4 rounded-2xl outline-none"
            onChange={(e) => setForm({ ...form, projectId: e.target.value })}
          >
            <option value="">Select Project</option>
            {projects?.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Assigned Member (fullProjectData থেকে লোড হচ্ছে) */}
          <select
            className="w-full bg-slate-50 p-4 rounded-2xl outline-none"
            onChange={(e) => setForm({ ...form, assignedToId: e.target.value })}
          >
            <option value="">Assign to Member</option>
            {fullProjectData?.members?.map((m: any) => (
              <option key={m.userId} value={m.userId}>
                {m.user.name}
              </option>
            ))}
          </select>

          {/* Milestone Selection (fullProjectData থেকে লোড হচ্ছে) */}
          <select
            className="w-full bg-slate-50 p-4 rounded-2xl outline-none"
            onChange={(e) => setForm({ ...form, milestoneId: e.target.value })}
          >
            <option value="">Select Milestone (Optional)</option>
            {fullProjectData?.milestones?.map((m: any) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>

          <input
            required
            className="w-full bg-slate-50 p-4 rounded-2xl outline-none"
            placeholder="Task Title"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            required
            type="date"
            className="w-full bg-slate-50 p-4 rounded-2xl outline-none text-slate-500"
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />

          <button
            disabled={isLoading}
            type="submit"
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold"
          >
            {isLoading ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              "Create Task"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
