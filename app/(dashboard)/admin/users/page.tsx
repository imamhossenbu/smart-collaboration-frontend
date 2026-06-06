"use client";

import {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from "@/services/userApi";
import { Loader2, UserCog } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const { data: users, isLoading } = useGetAllUsersQuery();
  const [updateRole] = useUpdateUserRoleMutation();

  const handleRoleChange = async (id: string, newRole: string) => {
    const toastId = toast.loading("Updating role...");
    try {
      await updateRole({ id, role: newRole }).unwrap();
      toast.success("Role updated successfully!", { id: toastId });
    } catch (err) {
      toast.error("Failed to update role.", { id: toastId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-3">
        <UserCog className="text-indigo-600" />
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Change Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users?.map((user: any) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4 text-slate-500">{user.email}</td>
                <td className="px-6 py-4">
                  <select
                    defaultValue={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 cursor-pointer"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="PROJECT_MANAGER">PROJECT MANAGER</option>
                    <option value="TEAM_MEMBER">TEAM MEMBER</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
