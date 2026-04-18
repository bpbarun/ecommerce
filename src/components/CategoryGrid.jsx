import React from 'react';
import { useNavigate } from 'react-router-dom';
import categories from '../data/categories.json';
import clients from '../data/clients.json';
import './CategoryGrid.css';

const CategoryGrid = () => {
  const navigate = useNavigate();

  const getClientCount = (slug) =>
    clients.filter((c) => c.category === slug).length;

  return (
    <section className="category-section">
      <div className="category-section-inner">
        <div className="section-header">
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-subtitle">
            Explore verified suppliers across 10+ construction material categories
          </p>
        </div>
        <div className="category-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => navigate(`/category/${cat.slug}`)}
              style={{ '--cat-color': cat.color }}
            >
              <div className="cat-icon-wrap">
                <span className="cat-icon">{cat.icon}</span>
              </div>
              <h3 className="cat-name">{cat.name}</h3>
              <p className="cat-desc">{cat.description}</p>
              <div className="cat-footer">
                <span className="cat-count">
                  {getClientCount(cat.slug)} supplier{getClientCount(cat.slug) !== 1 ? 's' : ''}
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
