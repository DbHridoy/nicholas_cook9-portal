import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Search, Eye, Plus, X, CheckCircle2, AlertCircle, DollarSign, User, Hash, CalendarDays, FileText, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';

const formatMoney = (value) => '$' + Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '-');

const termLabel = {
  '3_year_coverage': '3 Year Coverage',
  '5_year_coverage': '5 Year Coverage',
  'Preload 1 year': 'Preload 1 year',
  'Preload 2 year': 'Preload 2 year',
  WFO: 'WFO',
  'Preload product only': 'Preload product only',
};

const productLabel = {
  carpet: 'Carpet',
  lvp_laminate: 'LVP / Laminate',
  hardwood: 'Hardwood',
  tile: 'Tile',
};

const termOptions = [
  { value: '3_year_coverage', label: '3 Year Coverage' },
  { value: '5_year_coverage', label: '5 Year Coverage' },
  { value: 'Preload 1 year', label: 'Preload 1 year' },
  { value: 'Preload 2 year', label: 'Preload 2 year' },
  { value: 'WFO', label: 'WFO' },
  { value: 'Preload product only', label: 'Preload product only' },
];

const parseSaleAmount = (value) => {
  const normalized = value.trim().replace(/[$,]/g, '');
  if (!normalized) return NaN;

  return Number(normalized);
};

const getContractStatus = (contract) => {
  if (!contract?.expiry) return 'Active';

  return new Date(contract.expiry).getTime() < Date.now() ? 'Expired' : 'Active';
};

const toContractRow = (contract) => ({
  id: contract._id,
  orderId: contract.orderId,
  customer: contract.name,
  amountValue: Number(contract.price ?? 0),
  amount: formatMoney(contract.price),
  status: getContractStatus(contract),
  coveredProduct: contract.coveredProduct,
  term: contract.term,
  file: contract.file,
  propertyAddress: contract.propertyAddress,
  saleDate: contract.saleDate,
  expiry: contract.expiry,
  createdAt: contract.createdAt,
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
  saleDate: '',
  coveredProduct: 'carpet',
  term: '3_year_coverage',
};

export default function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [pageError, setPageError] = useState('');
  const [contractFile, setContractFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef();

  React.useEffect(() => {
    let active = true;

    api.listContracts()
      .then((data) => {
        if (active) setContracts(data.map(toContractRow));
      })
      .catch((err) => {
        if (active) setPageError(err instanceof Error ? err.message : 'Unable to load contracts.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = contracts.filter(c => {
    const q = search.toLowerCase();
    return !q
      || c.orderId?.toLowerCase().includes(q)
      || c.customer?.toLowerCase().includes(q)
      || c.propertyAddress?.toLowerCase().includes(q);
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
    if (!form.orderId.trim() || !form.customer.trim() || !form.amount.trim() || !form.propertyAddress.trim() || !form.saleDate) {
      setFormError('All fields are required.');
      return;
    }

    const price = parseSaleAmount(form.amount);
    if (!Number.isFinite(price) || price < 0) {
      setFormError('Sale amount must be a valid number.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append('orderId', form.orderId.trim());
      payload.append('name', form.customer.trim());
      payload.append('propertyAddress', form.propertyAddress.trim());
      payload.append('saleDate', form.saleDate);
      payload.append('coveredProduct', form.coveredProduct);
      payload.append('term', form.term);
      payload.append('price', String(price));
      if (contractFile) {
        payload.append('file', contractFile);
      }

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContract = async (contractId) => {
    if (!window.confirm('Are you sure you want to delete this contract?')) {
      return;
    }

    try {
      await api.deleteContract(contractId);
      setContracts((prev) => prev.filter((contract) => contract.id !== contractId));
      setPageError('');
      showSuccess('Contract deleted.');
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Unable to delete contract.');
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const statusColor = (s) => s === 'Active' ? 'badge-resolved' : 'badge-unresolved';

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

      {pageError && (
        <div className="flex items-center gap-2 rounded-[9px] border border-red-600/20 bg-red-600/10 px-4 py-2.5 text-[13px] text-red-600">
          <AlertCircle size={15} /> {pageError}
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
                <CalendarDays size={10} /> Sale Date
              </label>
              <input
                type="date"
                value={form.saleDate}
                onChange={e => setForm(p => ({ ...p, saleDate: e.target.value }))}
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
                {Object.entries(productLabel).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
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
                {termOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.75 flex items-center gap-1.25 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
                <Upload size={10} /> Contract File (Optional)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp"
                onChange={handleContractFileChange}
                className="portal-input w-full px-3 py-2 text-[13px]"
              />
              <p className="m-0 mt-1.5 text-[11px] text-text-muted">
                {contractFile ? `${contractFile.name} (${(contractFile.size / 1024).toFixed(1)} KB)` : 'PDF, Word, JPG, PNG, or WebP. Optional. Max 25 MB.'}
              </p>
            </div>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={handleManualSubmit}
              disabled={isSubmitting}
              className="portal-btn-primary flex items-center gap-1.75 px-5 py-2.25 text-[13px] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
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
                <th>Sale Date</th>
                <th>Sale Amount</th>
                <th>Status</th>
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
                  <td>
                    <div className="text-[13px] text-text-primary">{formatDate(contract.saleDate)}</div>
                    <div className="text-[11px] text-text-muted">{termLabel[contract.term] ?? contract.term}</div>
                  </td>
                  <td className="font-semibold text-emerald-600">{contract.amount}</td>
                  <td><span className={statusColor(contract.status)}>{contract.status}</span></td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {contract.file && (
                        <a
                          href={contract.file}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.25 rounded-[7px] border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-text-secondary no-underline"
                        >
                          <FileText size={13} /> File
                        </a>
                      )}
                      <Link to={`/dashboard/sales/${contract.id}`} className="inline-flex items-center gap-1.25 rounded-[7px] border border-accent-blue/20 bg-accent-blue/10 px-2.5 py-1.5 text-xs font-medium text-accent-blue no-underline">
                        <Eye size={13} /> View
                      </Link>
                      <button
                        onClick={() => handleDeleteContract(contract.id)}
                        className="inline-flex items-center gap-1.25 rounded-[7px] border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-500"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-text-muted">
                    {contracts.length === 0
                      ? 'No contracts have been uploaded for this dealer yet.'
                      : 'No contracts found matching your search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
