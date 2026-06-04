"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // 1. Added useRouter for redirection
import toast from "react-hot-toast"; // 2. Added react-hot-toast for feedback
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Team", href: "/dashboard/team", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // 🔐 Core Logout Event Handler Routine
  const handleLogout = () => {
    try {
      // 1. Wipe out all data caching blocks from local storage
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userName");

      // 2. Kill the middleware authentication cookie by resetting max-age and setting expired date
      document.cookie =
        "token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict;";

      // 3. Trigger a quick logout message alert box
      toast.success("Logged out successfully.");

      // 4. Clean-redirect the application session routing path straight back to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout execution fault:", error);
      toast.error("Failed to sign out properly. Please try again.");
    }
  };

  return (
    <aside className="w-64 bg-brand-dark-navy text-white flex flex-col min-h-screen fixed left-0 top-0 z-50 shadow-lg">
      {/* Sidebar Branding Block Header */}
      <div className="p-6 border-b border-brand-steel-blue/30">
        <h2 className="text-xl font-bold text-brand-teal-aqua tracking-wide">
          SmartCollab
        </h2>
        <p className="text-xs text-brand-steel-blue mt-1">v1.0.0 (2026)</p>
      </div>

      {/* Workspace Menu Link Navigation Items */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          // Accurate matching logic including deep sub-routes if needed
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-brand-royal-blue text-brand-teal-aqua shadow-md font-semibold"
                  : "text-slate-300 hover:bg-brand-royal-blue/30 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Danger Zone Action Action Bar Footer */}
      <div className="p-4 border-t border-brand-steel-blue/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          Logout
        </button>
      </div>
    </aside>
  );
}
