/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export default function TaskFilterBar({ setParams }: { setParams: any }) {
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200/60 flex gap-4 items-center">
            <select
                onChange={(e) => setParams((prev: any) => ({ ...prev, status: e.target.value || undefined }))}
                className="bg-slate-50 border border-slate-200 rounded-lg text-xs p-2 outline-none"
            >
                <option value="">All Status</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
            </select>

            <input
                type="text"
                placeholder="Search tasks..."
                className="bg-slate-50 border border-slate-200 rounded-lg text-xs p-2 outline-none flex-grow"
                onChange={(e) => setParams((prev: any) => ({ ...prev, search: e.target.value }))}
            />
        </div>
    );
}