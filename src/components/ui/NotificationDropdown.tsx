import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { getNotifications, markAllNotificationsRead, type AppNotification } from "@/services/notificationService";

export const NotificationDropdown: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const refreshNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const payload = await getNotifications(1);
      setNotifications(payload.rows || []);
      setUnreadCount(payload.unReadCount || 0);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    void refreshNotifications();
  }, [isOpen, refreshNotifications]);

  useEffect(() => {
    void refreshNotifications();
  }, [refreshNotifications]);

  const hasUnread = unreadCount > 0;

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      const ok = await markAllNotificationsRead();
      if (ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch {}
  }, []);

  const handleNotificationClick = useCallback(
    (notification: AppNotification) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
      if (!notification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      if (notification.modelType === "Appointment" && notification.modelId) {
        setIsOpen(false);
        void router.push(`/appointment-detail?source=customers&id=${notification.modelId}`);
      }
    },
    [router]
  );

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="px-4 py-10 text-center text-xs text-gray-500">
          Loading...
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="px-4 py-10 text-center text-xs text-gray-500">
          No notifications
        </div>
      );
    }

    return (
      <div className="max-h-100 overflow-y-auto py-1">
        {notifications.map((notification) => (
          <button
            key={notification.id}
            type="button"
            onClick={() => handleNotificationClick(notification)}
            className={cn(
              "w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0",
              !notification.isRead && "bg-pink-50/30"
            )}
          >
            <div className="flex justify-between items-start mb-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  !notification.isRead ? "text-gray-900" : "text-gray-700"
                )}
              >
                {notification.subject}
              </p>
              <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                {notification.time}
              </span>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2">{notification.message}</p>
          </button>
        ))}
      </div>
    );
  }, [handleNotificationClick, isLoading, notifications]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button 
        className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
            isOpen 
                ? "bg-[color-mix(in_oklab,var(--color-dark-bg)_80%,white)] text-white" 
                : "bg-[color-mix(in_oklab,var(--color-dark-bg)_85%,white)] hover:bg-[color-mix(in_oklab,var(--color-dark-bg)_80%,white)]"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {hasUnread ? (
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-pink-500 ring-2 ring-white"></span>
        ) : null}
      </button>

      {isOpen && (
        <div className="absolute overflow-hidden right-0 z-50 mt-2 w-80 origin-top-right rounded-2xl border border-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            {hasUnread ? (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="text-xs text-pink-500 hover:text-pink-600 font-medium"
              >
                Mark all as read
              </button>
            ) : null}
          </div>

          {content}

          <div className="border-t hidden border-gray-100 bg-gray-50 px-4 py-2 text-center rounded-b-2xl">
            <button type="button" className="text-xs font-medium text-gray-600 hover:text-gray-900">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
