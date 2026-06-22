import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuotation } from '../context/QuotationContext';
import { showToast } from '../components/Toast';
import { api } from '../services/api';
import './ClientDetailPage.css';

const ClientDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToQuotation, isInQuotation, cartItems } = useQuotation();
  const [addedFeedback, setAddedFeedback] = useState({});
  const [client, setClient] = useState(null);
  const [category, setCategory] = useState(null);
  const [relatedClients, setRelatedClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getClient(slug)
      .then(async (c) => {
        setClient(c);
        const [cats, related] = await Promise.all([
          api.getCategories(),
          api.getClients({ category: c.category }),
        ]);
        setCategory(cats.find((cat) => cat.slug === c.category) || null);
        setRelatedClients(related.filter((r) => r.id !== c.id).slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleAddToQuote = (product) => {
    addToQuotation(client, product);
    setAddedFeedback((prev) => ({ ...prev, [product.id]: true }));
    showToast(`${product.name} added to Quote Cart! 🎉`, 'success');
    setTimeout(() => {
      setAddedFeedback((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
      <span className="stars-lg">
        {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
      </span>
    );
  };

  if (loading) {
    return <div className="not-found-page" style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (!client) {
    return (
      <div className="not-found-page">
        <h2>Supplier not found</h2>
        <Link to="/">Go Home</Link>
      </div>
    );
  }

  const logoColor = client.logoColor || client.logo_color;

  return (
    <div className="client-detail-page">
      <div className="detail-hero" style={{ background: `linear-gradient(135deg, ${logoColor}22, ${logoColor}08)` }}>
        <div className="detail-hero-inner">
          <div className="detail-breadcrumb">
            <Link to="/">Home</Link> <span>›</span>
            <Link to="/categories">Categories</Link> <span>›</span>
            {category && <><Link to={`/category/${category.slug}`}>{category.name}</Link><span>›</span></>}
            <span>{client.name}</span>
          </div>

          <div className="detail-header">
            <div className="detail-logo" style={{ background: logoColor }}>
              {client.logo}
            </div>
            <div className="detail-info">
              <div className="detail-name-row">
                <h1>{client.name}</h1>
                {client.isPremium && <span className="premium-tag">⭐ Premium Partner</span>}
              </div>
              <p className="detail-tagline">"{client.tagline}"</p>
              <div className="detail-rating">
                {renderStars(client.rating)}
                <span className="rating-val">{client.rating}</span>
                <span className="rating-cnt">({client.reviews} reviews)</span>
              </div>
              <div className="detail-contact-row">
                <span>📞 {client.phone}</span>
                <span>✉️ {client.email}</span>
                <span>📍 {client.address}</span>
                <span>🏭 {client.experience} experience</span>
              </div>
            </div>
            <div className="detail-quick-actions">
              {cartItems.length > 0 && (
                <button
                  className="go-to-cart-btn"
                  onClick={() => navigate('/quotation-cart')}
                >
                  📋 View Cart ({cartItems.length})
                </button>
              )}
            </div>
          </div>

          <div className="detail-desc-box">
            <h3>About</h3>
            <p>{client.description}</p>
          </div>
        </div>
      </div>

      <div className="detail-body">
        <div className="products-section">
          <div className="products-header">
            <h2>Products & Services</h2>
            <p>Select products to add to your quotation request</p>
          </div>
          <div className="products-list">
            {(client.products || []).map((product) => {
              const inCart = isInQuotation(client.id, product.id);
              const justAdded = addedFeedback[product.id];
              return (
                <div key={product.id} className={`product-card ${inCart ? 'in-cart' : ''}`}>
                  {inCart && <div className="in-cart-badge">✓ In Quote Cart</div>}
                  <div className="product-card-left">
                    <span className="product-emoji">{product.image}</span>
                  </div>
                  <div className="product-card-body">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-desc">{product.description}</p>
                    <div className="product-specs">
                      {(product.specs || []).map((spec, i) => (
                        <span key={i} className="spec-tag">{spec}</span>
                      ))}
                    </div>
                    <div className="product-meta-row">
                      <span className="min-order">Min. Order: {product.minOrder}</span>
                    </div>
                  </div>
                  <div className="product-card-right">
                    <div className="product-price">
                      <span className="price-amount">₹{Number(product.price).toLocaleString('en-IN')}</span>
                      <span className="price-unit">{product.unit}</span>
                    </div>
                    <button
                      className={`add-quote-btn ${inCart ? 'added' : ''} ${justAdded ? 'just-added' : ''}`}
                      onClick={() => handleAddToQuote(product)}
                      disabled={inCart}
                    >
                      {justAdded ? '✓ Added!' : inCart ? '✓ In Cart' : '+ Add to Quote'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="related-section">
          <h3>Other Suppliers in {category?.name}</h3>
          <div className="related-list">
            {relatedClients.map((c) => (
              <div
                key={c.id}
                className="related-card"
                onClick={() => navigate(`/client/${c.slug}`)}
              >
                <div className="related-logo" style={{ background: c.logoColor || c.logo_color }}>
                  {c.logo}
                </div>
                <div className="related-info">
                  <span className="related-name">{c.name}</span>
                  <span className="related-rating">★ {c.rating}</span>
                </div>
                <span className="related-arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailPage;
