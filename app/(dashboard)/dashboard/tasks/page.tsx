"use client";

import { Plus, ListFilter, CheckSquare } from "lucide-react";

export default function TasksControlPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark-navy">
            Task Directory Master
          </h1>
          <p className="text-sm text-brand-steel-blue">
            Create standalone tasks, set priorities, and assign to engineering
            modules.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-brand-royal-blue text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-dark-navy transition-all cursor-pointer">
          <Plus className="w-4 h-4" /> Delegate New Task
        </button>
      </div>

      {/* Kanban / List Filters bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/60 flex gap-4 items-center">
        <span className="text-xs font-bold text-brand-steel-blue flex items-center gap-1 uppercase">
          <ListFilter className="w-4 h-4" /> Filter By:
        </span>
        <select className="bg-slate-50 border border-slate-200 rounded-lg text-xs p-2 text-brand-dark-navy outline-none">
          <option>All Projects</option>
        </select>
        <select className="bg-slate-50 border border-slate-200 rounded-lg text-xs p-2 text-brand-dark-navy outline-none">
          <option>All Assignees</option>
        </select>
      </div>

      {/* Tasks Table/Kanban System */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-brand-royal-blue" />
          <h3 className="font-bold text-brand-dark-navy">
            Current Sprint Queue
          </h3>
        </div>
        {/* এখানে টাস্কগুলোর টেবিল বা কানবান গ্রিড রেন্ডার হবে */}
      </div>
    </div>
  );
}
