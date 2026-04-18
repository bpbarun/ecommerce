import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-icon">🏗️</span>
              <span className="footer-logo-name">BuildMart</span>
            </div>
            <p className="footer-desc">
              India's leading construction materials marketplace. Connect with verified suppliers,
              get multiple quotations and build smarter.
            </p>
            <div className="footer-social">
              <a href="#!" className="social-link">📘 Facebook</a>
              <a href="#!" className="social-link">📸 Instagram</a>
              <a href="#!" className="social-link">💼 LinkedIn</a>
            </div>
          </div>

          <div className="footer-links-group">
            <h4>Categories</h4>
            <Link to="/category/bricks">Bricks</Link>
            <Link to="/category/glass">Glass</Link>
            <Link to="/category/cement">Cement</Link>
            <Link to="/category/steel">Steel</Link>
            <Link to="/category/tiles">Tiles</Link>
            <Link to="/categories">View All →</Link>
          </div>

          <div className="footer-links-group">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/categories">All Categories</Link>
            <Link to="/quotation-cart">Quote Cart</Link>
            <Link to="/quotations">My Quotations</Link>
            <Link to="/about">About Us</Link>
          </div>

          <div className="footer-links-group">
            <h4>Contact Us</h4>
            <p>📍 BuildMart HQ, MG Road</p>
            <p>Bangalore – 560001</p>
            <p>📞 +91 80 1234 5678</p>
            <p>✉️ hello@buildmart.in</p>
            <p>🕐 Mon–Sat: 9am – 6pm</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 BuildMart. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#!">Privacy Policy</a>
            <a href="#!">Terms of Service</a>
            <a href="#!">Advertise With Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
