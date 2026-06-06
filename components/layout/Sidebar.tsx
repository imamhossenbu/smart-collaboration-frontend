"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  LogOut,
  BarChart3,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const userRole =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;
  const userName =
    typeof window !== "undefined" ? localStorage.getItem("name") : "User";

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["ADMIN", "PROJECT_MANAGER", "TEAM_MEMBER"],
    },
    {
      name: "Projects",
      href: "/dashboard/projects",
      icon: FolderKanban,
      roles: ["ADMIN", "PROJECT_MANAGER"],
    },
    {
      name: "Tasks",
      href: "/dashboard/tasks",
      icon: CheckSquare,
      roles: ["ADMIN", "PROJECT_MANAGER", "TEAM_MEMBER"],
    },
    {
      name: "Team",
      href: "/dashboard/team",
      icon: Users,
      roles: ["ADMIN", "PROJECT_MANAGER"],
    },
    {
      name: "Reports",
      href: "/dashboard/reports",
      icon: BarChart3,
      roles: ["ADMIN"],
    },
  ];

  const handleLogout = () => {
    try {
      localStorage.clear();
      document.cookie =
        "token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      toast.success("Logged out successfully.");
      router.push("/login");
    } catch {
      toast.error("Failed to sign out.");
    }
  };

  const initials = (userName || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const roleLabel =
    userRole === "ADMIN"
      ? "Admin"
      : userRole === "PROJECT_MANAGER"
        ? "Project Manager"
        : "Team Member";

  return (
    <aside className="w-60 flex flex-col min-h-screen fixed left-0 top-0 z-50 bg-white border-r border-slate-100">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1.5" fill="white" />
              <rect
                x="8"
                y="1"
                width="5"
                height="5"
                rx="1.5"
                fill="white"
                fillOpacity="0.5"
              />
              <rect
                x="1"
                y="8"
                width="5"
                height="5"
                rx="1.5"
                fill="white"
                fillOpacity="0.5"
              />
              <rect x="8" y="8" width="5" height="5" rx="1.5" fill="white" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold text-slate-800 tracking-tight">
            SmartCollab
          </span>
        </div>
      </div>

      {/* Section label */}
      <div className="px-5 mb-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Menu
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navigation
          .filter((item) => item.roles.includes(userRole || ""))
          .map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {/* Active indicator bar */}
                <span
                  className={`w-0.5 h-4 rounded-full flex-shrink-0 -ml-0.5 transition-all ${
                    isActive ? "bg-indigo-500" : "bg-transparent"
                  }`}
                />
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive
                      ? "text-indigo-600"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                {item.name}

                {/* Active dot */}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                )}
              </Link>
            );
          })}
      </nav>

      {/* User card + logout */}
      <div className="p-3 border-t border-slate-100">
        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 mb-1">
          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-semibold text-indigo-600">
              {initials}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-slate-700 truncate">
              {userName || "User"}
            </p>
            <p className="text-[10px] text-slate-400 truncate">{roleLabel}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors group"
        >
          <span className="w-0.5 h-4 rounded-full flex-shrink-0 -ml-0.5 bg-transparent group-hover:bg-rose-400 transition-all" />
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}
