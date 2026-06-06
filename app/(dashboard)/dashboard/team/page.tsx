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
import { Plus, UserPlus, Users } from "lucide-react";

export default function TeamManagementPage() {
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  const { data: projects } = useGetProjectsQuery();
  const { data: allUsers } = useGetUsersQuery();

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

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Team Management
        </h1>
        <p className="text-slate-500 mt-1">
          Manage project members and assign new team roles.
        </p>
      </div>

      {/* Selection Area - Clean & Shadow based */}
      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-wrap gap-6 items-end">
        <div className="flex-1 min-w-[250px]">
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
            Target Project
          </label>
          <select
            className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-medium text-slate-700"
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="">Select a project...</option>
            {projects?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[250px]">
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
            Team Member
          </label>
          <select
            className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-medium text-slate-700"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">Select a user...</option>
            {allUsers?.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleInvite}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          <UserPlus className="w-5 h-5" /> Add Member
        </button>
      </div>

      {/* Members List */}
      {selectedProjectId && selectedProject ? (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-slate-900">
                {selectedProject.name}
              </h3>
            </div>
            <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full font-bold text-sm">
              {selectedProject.members?.length || 0} Members
            </span>
          </div>

          <div className="space-y-4">
            {selectedProject.members?.map((m: any) => (
              <div
                key={m.userId}
                className="bg-slate-50 p-5 rounded-2xl flex items-center gap-4 transition-transform hover:scale-[1.01]"
              >
                <div className="w-12 h-12 bg-white text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg uppercase shadow-sm">
                  {m.user.name.substring(0, 2)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{m.user.name}</h4>
                  <p className="text-sm text-slate-400">{m.user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl text-slate-400 font-medium">
          Select a project to see team members.
        </div>
      )}
    </div>
  );
}
