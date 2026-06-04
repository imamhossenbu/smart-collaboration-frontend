"use client";

import { UserPlus, ShieldAlert } from "lucide-react";

export default function TeamManagementPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark-navy">
            Workspace Members
          </h1>
          <p className="text-sm text-brand-steel-blue">
            Manage user profiles, structural access rights, and performance
            groups.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-brand-teal-aqua text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-dark-navy transition-all cursor-pointer">
          <UserPlus className="w-4 h-4" /> Invite Team Member
        </button>
      </div>

      {/* Members Directory Control Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-brand-royal-blue">
              IH
            </div>
            <div>
              <h4 className="font-bold text-sm text-brand-dark-navy">
                Imam Hossen
              </h4>
              <p className="text-xs text-brand-steel-blue">imam@company.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold bg-blue-50 text-brand-royal-blue px-3 py-1 rounded-full border border-blue-100">
              SOFTWARE_DEVELOPER
            </span>
            <button className="text-xs font-semibold text-rose-500 hover:underline cursor-pointer">
              Revoke Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
