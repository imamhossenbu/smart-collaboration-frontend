import { useState } from "react";
import UpdateTaskModal from "./UpdateTaskModal";

interface Task {
  id: string;
  title: string;
  project?: { name: string };
  status: "COMPLETED" | string;
  progress: number;
}

interface TaskTableProps {
  tasks: Task[];
  onUpdate: (task: Task) => void;
}

// components/tasks/TaskTable.tsx
export default function TaskTable({ tasks, onUpdate }: TaskTableProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50/50 text-slate-400 text-xs uppercase">
          <tr>
            <th className="px-8 py-5 text-left">Task</th>
            <th className="px-8 py-5 text-left">Project</th>
            <th className="px-8 py-5 text-left">Status</th>
            <th className="px-8 py-5 text-left">Progress</th>
            <th className="px-8 py-5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-slate-50/50">
              <td className="px-8 py-6 font-semibold">{task.title}</td>
              <td className="px-8 py-6 text-slate-500">{task.project?.name}</td>
              <td className="px-8 py-6">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    task.status === "COMPLETED"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {task.status}
                </span>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1.5"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-600">
                    {task.progress}%
                  </span>
                </div>
              </td>
              <td className="px-8 py-6 text-right">
                <button
                  onClick={() => setSelectedTask(task)}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedTask && (
        <UpdateTaskModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={() => {
            if (selectedTask) {
              onUpdate(selectedTask);
            }
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
}
