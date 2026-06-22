import React, { useState } from 'react';
import AdminHeader from '../components/AdminHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAdmin } from '../context/AdminContext';
import './AdminCategories.css';

const COLORS = ['#E8A87C','#74B9FF','#B2BEC3','#636E72','#FDCB6E','#A29BFE','#55EFC4','#FFEAA7','#D4A373','#FF7675','#FD79A8','#6C5CE7'];
const EMOJI_PRESETS = ['🧱','🪟','🏗️','⚙️','🏠','🎨','🔧','⚡','🪵','🏘️','🏢','🛠️','🪜','🚿','💡','🔑','🪣','🧲','🔩','⛏️'];

const emptyForm = { name: '', slug: '', icon: '🏗️', description: '', color: '#74B9FF' };

const CategoryForm = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState(initial || emptyForm);
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: '' }));
    if (k === 'name' && !initial) {
      setForm((p) => ({ ...p, name: v, slug: v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name = 'Name is required';
    if (!form.slug.trim())        e.slug = 'Slug is required';
    if (!form.description.trim()) e.description = 'Description is required';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initial ? 'Edit Category' : 'Add New Category'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-row-2">
            <div className="fld">
              <label>Category Name *</label>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Bricks" className={errors.name ? 'err' : ''} />
              {errors.name && <span className="err-msg">{errors.name}</span>}
            </div>
            <div className="fld">
              <label>Slug *</label>
              <input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="e.g. bricks" className={errors.slug ? 'err' : ''} />
              {errors.slug && <span className="err-msg">{errors.slug}</span>}
            </div>
          </div>

          <div className="fld">
            <label>Description *</label>
            <input value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Short description of this category" className={errors.description ? 'err' : ''} />
            {errors.description && <span className="err-msg">{errors.description}</span>}
          </div>

          <div className="form-row-2">
            <div className="fld">
              <label>Icon (Emoji)</label>
              <div className="emoji-picker">
                <div className="selected-emoji">{form.icon}</div>
                <div className="emoji-grid">
                  {EMOJI_PRESETS.map((e) => (
                    <button key={e} className={`emoji-opt ${form.icon === e ? 'sel' : ''}`} onClick={() => set('icon', e)} type="button">{e}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="fld">
              <label>Color</label>
              <div className="color-picker">
                <div className="color-preview" style={{ background: form.color }} />
                <div className="color-grid">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      className={`color-swatch ${form.color === c ? 'sel' : ''}`}
                      style={{ background: c }}
                      onClick={() => set('color', c)}
                      type="button"
                    />
                  ))}
                </div>
                <input type="color" value={form.color} onChange={(e) => set('color', e.target.value)} className="color-input-raw" />
              </div>
            </div>
          </div>

          <div className="category-preview">
            <span>Preview:</span>
            <div className="cat-preview-card" style={{ '--cc': form.color }}>
              <div className="cpw"><span>{form.icon}</span></div>
              <span className="cpn">{form.name || 'Category Name'}</span>
              <span className="cpd">{form.description || 'Description'}</span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>
            {initial ? 'Save Changes' : 'Add Category'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminCategories = () => {
  const { categories, addCategory, updateCategory, deleteCategory, clients } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data) => {
    if (editTarget) { updateCategory(editTarget.id, data); }
    else             { addCategory(data); }
    setShowForm(false);
    setEditTarget(null);
  };

  const openEdit = (cat) => { setEditTarget(cat); setShowForm(true); };

  const handleDelete = () => {
    deleteCategory(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="admin-page">
      <AdminHeader
        title="Categories"
        subtitle={`${categories.length} categories · ${clients.length} total suppliers`}
        actions={
          <button className="btn-primary" onClick={() => { setEditTarget(null); setShowForm(true); }}>
            + Add Category
          </button>
        }
      />

      <div className="page-body">
        <div className="table-toolbar">
          <div className="tb-search">
            <span>🔍</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search categories..." />
            {search && <button onClick={() => setSearch('')}>✕</button>}
          </div>
          <span className="tb-count">{filtered.length} of {categories.length} categories</span>
        </div>

        <div className="categories-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Color</th>
                <th>Description</th>
                <th>Suppliers</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cat) => {
                const supplierCount = clients.filter((c) => c.category === cat.slug).length;
                return (
                  <tr key={cat.id}>
                    <td>
                      <div className="cat-icon-cell" style={{ background: cat.color + '22' }}>
                        {cat.icon}
                      </div>
                    </td>
                    <td><strong>{cat.name}</strong></td>
                    <td><code className="slug-code">{cat.slug}</code></td>
                    <td>
                      <div className="color-cell">
                        <div className="color-dot" style={{ background: cat.color }} />
                        <span>{cat.color}</span>
                      </div>
                    </td>
                    <td className="desc-cell">{cat.description}</td>
                    <td>
                      <span className={`count-badge ${supplierCount === 0 ? 'zero' : ''}`}>
                        {supplierCount}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="act-btn edit" onClick={() => openEdit(cat)} title="Edit">✏️</button>
                        <button className="act-btn view" onClick={() => window.open(`/category/${cat.slug}`, '_blank')} title="View">👁</button>
                        <button className="act-btn del" onClick={() => setDeleteTarget(cat)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="empty-row">No categories found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <CategoryForm
          initial={editTarget}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete category "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default AdminCategories;
