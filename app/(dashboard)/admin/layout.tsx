// app/(dashboard)/admin/layout.tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-100 p-6 hidden md:block">
        <h2 className="font-bold text-indigo-600 mb-8">Admin Panel</h2>
        <nav className="space-y-2">
          <a href="/admin" className="block p-3 rounded-xl hover:bg-indigo-50">
            Overview
          </a>
          <a
            href="/admin/users"
            className="block p-3 rounded-xl hover:bg-indigo-50"
          >
            Manage Users
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
