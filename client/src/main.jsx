import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { NotificationProvider } from "./context/NotificationContext";
import ToastProvider from "./context/ToastContext";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  </ThemeProvider>
);
