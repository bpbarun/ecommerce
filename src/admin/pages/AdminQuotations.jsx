import React, { useState, useEffect } from 'react';
import AdminHeader from '../components/AdminHeader';
import { api } from '../../services/api';
import './AdminQuotations.css';

const STATUS_COLORS = {
  Pending:    { bg: '#FFF3CD', color: '#856404' },
  'In Review':{ bg: '#CCE5FF', color: '#004085' },
  Responded:  { bg: '#D4EDDA', color: '#155724' },
  Closed:     { bg: '#E2E3E5', color: '#383D41' },
};

const STATUSES = ['Pending','In Review','Responded','Closed'];

const AdminQuotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [expandedData, setExpandedData] = useState({});

  useEffect(() => {
    api.getQuotations().then(setQuotations).catch(() => {});
  }, []);

  const handleExpand = async (id) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    if (!expandedData[id]) {
      try {
        const detail = await api.getQuotation(id);
        setExpandedData((prev) => ({ ...prev, [id]: detail }));
      } catch {}
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateQuotation(id, { status });
      setQuotations((prev) => prev.map((q) => q.id == id ? { ...q, status } : q));
      setExpandedData((prev) => prev[id] ? { ...prev, [id]: { ...prev[id], status } } : prev);
    } catch {}
  };

  let filtered = quotations;
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((qt) =>
      qt.name?.toLowerCase().includes(q) ||
      qt.email?.toLowerCase().includes(q) ||
      qt.city?.toLowerCase().includes(q) ||
      qt.company?.toLowerCase().includes(q)
    );
  }
  if (statusFilter) {
    filtered = filtered.filter((qt) => qt.status === statusFilter);
  }

  return (
    <div className="admin-page">
      <AdminHeader
        title="Quotation Requests"
        subtitle={`${quotations.length} total · ${quotations.filter((q) => q.status === 'Pending').length} pending`}
      />

      <div className="page-body">
        {quotations.length === 0 ? (
          <div className="aq-empty">
            <span>📋</span>
            <h3>No quotation requests yet</h3>
            <p>Quotations submitted by users from the storefront will appear here.</p>
          </div>
        ) : (
          <>
            <div className="table-toolbar">
              <div className="tb-search">
                <span>🔍</span>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, city..." />
                {search && <button onClick={() => setSearch('')}>✕</button>}
              </div>
              <div className="status-filter-tabs">
                <button className={`stab ${!statusFilter ? 'active' : ''}`} onClick={() => setStatusFilter('')}>All ({quotations.length})</button>
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    className={`stab ${statusFilter === s ? 'active' : ''}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s} ({quotations.filter((q) => q.status === s).length})
                  </button>
                ))}
              </div>
            </div>

            <div className="quotation-list">
              {filtered.map((q) => {
                const status = q.status || 'Pending';
                const sc = STATUS_COLORS[status] || STATUS_COLORS['Pending'];
                const isOpen = expanded == q.id;
                const detail = expandedData[q.id];
                return (
                  <div key={q.id} className="qcard">
                    <div className="qcard-header" onClick={() => handleExpand(q.id)}>
                      <div className="qch-left">
                        <span className="qch-id">#{q.id}</span>
                        <div className="qch-info">
                          <span className="qch-name">{q.name}</span>
                          <span className="qch-meta">{q.email} · {q.submitted_at}</span>
                        </div>
                      </div>
                      <div className="qch-right">
                        <span className="qch-status" style={{ background: sc.bg, color: sc.color }}>{status}</span>
                        <select
                          className="status-select"
                          value={status}
                          onChange={(e) => { e.stopPropagation(); handleStatusChange(q.id, e.target.value); }}
                          onClick={(e) => e.stopPropagation()}
                          style={{ borderColor: sc.color }}
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <span className="expand-icon">{isOpen ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {isOpen && detail && (
                      <div className="qcard-body">
                        <div className="qcard-details">
                          <div className="qd-section">
                            <h4>Requester Details</h4>
                            <div className="qd-grid">
                              <span>👤 {detail.name}</span>
                              <span>✉️ {detail.email}</span>
                              <span>📞 {detail.phone}</span>
                              {detail.city && <span>📍 {detail.city}</span>}
                              {detail.company && <span>🏢 {detail.company}</span>}
                            </div>
                            {detail.notes && (
                              <div className="qd-notes">
                                <strong>Notes:</strong> {detail.notes}
                              </div>
                            )}
                          </div>
                          <div className="qd-section">
                            <h4>Requested Items ({(detail.items || []).length})</h4>
                            <div className="qd-items">
                              {(detail.items || []).map((item, i) => (
                                <div key={i} className="qd-item">
                                  <div className="qdi-info">
                                    <span className="qdi-product">{item.product_name}</span>
                                    <span className="qdi-supplier">by {item.client_name}</span>
                                  </div>
                                  <div className="qdi-price">
                                    ₹{Number(item.price || 0).toLocaleString('en-IN')} {item.unit}
                                    <span className="qdi-qty">× {item.quantity}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="qcard-actions">
                          <button className="qa-btn primary" onClick={() => window.open(`mailto:${detail.email}?subject=Re: Your BuildMart Quotation Request #${detail.id}`)}>
                            ✉️ Reply via Email
                          </button>
                          {detail.phone && (
                            <button className="qa-btn secondary" onClick={() => window.open(`tel:${detail.phone}`)}>
                              📞 Call
                            </button>
                          )}
                          <div className="qa-status-update">
                            <span>Update Status:</span>
                            {STATUSES.map((s) => (
                              <button
                                key={s}
                                className={`qa-status-btn ${status === s ? 'current' : ''}`}
                                style={status === s ? { background: sc.bg, color: sc.color, borderColor: sc.color } : {}}
                                onClick={() => handleStatusChange(q.id, s)}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="aq-empty">
                  <span>🔍</span>
                  <h3>No quotations match your filters</h3>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminQuotations;
