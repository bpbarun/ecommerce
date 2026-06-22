import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuotation } from '../context/QuotationContext';
import './FloatingCart.css';

const FloatingCart = () => {
  const { cartItems } = useQuotation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [bump, setBump] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  useEffect(() => {
    if (cartItems.length > 0) {
      setVisible(true);
    }
    if (cartItems.length > prevCount) {
      setBump(true);
      setTimeout(() => setBump(false), 400);
    }
    setPrevCount(cartItems.length);
  }, [cartItems.length]);

  if (!visible || cartItems.length === 0) return null;

  const suppliers = new Set(cartItems.map((i) => i.clientId)).size;

  return (
    <div className={`floating-cart ${bump ? 'bump' : ''}`} onClick={() => navigate('/quotation-cart')}>
      <div className="fc-icon">📋</div>
      <div className="fc-info">
        <span className="fc-title">Quote Cart</span>
        <span className="fc-sub">{cartItems.length} item{cartItems.length > 1 ? 's' : ''} · {suppliers} supplier{suppliers > 1 ? 's' : ''}</span>
      </div>
      <div className="fc-badge">{cartItems.length}</div>
      <div className="fc-arrow">→</div>
    </div>
  );
};

export default FloatingCart;
