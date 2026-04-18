import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuotation } from '../context/QuotationContext';
import './Navbar.css';

const Navbar = () => {
  const { cartItems } = useQuotation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🏗️</span>
          <div className="brand-text">
            <span className="brand-name">BuildMart</span>
            <span className="brand-tagline">Your Construction Partner</span>
          </div>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products, suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/categories" onClick={() => setMenuOpen(false)}>Categories</Link>
          <Link to="/quotations" onClick={() => setMenuOpen(false)}>My Quotations</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
        </div>

        <div className="navbar-actions">
          <Link to="/quotation-cart" className="cart-btn">
            <span className="cart-icon">📋</span>
            <span className="cart-label">Quote Cart</span>
            {cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.length}</span>
            )}
          </Link>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
