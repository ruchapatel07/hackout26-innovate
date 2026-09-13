import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'n-admin-1',
    title: '📢 Admin Announcement',
<<<<<<< HEAD
    message: 'Welcome to Carbon Connect. Platform ISO 14064 certification & real-time telemetry node active.',
=======
    message: 'Welcome to CarbonTrace. Platform ISO 14064 certification & real-time telemetry node active.',
>>>>>>> 90445d9 (Update Carbon Connect full stack application)
    type: 'admin',
    time: '10 mins ago',
    read: false,
  },
  {
    id: 'n-seller-1',
    title: '🏭 Seller Listing Active',
    message: 'Batch #CC-1082 (1,500 Tons CO₂ - 99.8% Food Grade) is now active on global marketplace.',
    type: 'bid',
    time: '25 mins ago',
    read: false,
  },
  {
    id: 'n-buyer-1',
    title: '🏢 Buyer Request Placed',
    message: 'Purchase request of $42/Ton submitted for Gujarat Chemical Refinery Batch.',
    type: 'verify',
    time: '1 hour ago',
    read: false,
  },
];

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('carbonlink_real_notifications');
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  // Persist to localStorage whenever notifications change
  useEffect(() => {
    try {
      localStorage.setItem('carbonlink_real_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  // Listen to cross-tab storage and window events for real-time notification sync
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'carbonlink_real_notifications' && e.newValue) {
        try {
          setNotifications(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
    };

    const handleCustomEvent = (e) => {
      if (e.detail) {
        const notif = e.detail;
        setNotifications((prev) => [notif, ...prev]);
        showToast(notif.title);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('carbon_notification_event', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('carbon_notification_event', handleCustomEvent);
    };
  }, [showToast]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('Cleared notification history.');
  };

  const addNotification = (title, message, type = 'bid') => {
    const newNotif = {
      id: 'n-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      title,
      message,
      type,
      time: 'Just now',
      read: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    showToast(title);

    // Dispatch event for other tabs/listeners
    window.dispatchEvent(
      new CustomEvent('carbon_notification_event', { detail: newNotif })
    );
  };

  // Admin Broadcast Announcement
  const broadcastAnnouncement = (announcementText) => {
    addNotification(
      '📢 Admin Announcement',
      announcementText,
      'admin'
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        addNotification,
        broadcastAnnouncement,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
