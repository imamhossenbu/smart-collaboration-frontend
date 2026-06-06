/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useAddMemberMutation,
} from "@/services/projectApi";
import { useGetUsersQuery } from "@/services/userApi";
import { Plus } from "lucide-react";

export default function TeamManagementPage() {
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  const { data: projects } = useGetProjectsQuery();
  const { data: allUsers } = useGetUsersQuery();

  // প্রজেক্ট সিলেক্ট হলে মেম্বারসহ ডাটা ফেচ হবে
  const { data: selectedProject } = useGetProjectByIdQuery(selectedProjectId, {
    skip: !selectedProjectId,
  });

  const [addMember] = useAddMemberMutation();

  const handleInvite = async () => {
    if (!selectedProjectId || !selectedUserId)
      return toast.error("Please select both project and member");

    try {
      await addMember({
        projectId: selectedProjectId,
        userId: selectedUserId,
      }).unwrap();
      toast.success("Member added successfully!");
      setSelectedUserId("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add member");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <Toaster position="top-right" />

      {/* Selection Area */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-brand-steel-blue mb-2 uppercase">
            Select Project
          </label>
          <select
            className="w-full border p-2.5 rounded-xl text-sm"
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="">Choose a project...</option>
            {projects?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-brand-steel-blue mb-2 uppercase">
            Select Member
          </label>
          <select
            className="w-full border p-2.5 rounded-xl text-sm"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">Choose a member...</option>
            {allUsers?.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleInvite}
          className="bg-brand-royal-blue text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-brand-dark-navy transition-all"
        >
          <Plus className="w-4 h-4" /> Add to Team
        </button>
      </div>

      {/* Members List */}
      {selectedProjectId && selectedProject ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-brand-dark-navy">
              Team: {selectedProject.name}
            </h3>
            <span className="text-xs bg-slate-100 px-3 py-1 rounded-full font-bold">
              {selectedProject.members?.length || 0} Members
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {selectedProject.members?.map((m: any) => (
              <div
                key={m.userId}
                className="p-6 flex items-center gap-4 hover:bg-slate-50"
              >
                <div className="w-12 h-12 bg-indigo-100 text-brand-royal-blue rounded-full flex items-center justify-center font-bold text-lg uppercase">
                  {m.user.name.substring(0, 2)}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{m.user.name}</h4>
                  <p className="text-xs text-brand-steel-blue">
                    {m.user.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center p-20 border-2 border-dashed rounded-2xl text-slate-400">
          Select a project to view members.
        </div>
      )}
    </div>
  );
}
