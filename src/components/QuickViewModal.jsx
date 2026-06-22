import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuotation } from '../context/QuotationContext';
import { api } from '../services/api';
import { showToast } from './Toast';
import './QuickViewModal.css';

const QuickViewModal = ({ client, onClose }) => {
  const navigate = useNavigate();
  const { addToQuotation, isInQuotation } = useQuotation();
  const [products, setProducts] = useState(client.products || []);
  const [loadingProducts, setLoadingProducts] = useState(!client.products);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => {
    if (client.products) return;
    api.getProducts(client.id)
      .then((data) => setProducts(data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, [client.id, client.products]);

  const logoColor = client.logoColor || client.logo_color || '#ccc';
  const isPremium = !!(client.isPremium ?? Number(client.is_premium));
  const address   = client.address || '';

  const handleAdd = (product) => {
    if (!isInQuotation(client.id, product.id)) {
      addToQuotation(client, product);
      showToast(`${product.name} added to Quote Cart`, 'success');
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '') + '☆'.repeat(5 - Math.ceil(rating));
  };

  return (
    <div className="qv-overlay" onClick={onClose}>
      <div className="qv-modal" onClick={(e) => e.stopPropagation()}>
        <button className="qv-close" onClick={onClose}>✕</button>

        <div className="qv-header" style={{ background: logoColor + '18' }}>
          <div className="qv-logo" style={{ background: logoColor }}>{client.logo}</div>
          <div>
            <div className="qv-name-row">
              <h2>{client.name}</h2>
              {isPremium && <span className="qv-premium">⭐ Premium</span>}
            </div>
            <p className="qv-tagline">"{client.tagline}"</p>
            <div className="qv-rating">
              <span className="qv-stars" style={{ color: '#f39c12' }}>{renderStars(client.rating)}</span>
              <span>{client.rating}</span>
              <span style={{ color: '#999' }}>({client.reviews} reviews)</span>
            </div>
            <div className="qv-meta">
              <span>📍 {address.split(',').slice(-2).join(',').trim()}</span>
              <span>🏭 {client.experience}</span>
              <span>📞 {client.phone}</span>
            </div>
          </div>
        </div>

        <div className="qv-body">
          <p className="qv-desc">{client.description}</p>
          <h3>Products</h3>
          {loadingProducts ? (
            <div style={{ padding: '1rem', color: '#999', textAlign: 'center' }}>Loading products…</div>
          ) : (
          <div className="qv-products">
            {products.map((p) => {
              const inCart = isInQuotation(client.id, p.id);
              return (
                <div key={p.id} className={`qv-product ${inCart ? 'in-cart' : ''}`}>
                  <div className="qvp-left">
                    <span className="qvp-emoji">{p.image}</span>
                    <div>
                      <div className="qvp-name">{p.name}</div>
                      <div className="qvp-unit">{p.unit}</div>
                    </div>
                  </div>
                  <div className="qvp-right">
                    <div className="qvp-price">₹{p.price.toLocaleString('en-IN')}</div>
                    <button
                      className={`qvp-add ${inCart ? 'added' : ''}`}
                      onClick={() => handleAdd(p)}
                      disabled={inCart}
                    >
                      {inCart ? '✓ Added' : '+ Quote'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>

        <div className="qv-footer">
          <button className="qv-view-full" onClick={() => { navigate(`/client/${client.slug}`); onClose(); }}>
            View Full Profile →
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
