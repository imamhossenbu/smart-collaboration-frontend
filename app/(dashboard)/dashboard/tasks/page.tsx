"use client";

import { useState } from "react";
import TaskTable from "@/components/tasks/TaskTable";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import { useGetTasksQuery } from "@/services/taskApi";
import { RefreshCw } from "lucide-react";

export default function TasksControlPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, refetch } = useGetTasksQuery({ page: 1, limit: 10 });
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
  const canCreateTask = role === "ADMIN" || role === "PROJECT_MANAGER";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Task Directory</h1>
          <p className="text-sm text-slate-500">
            Manage your tasks and track progress.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => refetch()}
            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
          >
            <RefreshCw className="w-5 h-5 text-slate-600" />
          </button>
          {canCreateTask && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all"
            >
              + New Task
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-slate-400">
          Loading your tasks...
        </div>
      ) : (
        <TaskTable tasks={data?.data || []} onUpdate={() => refetch()} />
      )}

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          refetch();
        }}
      />
    </div>
  );
}
