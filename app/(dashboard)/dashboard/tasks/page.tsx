"use client";
import { useState } from "react";

import TaskTable from "@/components/tasks/TaskTable";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import { useGetTasksQuery } from "@/services/taskApi";

export default function TasksControlPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, refetch } = useGetTasksQuery({ page: 1, limit: 10 });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark-navy">
            Task Directory Master
          </h1>
          <p className="text-sm text-brand-steel-blue">
            Create and manage your project tasks.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-royal-blue text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-dark-navy transition-all"
        >
          + New Task
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading Tasks...</div>
      ) : (
        <TaskTable tasks={data?.data || []} />
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
