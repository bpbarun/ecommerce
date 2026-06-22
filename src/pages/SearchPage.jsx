import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ClientCard from '../components/ClientCard';
import { api } from '../services/api';
import './SearchPage.css';

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const [clients, setClients] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    Promise.all([api.getClients(), api.getCategories()])
      .then(([cls, cats]) => { setClients(cls); setCategories(cats); })
      .catch(() => {});
  }, []);

  const q = query.toLowerCase();

  const matchedClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
  );

  const matchedCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(q) ||
      (cat.description || '').toLowerCase().includes(q)
  );

  return (
    <div className="search-page">
      <div className="search-header">
        <div className="search-header-inner">
          <h1>Search Results for "{query}"</h1>
          <p>
            Found {matchedClients.length} supplier(s) and {matchedCategories.length} categor(ies)
          </p>
        </div>
      </div>

      <div className="search-body">
        {matchedCategories.length > 0 && (
          <section className="search-section">
            <h2>Categories</h2>
            <div className="search-cats">
              {matchedCategories.map((cat) => (
                <Link key={cat.id} to={`/category/${cat.slug}`} className="search-cat-chip">
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {matchedClients.length > 0 ? (
          <section className="search-section">
            <h2>Suppliers ({matchedClients.length})</h2>
            <div className="search-clients-grid">
              {matchedClients.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
          </section>
        ) : (
          <div className="no-results">
            <span>🔍</span>
            <h3>No results found</h3>
            <p>Try different keywords or browse all categories.</p>
            <Link to="/categories" className="browse-all-btn">Browse All Categories</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
