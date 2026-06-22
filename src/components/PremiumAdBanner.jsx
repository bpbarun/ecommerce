import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './PremiumAdBanner.css';

const PremiumAdBanner = () => {
  const [ads, setAds] = useState([]);
  const [currentAd, setCurrentAd] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.getAds(true).then(setAds).catch(() => {});
  }, []);

  useEffect(() => {
    if (ads.length === 0) return;
    const timer = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [ads]);

  if (ads.length === 0) return null;

  const ad = ads[currentAd];

  return (
    <section className="ad-section">
      <div className="ad-section-header">
        <span className="ad-label">⭐ Featured Partners</span>
        <div className="ad-dots">
          {ads.map((_, i) => (
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
        style={{ background: ad.bg_color, borderColor: ad.accent_color + '40' }}
      >
        <div className="ad-badge" style={{ background: ad.accent_color }}>
          {ad.badge}
        </div>
        <div className="ad-main">
          <div className="ad-emoji">{ad.emoji}</div>
          <div className="ad-text">
            <h3 className="ad-headline" style={{ color: ad.accent_color }}>
              {ad.headline}
            </h3>
            <p className="ad-subtext">{ad.subtext}</p>
            <p className="ad-client-name">by {ad.client_name}</p>
          </div>
          <button
            className="ad-cta"
            style={{ background: ad.accent_color }}
            onClick={() => navigate(`/category/${ad.category}`)}
          >
            {ad.cta} →
          </button>
        </div>
      </div>

      <div className="ad-strip">
        {ads.map((a, i) => (
          <div
            key={a.id}
            className={`ad-strip-item ${i === currentAd ? 'active' : ''}`}
            onClick={() => setCurrentAd(i)}
            style={{ borderColor: i === currentAd ? a.accent_color : 'transparent' }}
          >
            <span className="strip-emoji">{a.emoji}</span>
            <span className="strip-name">{a.client_name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PremiumAdBanner;
