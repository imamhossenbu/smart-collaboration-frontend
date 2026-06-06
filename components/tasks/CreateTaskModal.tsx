"use client";
import { useCreateTaskMutation } from "@/services/taskApi";
import { useState } from "react";


export default function CreateTaskModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [createTask] = useCreateTaskMutation();
    const [formData, setFormData] = useState({ title: "", description: "", priority: "MEDIUM", projectId: "YOUR_PROJECT_ID" });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createTask(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl w-96 space-y-4">
                <h2 className="font-bold text-lg">Create New Task</h2>
                <input
                    placeholder="Task Title"
                    className="w-full border p-2 rounded"
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <textarea
                    placeholder="Description"
                    className="w-full border p-2 rounded"
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <div className="flex gap-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-brand-royal-blue text-white rounded">Create</button>
                </div>
            </form>
        </div>
    );
}