import React, { useState } from 'react';
import AdminHeader from '../components/AdminHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAdmin } from '../context/AdminContext';
import './AdminAdvertisements.css';

const AD_EMOJIS = ['🧱','🪟','🏗️','⚙️','🏠','🎨','🔧','⚡','🪵','🏘️','📢','⭐','🔥','💎','🚀'];

const emptyAd = {
  clientId: '', clientName: '', category: '',
  headline: '', subtext: '', cta: 'Get Quote Now',
  badge: 'Featured', bgColor: '#FFF3E0', accentColor: '#E17055', emoji: '🏗️',
};

const AdForm = ({ initial, clients, categories, onSave, onClose }) => {
  const [form, setForm] = useState(initial || { ...emptyAd });
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: '' }));
  };

  const handleClientChange = (clientId) => {
    const client = clients.find((c) => String(c.id) === String(clientId));
    if (client) {
      const cat = categories.find((c) => c.slug === client.category);
      set('clientId', Number(clientId));
      setForm((p) => ({ ...p, clientId: Number(clientId), clientName: client.name, category: client.category, emoji: cat?.icon || '🏗️' }));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.clientId)          e.clientId = 'Select a client';
    if (!form.headline.trim())   e.headline = 'Required';
    if (!form.subtext.trim())    e.subtext  = 'Required';
    if (!form.cta.trim())        e.cta      = 'Required';
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
          <h2>{initial ? 'Edit Advertisement' : 'Create Advertisement'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="fld">
            <label>Supplier *</label>
            <select value={form.clientId} onChange={(e) => handleClientChange(e.target.value)} className={errors.clientId ? 'err' : ''}>
              <option value="">Select supplier...</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.logo} {c.name}</option>)}
            </select>
            {errors.clientId && <span className="err-msg">{errors.clientId}</span>}
          </div>

          <div className="fld">
            <label>Headline *</label>
            <input value={form.headline} onChange={(e) => set('headline', e.target.value)} placeholder="e.g. Premium Bricks at Factory Prices!" className={errors.headline ? 'err' : ''} />
            {errors.headline && <span className="err-msg">{errors.headline}</span>}
          </div>

          <div className="fld">
            <label>Subtext *</label>
            <input value={form.subtext} onChange={(e) => set('subtext', e.target.value)} placeholder="Features and highlights..." className={errors.subtext ? 'err' : ''} />
            {errors.subtext && <span className="err-msg">{errors.subtext}</span>}
          </div>

          <div className="form-row-2">
            <div className="fld">
              <label>CTA Button Text *</label>
              <input value={form.cta} onChange={(e) => set('cta', e.target.value)} placeholder="Get Quote Now" className={errors.cta ? 'err' : ''} />
              {errors.cta && <span className="err-msg">{errors.cta}</span>}
            </div>
            <div className="fld">
              <label>Badge Text</label>
              <input value={form.badge} onChange={(e) => set('badge', e.target.value)} placeholder="e.g. Premium Partner" />
            </div>
          </div>

          <div className="form-row-3">
            <div className="fld">
              <label>Emoji</label>
              <div className="mini-emoji-row">
                {AD_EMOJIS.map((em) => (
                  <button key={em} type="button" className={`mini-emoji ${form.emoji === em ? 'sel' : ''}`} onClick={() => set('emoji', em)}>{em}</button>
                ))}
              </div>
            </div>
            <div className="fld">
              <label>Background Color</label>
              <div className="color-input-row">
                <div className="color-swatch-lg" style={{ background: form.bgColor }} />
                <input type="color" value={form.bgColor} onChange={(e) => set('bgColor', e.target.value)} className="color-input-raw" />
                <input value={form.bgColor} onChange={(e) => set('bgColor', e.target.value)} className="hex-input" placeholder="#FFF3E0" />
              </div>
            </div>
            <div className="fld">
              <label>Accent Color</label>
              <div className="color-input-row">
                <div className="color-swatch-lg" style={{ background: form.accentColor }} />
                <input type="color" value={form.accentColor} onChange={(e) => set('accentColor', e.target.value)} className="color-input-raw" />
                <input value={form.accentColor} onChange={(e) => set('accentColor', e.target.value)} className="hex-input" placeholder="#E17055" />
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="ad-live-preview" style={{ background: form.bgColor, borderColor: form.accentColor + '60' }}>
            <div className="alp-badge" style={{ background: form.accentColor }}>{form.badge || 'Badge'}</div>
            <div className="alp-main">
              <span className="alp-emoji">{form.emoji}</span>
              <div className="alp-text">
                <h4 style={{ color: form.accentColor }}>{form.headline || 'Your Headline'}</h4>
                <p>{form.subtext || 'Your subtext here'}</p>
                <small>{form.clientName || 'Supplier Name'}</small>
              </div>
              <div className="alp-cta" style={{ background: form.accentColor }}>{form.cta || 'CTA'}</div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>{initial ? 'Save Changes' : 'Create Ad'}</button>
        </div>
      </div>
    </div>
  );
};

