"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const PRIORITY_COLORS: Record<string, string> = {
  HIGH: "#EF4444",
  MEDIUM: "#F59E0B",
  LOW: "#10B981",
};

interface PriorityItem {
  priority: string;
  _count?: { _all?: number; id?: number };
}

export default function PriorityChart({
  distribution,
}: {
  distribution: PriorityItem[];
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartData =
    distribution?.map((item) => ({
      name: item.priority,
      Count: item._count?._all ?? item._count?.id ?? 0,
    })) || [];

  if (!isMounted) {
    return <div className="h-64 bg-slate-50/50 animate-pulse rounded-xl" />;
  }

  return (
    <div className="dashboard-card bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col">
      <h3 className="text-lg font-bold text-brand-dark-navy mb-4">
        Tasks by Priority
      </h3>
      <div className="w-full h-64 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <XAxis
              dataKey="name"
              stroke="#2F578A"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#2F578A"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip cursor={{ fill: "rgba(54, 173, 163, 0.04)" }} />
            <Bar dataKey="Count" radius={[6, 6, 0, 0]} barSize={45}>
              {chartData.map((entry, index) => {
                const barColor =
                  PRIORITY_COLORS[entry.name.toUpperCase()] || "#CBD5E1";
                return <Cell key={`cell-${index}`} fill={barColor} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
