"use client";

import { useRouter } from "next/navigation";
import { Calendar, DollarSign, Briefcase, ArrowRight } from "lucide-react";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    budget: number;
    deadline: string;
    progress: number;
    status: string;
  };
  onDelete?: () => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const router = useRouter();

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            {project?.status || "ACTIVE"}
          </span>
          <Briefcase className="w-5 h-5 text-brand-steel-blue/70" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-brand-dark-navy group-hover:text-brand-royal-blue transition-colors line-clamp-1">
            {project?.name || "Untitled Project"}
          </h3>
          <p className="text-sm text-brand-steel-blue mt-1.5 line-clamp-2 leading-relaxed">
            {project?.description || "No description provided."}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-slate-50 space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-brand-dark-navy">
            <span>Sprint Burn Rate</span>
            <span>{project?.progress ?? 0}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-royal-blue h-full rounded-full transition-all duration-300"
              style={{ width: `${project?.progress ?? 0}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-brand-steel-blue font-medium">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />{" "}
            {project?.deadline || "No Deadline"}
          </span>

          {/* 🔐 Safe Budget Handling Matrix Block */}
          <span className="flex items-center font-bold text-brand-dark-navy">
            <DollarSign className="w-3.5 h-3.5" />{" "}
            {project?.budget !== undefined && project?.budget !== null
              ? project.budget.toLocaleString()
              : "0"}
          </span>
        </div>

        <button
          onClick={() => router.push(`/dashboard/projects/${project?.id}`)}
          className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 border border-slate-200 text-brand-dark-navy rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
        >
          View Project Details <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
