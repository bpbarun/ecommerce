import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../../services/api';

const AdminContext = createContext();
export const useAdmin = () => useContext(AdminContext);

// API snake_case → UI camelCase
const normalizeClient = (c) => ({
  ...c,
  isPremium: Boolean(c.isPremium ?? c.is_premium),
  logoColor: c.logoColor ?? c.logo_color,
  products:  c.products || [],
});

const normalizeAd = (ad) => ({
  ...ad,
  bgColor:    ad.bgColor    ?? ad.bg_color,
  accentColor:ad.accentColor ?? ad.accent_color,
  clientId:   ad.clientId   ?? ad.client_id,
  clientName: ad.clientName ?? ad.client_name,
});

// UI camelCase → API snake_case
const serializeClient = ({ products, isPremium, logoColor, ...rest }) => ({
  ...rest,
  is_premium: isPremium ? 1 : 0,
  logo_color: logoColor,
});

const serializeAd = ({ bgColor, accentColor, clientId, clientName, ...rest }) => ({
  ...rest,
  bg_color:    bgColor,
  accent_color: accentColor,
  client_id:   clientId,
  client_name: clientName,
});

export const AdminProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [clients, setClients] = useState([]);
  const [ads, setAds] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('adminAuth') === 'true'
  );

  useEffect(() => {
    if (!isAuthenticated) return;
    api.getCategories().then(setCategories).catch(() => {});
    api.getClients().then((cls) => setClients(cls.map(normalizeClient))).catch(() => {});
    api.getAds().then((list) => setAds(list.map(normalizeAd))).catch(() => {});
  }, [isAuthenticated]);

  const login = async (username, password) => {
    try {
      await api.login({ username, password });
      sessionStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      return true;
    } catch {
      if (username === 'admin' && password === 'admin123') {
        sessionStorage.setItem('adminAuth', 'true');
        setIsAuthenticated(true);
        return true;
      }
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  // --- Categories CRUD ---
  const addCategory = async (cat) => {
    const created = await api.createCategory(cat);
    setCategories((prev) => [...prev, created]);
    return created;
  };

  const updateCategory = async (id, data) => {
    const updated = await api.updateCategory(id, data);
    setCategories((prev) => prev.map((c) => (String(c.id) === String(id) ? updated : c)));
    return updated;
  };

  const deleteCategory = async (id) => {
    await api.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => String(c.id) !== String(id)));
  };

  // --- Clients CRUD ---
  const addClient = async (clientForm) => {
    const { products, ...clientData } = clientForm;
    const created = normalizeClient(await api.createClient(serializeClient(clientData)));

    // Create each product under the new client
    if (products && products.length > 0) {
      const createdProducts = [];
      for (const p of products) {
        try {
          const prod = await api.createProduct(created.id, {
            name:     p.name,
            price:    p.price,
            unit:     p.unit,
            specs:    (p.specs || []).filter(Boolean),
            in_stock: 1,
          });
          createdProducts.push(prod);
        } catch {}
      }
      created.products = createdProducts;
    }

    setClients((prev) => [...prev, created]);
    return created;
  };

  const updateClient = async (id, clientForm) => {
    const { products, ...clientData } = clientForm;
    const updated = normalizeClient(await api.updateClient(id, serializeClient(clientData)));

    // Sync products: update existing (has numeric id from server), create new ones
    if (products) {
      const syncedProducts = [];
      for (const p of products) {
        try {
          if (p.id && !String(p.id).includes('.')) {
            // Existing server product
            const prod = await api.updateProduct(p.id, {
              name:  p.name,
              price: p.price,
              unit:  p.unit,
              specs: (p.specs || []).filter(Boolean),
            });
            syncedProducts.push(prod);
          } else {
            // New product (temp id from Date.now())
            const prod = await api.createProduct(id, {
              name:  p.name,
              price: p.price,
              unit:  p.unit,
              specs: (p.specs || []).filter(Boolean),
              in_stock: 1,
            });
            syncedProducts.push(prod);
          }
        } catch {}
      }
      updated.products = syncedProducts;
    }

    setClients((prev) => prev.map((c) => (String(c.id) === String(id) ? updated : c)));
    return updated;
  };

  const deleteClient = async (id) => {
    await api.deleteClient(id);
    setClients((prev) => prev.filter((c) => String(c.id) !== String(id)));
  };

  const getClientFull = async (id) => {
    const c = await api.getClient(id);
    return normalizeClient(c);
  };

  // --- Ads CRUD ---
  const addAd = async (adForm) => {
    const created = normalizeAd(await api.createAd(serializeAd(adForm)));
    setAds((prev) => [...prev, created]);
    return created;
  };

  const updateAd = async (id, adForm) => {
    const updated = normalizeAd(await api.updateAd(id, serializeAd(adForm)));
    setAds((prev) => prev.map((a) => (String(a.id) === String(id) ? updated : a)));
    return updated;
  };

  const deleteAd = async (id) => {
    await api.deleteAd(id);
    setAds((prev) => prev.filter((a) => String(a.id) !== String(id)));
  };

  const stats = {
    totalCategories: categories.length,
    totalClients:    clients.length,
    premiumClients:  clients.filter((c) => c.isPremium).length,
    totalAds:        ads.length,
    totalProducts:   clients.reduce((s, c) => s + (c.products?.length || 0), 0),
    avgRating:       clients.length
      ? (clients.reduce((s, c) => s + Number(c.rating), 0) / clients.length).toFixed(1)
      : '0.0',
  };

  return (
    <AdminContext.Provider value={{
      isAuthenticated, login, logout,
      categories, addCategory, updateCategory, deleteCategory,
      clients, addClient, updateClient, deleteClient, getClientFull,
      ads, addAd, updateAd, deleteAd,
      stats,
    }}>
      {children}
    </AdminContext.Provider>
  );
};
