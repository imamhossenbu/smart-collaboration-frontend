"use client";
import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { useGetNotificationsQuery, useMarkNotificationReadMutation } from "@/services/advancedApi";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: notifications } = useGetNotificationsQuery(undefined, {
    pollingInterval: 30000, // Poll every 30s
  });
  const [markAsRead] = useMarkNotificationReadMutation();

  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-slate-100 transition"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 shadow-[0_10px_40px_rgb(0,0,0,0.1)] rounded-2xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Notifications</h3>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                {unreadCount} unread
              </span>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications?.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  You are all caught up!
                </div>
              ) : (
                notifications?.map((notif: any) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-slate-50 flex gap-3 transition ${
                      notif.isRead ? "bg-white" : "bg-indigo-50/50"
                    }`}
                  >
                    <div className="flex-1">
                      <p className={`text-sm ${notif.isRead ? "text-slate-600" : "text-slate-800 font-medium"}`}>
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {!notif.isRead && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="p-1.5 h-fit bg-white border border-slate-200 rounded-full text-indigo-600 hover:bg-indigo-50"
                        title="Mark as read"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
