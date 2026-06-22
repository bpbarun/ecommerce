import React, { useState } from 'react';
import AdminHeader from '../components/AdminHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAdmin } from '../context/AdminContext';
import './AdminClients.css';

const LOGO_COLORS = ['#E17055','#D35400','#C0392B','#0984E3','#2980B9','#7F8C8D','#2C3E50','#E67E22','#8E44AD','#27AE60','#F39C12','#795548'];

const emptyProduct = { id: Date.now(), name: '', description: '', price: '', unit: 'per unit', minOrder: '', image: '📦', specs: [''] };

const emptyClient = {
  name: '', slug: '', category: '', isPremium: false,
  logo: '', logoColor: '#0984E3', tagline: '', description: '',
  address: '', phone: '', email: '', experience: '',
  rating: 4.5, reviews: 0, products: [],
};

const ProductEditor = ({ products, onChange }) => {
  const addProduct = () =>
    onChange([...products, { ...emptyProduct, id: Date.now() }]);

  const updateProduct = (idx, key, val) =>
    onChange(products.map((p, i) => i === idx ? { ...p, [key]: val } : p));

  const removeProduct = (idx) =>
    onChange(products.filter((_, i) => i !== idx));

  const addSpec = (idx) =>
    onChange(products.map((p, i) => i === idx ? { ...p, specs: [...(p.specs || []), ''] } : p));

  const updateSpec = (pIdx, sIdx, val) =>
    onChange(products.map((p, i) => i === pIdx ? { ...p, specs: p.specs.map((s, j) => j === sIdx ? val : s) } : p));

  const removeSpec = (pIdx, sIdx) =>
    onChange(products.map((p, i) => i === pIdx ? { ...p, specs: p.specs.filter((_, j) => j !== sIdx) } : p));

  const PRODUCT_EMOJIS = ['🧱','🪟','🏗️','⚙️','🏠','🎨','🔧','⚡','🪵','📦','🔩','🪜'];

  return (
    <div className="product-editor">
      <div className="pe-header">
        <h4>Products / Services ({products.length})</h4>
        <button type="button" className="pe-add-btn" onClick={addProduct}>+ Add Product</button>
      </div>
      {products.length === 0 && (
        <div className="pe-empty">No products yet. Click "+ Add Product" to add one.</div>
      )}
      {products.map((p, idx) => (
        <div key={p.id || idx} className="pe-item">
          <div className="pe-item-header">
            <span className="pe-item-num">Product #{idx + 1}</span>
            <button type="button" className="pe-remove" onClick={() => removeProduct(idx)}>Remove ✕</button>
          </div>
          <div className="form-row-2">
            <div className="fld">
              <label>Product Name</label>
              <input value={p.name} onChange={(e) => updateProduct(idx, 'name', e.target.value)} placeholder="e.g. Red Clay Bricks" />
            </div>
            <div className="fld">
              <label>Emoji Icon</label>
              <div className="mini-emoji-row">
                {PRODUCT_EMOJIS.map((em) => (
                  <button key={em} type="button" className={`mini-emoji ${p.image === em ? 'sel' : ''}`} onClick={() => updateProduct(idx, 'image', em)}>{em}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="fld">
            <label>Description</label>
            <textarea value={p.description} onChange={(e) => updateProduct(idx, 'description', e.target.value)} placeholder="Describe the product..." rows={2} />
          </div>
          <div className="form-row-3">
            <div className="fld">
              <label>Price (₹)</label>
              <input type="number" value={p.price} onChange={(e) => updateProduct(idx, 'price', Number(e.target.value))} placeholder="e.g. 8500" />
            </div>
            <div className="fld">
              <label>Unit</label>
              <input value={p.unit} onChange={(e) => updateProduct(idx, 'unit', e.target.value)} placeholder="e.g. per 1000 bricks" />
            </div>
            <div className="fld">
              <label>Min. Order</label>
              <input value={p.minOrder} onChange={(e) => updateProduct(idx, 'minOrder', e.target.value)} placeholder="e.g. 5000 bricks" />
            </div>
          </div>
          <div className="fld">
            <label>Specifications</label>
            {(p.specs || []).map((spec, sIdx) => (
              <div key={sIdx} className="spec-row">
                <input value={spec} onChange={(e) => updateSpec(idx, sIdx, e.target.value)} placeholder={`Spec ${sIdx + 1}`} />
                <button type="button" className="spec-remove" onClick={() => removeSpec(idx, sIdx)}>✕</button>
              </div>
            ))}
            <button type="button" className="spec-add-btn" onClick={() => addSpec(idx)}>+ Add Spec</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const ClientForm = ({ initial, categories, onSave, onClose }) => {
  const [form, setForm] = useState(
    initial
      ? { ...initial, products: (initial.products || []).map((p) => ({ ...p, specs: p.specs || [] })) }
      : { ...emptyClient }
  );
  const [errors, setErrors] = useState({});
  const [tab, setTab] = useState('basic');

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: '' }));
    if (k === 'name' && !initial) {
      setForm((p) => ({ ...p, name: v, slug: v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), logo: v.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) }));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name = 'Required';
    if (!form.slug.trim())        e.slug = 'Required';
    if (!form.category)           e.category = 'Required';
    if (!form.phone.trim())       e.phone = 'Required';
    if (!form.email.trim())       e.email = 'Required';
    if (!form.address.trim())     e.address = 'Required';
    if (!form.description.trim()) e.description = 'Required';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); setTab('basic'); return; }
    onSave({ ...form, rating: Number(form.rating), reviews: Number(form.reviews) });
  };

  const TABS = [
    { id: 'basic',    label: '📋 Basic Info' },
    { id: 'contact',  label: '📞 Contact' },
    { id: 'products', label: `📦 Products (${form.products.length})` },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box wide-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initial ? `Edit: ${initial.name}` : 'Add New Supplier'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-tabs">
          {TABS.map((t) => (
            <button key={t.id} className={`mtab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)} type="button">
              {t.label}
            </button>
          ))}
        </div>

        <div className="modal-body">
          {tab === 'basic' && (
            <>
              <div className="form-row-2">
                <div className="fld">
                  <label>Supplier Name *</label>
                  <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Sharma Bricks Industries" className={errors.name ? 'err' : ''} />
                  {errors.name && <span className="err-msg">{errors.name}</span>}
                </div>
                <div className="fld">
                  <label>Slug *</label>
                  <input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="e.g. sharma-bricks" className={errors.slug ? 'err' : ''} />
                  {errors.slug && <span className="err-msg">{errors.slug}</span>}
                </div>
              </div>
              <div className="form-row-2">
                <div className="fld">
                  <label>Category *</label>
                  <select value={form.category} onChange={(e) => set('category', e.target.value)} className={errors.category ? 'err' : ''}>
                    <option value="">Select category...</option>
                    {categories.map((c) => <option key={c.id} value={c.slug}>{c.icon} {c.name}</option>)}
                  </select>
                  {errors.category && <span className="err-msg">{errors.category}</span>}
                </div>
                <div className="fld">
                  <label>Experience</label>
                  <input value={form.experience} onChange={(e) => set('experience', e.target.value)} placeholder="e.g. 25+ Years" />
                </div>
              </div>
              <div className="fld">
                <label>Tagline</label>
                <input value={form.tagline} onChange={(e) => set('tagline', e.target.value)} placeholder="Short memorable tagline" />
              </div>
              <div className="fld">
                <label>Description *</label>
                <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="Describe the supplier's business..." className={errors.description ? 'err' : ''} />
                {errors.description && <span className="err-msg">{errors.description}</span>}
              </div>
              <div className="form-row-3">
                <div className="fld">
                  <label>Logo Text (2 chars)</label>
                  <input value={form.logo} maxLength={2} onChange={(e) => set('logo', e.target.value.toUpperCase())} placeholder="SB" />
                </div>
                <div className="fld">
                  <label>Logo Color</label>
                  <div className="logo-color-row">
                    {LOGO_COLORS.map((c) => (
                      <button key={c} type="button" className={`color-swatch sm ${form.logoColor === c ? 'sel' : ''}`} style={{ background: c }} onClick={() => set('logoColor', c)} />
                    ))}
                    <input type="color" value={form.logoColor} onChange={(e) => set('logoColor', e.target.value)} className="color-input-raw" />
                  </div>
                </div>
                <div className="fld">
                  <label>Preview</label>
                  <div className="logo-preview" style={{ background: form.logoColor }}>{form.logo || '??'}</div>
                </div>
              </div>
              <div className="form-row-2">
                <div className="fld">
                  <label>Rating (1–5)</label>
                  <input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={(e) => set('rating', e.target.value)} />
                </div>
                <div className="fld">
                  <label>Review Count</label>
                  <input type="number" min="0" value={form.reviews} onChange={(e) => set('reviews', e.target.value)} />
                </div>
              </div>
              <div className="fld">
                <label className="toggle-label">
                  <input type="checkbox" checked={form.isPremium} onChange={(e) => set('isPremium', e.target.checked)} />
                  <span className="toggle-track-sm"><span className="toggle-thumb-sm" /></span>
                  <span>Premium Supplier {form.isPremium ? '⭐' : ''}</span>
                </label>
              </div>
            </>
          )}

          {tab === 'contact' && (
            <>
              <div className="fld">
                <label>Full Address *</label>
                <textarea value={form.address} onChange={(e) => set('address', e.target.value)} rows={2} placeholder="e.g. Industrial Area, Sector 5, Rajasthan" className={errors.address ? 'err' : ''} />
                {errors.address && <span className="err-msg">{errors.address}</span>}
              </div>
              <div className="form-row-2">
                <div className="fld">
                  <label>Phone *</label>
                  <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" className={errors.phone ? 'err' : ''} />
                  {errors.phone && <span className="err-msg">{errors.phone}</span>}
                </div>
                <div className="fld">
                  <label>Email *</label>
                  <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="info@supplier.com" className={errors.email ? 'err' : ''} />
                  {errors.email && <span className="err-msg">{errors.email}</span>}
                </div>
              </div>
            </>
          )}

          {tab === 'products' && (
            <ProductEditor products={form.products} onChange={(p) => set('products', p)} />
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>
            {initial ? 'Save Changes' : 'Add Supplier'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminClients = () => {
  const { clients, categories, addClient, updateClient, deleteClient, getClientFull } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [premiumFilter, setPremiumFilter] = useState(false);

  let filtered = clients;
  if (search)        filtered = filtered.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()));
  if (catFilter)     filtered = filtered.filter((c) => c.category === catFilter);
  if (premiumFilter) filtered = filtered.filter((c) => c.isPremium);

  const handleSave = async (data) => {
    if (editTarget) await updateClient(editTarget.id, data);
    else await addClient(data);
    setShowForm(false);
    setEditTarget(null);
  };

  const openEdit = async (c) => {
    // Fetch full client data (including products) before opening form
    try {
      const full = await getClientFull(c.slug);
      setEditTarget(full);
    } catch {
      setEditTarget({ ...c, products: c.products || [] });
    }
    setShowForm(true);
  };

  const getCategoryIcon = (slug) => categories.find((c) => c.slug === slug)?.icon || '🏭';
  const getCategoryName = (slug) => categories.find((c) => c.slug === slug)?.name || slug;

  return (
    <div className="admin-page">
      <AdminHeader
        title="Suppliers"
        subtitle={`${clients.length} suppliers · ${clients.filter((c) => c.isPremium).length} premium`}
        actions={
          <button className="btn-primary" onClick={() => { setEditTarget(null); setShowForm(true); }}>
            + Add Supplier
          </button>
        }
      />

      <div className="page-body">
        <div className="table-toolbar">
          <div className="tb-search">
            <span>🔍</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." />
            {search && <button onClick={() => setSearch('')}>✕</button>}
          </div>
          <select className="tb-filter-select" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.slug}>{c.icon} {c.name}</option>)}
          </select>
          <label className="tb-toggle-label">
            <input type="checkbox" checked={premiumFilter} onChange={(e) => setPremiumFilter(e.target.checked)} />
            ⭐ Premium only
          </label>
          <span className="tb-count">{filtered.length} suppliers</span>
        </div>

        <div className="categories-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Category</th>
                <th>Contact</th>
                <th>Products</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr key={client.id}>
                  <td>
                    <div className="client-cell">
                      <div className="cc-logo" style={{ background: client.logoColor }}>{client.logo}</div>
                      <div>
                        <div className="cc-name">{client.name}</div>
                        <div className="cc-slug">{client.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="cat-chip">{getCategoryIcon(client.category)} {getCategoryName(client.category)}</span>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <span>📞 {client.phone}</span>
                      <span>✉️ {client.email}</span>
                    </div>
                  </td>
                  <td><span className="count-badge">{client.products?.length || 0}</span></td>
                  <td>
                    <span className="rating-cell">⭐ {client.rating} <span className="rev-count">({client.reviews})</span></span>
                  </td>
                  <td>
                    {client.isPremium
                      ? <span className="status-badge premium">⭐ Premium</span>
                      : <span className="status-badge standard">Standard</span>
                    }
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="act-btn edit" onClick={() => openEdit(client)} title="Edit">✏️</button>
                      <button className="act-btn view" onClick={() => window.open(`/client/${client.slug}`, '_blank')} title="View">👁</button>
                      <button className="act-btn del" onClick={() => setDeleteTarget(client)} title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="empty-row">No suppliers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <ClientForm
          initial={editTarget}
          categories={categories}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete supplier "${deleteTarget.name}"? This cannot be undone.`}
          onConfirm={() => { deleteClient(deleteTarget.id); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default AdminClients;
