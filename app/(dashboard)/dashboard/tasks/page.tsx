"use client";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import { useState } from "react";


export default function TasksControlPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand-dark-navy">Task Directory Master</h1>

        {/* বাটন ক্লিক করলে মোডাল ওপেন হবে */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-royal-blue text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
        >
          Delegate New Task
        </button>
      </div>

      <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* বাকি কম্পোনেন্টগুলো এখানে থাকবে */}
    </div>
  );
}