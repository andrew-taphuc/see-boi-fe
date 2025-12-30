import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";

// Tạo Context
const SocketContext = createContext(null);

// Socket Provider Component - đặt trước để tránh Fast Refresh warning
export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Khởi tạo socket instance một lần duy nhất
  const socket = useMemo(() => {
    return io(import.meta.env.VITE_SOCKET_URL || "http://seeboi.xyz:6789", {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Lắng nghe sự kiện kết nối
    const handleConnect = () => {
      console.log("✅ Socket connected:", socket.id);
      setIsConnected(true);
    };

    // Lắng nghe sự kiện mất kết nối
    const handleDisconnect = () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    };

    // Lắng nghe lỗi kết nối
    const handleConnectError = (error) => {
      console.error("❌ Socket connection error:", error);
      setIsConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    // Cleanup khi component unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.disconnect();
    };
  }, [socket]);

  // Hàm join room theo userId (gọi sau khi đăng nhập)
  const joinUserRoom = (userId) => {
    if (socket && userId) {
      socket.emit("join", userId);
      console.log(`📥 Joined user room: user_${userId}`);
    }
  };

  // Hàm join post room (gọi khi vào trang chi tiết bài viết)
  const joinPostRoom = (postId) => {
    if (socket && postId) {
      socket.emit("joinPost", postId);
      console.log(`📥 Joined post room: post-${postId}`);
    }
  };

  // Hàm leave post room (gọi khi rời trang chi tiết bài viết)
  const leavePostRoom = (postId) => {
    if (socket && postId) {
      socket.emit("leavePost", postId);
      console.log(`📤 Left post room: post-${postId}`);
    }
  };

  // Lắng nghe thông báo mới
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data) => {
      console.log("🔔 New notification:", data);
      setNotifications((prev) => [data, ...prev]);
    };

    const handleComment = (data) => {
      console.log("💬 New comment:", data);
      // Xử lý comment notification
    };

    const handleLike = (data) => {
      console.log("❤️ New like:", data);
      // Xử lý like notification
    };

    socket.on("notification", handleNotification);
    socket.on("comment", handleComment);
    socket.on("like", handleLike);

    return () => {
      socket.off("notification", handleNotification);
      socket.off("comment", handleComment);
      socket.off("like", handleLike);
    };
  }, [socket]);

  const value = {
    socket,
    isConnected,
    notifications,
    joinUserRoom,
    joinPostRoom,
    leavePostRoom,
    setNotifications,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

// Custom hook để sử dụng Socket Context - đặt sau component
// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket phải được sử dụng trong SocketProvider");
  }
  return context;
};
