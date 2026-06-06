/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  useGetDashboardInsightsQuery,
  useGetRecentActivitiesQuery,
} from "@/services/dashboardApi";
import {
  RefreshCw,
  FolderKanban,
  CheckSquare,
  ClipboardList,
  AlertCircle,
  BarChart3,
  Users,
} from "lucide-react";
import PriorityChart from "@/components/dashboard/PriorityChart";
import ActivityLog from "@/components/dashboard/ActivityLog";

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const { data: insights, refetch, isLoading } = useGetDashboardInsightsQuery();
  console.log(insights);
  const { data: activities } = useGetRecentActivitiesQuery();

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center p-20">
        <RefreshCw className="animate-spin" />
      </div>
    );

  const isManager = role === "PROJECT_MANAGER" || role === "ADMIN";

  const kpiData = isManager
    ? [
        {
          title: "Total Projects",
          value: insights?.kpi?.totalProjects ?? 0,
          icon: FolderKanban,
        },
        {
          title: "Total Tasks",
          value: insights?.kpi?.totalTasks ?? 0,
          icon: ClipboardList,
        },
        {
          title: "Completed",
          value: insights?.kpi?.completedTasks ?? 0,
          icon: CheckSquare,
        },
        {
          title: "Overdue",
          value: insights?.kpi?.overdueTasks ?? 0,
          icon: AlertCircle,
        },
      ]
    : [
        {
          title: "My Projects",
          value: insights?.kpi?.myActiveProjects ?? 0,
          icon: FolderKanban,
        },
        {
          title: "My Tasks",
          value: insights?.kpi?.myAssignedTasks ?? 0,
          icon: ClipboardList,
        },
        {
          title: "Completed",
          value: insights?.kpi?.myCompletedTasks ?? 0,
          icon: CheckSquare,
        },
        {
          title: "Overdue",
          value: insights?.kpi?.myOverdueTasks ?? 0,
          icon: AlertCircle,
        },
      ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">
          {isManager ? "Management Overview" : "My Workspace"}
        </h1>
        <button
          onClick={() => refetch()}
          className="p-2 bg-white rounded-xl shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpiData.map((item, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.05)]"
          >
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              {item.title}
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
              {item.value}
            </h3>
          </div>
        ))}
      </div>

      {isManager && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.05)]">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" /> Priority Distribution
              </h3>
              <PriorityChart
                distribution={insights?.priorityDistribution || []}
              />
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.05)]">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Users className="w-5 h-5" /> Team Members Overview
              </h3>
              <table className="w-full text-left">
                <tbody>
                  {insights?.memberWorkloadSummary?.map((m: any) => (
                    <tr key={m.id}>
                      <td className="py-2 text-sm font-bold">{m.name}</td>
                      <td className="py-2 text-center text-indigo-600 font-bold">
                        {m.totalTasks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.05)]">
            <h3 className="font-bold text-lg mb-6">
              Recent Workspace Activity
            </h3>
            <ActivityLog activities={activities || []} />
          </div>
        </div>
      )}
    </div>
  );
}
