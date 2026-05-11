import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Upload, Search, Eye, Plus, X, CheckCircle2, AlertCircle, DollarSign, User, Hash } from 'lucide-react';

const initialContracts = [
  { id: 'CON-1001', customer: 'John Doe', amount: '$1,299.00', status: 'Active', source: 'uploaded' },
  { id: 'CON-1002', customer: 'Jane Smith', amount: '$899.00', status: 'Pending', source: 'manual' },
  { id: 'CON-1003', customer: 'Bob Johnson', amount: '$2,499.00', status: 'Active', source: 'uploaded' },
  { id: 'CON-1004', customer: 'Alice Williams', amount: '$1,850.00', status: 'Active', source: 'uploaded' },
];

const emptyForm = { id: '', customer: '', amount: '' };

export default function Contracts() {
  const [contracts, setContracts] = useState(initialContracts);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef();

  const filtered = contracts.filter(c => {
    const q = search.toLowerCase();
    return !q || c.id.toLowerCase().includes(q) || c.customer.toLowerCase().includes(q);
  });

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0] || e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      showSuccess(`"${file.name}" ready to attach to a contract.`);
    } else if (file) {
      setFormError('Only PDF files are accepted.');
      setTimeout(() => setFormError(''), 3000);
    }
  };

  const handleManualSubmit = () => {
    if (!form.id.trim() || !form.customer.trim() || !form.amount.trim()) {
      setFormError('All fields are required.');
      return;
    }
    if (contracts.find(c => c.id === form.id.trim())) {
      setFormError('Contract ID already exists.');
      return;
    }
    const amt = form.amount.trim().startsWith('$') ? form.amount.trim() : `$${parseFloat(form.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    setContracts(prev => [{ id: form.id.trim(), customer: form.customer.trim(), amount: amt, status: 'Pending', source: 'manual' }, ...prev]);
    setForm(emptyForm);
    setShowForm(false);
    setFormError('');
    showSuccess('Contract added manually.');
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const statusColor = (s) => s === 'Active' ? 'badge-resolved' : 'badge-pending';

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>Contracts</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>Upload or manually enter contract data for your store.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => fileInputRef.current.click()}
            className="portal-btn-ghost"
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', fontSize: 13 }}
          >
            <Upload size={14} /> Upload PDF
          </button>
          <button
            onClick={() => { setShowForm(p => !p); setFormError(''); }}
            className="portal-btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', fontSize: 13 }}
          >
            <Plus size={14} /> Manual Entry
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFileDrop} />
      </div>

      {/* Success Toast */}
      {successMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 9, fontSize: 13, color: '#34d399', fontWeight: 500 }}>
          <CheckCircle2 size={15} /> {successMsg}
        </div>
      )}

      {/* PDF Drop Zone */}
      <div
        onClick={() => fileInputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleFileDrop}
        style={{
          border: `2px dashed ${dragOver ? '#2563eb' : uploadedFile ? 'rgba(16,185,129,0.45)' : '#d1d5db'}`,
          borderRadius: 14,
          padding: '28px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragOver ? 'rgba(37,99,235,0.04)' : uploadedFile ? 'rgba(16,185,129,0.03)' : '#fafafa',
          transition: 'all 0.2s',
        }}
      >
        <div style={{ display: 'inline-flex', padding: 12, background: 'rgba(37,99,235,0.08)', borderRadius: 12, marginBottom: 12 }}>
          <FileText size={24} style={{ color: '#2563eb' }} />
        </div>
        {uploadedFile ? (
          <>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#059669', margin: 0 }}>✓ {uploadedFile.name}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{(uploadedFile.size / 1024).toFixed(1)} KB · PDF</p>
          </>
        ) : (
          <>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Drop a contract PDF here, or click to browse</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 5 }}>Scanned or digital PDF contracts accepted · Max 25 MB</p>
          </>
        )}
        {uploadedFile && (
          <button
            onClick={e => { e.stopPropagation(); setUploadedFile(null); }}
            style={{ marginTop: 10, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 }}
          >
            <X size={12} /> Remove
          </button>
        )}
      </div>

      {/* Manual Entry Form */}
      {showForm && (
        <div className="portal-card animate-fade-in" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Manual Contract Entry</h2>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>

          {formError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 14px', background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.18)', borderRadius: 8, fontSize: 12, color: '#dc2626', marginBottom: 14 }}>
              <AlertCircle size={13} /> {formError}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>
                <Hash size={10} /> Contract ID
              </label>
              <input
                type="text"
                placeholder="e.g. CON-2001"
                value={form.id}
                onChange={e => setForm(p => ({ ...p, id: e.target.value }))}
                className="portal-input"
                style={{ width: '100%', padding: '9px 12px', fontSize: 13 }}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>
                <User size={10} /> Customer Name
              </label>
              <input
                type="text"
                placeholder="e.g. John Smith"
                value={form.customer}
                onChange={e => setForm(p => ({ ...p, customer: e.target.value }))}
                className="portal-input"
                style={{ width: '100%', padding: '9px 12px', fontSize: 13 }}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>
                <DollarSign size={10} /> Sale Amount
              </label>
              <input
                type="text"
                placeholder="e.g. 1500.00"
                value={form.amount}
                onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                className="portal-input"
                style={{ width: '100%', padding: '9px 12px', fontSize: 13 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleManualSubmit} className="portal-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 20px', fontSize: 13 }}>
              <Plus size={14} /> Add Contract
            </button>
            <button onClick={() => { setShowForm(false); setForm(emptyForm); setFormError(''); }} className="portal-btn-ghost" style={{ padding: '9px 16px', fontSize: 13 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Contracts Table */}
      <div className="portal-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #e9ecef', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search contracts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="portal-input"
              style={{ width: '100%', padding: '8px 12px 8px 30px', fontSize: 13 }}
            />
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {filtered.length} contract{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="portal-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Contract ID</th>
                <th style={{ textAlign: 'left' }}>Customer</th>
                <th style={{ textAlign: 'left' }}>Sale Amount</th>
                <th style={{ textAlign: 'left' }}>Status</th>
                <th style={{ textAlign: 'left' }}>Source</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((contract) => (
                <tr key={contract.id}>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: 13 }}>
                      {contract.id}
                    </span>
                  </td>
                  <td>{contract.customer}</td>
                  <td style={{ fontWeight: 600, color: '#059669' }}>{contract.amount}</td>
                  <td><span className={statusColor(contract.status)}>{contract.status}</span></td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                      {contract.source === 'uploaded' ? <><FileText size={11} /> PDF</> : <><Plus size={11} /> Manual</>}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link to={`/dashboard/sales/${contract.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 10px', background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.18)', borderRadius: 7, color: '#2563eb', fontSize: 12, fontWeight: 500, textDecoration: 'none' }}>
                      <Eye size={13} /> View
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>No contracts found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
