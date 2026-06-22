import React, { useEffect, useState } from 'react';
import './Toast.css';

let toastQueue = [];
let toastListener = null;

export const showToast = (message, type = 'success', duration = 3000) => {
  const id = Date.now();
  toastQueue.push({ id, message, type, duration });
  if (toastListener) toastListener([...toastQueue]);
};

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastListener = setToasts;
    return () => { toastListener = null; };
  }, []);

  const dismiss = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    toastQueue = toastQueue.filter((t) => t.id !== id);
  };

  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => dismiss(toast.id), toast.duration);
      return () => clearTimeout(timer);
    });
  }, [toasts]);

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span className="toast-icon">{icons[toast.type]}</span>
          <span className="toast-msg">{toast.message}</span>
          <button className="toast-close" onClick={() => dismiss(toast.id)}>✕</button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
