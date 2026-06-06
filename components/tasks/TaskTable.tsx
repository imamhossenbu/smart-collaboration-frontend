/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useUpdateTaskStatusMutation } from "@/services/taskApi";


export default function TaskTable({ tasks }: { tasks: any[] }) {
    const [updateStatus] = useUpdateTaskStatusMutation();

    const handleStatusChange = async (id: string, newStatus: string) => {
        await updateStatus({ id, status: newStatus });
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-slate-50 text-brand-steel-blue">
                    <tr>
                        <th className="p-4">Title</th>
                        <th className="p-4">Priority</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id} className="border-b border-slate-100">
                            <td className="p-4">{task.title}</td>
                            <td className="p-4">{task.priority}</td>
                            <td className="p-4">
                                <select
                                    defaultValue={task.status}
                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                    className="bg-transparent font-semibold cursor-pointer"
                                >
                                    <option value="TODO">To Do</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}