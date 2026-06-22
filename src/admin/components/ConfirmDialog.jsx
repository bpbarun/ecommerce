import React from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <div className="confirm-overlay" onClick={onCancel}>
    <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
      <span className="confirm-icon">⚠️</span>
      <p>{message}</p>
      <div className="confirm-actions">
        <button className="confirm-cancel" onClick={onCancel}>Cancel</button>
        <button className="confirm-ok" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
