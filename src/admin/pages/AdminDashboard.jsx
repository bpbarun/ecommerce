import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';
import { useAdmin } from '../context/AdminContext';
import './AdminDashboard.css';

const StatCard = ({ icon, label, value, sub, color, onClick }) => (
  <div className="stat-card" style={{ '--card-color': color }} onClick={onClick}>
    <div className="sc-icon">{icon}</div>
    <div className="sc-body">
      <span className="sc-value">{value}</span>
      <span className="sc-label">{label}</span>
      {sub && <span className="sc-sub">{sub}</span>}
    </div>
    <div className="sc-bg-icon">{icon}</div>
  </div>
);

const AdminDashboard = () => {
  const { stats, categories, clients, ads } = useAdmin();
  const navigate = useNavigate();

  const recentClients = [...clients].reverse().slice(0, 5);
  const categoryDist = categories.map((cat) => {
    const count = clients.filter((c) => c.category === cat.slug).length;
    const max = Math.max(...categories.map((c2) =>
      clients.filter((cc) => cc.category === c2.slug).length
    ), 1);
    return { ...cat, count, pct: Math.round((count / max) * 100) };
  });

  return (
    <div className="admin-dashboard">
      <AdminHeader
        title="Dashboard"
        subtitle="Welcome back, Admin! Here's what's happening today."
      />

      <div className="dashboard-body">
        {/* Stat Cards */}
        <div className="stat-cards">
          <StatCard icon="🗂️" label="Categories" value={stats.totalCategories} sub="Active categories" color="#0984e3" onClick={() => navigate('/admin/categories')} />
          <StatCard icon="🏭" label="Suppliers" value={stats.totalClients} sub={`${stats.premiumClients} premium`} color="#6c5ce7" onClick={() => navigate('/admin/clients')} />
          <StatCard icon="📦" label="Products" value={stats.totalProducts} sub="Across all suppliers" color="#00b894" onClick={() => navigate('/admin/clients')} />
          <StatCard icon="📢" label="Active Ads" value={stats.totalAds} sub="Premium placements" color="#e17055" onClick={() => navigate('/admin/advertisements')} />
          <StatCard icon="⭐" label="Avg Rating" value={stats.avgRating} sub="Across all suppliers" color="#fdcb6e" />
          <StatCard icon="👑" label="Premium" value={stats.premiumClients} sub={`${Math.round((stats.premiumClients / stats.totalClients) * 100)}% of suppliers`} color="#d63031" onClick={() => navigate('/admin/clients')} />
        </div>

        <div className="dashboard-grid">
          {/* Category Distribution */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3>Suppliers by Category</h3>
              <button className="dash-link" onClick={() => navigate('/admin/categories')}>Manage →</button>
            </div>
            <div className="cat-dist-list">
              {categoryDist.filter((c) => c.count > 0).sort((a, b) => b.count - a.count).map((cat) => (
                <div key={cat.id} className="cat-dist-item">
                  <span className="cdi-icon">{cat.icon}</span>
                  <span className="cdi-name">{cat.name}</span>
                  <div className="cdi-bar-wrap">
                    <div className="cdi-bar" style={{ width: `${cat.pct}%`, background: cat.color }} />
                  </div>
                  <span className="cdi-count">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Suppliers */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3>Recent Suppliers</h3>
              <button className="dash-link" onClick={() => navigate('/admin/clients')}>View All →</button>
            </div>
            <div className="recent-list">
              {recentClients.map((client) => (
                <div key={client.id} className="recent-item">
                  <div className="ri-logo" style={{ background: client.logoColor }}>{client.logo}</div>
                  <div className="ri-info">
                    <span className="ri-name">{client.name}</span>
                    <span className="ri-cat">{client.category} · ⭐ {client.rating}</span>
                  </div>
                  {client.isPremium && <span className="ri-badge">Premium</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Active Ads */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3>Active Advertisements</h3>
              <button className="dash-link" onClick={() => navigate('/admin/advertisements')}>Manage →</button>
            </div>
            <div className="ads-preview-list">
              {ads.map((ad) => (
                <div key={ad.id} className="ad-preview-item" style={{ background: ad.bgColor, borderColor: ad.accentColor + '40' }}>
                  <span className="api-emoji">{ad.emoji}</span>
                  <div className="api-info">
                    <span className="api-headline">{ad.headline}</span>
                    <span className="api-client">{ad.clientName}</span>
                  </div>
                  <span className="api-badge" style={{ background: ad.accentColor }}>{ad.badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="quick-actions-grid">
              {[
                { icon: '➕', label: 'Add Category',   path: '/admin/categories',     hint: 'Create a new material category' },
                { icon: '🏭', label: 'Add Supplier',    path: '/admin/clients',        hint: 'Register a new supplier' },
                { icon: '📢', label: 'Add Advertisement', path: '/admin/advertisements', hint: 'Create a premium ad placement' },
                { icon: '📋', label: 'View Quotations',  path: '/admin/quotations',    hint: 'Review all user quotations' },
                { icon: '🌐', label: 'View Storefront',  path: '/',                    hint: 'See what users see', external: true },
              ].map((qa) => (
                <button
                  key={qa.label}
                  className="quick-action-btn"
                  onClick={() => qa.external ? window.open(qa.path, '_blank') : navigate(qa.path)}
                >
                  <span className="qa-icon">{qa.icon}</span>
                  <span className="qa-label">{qa.label}</span>
                  <span className="qa-hint">{qa.hint}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
