import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import advertisements from '../data/advertisements.json';
import './PremiumAdBanner.css';

const PremiumAdBanner = () => {
  const [currentAd, setCurrentAd] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % advertisements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const ad = advertisements[currentAd];

  return (
    <section className="ad-section">
      <div className="ad-section-header">
        <span className="ad-label">⭐ Featured Partners</span>
        <div className="ad-dots">
          {advertisements.map((_, i) => (
            <button
              key={i}
              className={`ad-dot ${i === currentAd ? 'active' : ''}`}
              onClick={() => setCurrentAd(i)}
            />
          ))}
        </div>
      </div>

      <div
        className="ad-banner"
        style={{ background: ad.bgColor, borderColor: ad.accentColor + '40' }}
      >
        <div className="ad-badge" style={{ background: ad.accentColor }}>
          {ad.badge}
        </div>
        <div className="ad-main">
          <div className="ad-emoji">{ad.emoji}</div>
          <div className="ad-text">
            <h3 className="ad-headline" style={{ color: ad.accentColor }}>
              {ad.headline}
            </h3>
            <p className="ad-subtext">{ad.subtext}</p>
            <p className="ad-client-name">by {ad.clientName}</p>
          </div>
          <button
            className="ad-cta"
            style={{ background: ad.accentColor }}
            onClick={() => navigate(`/category/${ad.category}`)}
          >
            {ad.cta} →
          </button>
        </div>
      </div>

      <div className="ad-strip">
        {advertisements.map((a, i) => (
          <div
            key={a.id}
            className={`ad-strip-item ${i === currentAd ? 'active' : ''}`}
            onClick={() => setCurrentAd(i)}
            style={{ borderColor: i === currentAd ? a.accentColor : 'transparent' }}
          >
            <span className="strip-emoji">{a.emoji}</span>
            <span className="strip-name">{a.clientName}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PremiumAdBanner;
