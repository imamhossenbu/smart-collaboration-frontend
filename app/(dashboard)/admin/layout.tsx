"use client";

import { usePathname } from "next/navigation";
import Link from "next/link"; // 'a' ট্যাগের বদলে 'Link' ব্যবহার করা ভালো

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Active স্টাইল ফাংশন
  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6">
        <h2 className="font-bold text-indigo-600 mb-8 text-xl">Admin Portal</h2>
        <nav className="space-y-2">
          <Link
            href="/admin"
            className={`block px-4 py-3 rounded-xl font-medium transition-all ${
              isActive("/admin")
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/projects"
            className={`block px-4 py-3 rounded-xl font-medium transition-all ${
              isActive("/admin/projects")
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Projects
          </Link>
          <Link
            href="/admin/users"
            className={`block px-4 py-3 rounded-xl font-medium transition-all ${
              isActive("/admin/users")
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            User Management
          </Link>
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
