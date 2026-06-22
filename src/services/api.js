const BASE_URL = 'http://localhost:8080/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'API error');
  return json.data;
}

export const api = {
  // Categories
  getCategories: ()              => request('/categories'),
  getCategory:   (id)            => request(`/categories/${id}`),
  createCategory:(data)          => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory:(id, data)      => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory:(id)            => request(`/categories/${id}`, { method: 'DELETE' }),

  // Clients
  getClients:    (params = {})   => request('/clients' + toQuery(params)),
  getClient:     (slug)          => request(`/clients/${slug}`),
  createClient:  (data)          => request('/clients', { method: 'POST', body: JSON.stringify(data) }),
  updateClient:  (id, data)      => request(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteClient:  (id)            => request(`/clients/${id}`, { method: 'DELETE' }),

  // Products
  getProducts:   (clientId)      => request(`/clients/${clientId}/products`),
  createProduct: (clientId, data)=> request(`/clients/${clientId}/products`, { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data)      => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id)            => request(`/products/${id}`, { method: 'DELETE' }),

  // Advertisements
  getAds:        (activeOnly)    => request('/advertisements' + (activeOnly ? '?active=1' : '')),
  getAd:         (id)            => request(`/advertisements/${id}`),
  createAd:      (data)          => request('/advertisements', { method: 'POST', body: JSON.stringify(data) }),
  updateAd:      (id, data)      => request(`/advertisements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAd:      (id)            => request(`/advertisements/${id}`, { method: 'DELETE' }),

  // Quotations
  getQuotations: (params = {})   => request('/quotations' + toQuery(params)),
  getQuotation:  (id)            => request(`/quotations/${id}`),
  createQuotation:(data)         => request('/quotations', { method: 'POST', body: JSON.stringify(data) }),
  updateQuotation:(id, data)     => request(`/quotations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Auth
  login:         (creds)         => request('/admin/login', { method: 'POST', body: JSON.stringify(creds) }),
};

function toQuery(params) {
  const q = new URLSearchParams(params).toString();
  return q ? `?${q}` : '';
}
