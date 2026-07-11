import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Calculator,
  CheckCircle2,
  DollarSign,
  Plus,
  ReceiptText,
  RotateCcw,
  Search,
  User,
  X,
} from 'lucide-react';
import { api } from '../../lib/api';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const calculateRefundPreview = (purchasePrice, remainingMonths, originalMonths) => {
  const price = Number(purchasePrice);
  const remaining = Number(remainingMonths);
  const original = Number(originalMonths);

  if (!Number.isFinite(price) || !Number.isFinite(remaining) || !Number.isFinite(original) || original <= 0) {
    return 0;
  }

  return Math.round(((price * remaining) / original) * 100) / 100;
};

const formatDateTime = (value) => value ? new Date(value).toLocaleString() : '—';

export default function Cancellations() {
  const [cancellations, setCancellations] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    originalPurchasePrice: '',
    remainingCoverageMonths: '',
    originalCoverageMonths: '',
  });

  const refundPreview = useMemo(
    () =>
      calculateRefundPreview(
        form.originalPurchasePrice,
        form.remainingCoverageMonths,
        form.originalCoverageMonths,
      ),
    [form.originalCoverageMonths, form.originalPurchasePrice, form.remainingCoverageMonths],
  );

  const showSuccess = (message) => {
    setSuccessMsg(message);
    window.setTimeout(() => setSuccessMsg(''), 4000);
  };

  useEffect(() => {
    let active = true;

    api.listCancellations()
      .then((data) => {
        if (active) {
          setCancellations(data ?? []);
          setPageError('');
        }
      })
      .catch((err) => {
        if (active) {
          setPageError(err instanceof Error ? err.message : 'Unable to load cancellations.');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredCancellations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return cancellations.filter((cancellation) => {
      if (!query) {
        return true;
      }

      return (
        cancellation.customerName?.toLowerCase().includes(query)
        || cancellation.status?.toLowerCase().includes(query)
      );
    });
  }, [cancellations, search]);

  const resetForm = () => {
    setForm({
      customerName: '',
      originalPurchasePrice: '',
      remainingCoverageMonths: '',
      originalCoverageMonths: '',
    });
  };

  const handleCreateCancellation = async (event) => {
    event.preventDefault();
    setFormError('');

    const originalPurchasePrice = Number(form.originalPurchasePrice);
    const remainingCoverageMonths = Number(form.remainingCoverageMonths);
    const originalCoverageMonths = Number(form.originalCoverageMonths);

    if (!form.customerName.trim()) {
      setFormError('Customer name is required.');
      return;
    }

    if (!Number.isFinite(originalPurchasePrice) || originalPurchasePrice < 0) {
      setFormError('Original purchase price must be a valid number.');
      return;
    }

    if (!Number.isInteger(remainingCoverageMonths) || remainingCoverageMonths < 0) {
      setFormError('Remaining coverage months must be a whole number.');
      return;
    }

    if (!Number.isInteger(originalCoverageMonths) || originalCoverageMonths <= 0) {
      setFormError('Original coverage months must be a whole number greater than 0.');
      return;
    }

    if (remainingCoverageMonths > originalCoverageMonths) {
      setFormError('Remaining coverage months cannot exceed original coverage months.');
      return;
    }

    setSubmitting(true);

    try {
      const cancellation = await api.createCancellation({
        customerName: form.customerName.trim(),
        originalPurchasePrice,
        remainingCoverageMonths,
        originalCoverageMonths,
      });

      setCancellations((prev) => [cancellation, ...prev]);
      resetForm();
      setShowForm(false);
      showSuccess('Cancellation quote created successfully.');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to create cancellation quote.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProcessCancellation = async (cancellation) => {
    const confirmed = window.confirm(
      `Are you sure you want to process the refund for ${cancellation.customerName}?`,
    );

    if (!confirmed) {
      return;
    }

    setProcessingId(cancellation._id);
    setPageError('');

    try {
      const processed = await api.processCancellation(cancellation._id);
      setCancellations((prev) =>
        prev.map((entry) => (entry._id === processed._id ? processed : entry)),
      );
      showSuccess('Cancellation refund processed successfully.');
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Unable to process cancellation refund.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="portal-page animate-fade-in">
      <div className="portal-page-header">
        <div>
          <h1 className="portal-page-title">Cancellations</h1>
          <p className="portal-page-subtitle">
            Generate customer cancellation refund quotes and finalize them once approved.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm((current) => !current);
            setFormError('');
          }}
          className="portal-btn-primary flex items-center gap-1.75 px-4 py-2.25 text-[13px]"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Close Form' : 'New Cancellation'}
        </button>
      </div>

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

      {showForm && (
        <div className="portal-card p-5.5 animate-fade-in">
          <div className="mb-[18px] flex items-center justify-between">
            <div>
              <h2 className="m-0 text-sm font-bold text-text-primary">Create Cancellation Quote</h2>
              <p className="mt-1 text-xs text-text-muted">
                Refund amount is calculated automatically from the entered coverage values.
              </p>
            </div>
            <button
              onClick={() => {
                setShowForm(false);
                setFormError('');
              }}
              className="cursor-pointer border-0 bg-transparent text-text-muted hover:text-text-primary"
            >
              <X size={16} />
            </button>
          </div>

          {formError && (
            <div className="mb-3.5 flex items-center gap-1.75 rounded-lg border border-red-600/20 bg-red-600/10 px-3.5 py-2.25 text-xs text-red-600">
              <AlertCircle size={13} /> {formError}
            </div>
          )}

          <form onSubmit={handleCreateCancellation} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div>
              <label className="mb-1.75 flex items-center gap-1.25 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
                <User size={11} className="text-slate-500" /> Customer Name
              </label>
              <input
                type="text"
                value={form.customerName}
                onChange={(event) => setForm((current) => ({ ...current, customerName: event.target.value }))}
                className="portal-input w-full text-sm"
                placeholder="Customer name"
              />
            </div>

            <div>
              <label className="mb-1.75 flex items-center gap-1.25 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
                <DollarSign size={11} className="text-slate-500" /> Original Purchase Price
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.originalPurchasePrice}
                onChange={(event) =>
                  setForm((current) => ({ ...current, originalPurchasePrice: event.target.value }))
                }
                className="portal-input w-full text-sm"
                placeholder="699.00"
              />
            </div>

            <div>
              <label className="mb-1.75 flex items-center gap-1.25 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
                <RotateCcw size={11} className="text-slate-500" /> Remaining Coverage Months
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.remainingCoverageMonths}
                onChange={(event) =>
                  setForm((current) => ({ ...current, remainingCoverageMonths: event.target.value }))
                }
                className="portal-input w-full text-sm"
                placeholder="26"
              />
            </div>

            <div>
              <label className="mb-1.75 flex items-center gap-1.25 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
                <ReceiptText size={11} className="text-slate-500" /> Original Coverage Months
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={form.originalCoverageMonths}
                onChange={(event) =>
                  setForm((current) => ({ ...current, originalCoverageMonths: event.target.value }))
                }
                className="portal-input w-full text-sm"
                placeholder="36"
              />
            </div>

            <div>
              <label className="mb-1.75 flex items-center gap-1.25 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
                <Calculator size={11} className="text-slate-500" /> Refund Amount
              </label>
              <div className="portal-input flex min-h-[42px] items-center bg-slate-50 text-sm font-semibold text-text-primary">
                {formatCurrency(refundPreview)}
              </div>
            </div>

            <div className="md:col-span-2 xl:col-span-5 flex flex-wrap justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setFormError('');
                }}
                className="rounded-[9px] border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="portal-btn-primary px-4 py-2.5 text-[13px] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? 'Saving...' : 'Save Cancellation Quote'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="portal-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-portal-border-sub px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-sm font-bold text-text-primary">Cancellation Quotes</h2>
            <p className="mt-1 text-xs text-text-muted">
              Review refund calculations and process finalized cancellations.
            </p>
          </div>

          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by customer or status..."
              className="portal-input w-full py-2 pl-10 pr-3 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-portal-border-sub">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">Name</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">Original Purchase Price</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">Remaining Coverage Months</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">Original Coverage Months</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">Refund Amount</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">Status</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">Processed At</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-portal-border-sub bg-white">
              {loading && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-text-muted">
                    Loading cancellations...
                  </td>
                </tr>
              )}

              {!loading && filteredCancellations.map((cancellation) => (
                <tr key={cancellation._id} className="transition hover:bg-slate-50/70">
                  <td className="px-5 py-4 text-sm font-medium text-text-primary">{cancellation.customerName}</td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{formatCurrency(cancellation.originalPurchasePrice)}</td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{cancellation.remainingCoverageMonths}</td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{cancellation.originalCoverageMonths}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-text-primary">{formatCurrency(cancellation.refundAmount)}</td>
                  <td className="px-5 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      cancellation.status === 'processed'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {cancellation.status === 'processed' ? 'Processed' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{formatDateTime(cancellation.processedAt)}</td>
                  <td className="px-5 py-4 text-right text-sm">
                    <button
                      onClick={() => handleProcessCancellation(cancellation)}
                      disabled={cancellation.status === 'processed' || processingId === cancellation._id}
                      className="rounded-[8px] border border-emerald-600/20 bg-emerald-600/10 px-3 py-1.75 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-600/15 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {cancellation.status === 'processed'
                        ? 'Finalized'
                        : processingId === cancellation._id
                          ? 'Processing...'
                          : 'Process'}
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && filteredCancellations.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-text-muted">
                    No cancellation quotes found.
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
