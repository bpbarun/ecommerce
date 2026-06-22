import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ClientCard from '../components/ClientCard';
import { api } from '../services/api';
import './CategoryPage.css';

const SORT_OPTIONS = [
  { value: 'rating',  label: '⭐ Top Rated' },
  { value: 'reviews', label: '💬 Most Reviews' },
  { value: 'name',    label: '🔤 Name A–Z' },
  { value: 'premium', label: '👑 Premium First' },
];

const CategoryPage = () => {
  const { slug } = useParams();
  const [sortBy, setSortBy] = useState('rating');
  const [filterPremium, setFilterPremium] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [category, setCategory] = useState(null);
  const [allClients, setAllClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoaded(false);
    setLoading(true);
    Promise.all([
      api.getCategories(),
      api.getClients({ category: slug }),
    ]).then(([cats, cls]) => {
      setCategory(cats.find((c) => c.slug === slug) || null);
      setAllClients(cls);
      setLoading(false);
      setTimeout(() => setLoaded(true), 80);
    }).catch(() => setLoading(false));
  }, [slug]);

  let filtered = allClients;
  if (filterPremium) filtered = filtered.filter((c) => c.isPremium);
  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
  }

  if (sortBy === 'rating')  filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  if (sortBy === 'reviews') filtered = [...filtered].sort((a, b) => b.reviews - a.reviews);
  if (sortBy === 'name')    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === 'premium') filtered = [...filtered].sort((a, b) => (b.isPremium ? 1 : 0) - (a.isPremium ? 1 : 0));

  if (loading) {
    return <div className="not-found" style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (!category) {
    return (
      <div className="not-found">
        <h2>Category not found</h2>
        <Link to="/categories">Browse all categories</Link>
      </div>
    );
  }

  const premiumCount = allClients.filter((c) => c.isPremium).length;
  const productCount = allClients.reduce((s, c) => s + (c.products?.length || 0), 0);

  return (
    <div className="category-page">
      <div className="cat-page-hero" style={{ background: `linear-gradient(135deg, ${category.color}55, ${category.color}22)` }}>
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
          <div className="cat-stat-pills">
            <div className="stat-pill">
              <span className="sp-num">{allClients.length}</span>
              <span className="sp-label">Total Suppliers</span>
            </div>
            <div className="stat-pill">
              <span className="sp-num">{premiumCount}</span>
              <span className="sp-label">Premium Partners</span>
            </div>
            <div className="stat-pill">
              <span className="sp-num">{productCount}</span>
              <span className="sp-label">Products Listed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cat-page-body">
        <div className="cat-toolbar">
          <div className="cat-search-wrap">
            <span className="search-ico">🔍</span>
            <input
              type="text"
              placeholder={`Search ${category.name} suppliers...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="cat-search-input"
            />
            {searchTerm && (
              <button className="search-clear" onClick={() => setSearchTerm('')}>✕</button>
            )}
          </div>

          <div className="sort-tabs">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`sort-tab ${sortBy === opt.value ? 'active' : ''}`}
                onClick={() => setSortBy(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <label className="toggle-premium">
            <input
              type="checkbox"
              checked={filterPremium}
              onChange={(e) => setFilterPremium(e.target.checked)}
            />
            <span className="toggle-track">
              <span className="toggle-thumb" />
            </span>
            <span>Premium only</span>
          </label>
        </div>

        {searchTerm || filterPremium ? (
          <div className="results-bar">
            Showing <strong>{filtered.length}</strong> of {allClients.length} suppliers
            {(searchTerm || filterPremium) && (
              <button className="clear-all-btn" onClick={() => { setSearchTerm(''); setFilterPremium(false); }}>
                Clear all filters
              </button>
            )}
          </div>
        ) : null}

        {filtered.length === 0 ? (
          <div className="no-results">
            <span>😔</span>
            <p>No suppliers match your filters.</p>
            <button onClick={() => { setSearchTerm(''); setFilterPremium(false); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={`clients-grid ${loaded ? 'loaded' : ''}`}>
            {filtered.map((client, idx) => (
              <ClientCard key={client.id} client={client} animDelay={idx * 80} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
