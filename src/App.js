import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Storefront
import { QuotationProvider } from './context/QuotationContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import FloatingCart from './components/FloatingCart';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryPage from './pages/CategoryPage';
import ClientDetailPage from './pages/ClientDetailPage';
import QuotationCartPage from './pages/QuotationCartPage';
import MyQuotationsPage from './pages/MyQuotationsPage';
import SearchPage from './pages/SearchPage';

// Admin
import { AdminProvider } from './admin/context/AdminContext';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminCategories from './admin/pages/AdminCategories';
import AdminClients from './admin/pages/AdminClients';
import AdminAdvertisements from './admin/pages/AdminAdvertisements';
import AdminQuotations from './admin/pages/AdminQuotations';

import './App.css';

const StorefrontLayout = () => (
  <QuotationProvider>
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
      <FloatingCart />
      <Toast />
    </div>
  </QuotationProvider>
);

function App() {
  return (
    <AdminProvider>
      <Router>
        <Routes>
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/*" element={
            <AdminLayout />
          }>
            <Route path="dashboard"      element={<AdminDashboard />} />
            <Route path="categories"     element={<AdminCategories />} />
            <Route path="clients"        element={<AdminClients />} />
            <Route path="advertisements" element={<AdminAdvertisements />} />
            <Route path="quotations"     element={
              <QuotationProvider>
                <AdminQuotations />
              </QuotationProvider>
            } />
          </Route>

          {/* Storefront routes */}
          <Route path="/*" element={<StorefrontLayout />} />
        </Routes>
      </Router>
    </AdminProvider>
  );
}

export default App;
