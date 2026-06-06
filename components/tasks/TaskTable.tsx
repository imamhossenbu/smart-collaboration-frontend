/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useUpdateTaskStatusMutation } from "@/services/taskApi";

export default function TaskTable({ tasks }: { tasks: any[] }) {
  const [updateStatus] = useUpdateTaskStatusMutation();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
          <tr>
            <th className="p-4">Task Name</th>
            <th className="p-4">Priority</th>
            <th className="p-4">Due Date</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks?.map((task) => (
            <tr
              key={task.id}
              className="border-b border-slate-50 hover:bg-slate-50"
            >
              <td className="p-4 font-medium text-brand-dark-navy">
                {task.title}
              </td>
              <td className="p-4 text-xs font-bold text-orange-600">
                {task.priority}
              </td>
              <td className="p-4 text-slate-500">
                {new Date(task.dueDate).toLocaleDateString()}
              </td>
              <td className="p-4">
                <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs">
                  {task.status}
                </span>
              </td>
              <td className="p-4">
                {task.status !== "COMPLETED" && (
                  <button
                    onClick={() =>
                      updateStatus({ id: task.id, status: "COMPLETED" })
                    }
                    className="text-brand-royal-blue hover:underline text-xs font-bold"
                  >
                    Done
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
