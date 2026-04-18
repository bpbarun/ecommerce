import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ClientCard from '../components/ClientCard';
import clients from '../data/clients.json';
import categories from '../data/categories.json';
import './CategoryPage.css';

const CategoryPage = () => {
  const { slug } = useParams();
  const [sortBy, setSortBy] = useState('rating');
  const [filterPremium, setFilterPremium] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const category = categories.find((c) => c.slug === slug);
  const allCategoryClients = clients.filter((c) => c.category === slug);

  let filtered = allCategoryClients;
  if (filterPremium) filtered = filtered.filter((c) => c.isPremium);
  if (searchTerm) {
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  else if (sortBy === 'reviews') filtered = [...filtered].sort((a, b) => b.reviews - a.reviews);
  else if (sortBy === 'name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === 'premium') filtered = [...filtered].sort((a, b) => (b.isPremium ? 1 : 0) - (a.isPremium ? 1 : 0));

  if (!category) {
    return (
      <div className="not-found">
        <h2>Category not found</h2>
        <Link to="/categories">Browse all categories</Link>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="cat-page-hero" style={{ background: `linear-gradient(135deg, ${category.color}33, ${category.color}11)` }}>
        <div className="cat-page-hero-inner">
          <div className="cat-breadcrumb">
            <Link to="/">Home</Link> <span>›</span>
            <Link to="/categories">Categories</Link> <span>›</span>
            <span>{category.name}</span>
          </div>
          <div className="cat-page-title">
            <span className="cat-page-icon">{category.icon}</span>
            <div>
              <h1>{category.name} Suppliers</h1>
              <p>{category.description}</p>
            </div>
          </div>
          <div className="cat-stats">
            <span>{allCategoryClients.length} suppliers found</span>
            <span>•</span>
            <span>{allCategoryClients.filter((c) => c.isPremium).length} premium partners</span>
          </div>
        </div>
      </div>

      <div className="cat-page-body">
        <div className="cat-filters">
          <div className="filter-left">
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-search"
            />
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={filterPremium}
                onChange={(e) => setFilterPremium(e.target.checked)}
              />
              <span>Premium only</span>
            </label>
          </div>
          <div className="filter-right">
            <label className="filter-label">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="rating">Rating</option>
              <option value="reviews">Most Reviews</option>
              <option value="name">Name A–Z</option>
              <option value="premium">Premium First</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="no-results">
            <span>😔</span>
            <p>No suppliers found matching your criteria.</p>
            <button onClick={() => { setSearchTerm(''); setFilterPremium(false); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="clients-grid">
            {filtered.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
