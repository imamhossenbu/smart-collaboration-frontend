"use client";

import { CheckCircle2, Clock } from "lucide-react";

interface Milestone {
  id: string | number;
  title: string;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | string;
}

export default function MilestoneList({
  milestones,
}: {
  milestones: Milestone[];
}) {
  if (!milestones || milestones.length === 0) {
    return (
      <p className="text-sm text-brand-steel-blue text-center py-6">
        No milestones defined for this project scope yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {milestones.map((milestone) => (
        <div
          key={milestone.id}
          className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl"
        >
          <span className="font-semibold text-sm text-brand-dark-navy">
            {milestone.title}
          </span>
          <span
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
              milestone.status === "COMPLETED"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : milestone.status === "IN_PROGRESS"
                  ? "bg-blue-50 text-brand-royal-blue border border-blue-100 animate-pulse"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            {milestone.status === "COMPLETED" ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
            {milestone.status}
          </span>
        </div>
      ))}
    </div>
  );
}