const AdminAdvertisements = () => {
  const { ads, clients, categories, addAd, updateAd, deleteAd } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const premiumClients = clients.filter((c) => c.isPremium || c.is_premium);

  const handleSave = (data) => {
    if (editTarget) updateAd(editTarget.id, data);
    else addAd(data);
    setShowForm(false);
    setEditTarget(null);
  };

  return (
    <div className="admin-page">
      <AdminHeader
        title="Advertisements"
        subtitle={`${ads.length} active ads · ${premiumClients.length} premium suppliers eligible`}
        actions={
          <button className="btn-primary" onClick={() => { setEditTarget(null); setShowForm(true); }}>
            + Create Ad
          </button>
        }
      />

      <div className="page-body">
        <div className="info-banner">
          <span>💡</span>
          <span>Advertisements are shown on the homepage to visitors. Only premium suppliers can have featured ads. Ads rotate automatically every 5 seconds.</span>
        </div>

        <div className="ads-management-grid">
          {ads.map((ad, idx) => (
            <div key={ad.id} className="ad-manage-card" style={{ borderColor: ad.accentColor + '50' }}>
              <div className="amc-header" style={{ background: ad.bgColor }}>
                <span className="amc-num">Ad #{idx + 1}</span>
                <span className="amc-badge" style={{ background: ad.accentColor }}>{ad.badge}</span>
              </div>
              <div className="amc-body">
                <div className="amc-top">
                  <span className="amc-emoji">{ad.emoji}</span>
                  <div className="amc-info">
                    <h4>{ad.headline}</h4>
                    <p>{ad.subtext}</p>
                    <span className="amc-client">by {ad.clientName}</span>
                  </div>
                </div>
                <div className="amc-meta">
                  <div className="amc-colors">
                    <div className="color-dot" style={{ background: ad.bgColor, border: '1px solid #eee' }} />
                    <div className="color-dot" style={{ background: ad.accentColor }} />
                    <span className="amc-cta-preview">CTA: "{ad.cta}"</span>
                  </div>
                </div>
              </div>
              <div className="amc-footer">
                <button className="act-btn edit" onClick={() => { setEditTarget(ad); setShowForm(true); }}>✏️ Edit</button>
                <button className="act-btn view" onClick={() => window.open(`/category/${ad.category}`, '_blank')}>👁 Preview</button>
                <button className="act-btn del" onClick={() => setDeleteTarget(ad)}>🗑️ Delete</button>
              </div>
            </div>
          ))}

          <div className="ad-add-card" onClick={() => { setEditTarget(null); setShowForm(true); }}>
            <span className="aac-icon">+</span>
            <span className="aac-label">Create New Advertisement</span>
            <span className="aac-hint">Add a premium ad placement for a supplier</span>
          </div>
        </div>
      </div>

      {showForm && (
        <AdForm
          initial={editTarget}
          clients={premiumClients}
          categories={categories}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete ad "${deleteTarget.headline}"?`}
          onConfirm={() => { deleteAd(deleteTarget.id); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default AdminAdvertisements;
