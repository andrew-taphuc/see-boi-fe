import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNotification } from "@context/NotificationContext";
import { useSocket } from "@context/SocketContext";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotification();
  const { isConnected } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const prevUnreadCountRef = useRef(unreadCount);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Watch for unread count changes to trigger animations
  useEffect(() => {
    // Only trigger if unread count increased (new notification)
    if (unreadCount > prevUnreadCountRef.current) {
      console.log("🔔 New notification detected. Unread count:", unreadCount);

      // Trigger animation (wrapped in setTimeout to avoid setState in effect warning)
      setTimeout(() => {
        setHasNewNotification(true);
        setTimeout(() => setHasNewNotification(false), 3000);
      }, 0);
    }

    // Update previous count
    prevUnreadCountRef.current = unreadCount;
  }, [unreadCount]);

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    console.log("Clicked notification:", notification);

    // Mark as read if unread
    if (!notification.isRead) {
      console.log("Marking as read:", notification.id);
      await markAsRead(notification.id);
    }

    // Get target ID from various possible sources
    const targetId =
      notification.refId ||
      notification.post?.id ||
      notification.user?.id ||
      notification.follower?.id;

    console.log("Target ID:", targetId, "Type:", notification.type);

    // Navigate based on notification type
    if (targetId) {
      if (
        notification.type === "POST_LIKE" ||
        notification.type === "POST_COMMENT" ||
        notification.type === "NEW_POST"
      ) {
        navigate(`/post/${targetId}`);
      } else if (notification.type === "FOLLOW") {
        navigate(`/user/${targetId}`);
      }
    }

    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 hover:bg-gray-100 rounded-full transition-all duration-300 ${
          hasNewNotification ? "animate-bounce" : ""
        }`}
        title={isConnected ? "Thông báo (Đang kết nối)" : "Thông báo (Offline)"}
      >
        <Bell
          size={20}
          className={`transition-colors duration-300 ${
            hasNewNotification ? "text-purple-600" : "text-gray-600"
          }`}
        />
        {unreadCount > 0 && (
          <span
            className={`absolute top-1 right-1 bg-red-500 rounded-full flex items-center justify-center ${
              hasNewNotification ? "w-5 h-5 animate-pulse" : "w-4 h-4"
            } transition-all duration-300`}
          >
            {unreadCount > 99 ? (
              <span className="text-white text-[10px] font-bold">99+</span>
            ) : unreadCount > 9 ? (
              <span className="text-white text-[10px] font-bold">
                {unreadCount}
              </span>
            ) : (
              <span className="text-white text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </span>
        )}
        {!isConnected && (
          <span
            className="absolute bottom-0 right-0 w-2 h-2 bg-gray-400 rounded-full"
            title="Offline"
          ></span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-128 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">Thông báo</h3>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                >
                  Đánh dấu tất cả đã đọc
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500 animate-pulse" : "bg-gray-400"
                }`}
              ></span>
              <span className="text-gray-500">
                {isConnected ? "Đang kết nối realtime" : "Offline"}
              </span>
            </div>
          </div>

          {/* Notification List */}
          <div className="divide-y divide-gray-100 overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                <Bell size={32} className="mx-auto mb-2 text-gray-400" />
                <p>Chưa có thông báo nào</p>
              </div>
            ) : (
              // Sort notifications by createdAt (newest first) and limit to 20 items in dropdown
              [...notifications]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 20)
                .map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.isRead
                        ? "bg-purple-50 border-l-2 border-purple-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm text-gray-800 ${
                            !notification.isRead ? "font-medium" : ""
                          }`}
                        >
                          {notification.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-purple-500 rounded-full shrink-0 mt-1.5"></span>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Could navigate to a full notifications page if exists
                }}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Xem tất cả thông báo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
