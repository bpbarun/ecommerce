import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useQuotation } from '../context/QuotationContext';
import './Navbar.css';

const Navbar = () => {
  const { cartItems } = useQuotation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setSearchFocused(false);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🏗️</span>
          <div className="brand-text">
            <span className="brand-name">BuildMart</span>
            <span className="brand-tagline">Your Construction Partner</span>
          </div>
        </Link>

        <form className={`navbar-search ${searchFocused ? 'focused' : ''}`} onSubmit={handleSearch}>
          <span className="search-prefix">🔍</span>
          <input
            type="text"
            placeholder="Search products, suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchTerm && (
            <button type="button" className="search-clear-nav" onClick={() => setSearchTerm('')}>✕</button>
          )}
          <button type="submit" className="search-go">Search</button>
        </form>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
          <NavLink to="/categories" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>Categories</NavLink>
          <NavLink to="/quotations" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>My Quotations</NavLink>
        </div>

        <div className="navbar-actions">
          <Link to="/quotation-cart" className="cart-btn">
            <span className="cart-icon">📋</span>
            <span className="cart-label">Quote Cart</span>
            {cartItems.length > 0 && (
              <span className="cart-badge" key={cartItems.length}>{cartItems.length}</span>
            )}
          </Link>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="menu">
            <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
            <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
            <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
