"use client";

import { useEffect, useState } from "react";
import {
  useGetDashboardInsightsQuery,
  useGetRecentActivitiesQuery,
} from "@/services/dashboardApi";
import {
  FolderKanban,
  CheckSquare,
  ClipboardList,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import PriorityChart from "@/components/dashboard/PriorityChart";
import ActivityLog from "@/components/dashboard/ActivityLog";

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const {
    data: insights,
    isLoading: isInsightsLoading,
    refetch: refetchInsights,
  } = useGetDashboardInsightsQuery();
  const { data: activities, isLoading: isActivitiesLoading } =
    useGetRecentActivitiesQuery();

  // 1. Get the authenticated user's workspace role securely on mount
  useEffect(() => {
    setIsMounted(true);
    const savedRole = localStorage.getItem("role");
    setRole(savedRole);
  }, []);

  if (isInsightsLoading || isActivitiesLoading || !isMounted) {
    return (
      <div className="flex justify-center items-center h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-teal-aqua" />
      </div>
    );
  }

  // 2. Generate customized KPI Metrics array based explicitly on User Role permissions
  const isManager = role === "PROJECT_MANAGER";

  const kpiData = [
    {
      title: isManager ? "Total Projects" : "My Active Projects",
      value: isManager
        ? (insights?.kpi?.totalProjects ?? 0)
        : (insights?.kpi?.myActiveProjects ?? 0),
      icon: FolderKanban,
      color: "bg-brand-royal-blue text-white",
    },
    {
      title: isManager ? "Total Tasks Created" : "My Assigned Tasks",
      value: isManager
        ? (insights?.kpi?.totalTasks ?? 0)
        : (insights?.kpi?.myAssignedTasks ?? 0),
      icon: ClipboardList,
      color: "bg-brand-steel-blue text-white",
    },
    {
      title: "Completed Tasks",
      value: isManager
        ? (insights?.kpi?.completedTasks ?? 0)
        : (insights?.kpi?.myCompletedTasks ?? 0),
      icon: CheckSquare,
      color: "bg-emerald-600 text-white",
    },
    {
      title: "Overdue Tasks",
      value: isManager
        ? (insights?.kpi?.overdueTasks ?? 0)
        : (insights?.kpi?.myOverdueTasks ?? 0),
      icon: AlertCircle,
      color: "bg-rose-600 text-white",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header Block with dynamic personalization greeting */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand-dark-navy">
            {isManager ? "Management Dashboard" : "Workspace Dashboard"}
          </h1>
          <p className="text-sm text-brand-steel-blue mt-1">
            {isManager
              ? "Monitor comprehensive workspace insights, metrics, and member workloads."
              : "Track your personal active sprint performance and recent target deadlines."}
          </p>
        </div>
        <button
          onClick={() => refetchInsights()}
          className="p-2 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-all cursor-pointer"
        >
          <RefreshCw className="w-5 h-5 text-brand-steel-blue" />
        </button>
      </div>

      {/* 📊 Shared/Dynamic Card Matrix Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 flex items-center justify-between shadow-sm"
            >
              <div>
                <p className="text-xs font-semibold text-brand-steel-blue uppercase tracking-wider">
                  {card.title}
                </p>
                <h3 className="text-3xl font-extrabold mt-2 text-brand-dark-navy">
                  {card.value}
                </h3>
              </div>
              <div className={`p-3.5 rounded-xl ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 📉 Main Row Layout: Priority Graph & Workspace Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <PriorityChart distribution={insights?.priorityDistribution || []} />
        <ActivityLog activities={activities || []} />
      </div>

      {/* 👥 Dynamic Security Section Block: ONLY RENDER FOR ROLES MATCHING MANAGEMENT CRITERIA */}
      {isManager && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm animate-fade-in">
          <h3 className="text-lg font-bold text-brand-dark-navy mb-4">
            Team Member Workload Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-brand-steel-blue text-xs uppercase font-semibold tracking-wider">
                  <th className="pb-3.5 pl-2">Member Name</th>
                  <th className="pb-3.5 text-center">Total Tasks</th>
                  <th className="pb-3.5 text-center">Completed</th>
                  <th className="pb-3.5 text-center">Pending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {insights?.memberWorkloadSummary?.map((member: any) => (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-3.5 pl-2 font-medium text-brand-dark-navy">
                      {member.name}
                    </td>
                    <td className="py-3.5 text-center font-bold text-brand-royal-blue">
                      {member.totalTasks}
                    </td>
                    <td className="py-3.5 text-center">
                      <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-semibold text-xs border border-emerald-100">
                        {member.completedTasks}
                      </span>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className="bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full font-semibold text-xs border border-amber-100">
                        {member.pendingTasks}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
