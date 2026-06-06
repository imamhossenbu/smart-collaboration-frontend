"use client";

import { useAddMemberMutation } from "@/services/projectApi";
import { useGetUsersQuery } from "@/services/userApi";

export default function ProjectMemberAdder({
  projectId,
}: {
  projectId: string;
}) {
  const [addMember] = useAddMemberMutation();
  const { data: users } = useGetUsersQuery();

  const handleAdd = async (userId: string) => {
    await addMember({ projectId, userId }).unwrap();
    alert("Member added to project successfully!");
  };

  return (
    <select
      onChange={(e) => handleAdd(e.target.value)}
      className="border p-2 rounded-xl text-sm w-full"
    >
      <option>Select user to add to project</option>
      {users?.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))}
    </select>
  );
}
