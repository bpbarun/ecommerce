import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroBanner.css';

const slides = [
  {
    title: "Find the Best Construction Suppliers",
    subtitle: "Compare prices, get multiple quotations and build with confidence",
    emoji: "🏗️",
    bg: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 50%, #533483 100%)",
    cta: "Browse Categories",
    link: "/categories"
  },
  {
    title: "Premium Bricks & Building Materials",
    subtitle: "Verified suppliers • Competitive pricing • Bulk discounts available",
    emoji: "🧱",
    bg: "linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #FF7043 100%)",
    cta: "Shop Bricks",
    link: "/category/bricks"
  },
  {
    title: "Glass Solutions for Modern Architecture",
    subtitle: "Tempered • Laminated • Insulated • Custom fabrication",
    emoji: "🪟",
    bg: "linear-gradient(135deg, #0277BD 0%, #0288D1 50%, #29B6F6 100%)",
    cta: "Explore Glass",
    link: "/category/glass"
  },
  {
    title: "Get Multiple Quotations Instantly",
    subtitle: "Select products from different suppliers and get the best deal",
    emoji: "📋",
    bg: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #43A047 100%)",
    cta: "Start Quoting",
    link: "/categories"
  }
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div className="hero-banner" style={{ background: slide.bg }}>
      <div className="hero-content">
        <div className="hero-emoji">{slide.emoji}</div>
        <h1 className="hero-title">{slide.title}</h1>
        <p className="hero-subtitle">{slide.subtitle}</p>
        <div className="hero-actions">
          <button
            className="hero-cta-primary"
            onClick={() => navigate(slide.link)}
          >
            {slide.cta}
          </button>
          <button
            className="hero-cta-secondary"
            onClick={() => navigate('/quotation-cart')}
          >
            📋 View Quote Cart
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat"><span className="stat-num">500+</span><span className="stat-label">Suppliers</span></div>
          <div className="stat-divider"></div>
          <div className="stat"><span className="stat-num">10K+</span><span className="stat-label">Products</span></div>
          <div className="stat-divider"></div>
          <div className="stat"><span className="stat-num">50K+</span><span className="stat-label">Quotations</span></div>
          <div className="stat-divider"></div>
          <div className="stat"><span className="stat-num">20+</span><span className="stat-label">Categories</span></div>
        </div>
      </div>
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
