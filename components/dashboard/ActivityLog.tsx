"use client";

interface Activity {
  id: string;
  message: string;
  createdAt: string;
  user?: { name: string };
}

export default function ActivityLog({
  activities,
}: {
  activities: Activity[];
}) {
  return (
    <div className="dashboard-card bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col">
      <h3 className="text-lg font-bold text-brand-dark-navy mb-4">
        Recent Activity Log
      </h3>
      <div className="space-y-4 flex-1 overflow-y-auto max-h-64 pr-1 custom-scrollbar">
        {activities && activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0"
            >
              <p className="text-brand-dark-navy font-medium leading-relaxed">
                {activity.message}
              </p>
              <span className="text-xs text-brand-steel-blue/80 block mt-1">
                By {activity.user?.name || "System"} •{" "}
                {new Date(activity.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))
        ) : (
          <div className="text-sm text-brand-steel-blue text-center my-auto py-8">
            No recent activities available.
          </div>
        )}
      </div>
    </div>
  );
}
