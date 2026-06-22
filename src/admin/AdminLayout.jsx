import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from './context/AdminContext';
import AdminSidebar from './components/AdminSidebar';
import './AdminLayout.css';

const AdminLayout = () => {
  const { isAuthenticated } = useAdmin();
  const [collapsed, setCollapsed] = useState(false);

  if (!isAuthenticated) return <Navigate to="/admin" replace />;

  return (
    <div className="admin-shell">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
