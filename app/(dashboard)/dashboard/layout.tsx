import Sidebar from "@/components/layout/Sidebar";
import NotificationPopover from "@/components/layout/NotificationPopover";

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
      <main className="pl-64 min-h-screen transition-all duration-300 relative">
        <div className="absolute top-4 right-8 z-50">
          <NotificationPopover />
        </div>
        <div className="min-h-screen pt-4">{children}</div>
      </main>
    </div>
  );
}
