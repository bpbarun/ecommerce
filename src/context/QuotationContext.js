import React, { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const QuotationContext = createContext();

export const useQuotation = () => useContext(QuotationContext);

export const QuotationProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [submittedQuotations, setSubmittedQuotations] = useState([]);

  const addToQuotation = (client, product) => {
    const exists = cartItems.find(
      (item) => item.clientId === client.id && item.productId === product.id
    );
    if (!exists) {
      setCartItems((prev) => [
        ...prev,
        {
          clientId: client.id,
          clientName: client.name,
          productId: product.id,
          productName: product.name,
          price: product.price,
          unit: product.unit,
          category: client.category,
          quantity: 1,
        },
      ]);
    }
  };

  const removeFromQuotation = (clientId, productId) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.clientId === clientId && item.productId === productId))
    );
  };

  const updateQuantity = (clientId, productId, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.clientId === clientId && item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const submitQuotation = async (formData) => {
    const payload = {
      name:    formData.name,
      email:   formData.email,
      phone:   formData.phone,
      company: formData.company,
      notes:   formData.notes,
      items: cartItems.map((item) => ({
        product_id: item.productId,
        client_id:  item.clientId,
        quantity:   item.quantity,
      })),
    };

    try {
      const quotation = await api.createQuotation(payload);
      setSubmittedQuotations((prev) => [quotation, ...prev]);
      clearCart();
      return quotation;
    } catch {
      // fallback: store locally if API unavailable
      const quotation = { id: Date.now(), ...formData, items: cartItems, status: 'pending' };
      setSubmittedQuotations((prev) => [quotation, ...prev]);
      clearCart();
      return quotation;
    }
  };

  const isInQuotation = (clientId, productId) =>
    cartItems.some((item) => item.clientId === clientId && item.productId === productId);

  return (
    <QuotationContext.Provider
      value={{
        cartItems,
        submittedQuotations,
        addToQuotation,
        removeFromQuotation,
        updateQuantity,
        clearCart,
        submitQuotation,
        isInQuotation,
      }}
    >
      {children}
    </QuotationContext.Provider>
  );
};
