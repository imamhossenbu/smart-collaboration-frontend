import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0c22]">
      {/* বাম পাশে ফিক্সড সাইডবার */}
      <Sidebar />

      {/* ডান পাশে স্ক্রোলযোগ্য মূল কন্টেন্ট এরিয়া */}
      <main className="pl-64 min-h-screen transition-all duration-300">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}
