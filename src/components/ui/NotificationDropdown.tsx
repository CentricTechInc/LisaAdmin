import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const dummyNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Booking',
    message: 'You have a new booking from Sarah Jones.',
    time: '2 mins ago',
    isRead: false,
  },
  {
    id: '2',
    title: 'Payment Received',
    message: 'Payment of $150 received from John Doe.',
    time: '1 hour ago',
    isRead: false,
  },
  {
    id: '3',
    title: 'System Update',
    message: 'System maintenance scheduled for tonight.',
    time: '5 hours ago',
    isRead: true,
  },
];

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger Button */}
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
        {/* Optional: Badge for unread count */}
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-pink-500 ring-2 ring-white"></span>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-2xl border border-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            <button className="text-xs text-pink-500 hover:text-pink-600 font-medium">
              Mark all as read
            </button>
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto py-1">
            {dummyNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={cn(
                    "px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0",
                    !notification.isRead && "bg-pink-50/30"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                    <p className={cn("text-sm font-medium", !notification.isRead ? "text-gray-900" : "text-gray-700")}>
                        {notification.title}
                    </p>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{notification.time}</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{notification.message}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-center rounded-b-2xl">
            <button className="text-xs font-medium text-gray-600 hover:text-gray-900">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
