import React from 'react';
import { useAdmin } from '../context/AdminContext';
import './AdminHeader.css';

const AdminHeader = ({ title, subtitle, actions }) => {
  const { stats } = useAdmin();

  return (
    <div className="admin-header">
      <div className="ah-left">
        <h1 className="ah-title">{title}</h1>
        {subtitle && <p className="ah-subtitle">{subtitle}</p>}
      </div>
      <div className="ah-right">
        {actions}
        <div className="ah-user">
          <div className="ah-avatar">A</div>
          <div className="ah-user-info">
            <span className="ah-username">Admin</span>
            <span className="ah-role">Super Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
