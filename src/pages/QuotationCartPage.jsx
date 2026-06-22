import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuotation } from '../context/QuotationContext';
import './QuotationCartPage.css';

const QuotationCartPage = () => {
  const { cartItems, removeFromQuotation, updateQuantity, submitQuotation } = useQuotation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    city: '',
    deliveryDate: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = 'Valid email is required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g, '')))
      newErrors.phone = 'Valid 10-digit phone is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    return newErrors;
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      const quotation = await submitQuotation(form);
      setSubmitted(quotation);
    } finally {
      setSubmitting(false);
    }
  };

  const groupedByClient = cartItems.reduce((acc, item) => {
    if (!acc[item.clientId]) {
      acc[item.clientId] = { clientName: item.clientName, items: [] };
    }
    acc[item.clientId].items.push(item);
    return acc;
  }, {});

  if (submitted) {
    return (
      <div className="success-page">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h2>Quotation Submitted!</h2>
          <p>Your quotation request <strong>#{submitted.id}</strong> has been submitted successfully.</p>
          <p>Our team and suppliers will contact you at <strong>{submitted.email}</strong> within 24 hours.</p>
          <div className="success-summary">
            <h4>Submitted Items ({submitted.items.length}):</h4>
            {submitted.items.map((item, i) => (
              <div key={i} className="success-item">
                <span>{item.productName}</span>
                <span>by {item.clientName}</span>
              </div>
            ))}
          </div>
          <div className="success-actions">
            <button onClick={() => navigate('/')} className="success-btn-primary">
              Back to Home
            </button>
            <button onClick={() => navigate('/quotations')} className="success-btn-secondary">
              View My Quotations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div className="cart-header-inner">
          <h1>📋 Quotation Cart</h1>
          <p>Review your selected products and submit a quotation request</p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <span>📋</span>
          <h3>Your quote cart is empty</h3>
          <p>Browse categories and add products from suppliers to get quotations.</p>
          <Link to="/categories" className="browse-btn">Browse Categories</Link>
        </div>
      ) : (
        <div className="cart-body">
          <div className="cart-items-section">
            <h2>Selected Products ({cartItems.length})</h2>
            {Object.values(groupedByClient).map((group) => (
              <div key={group.clientName} className="client-group">
                <div className="client-group-header">
                  <span className="client-group-name">🏭 {group.clientName}</span>
                  <span className="client-group-count">{group.items.length} product(s)</span>
                </div>
                {group.items.map((item) => (
                  <div key={`${item.clientId}-${item.productId}`} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.productName}</h4>
                      <p className="cart-item-price">
                        ₹{item.price.toLocaleString('en-IN')} {item.unit}
                      </p>
                    </div>
                    <div className="cart-item-qty">
                      <label>Qty:</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.clientId, item.productId, Number(e.target.value))
                        }
                      />
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromQuotation(item.clientId, item.productId)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="quotation-form-section">
            <h2>Your Details</h2>
            <p className="form-intro">Fill in your details to submit the quotation request to all selected suppliers.</p>
            <form onSubmit={handleSubmit} className="quotation-form">
              <div className="form-row">
                <div className="form-field">
                  <label>Full Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="form-field">
                  <label>Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Phone *</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
                <div className="form-field">
                  <label>Company / Project Name</label>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>City / Delivery Location *</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Delivery city"
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="field-error">{errors.city}</span>}
                </div>
                <div className="form-field">
                  <label>Required By (Date)</label>
                  <input
                    name="deliveryDate"
                    type="date"
                    value={form.deliveryDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-field full-width">
                <label>Additional Notes / Requirements</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Describe your project requirements, specific grades, quantities, etc."
                  rows={4}
                />
              </div>
              <div className="form-submit-row">
                <div className="submit-summary">
                  Submitting to <strong>{Object.keys(groupedByClient).length} supplier(s)</strong> for <strong>{cartItems.length} product(s)</strong>
                </div>
                <button type="submit" className="submit-quote-btn" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Quotation Request →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationCartPage;
