import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Search, Eye, Plus, X, CheckCircle2, AlertCircle, DollarSign, User, Hash } from 'lucide-react';
import { api } from '../../lib/api';

const formatMoney = (value) => '$' + Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });

const parseSaleAmount = (value) => {
  const normalized = value.trim().replace(/[$,]/g, '');
  if (!normalized) return NaN;

  return Number(normalized);
};

const toContractRow = (contract) => ({
  id: contract._id,
  orderId: contract.orderId,
  customer: contract.name,
  amount: formatMoney(contract.price),
  status: 'Active',
  source: contract.file?.startsWith('manual/') ? 'manual' : 'uploaded',
});

const MAX_CONTRACT_FILE_SIZE = 25 * 1024 * 1024;
const CONTRACT_FILE_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const emptyForm = {
  orderId: '',
  customer: '',
  amount: '',
  propertyAddress: '',
  installationDate: '',
  coveredProduct: 'carpet',
  term: '3_year_coverage',
};

export default function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [contractFile, setContractFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef();

  React.useEffect(() => {
    let active = true;

    api.listContracts()
      .then((data) => {
        if (active) setContracts(data.map(toContractRow));
      })
      .catch((err) => setFormError(err instanceof Error ? err.message : 'Unable to load contracts.'))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  console.log(contracts)
  const filtered = contracts.filter(c => {
    const q = search.toLowerCase();
    return !q || c.id.toLowerCase().includes(q) || c.customer.toLowerCase().includes(q);
  });

  const handleContractFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_CONTRACT_FILE_SIZE) {
      setFormError('Contract file must be 25 MB or smaller.');
      e.target.value = '';
      return;
    }

    if (!CONTRACT_FILE_TYPES.has(file.type)) {
      setFormError('Only PDF, Word, JPG, PNG, and WebP documents are allowed.');
      e.target.value = '';
      return;
    }

    setContractFile(file);
    setFormError('');
  };

  const handleManualSubmit = async () => {
    if (!form.orderId.trim() || !form.customer.trim() || !form.amount.trim() || !form.propertyAddress.trim() || !form.installationDate || !contractFile) {
      setFormError('All fields are required.');
      return;
    }

    const price = parseSaleAmount(form.amount);
    if (!Number.isFinite(price) || price < 0) {
      setFormError('Sale amount must be a valid number.');
      return;
    }

    try {
      const payload = new FormData();
      payload.append('orderId', form.orderId.trim());
      payload.append('name', form.customer.trim());
      payload.append('propertyAddress', form.propertyAddress.trim());
      payload.append('installationDate', form.installationDate);
      payload.append('coveredProduct', form.coveredProduct);
      payload.append('term', form.term);
      payload.append('price', String(price));
      payload.append('file', contractFile);

      const created = await api.createContract(payload);
      setContracts(prev => [toContractRow(created), ...prev]);
      setForm(emptyForm);
      setContractFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setShowForm(false);
      setFormError('');
      showSuccess('Contract added.');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to create contract.');
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const statusColor = (s) => s === 'Active' ? 'badge-resolved' : 'badge-pending';

  return (
    <div className="flex flex-col gap-5.5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="m-0 text-[22px] font-extrabold text-text-primary">Contracts</h1>
          <p className="m-0 mt-1 text-[13px] text-text-muted">Upload or manually enter contract data for your store.</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => { setShowForm(p => !p); setFormError(''); }}
            className="portal-btn-primary flex items-center gap-1.75 px-4 py-2.25 text-[13px]"
          >
            <Plus size={14} /> Add contract
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-[9px] border border-emerald-500/25 bg-emerald-500/10 px-4 py-2.5 text-[13px] font-medium text-emerald-500">
          <CheckCircle2 size={15} /> {successMsg}
        </div>
      )}

      {/* Manual Entry Form */}
      {showForm && (
        <div className="portal-card p-5.5 animate-fade-in">
          <div className="mb-[18px] flex items-center justify-between">
            <h2 className="m-0 text-sm font-bold text-text-primary">Manual Contract Entry</h2>
            <button onClick={() => setShowForm(false)} className="cursor-pointer border-0 bg-transparent text-text-muted">
              <X size={16} />
            </button>
          </div>

          {formError && (
            <div className="mb-3.5 flex items-center gap-1.75 rounded-lg border border-red-600/20 bg-red-600/10 px-3.5 py-2.25 text-xs text-red-600">
              <AlertCircle size={13} /> {formError}
            </div>
          )}

          <div className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
            <div>
              <label className="mb-1.75 flex items-center gap-1.25 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
                <Hash size={10} /> Order ID
              </label>
              <input
                type="text"
                placeholder="e.g. ORDER-1001"
                value={form.orderId}
                onChange={e => setForm(p => ({ ...p, orderId: e.target.value }))}
                className="portal-input w-full px-3 py-2.25 text-[13px]"
              />
            </div>
            <div>
              <label className="mb-1.75 flex items-center gap-1.25 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
                <Hash size={10} /> Property Address
              </label>
              <input
                type="text"
                placeholder="e.g. 123 Main Street"
                value={form.propertyAddress}
                onChange={e => setForm(p => ({ ...p, propertyAddress: e.target.value }))}
                className="portal-input w-full px-3 py-2.25 text-[13px]"
              />
            </div>
            <div>
              <label className="mb-1.75 flex items-center gap-1.25 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
                <User size={10} /> Customer Name
              </label>
              <input
                type="text"
                placeholder="e.g. John Smith"
                value={form.customer}
                onChange={e => setForm(p => ({ ...p, customer: e.target.value }))}
                className="portal-input w-full px-3 py-2.25 text-[13px]"
              />
            </div>
            <div>
              <label className="mb-1.75 flex items-center gap-1.25 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
                <DollarSign size={10} /> Sale Amount
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="e.g. 1500.00"
                value={form.amount}
                onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                className="portal-input w-full px-3 py-2.25 text-[13px]"
              />
            </div>
            <div>
              <label className="mb-1.75 flex items-center gap-1.25 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
                Installation Date
              </label>
              <input
                type="date"
                value={form.installationDate}
                onChange={e => setForm(p => ({ ...p, installationDate: e.target.value }))}
                className="portal-input w-full px-3 py-2.25 text-[13px]"
              />
            </div>
            <div>
              <label className="mb-1.75 flex items-center gap-1.25 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
                Covered Product
              </label>
              <select
                value={form.coveredProduct}
                onChange={e => setForm(p => ({ ...p, coveredProduct: e.target.value }))}
                className="portal-input w-full px-3 py-2.25 text-[13px]"
              >
                <option value="carpet">Carpet</option>
                <option value="lvp_laminate">LVP / Laminate</option>
                <option value="hardwood">Hardwood</option>
                <option value="tile">Tile</option>
              </select>
            </div>
            <div>
              <label className="mb-1.75 flex items-center gap-1.25 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
                Term
              </label>
              <select
                value={form.term}
                onChange={e => setForm(p => ({ ...p, term: e.target.value }))}
                className="portal-input w-full px-3 py-2.25 text-[13px]"
              >
                <option value="3_year_coverage">3 Year Coverage</option>
                <option value="5_year_coverage">5 Year Coverage</option>
              </select>
            </div>
            <div>
              <label className="mb-1.75 flex items-center gap-1.25 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
                <Upload size={10} /> Contract File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp"
                onChange={handleContractFileChange}
                className="portal-input w-full px-3 py-2 text-[13px]"
              />
              <p className="m-0 mt-1.5 text-[11px] text-text-muted">
                {contractFile ? `${contractFile.name} (${(contractFile.size / 1024).toFixed(1)} KB)` : 'PDF, Word, JPG, PNG, or WebP. Max 25 MB.'}
              </p>
            </div>
          </div>

          <div className="flex gap-2.5">
            <button onClick={handleManualSubmit} className="portal-btn-primary flex items-center gap-1.75 px-5 py-2.25 text-[13px]">
              Save
            </button>
            <button onClick={() => { setShowForm(false); setForm(emptyForm); setContractFile(null); setFormError(''); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="portal-btn-ghost px-4 py-2.25 text-[13px]">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Contracts Table */}
      <div className="portal-card overflow-hidden">
        <div className="flex items-center gap-2.5 border-b border-portal-border-sub px-[18px] py-3.5">
          <div className="relative max-w-[340px] flex-1">
            <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search contracts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="portal-input w-full py-2 pl-7.5 pr-3 text-[13px]"
            />
          </div>
          <span className="ml-auto text-xs text-text-muted">
            {filtered.length} contract{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Sale Amount</th>
                <th>Status</th>
                {/* <th>Source</th> */}
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-text-muted">Loading contracts...</td></tr>
              )}
              {!loading && filtered.map((contract) => (
                <tr key={contract.id}>
                  <td>
                    <span className="font-mono text-[13px] font-semibold text-text-primary">
                      {contract.orderId}
                    </span>
                  </td>
                  <td>{contract.customer}</td>
                  <td className="font-semibold text-emerald-600">{contract.amount}</td>
                  <td><span className={statusColor(contract.status)}>{contract.status}</span></td>
                  {/* <td>
                    <span className="inline-flex items-center gap-1.25 text-[11px] text-text-muted">
                      {contract.source === 'uploaded' ? <><FileText size={11} /> PDF</> : <><Plus size={11} /> Manual</>}
                    </span>
                  </td> */}
                  <td className="text-right">
                    <Link to={`/dashboard/sales/${contract.id}`} className="inline-flex items-center gap-1.25 rounded-[7px] border border-accent-blue/20 bg-accent-blue/10 px-2.5 py-1.5 text-xs font-medium text-accent-blue no-underline">
                      <Eye size={13} /> View
                    </Link>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-text-muted">No contracts found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
