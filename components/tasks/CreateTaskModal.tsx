/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useGetProjectsQuery } from "@/services/dashboardApi";
import { useGetUsersQuery } from "@/services/userApi";
import { useCreateTaskMutation } from "@/services/taskApi";

export default function CreateTaskModal({ isOpen, onClose }: any) {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const { data: projects } = useGetProjectsQuery();
  const { data: members } = useGetUsersQuery();

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const selectedProject = projects?.find((p) => p.id === selectedProjectId);

  console.log(selectedProject)

  const [form, setForm] = useState({
    title: "",
    projectId: "",
    milestoneId: "",
    assignedToId: "",
    dueDate: "",
    priority: "MEDIUM",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask({
        ...form,
        dueDate: new Date(form.dueDate).toISOString(),
      }).unwrap();
      onClose();
    } catch (err) {
      alert("Error saving task");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl w-full max-w-lg space-y-4"
      >
        <h2 className="font-bold text-lg">Create Task</h2>

        <select
          required
          className="w-full border p-2 rounded-xl"
          onChange={(e) => {
            setSelectedProjectId(e.target.value);
            setForm({ ...form, projectId: e.target.value });
          }}
        >
          <option value="">Select Project</option>
          {projects?.map((p: any) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Milestone Selection */}
        <select
          className="w-full border p-2 rounded-xl"
          onChange={(e) => setForm({ ...form, milestoneId: e.target.value })}
        >
          <option value="">Select Milestone (Optional)</option>
          {selectedProject?.milestones?.map((m: any) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>

        <input
          required
          className="w-full border p-2 rounded-xl"
          placeholder="Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          required
          type="date"
          className="w-full border p-2 rounded-xl"
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-xl"
        >
          Save
        </button>
      </form>
    </div>
  );
}
