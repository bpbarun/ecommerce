import React from 'react';
import { Link } from 'react-router-dom';
import categories from '../data/categories.json';
import clients from '../data/clients.json';
import './CategoriesPage.css';

const CategoriesPage = () => {
  const getClientCount = (slug) => clients.filter((c) => c.category === slug).length;
  const getPremiumCount = (slug) => clients.filter((c) => c.category === slug && c.isPremium).length;

  return (
    <div className="categories-page">
      <div className="cat-page-hero-full">
        <div className="cat-hero-inner">
          <h1>All Categories</h1>
          <p>Find suppliers across {categories.length} construction material categories</p>
        </div>
      </div>

      <div className="categories-body">
        <div className="all-categories-grid">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="cat-full-card"
              style={{ '--cat-color': cat.color }}
            >
              <div className="cat-full-top">
                <div className="cat-full-icon-wrap">
                  <span className="cat-full-icon">{cat.icon}</span>
                </div>
                <div className="cat-full-info">
                  <h3>{cat.name}</h3>
                  <p>{cat.description}</p>
                </div>
              </div>
              <div className="cat-full-bottom">
                <div className="cat-stat">
                  <span className="cat-stat-num">{getClientCount(cat.slug)}</span>
                  <span className="cat-stat-label">Suppliers</span>
                </div>
                <div className="cat-stat">
                  <span className="cat-stat-num">{getPremiumCount(cat.slug)}</span>
                  <span className="cat-stat-label">Premium</span>
                </div>
                <div className="cat-view-btn">Browse →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
