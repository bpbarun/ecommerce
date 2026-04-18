import React from 'react';
import HeroBanner from '../components/HeroBanner';
import CategoryGrid from '../components/CategoryGrid';
import PremiumAdBanner from '../components/PremiumAdBanner';
import ClientCard from '../components/ClientCard';
import clients from '../data/clients.json';
import './HomePage.css';

const HomePage = () => {
  const premiumClients = clients.filter((c) => c.isPremium);

  return (
    <div className="home-page">
      <HeroBanner />
      <PremiumAdBanner />
      <CategoryGrid />

      <section className="featured-section">
        <div className="featured-inner">
          <div className="section-header">
            <h2 className="section-title">⭐ Featured Suppliers</h2>
            <p className="section-subtitle">
              Top-rated premium partners trusted by thousands of builders
            </p>
          </div>
          <div className="featured-grid">
            {premiumClients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="hiw-inner">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 12 }}>
            How BuildMart Works
          </h2>
          <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: 40 }}>
            Get the best deal in just 3 simple steps
          </p>
          <div className="hiw-steps">
            <div className="hiw-step">
              <div className="step-num">1</div>
              <div className="step-icon">🔍</div>
              <h3>Browse & Select</h3>
              <p>Choose a category and explore verified suppliers. Add products to your quote cart.</p>
            </div>
            <div className="hiw-connector">→</div>
            <div className="hiw-step">
              <div className="step-num">2</div>
              <div className="step-icon">📋</div>
              <h3>Submit Quotation</h3>
              <p>Fill in your requirements and submit a single quotation request to multiple suppliers.</p>
            </div>
            <div className="hiw-connector">→</div>
            <div className="hiw-step">
              <div className="step-num">3</div>
              <div className="step-icon">🤝</div>
              <h3>Compare & Deal</h3>
              <p>Suppliers respond with their best prices. You compare and choose the best offer.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-section">
        <div className="trust-inner">
          <div className="trust-item">
            <span className="trust-icon">✅</span>
            <div>
              <h4>Verified Suppliers</h4>
              <p>All suppliers are background checked and verified</p>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon">💰</span>
            <div>
              <h4>Best Prices</h4>
              <p>Compare quotes from multiple suppliers, get best deal</p>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon">⚡</span>
            <div>
              <h4>Fast Response</h4>
              <p>Suppliers typically respond within 24 hours</p>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon">🛡️</span>
            <div>
              <h4>Secure Platform</h4>
              <p>Your data and transactions are 100% protected</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
