import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QuotationProvider } from './context/QuotationContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryPage from './pages/CategoryPage';
import ClientDetailPage from './pages/ClientDetailPage';
import QuotationCartPage from './pages/QuotationCartPage';
import MyQuotationsPage from './pages/MyQuotationsPage';
import SearchPage from './pages/SearchPage';
import './App.css';

function App() {
  return (
    <QuotationProvider>
      <Router>
        <div className="app-layout">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/client/:slug" element={<ClientDetailPage />} />
              <Route path="/quotation-cart" element={<QuotationCartPage />} />
              <Route path="/quotations" element={<MyQuotationsPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </QuotationProvider>
  );
}

export default App;
