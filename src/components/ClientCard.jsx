import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ClientCard.css';

const ClientCard = ({ client }) => {
  const navigate = useNavigate();

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
      <span className="stars">
        {'★'.repeat(full)}
        {half ? '½' : ''}
        {'☆'.repeat(5 - full - (half ? 1 : 0))}
      </span>
    );
  };

  return (
    <div className="client-card" onClick={() => navigate(`/client/${client.slug}`)}>
      {client.isPremium && (
        <div className="premium-badge">⭐ Premium</div>
      )}
      <div className="client-card-header" style={{ background: client.logoColor + '18' }}>
        <div className="client-logo" style={{ background: client.logoColor }}>
          {client.logo}
        </div>
        <div className="client-basic">
          <h3 className="client-name">{client.name}</h3>
          <p className="client-tagline">"{client.tagline}"</p>
        </div>
      </div>
      <div className="client-card-body">
        <p className="client-desc">{client.description.substring(0, 110)}...</p>
        <div className="client-meta">
          <span className="meta-item">🏭 {client.experience}</span>
          <span className="meta-item">📍 {client.address.split(',').slice(-2).join(',').trim()}</span>
        </div>
        <div className="client-rating">
          {renderStars(client.rating)}
          <span className="rating-num">{client.rating}</span>
          <span className="rating-reviews">({client.reviews} reviews)</span>
        </div>
        <div className="client-products-preview">
          <span className="products-label">Products:</span>
          {client.products.slice(0, 2).map((p) => (
            <span key={p.id} className="product-chip">{p.name}</span>
          ))}
          {client.products.length > 2 && (
            <span className="product-chip more">+{client.products.length - 2} more</span>
          )}
        </div>
      </div>
      <div className="client-card-footer">
        <button
          className="view-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/client/${client.slug}`);
          }}
        >
          View Details & Quote
        </button>
      </div>
    </div>
  );
};

export default ClientCard;
