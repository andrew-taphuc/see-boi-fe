import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '@components/admin/AdminSidebar';

const AdminLayout = ({ children }) => {
  // Track sidebar state from localStorage or default to false
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Listen to sidebar width changes
  useEffect(() => {
    const handleResize = () => {
      const sidebar = document.querySelector('[class*="w-64"], [class*="w-20"]');
      if (sidebar) {
        setSidebarCollapsed(sidebar.classList.contains('w-20'));
      }
    };

    // Initial check
    handleResize();

    // Add resize observer
    const observer = new MutationObserver(handleResize);
    const sidebar = document.querySelector('.bg-gray-800');
    if (sidebar) {
      observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        sidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        <div className="p-8">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
