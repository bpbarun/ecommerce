import React, { useEffect, useRef, useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import CategoryGrid from '../components/CategoryGrid';
import PremiumAdBanner from '../components/PremiumAdBanner';
import ClientCard from '../components/ClientCard';
import { api } from '../services/api';
import './HomePage.css';

const useReveal = (ref, data) => {
  useEffect(() => {
    const els = ref.current?.querySelectorAll('.fade-up');
    if (!els || els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
};

const HomePage = () => {
  const [premiumClients, setPremiumClients] = useState([]);
  const featuredRef = useRef(null);
  const hiwRef = useRef(null);
  useReveal(featuredRef, premiumClients);
  useReveal(hiwRef);

  useEffect(() => {
    api.getClients({ premium: 1 }).then(setPremiumClients).catch(() => {});
  }, []);

  return (
    <div className="home-page">
      <HeroBanner />
      <PremiumAdBanner />
      <CategoryGrid />

      <section className="featured-section" ref={featuredRef}>
        <div className="featured-inner">
          <div className="section-header fade-up">
            <span className="section-badge">⭐ Featured</span>
            <h2 className="section-title">Top-Rated Suppliers</h2>
            <p className="section-subtitle">
              Premium partners trusted by thousands of builders across India
            </p>
          </div>
          <div className="featured-grid">
            {premiumClients.map((client, idx) => (
              <div className="fade-up" key={client.id} style={{ animationDelay: `${idx * 100}ms` }}>
                <ClientCard client={client} animDelay={idx * 100} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="how-it-works" ref={hiwRef}>
        <div className="hiw-inner">
          <div className="section-header fade-up">
            <span className="section-badge">🚀 How it Works</span>
            <h2 className="section-title">Get Quotes in 3 Simple Steps</h2>
          </div>
          <div className="hiw-steps">
            {[
              { num: '1', icon: '🔍', title: 'Browse & Select', desc: 'Choose a category and explore verified suppliers. Add products from multiple suppliers to your quote cart.' },
              { num: '2', icon: '📋', title: 'Submit Quotation', desc: 'Fill your project details and submit a single quotation request to all selected suppliers instantly.' },
              { num: '3', icon: '🤝', title: 'Compare & Deal', desc: 'Suppliers respond with their best prices. You compare offers and choose the best deal for your project.' },
            ].map((step, idx) => (
              <React.Fragment key={step.num}>
                {idx > 0 && <div className="hiw-connector fade-up" style={{ animationDelay: `${idx * 150 + 100}ms` }}>→</div>}
                <div className="hiw-step fade-up" style={{ animationDelay: `${idx * 150}ms` }}>
                  <div className="step-num-badge">{step.num}</div>
                  <span className="step-icon">{step.icon}</span>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-bar">
        <div className="trust-inner">
          {[
            { icon: '✅', title: 'Verified Suppliers', desc: 'All suppliers background-checked & verified' },
            { icon: '💰', title: 'Best Prices', desc: 'Compare quotes, get the best market rate' },
            { icon: '⚡', title: 'Fast Response', desc: 'Suppliers respond within 24 hours' },
            { icon: '🛡️', title: 'Secure Platform', desc: 'Your data & transactions are protected' },
          ].map((item) => (
            <div key={item.title} className="trust-item">
              <span className="trust-icon">{item.icon}</span>
              <div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
