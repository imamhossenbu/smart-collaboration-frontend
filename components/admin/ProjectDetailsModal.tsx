"use client";

import { X, Calendar, DollarSign, Target, CheckCircle2 } from "lucide-react";

export default function ProjectDetailsModal({ isOpen, onClose, project }: any) {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Project Overview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="px-8 pb-8 space-y-6">
          {/* Title and Description */}
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {project.name}
            </h3>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Budget
              </span>
              <div className="flex items-center gap-1 mt-1 text-slate-900 font-bold">
                <DollarSign className="w-4 h-4" />
                {project.budget?.toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Deadline
              </span>
              <div className="flex items-center gap-1 mt-1 text-slate-900 font-bold">
                <Calendar className="w-4 h-4" />
                {new Date(project.deadline).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Milestones List */}
          {project.milestones && project.milestones.length > 0 && (
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
                Project Milestones
              </p>
              <div className="space-y-2">
                {project.milestones.map((m: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-5 py-4 bg-slate-50 rounded-2xl"
                  >
                    <CheckCircle2 className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700">
                      {m.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-[0.98]"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
