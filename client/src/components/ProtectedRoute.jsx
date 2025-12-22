import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component - Bảo vệ route yêu cầu authentication
 * Nếu user chưa đăng nhập, redirect về landing page với popup login
 */
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // Nếu chưa đăng nhập, redirect về /?login=true
  if (!currentUser) {
    return <Navigate to="/?login=true" state={{ from: location }} replace />;
  }

  // Nếu đã đăng nhập, render children
  return children;
};

export default ProtectedRoute;

