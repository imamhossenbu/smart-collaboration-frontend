// app/(dashboard)/admin/page.tsx
"use client";
import { useGetStatsQuery } from "@/services/adminApi";
import { motion } from "framer-motion";
import { 
  Users, 
  FolderKanban, 
  ClipboardList, 
  CheckSquare, 
  Activity,
  Server,
  Download,
  UserPlus,
  RefreshCw
} from "lucide-react";

export default function AdminOverview() {
  const { data, isLoading, refetch } = useGetStatsQuery();

  if (isLoading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
    </div>
  );

  const stats = [
    { title: "Total Users", val: data?.totalUsers, icon: Users, color: "from-blue-500 to-cyan-400" },
    { title: "Active Projects", val: data?.activeProjects, icon: FolderKanban, color: "from-indigo-500 to-purple-500" },
    { title: "Total Tasks", val: data?.totalTasks, icon: ClipboardList, color: "from-fuchsia-500 to-pink-500" },
    { title: "Completed", val: data?.completedTasks, icon: CheckSquare, color: "from-emerald-400 to-teal-500" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 mt-1">Real-time metrics and administration controls</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => refetch()} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm">
            <RefreshCw className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="relative overflow-hidden bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${s.color} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`} />
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-6 shadow-lg shadow-${s.color.split('-')[1]}-500/30`}>
              <s.icon size={24} />
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {s.title}
            </p>
            <h2 className="text-4xl font-black text-slate-800 mt-2">{s.val || 0}</h2>
          </motion.div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* System Health */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-brand-dark-navy p-8 rounded-3xl text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Server size={120} />
          </div>
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
            <Activity className="text-emerald-400" /> System Health
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <p className="text-white/60 text-xs font-bold uppercase mb-1">Server Uptime</p>
              <p className="text-2xl font-black">99.9%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <p className="text-white/60 text-xs font-bold uppercase mb-1">CPU Load</p>
              <p className="text-2xl font-black text-emerald-400">12.4%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <p className="text-white/60 text-xs font-bold uppercase mb-1">Active Sessions</p>
              <p className="text-2xl font-black">{data?.totalUsers ? Math.floor(data.totalUsers * 0.4) : 0}</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition-colors group">
              <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                <UserPlus size={18} className="text-indigo-600" />
              </div>
              Invite New User
            </button>
            <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors group">
              <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                <Download size={18} className="text-emerald-600" />
              </div>
              Export System Report
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
