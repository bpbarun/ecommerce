import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './CategoryGrid.css';

const CategoryGrid = () => {
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  const getClientCount = (cat) => cat.supplier_count ?? 0;

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.category-card');
    if (!cards || cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [categories]);

  const handleClick = (e, slug) => {
    const card = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = card.getBoundingClientRect();
    ripple.className = 'ripple';
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top  = `${e.clientY - rect.top}px`;
    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    setTimeout(() => navigate(`/category/${slug}`), 180);
  };

  return (
    <section className="category-section">
      <div className="category-section-inner">
        <div className="section-header">
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-subtitle">
            Explore verified suppliers across 10+ construction material categories
          </p>
        </div>
        <div className="category-grid" ref={gridRef}>
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="category-card"
              style={{ '--cat-color': cat.color, '--delay': `${idx * 60}ms` }}
              onClick={(e) => handleClick(e, cat.slug)}
            >
              <div className="cat-glow" style={{ background: cat.color }} />
              <div className="cat-icon-wrap">
                <span className="cat-icon">{cat.icon}</span>
              </div>
              <h3 className="cat-name">{cat.name}</h3>
              <p className="cat-desc">{cat.description}</p>
              <div className="cat-footer">
                <span className="cat-count">
                  {getClientCount(cat)} supplier{getClientCount(cat) !== 1 ? 's' : ''}
                </span>
                <span className="cat-arrow">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
