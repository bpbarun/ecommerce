import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from './context/AdminContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const ok = login(form.username, form.password);
    setLoading(false);
    if (ok) navigate('/admin/dashboard');
    else setError('Invalid credentials. Try admin / admin123');
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-brand-icon">🏗️</span>
          <div>
            <h1>BuildMart Admin</h1>
            <p>Sign in to manage your platform</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>Username</label>
            <div className="input-wrap">
              <span className="input-icon">👤</span>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                placeholder="admin"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label>Password</label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button type="button" className="show-pass" onClick={() => setShowPass(!showPass)}>
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {error && <div className="login-error">⚠️ {error}</div>}

          <button type="submit" className={`login-btn ${loading ? 'loading' : ''}`} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign In →'}
          </button>
        </form>

        <div className="login-hint">
          Demo credentials: <strong>admin</strong> / <strong>admin123</strong>
        </div>

        <a href="/" className="back-to-site">← Back to BuildMart</a>
      </div>

      <div className="login-bg">
        <div className="login-bg-circle c1" />
        <div className="login-bg-circle c2" />
        <div className="login-bg-circle c3" />
      </div>
    </div>
  );
};

export default AdminLogin;
