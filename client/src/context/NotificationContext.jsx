import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axiosInstance from "@utils/axiosInstance";
import { useAuth } from "./AuthContext";
import { useSocket } from "./SocketContext";

const NotificationContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { socket, joinUserRoom } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notifications from API
  const fetchNotifications = useCallback(
    async (unreadOnly = false) => {
      if (!currentUser) return;

      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (unreadOnly) params.append("unread", "true");
        params.append("limit", "20");

        console.log(
          "Fetching notifications from:",
          `/notification/me?${params}`
        );
        const response = await axiosInstance.get(`/notification/me?${params}`);
        const fetchedNotifications = response.data || [];

        console.log("Fetched notifications:", fetchedNotifications);
        setNotifications(fetchedNotifications);
        setUnreadCount(fetchedNotifications.filter((n) => !n.isRead).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentUser]
  );

  // Mark a notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      console.log("Calling API:", `/notification/${notificationId}/read`);
      await axiosInstance.patch(`/notification/${notificationId}/read`);

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      console.error("Error response:", error.response);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await axiosInstance.patch("/notification/read-all");

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }, []);

  // Fetch initial notifications when user changes
  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
      // Join user room để nhận notifications realtime
      if (currentUser.id) {
        joinUserRoom(currentUser.id);
      }
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [currentUser, fetchNotifications, joinUserRoom]);

  // Listen to socket events and add new notifications to the list
  useEffect(() => {
    if (!socket || !currentUser) return;

    const handleNewNotification = (data) => {
      console.log("🔔 New notification received in NotificationContext:", data);

      // Add new notification to the beginning of the list
      setNotifications((prev) => {
        // Check if notification already exists
        const exists = prev.some((n) => n.id === data.id);
        if (exists) {
          console.log("Notification already exists, skipping");
          return prev;
        }

        // Add new notification at the beginning
        const updated = [data, ...prev];

        // Update unread count
        const newUnreadCount = updated.filter((n) => !n.isRead).length;
        setUnreadCount(newUnreadCount);

        console.log(
          "✅ Notification added to list. Total:",
          updated.length,
          "Unread:",
          newUnreadCount
        );
        return updated;
      });
    };

    // Listen for all notification types
    socket.on("notification", handleNewNotification);
    socket.on("comment", handleNewNotification);
    socket.on("like", handleNewNotification);

    return () => {
      socket.off("notification", handleNewNotification);
      socket.off("comment", handleNewNotification);
      socket.off("like", handleNewNotification);
    };
  }, [socket, currentUser]);

  const value = {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
