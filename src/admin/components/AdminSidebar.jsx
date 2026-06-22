import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import './AdminSidebar.css';

const navItems = [
  { to: '/admin/dashboard',      icon: '📊', label: 'Dashboard' },
  { to: '/admin/categories',     icon: '🗂️',  label: 'Categories' },
  { to: '/admin/clients',        icon: '🏭', label: 'Suppliers' },
  { to: '/admin/advertisements', icon: '📢', label: 'Advertisements' },
  { to: '/admin/quotations',     icon: '📋', label: 'Quotations' },
];

const AdminSidebar = ({ collapsed, onToggle }) => {
  const { logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand" onClick={onToggle}>
        <span className="sb-icon">🏗️</span>
        {!collapsed && (
          <div className="sb-text">
            <span className="sb-name">BuildMart</span>
            <span className="sb-role">Admin Portal</span>
          </div>
        )}
        <button className="sb-toggle">{collapsed ? '›' : '‹'}</button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={collapsed ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
            {!collapsed && <span className="nav-chevron">›</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <a href="/" className="sidebar-link" title={collapsed ? 'View Site' : ''}>
          <span className="nav-icon">🌐</span>
          {!collapsed && <span>View Site</span>}
        </a>
        <button className="sidebar-link logout-btn" onClick={handleLogout} title={collapsed ? 'Logout' : ''}>
          <span className="nav-icon">🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
