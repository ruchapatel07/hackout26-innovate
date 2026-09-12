import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Gavel, Truck, Sparkles, CheckCheck, Trash2, Bell, Megaphone, Send } from 'lucide-react';

const iconMap = {
  admin: <Megaphone className="w-5 h-5 text-amber-500" />,
  verify: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
  ai: <Sparkles className="w-5 h-5 text-teal-600" />,
  bid: <Gavel className="w-5 h-5 text-indigo-600" />,
  transport: <Truck className="w-5 h-5 text-blue-600" />,
};

export const NotificationsSection = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications, broadcastAnnouncement } = useNotifications();
  const { currentUser } = useAuth();

  const [announcementText, setAnnouncementText] = useState('');

  const handleSendAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    broadcastAnnouncement(announcementText.trim());
    setAnnouncementText('');
  };

  return (
    <div className="content-enter space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold shadow-sm">
                {unreadCount} unread
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time event updates for listings, bids, orders, transport, and admin announcements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 font-bold text-xs flex items-center gap-1.5 transition border border-emerald-500/30"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All as Read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1.5 transition border border-slate-300"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Broadcast Announcement Card (Shown for Admin Role) */}
      {currentUser?.role === 'admin' && (
        <form onSubmit={handleSendAnnouncement} className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Megaphone className="w-4 h-4" />
            <span>Admin Real-Time Announcement Broadcast</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type an announcement to broadcast live to all active platform users..."
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast</span>
            </button>
          </div>
        </form>
      )}

      {/* Notification List */}
      <div className="notification-list space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800">All caught up!</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No active notifications. Real seller, buyer, order, and admin events will appear here live.
            </p>
          </div>
        ) : (
          notifications.map((notif) => {
            const isUnread = !notif.read;
            return (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`notification-item flex items-start justify-between gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isUnread
                    ? 'bg-emerald-50/70 border-emerald-300/80 shadow-sm'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isUnread
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {iconMap[notif.type] || <Bell className="w-5 h-5" />}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <b className="text-sm font-extrabold text-slate-900">{notif.title}</b>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap pt-0.5">
                  {notif.time}
                </span>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
