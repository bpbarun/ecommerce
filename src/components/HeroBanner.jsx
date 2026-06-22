import React, { useState, useEffect, useRef } from 'react';
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
    subtitle: "Verified suppliers · Competitive pricing · Bulk discounts available",
    emoji: "🧱",
    bg: "linear-gradient(135deg, #7B2D00 0%, #C0390B 50%, #E17055 100%)",
    cta: "Shop Bricks",
    link: "/category/bricks"
  },
  {
    title: "Glass Solutions for Modern Architecture",
    subtitle: "Tempered · Laminated · Insulated · Custom fabrication",
    emoji: "🪟",
    bg: "linear-gradient(135deg, #013A63 0%, #0277BD 50%, #0288D1 100%)",
    cta: "Explore Glass",
    link: "/category/glass"
  },
  {
    title: "Get Multiple Quotations Instantly",
    subtitle: "Select products from different suppliers and get the best deal",
    emoji: "📋",
    bg: "linear-gradient(135deg, #0D3B1E 0%, #1B5E20 50%, #2E7D32 100%)",
    cta: "Start Quoting",
    link: "/categories"
  }
];

const stats = [
  { end: 500, suffix: '+', label: 'Suppliers' },
  { end: 10,  suffix: 'K+', label: 'Products' },
  { end: 50,  suffix: 'K+', label: 'Quotations' },
  { end: 20,  suffix: '+', label: 'Categories' },
];

function useCountUp(end, duration = 1800, active) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [active, end, duration]);
  return count;
}

const StatItem = ({ stat, active }) => {
  const count = useCountUp(stat.end, 1600, active);
  return (
    <div className="stat">
      <span className="stat-num">{count}{stat.suffix}</span>
      <span className="stat-label">{stat.label}</span>
    </div>
  );
};

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [statsActive, setStatsActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setStatsActive(true), 600);
  }, []);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const goTo = (i) => {
    setCurrent(i);
    setPaused(true);
    clearInterval(timerRef.current);
    setTimeout(() => setPaused(false), 6000);
  };

  const slide = slides[current];

  return (
    <div className="hero-banner" style={{ background: slide.bg }}>
      <div className="hero-bg-pattern" />

      <div className="hero-content">
        <div className="hero-emoji" key={current}>{slide.emoji}</div>
        <h1 className="hero-title" key={`t${current}`}>{slide.title}</h1>
        <p className="hero-subtitle" key={`s${current}`}>{slide.subtitle}</p>

        <div className="hero-actions">
          <button className="hero-cta-primary" onClick={() => navigate(slide.link)}>
            {slide.cta}
          </button>
          <button className="hero-cta-secondary" onClick={() => navigate('/quotation-cart')}>
            📋 View Quote Cart
          </button>
        </div>

        <div className="hero-stats">
          {stats.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div className="stat-divider" />}
              <StatItem stat={s} active={statsActive} />
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="hero-controls">
        <button className="hero-prev" onClick={() => goTo((current - 1 + slides.length) % slides.length)}>‹</button>
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button key={i} className={`dot ${i === current ? 'active' : ''}`} onClick={() => goTo(i)} />
          ))}
        </div>
        <button className="hero-next" onClick={() => goTo((current + 1) % slides.length)}>›</button>
      </div>

      <div className="hero-progress-bar">
        <div
          key={current}
          className="hero-progress-fill"
          style={{ animationDuration: paused ? '0ms' : '4500ms' }}
        />
      </div>
    </div>
  );
};

export default HeroBanner;
