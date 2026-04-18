import React from 'react';
import { Link } from 'react-router-dom';
import { useQuotation } from '../context/QuotationContext';
import './MyQuotationsPage.css';

const statusColors = {
  Pending: '#f39c12',
  'In Review': '#0984e3',
  Responded: '#27ae60',
  Closed: '#636e72',
};

const MyQuotationsPage = () => {
  const { submittedQuotations } = useQuotation();

  return (
    <div className="my-quotations-page">
      <div className="mq-header">
        <div className="mq-header-inner">
          <h1>My Quotations</h1>
          <p>Track all your submitted quotation requests</p>
        </div>
      </div>

      <div className="mq-body">
        {submittedQuotations.length === 0 ? (
          <div className="mq-empty">
            <span>📋</span>
            <h3>No quotations yet</h3>
            <p>Browse categories and submit your first quotation request.</p>
            <Link to="/categories" className="mq-browse-btn">Browse Categories</Link>
          </div>
        ) : (
          <div className="quotations-list">
            {submittedQuotations.map((q) => (
              <div key={q.id} className="quotation-card">
                <div className="qc-header">
                  <div className="qc-id-row">
                    <span className="qc-id">Quotation #{q.id}</span>
                    <span
                      className="qc-status"
                      style={{ background: statusColors[q.status] + '22', color: statusColors[q.status] }}
                    >
                      {q.status}
                    </span>
                  </div>
                  <span className="qc-date">{q.submittedAt}</span>
                </div>
                <div className="qc-body">
                  <div className="qc-requester">
                    <span>👤 {q.name}</span>
                    <span>✉️ {q.email}</span>
                    <span>📞 {q.phone}</span>
                    <span>📍 {q.city}</span>
                    {q.company && <span>🏢 {q.company}</span>}
                    {q.deliveryDate && <span>📅 Required by: {q.deliveryDate}</span>}
                  </div>
                  {q.notes && (
                    <div className="qc-notes">
                      <strong>Notes:</strong> {q.notes}
                    </div>
                  )}
                  <div className="qc-items">
                    <h4>Items ({q.items.length})</h4>
                    {q.items.map((item, i) => (
                      <div key={i} className="qc-item">
                        <span className="qci-product">{item.productName}</span>
                        <span className="qci-client">by {item.clientName}</span>
                        <span className="qci-price">
                          ₹{item.price.toLocaleString('en-IN')} {item.unit} × {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQuotationsPage;
