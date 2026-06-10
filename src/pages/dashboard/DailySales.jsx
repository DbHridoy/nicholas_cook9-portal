import { useEffect, useState } from 'react';
import { Plus, X, Search, Calendar, User, DollarSign, Percent, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../../lib/api';

const formatMoney = (value) => '$' + Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatPercent = (value) => Number(value || 0).toFixed(1) + '%';

const toSaleRow = (sale) => ({
  id: sale._id,
  date: sale.date,
  customer: sale.customerName,
  revenue: sale.totalRevenue,
  margin: sale.grossMargin,
});

export default function DailySales() {
  const [sales, setSales] = useState([]);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    averageGrossMargin: 0,
    salesRecorded: 0,
  });
  const [dailySummaries, setDailySummaries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [pageError, setPageError] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    customer: '',
    revenue: '',
    margin: '',
  });

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  useEffect(() => {
    let active = true;

    api.listDailySales({
      search: search.trim() || undefined,
      date: dateFilter || undefined,
    })
      .then((data) => {
        if (!active) return;

        setSales((data.sales ?? []).map(toSaleRow));
        setMetrics(data.metrics ?? {
          totalRevenue: 0,
          averageGrossMargin: 0,
          salesRecorded: 0,
        });
        setDailySummaries(data.dailySummaries ?? []);
      })
      .catch((err) => {
        if (active) {
          setPageError(err instanceof Error ? err.message : 'Unable to load daily sales.');
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
  }, [search, dateFilter]);

  const handleAddSale = async (e) => {
    e.preventDefault();
    setFormError('');

    const revenueNum = parseFloat(form.revenue);
    const marginNum = parseFloat(form.margin);

    if (!form.date) {
      setFormError('Date is required.');
      return;
    }
    if (!form.customer.trim()) {
      setFormError('Customer name is required.');
      return;
    }
    if (isNaN(revenueNum) || revenueNum < 0) {
      setFormError('Revenue must be a valid positive number.');
      return;
    }
    if (isNaN(marginNum) || marginNum < 0 || marginNum > 100) {
      setFormError('Gross margin percent must be a number between 0 and 100.');
      return;
    }

    try {
      const createdSale = await api.createDailySale({
        date: form.date,
        customerName: form.customer.trim(),
        totalRevenue: revenueNum,
        grossMargin: marginNum,
      });

      const createdDateMatchesFilter = !dateFilter || createdSale.date === dateFilter;
      const createdSearchMatchesFilter = !search.trim()
        || createdSale.customerName.toLowerCase().includes(search.trim().toLowerCase());

      if (createdDateMatchesFilter && createdSearchMatchesFilter) {
        setSales((prev) => [toSaleRow(createdSale), ...prev]);
        setMetrics((prev) => {
          const totalRevenue = prev.totalRevenue + createdSale.totalRevenue;
          const salesRecorded = prev.salesRecorded + 1;
          const averageGrossMargin = salesRecorded === 0
            ? 0
            : ((prev.averageGrossMargin * prev.salesRecorded) + createdSale.grossMargin) / salesRecorded;

          return {
            totalRevenue,
            salesRecorded,
            averageGrossMargin,
          };
        });
      }

      setDailySummaries((prev) => {
        const next = [...prev];
        const existingIndex = next.findIndex((summary) => summary.date === createdSale.date);

        if (existingIndex === -1) {
          next.push({
            date: createdSale.date,
            totalRevenue: createdSale.totalRevenue,
            averageGrossMargin: createdSale.grossMargin,
            salesRecorded: 1,
          });
        } else {
          const current = next[existingIndex];
          const salesRecorded = current.salesRecorded + 1;
          next[existingIndex] = {
            ...current,
            totalRevenue: current.totalRevenue + createdSale.totalRevenue,
            averageGrossMargin:
              ((current.averageGrossMargin * current.salesRecorded) + createdSale.grossMargin) / salesRecorded,
            salesRecorded,
          };
        }

        return next.sort((a, b) => b.date.localeCompare(a.date));
      });

      setForm({
        date: new Date().toISOString().split('T')[0],
        customer: '',
        revenue: '',
        margin: '',
      });
      setShowForm(false);
      showSuccess('Daily sale entry added successfully.');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to save daily sale.');
    }
  };

  const handleDeleteSale = async (id) => {
    if (window.confirm('Are you sure you want to delete this sale entry?')) {
      try {
        await api.deleteDailySale(id);
        showSuccess('Sale entry removed.');

        const refreshed = await api.listDailySales({
          search: search.trim() || undefined,
          date: dateFilter || undefined,
        });

        setSales((refreshed.sales ?? []).map(toSaleRow));
        setMetrics(refreshed.metrics ?? {
          totalRevenue: 0,
          averageGrossMargin: 0,
          salesRecorded: 0,
        });
        setDailySummaries(refreshed.dailySummaries ?? []);
        setPageError('');
      } catch (err) {
        setPageError(err instanceof Error ? err.message : 'Unable to delete daily sale.');
      }
    }
  };

  return (
    <div className="portal-page animate-fade-in">
      {/* Header */}
      <div className="portal-page-header">
        <div>
          <h1 className="portal-page-title">Daily Sales</h1>
          <p className="portal-page-subtitle">Track and manage daily revenue and margins outside of service contracts.</p>
        </div>
        <div>
          <button
            onClick={() => {
              setShowForm((p) => !p);
              setFormError('');
            }}
            className="portal-btn-primary flex items-center gap-1.75 px-4 py-2.25 text-[13px]"
          >
            {showForm ? <X size={14} /> : <Plus size={14} />} {showForm ? 'Close Form' : 'Add Daily Sale'}
          </button>
        </div>
      </div>

      {/* Success Notification */}
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

      {loading && (
        <div className="rounded-lg border border-portal-border-sub bg-white px-4 py-3 text-[13px] text-text-muted">
          Loading daily sales...
        </div>
      )}

      {/* Manual Entry Form */}
      {showForm && (
        <div className="portal-card p-5.5 animate-fade-in">
          <div className="mb-[18px] flex items-center justify-between">
            <h2 className="m-0 text-sm font-bold text-text-primary">Manual Daily Sale Entry</h2>
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

          <form onSubmit={handleAddSale} className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1.75 flex items-center gap-1.25 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
                <Calendar size={11} className="text-slate-500" /> Date
              </label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                className="portal-input w-full px-3 py-2.25 text-[13px]"
              />
            </div>
            <div>
              <label className="mb-1.75 flex items-center gap-1.25 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
                <User size={11} className="text-slate-500" /> Customer Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. John Smith"
                value={form.customer}
                onChange={(e) => setForm((p) => ({ ...p, customer: e.target.value }))}
                className="portal-input w-full px-3 py-2.25 text-[13px]"
              />
            </div>
            <div>
              <label className="mb-1.75 flex items-center gap-1.25 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
                <DollarSign size={11} className="text-slate-500" /> Total Revenue
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                placeholder="e.g. 1500.00"
                value={form.revenue}
                onChange={(e) => setForm((p) => ({ ...p, revenue: e.target.value }))}
                className="portal-input w-full px-3 py-2.25 text-[13px]"
              />
            </div>
            <div>
              <label className="mb-1.75 flex items-center gap-1.25 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
                <Percent size={11} className="text-slate-500" /> Gross Margin %
              </label>
              <input
                type="number"
                required
                step="0.1"
                min="0"
                max="100"
                placeholder="e.g. 35.5"
                value={form.margin}
                onChange={(e) => setForm((p) => ({ ...p, margin: e.target.value }))}
                className="portal-input w-full px-3 py-2.25 text-[13px]"
              />
            </div>
            <div className="flex gap-2.5 md:col-span-4">
              <button
                type="submit"
                className="portal-btn-primary flex items-center gap-1.75 px-5 py-2.25 text-[13px]"
              >
                Save Sale
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormError('');
                  setForm({
                    date: new Date().toISOString().split('T')[0],
                    customer: '',
                    revenue: '',
                    margin: '',
                  });
                }}
                className="portal-btn-ghost px-4 py-2.25 text-[13px]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="portal-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-[0.06em] text-text-muted">Total Revenue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-emerald-500/10 text-emerald-600">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-text-primary">{formatMoney(metrics.totalRevenue)}</span>
            <p className="m-0 mt-1.5 text-[11px] text-text-muted">Filtered totals based on active filters</p>
          </div>
        </div>

        <div className="portal-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-[0.06em] text-text-muted">Avg. Gross Margin</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-accent-gold/15 text-accent-gold">
              <Percent size={16} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-text-primary">{formatPercent(metrics.averageGrossMargin)}</span>
            <p className="m-0 mt-1.5 text-[11px] text-text-muted">Average profitability per sale</p>
          </div>
        </div>

        <div className="portal-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-[0.06em] text-text-muted">Sales Recorded</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-accent-blue/10 text-accent-blue">
              <User size={16} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-text-primary">{metrics.salesRecorded}</span>
            <p className="m-0 mt-1.5 text-[11px] text-text-muted">Total manual entries found</p>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sales Transactions Table Card */}
        <div className="portal-card overflow-hidden lg:col-span-2">
          <div className="border-b border-portal-border-sub bg-white px-5 py-4">
            <h2 className="m-0 text-sm font-bold text-text-primary">Sales Transactions</h2>
            <p className="m-0 mt-1 text-[11px] text-text-muted">Detailed view of all manual entries</p>
          </div>

          {/* Table Filters */}
          <div className="flex flex-wrap items-center gap-3 border-b border-portal-border-sub px-5 py-3 bg-gray-50">
            <div className="relative max-w-[240px] flex-1">
              <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search customer..."
                value={search}
                onChange={(e) => {
                  setLoading(true);
                  setPageError('');
                  setSearch(e.target.value);
                }}
                className="portal-input w-full py-1.75 pl-7.5 pr-3 text-[12.5px]"
              />
            </div>
            <div className="relative max-w-[180px] flex-1">
              <Calendar size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setLoading(true);
                  setPageError('');
                  setDateFilter(e.target.value);
                }}
                className="portal-input w-full py-1.75 pl-7.5 pr-3 text-[12.5px]"
              />
            </div>
            {(search || dateFilter) && (
              <button
                onClick={() => {
                  setLoading(true);
                  setPageError('');
                  setSearch('');
                  setDateFilter('');
                }}
                className="text-xs font-semibold text-accent-blue hover:text-blue-700 bg-transparent border-0 cursor-pointer"
              >
                Clear Filters
              </button>
            )}
            <span className="ml-auto text-xs text-text-muted">
              {sales.length} entry{sales.length !== 1 ? 'ies' : ''}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer Name</th>
                  <th>Total Revenue</th>
                  <th>Gross Margin</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id}>
                    <td>
                      <span className="font-semibold text-text-secondary">
                        {sale.date}
                      </span>
                    </td>
                    <td className="font-medium">{sale.customer}</td>
                    <td className="font-bold text-emerald-600">{formatMoney(sale.revenue)}</td>
                    <td className="font-bold text-accent-blue">{formatPercent(sale.margin)}</td>
                    <td className="text-right">
                      <button
                        onClick={() => handleDeleteSale(sale.id)}
                        className="inline-flex cursor-pointer items-center justify-center rounded-[7px] border border-red-500/10 bg-red-500/10 p-2 text-red-500 hover:bg-red-500/20"
                        title="Delete Sale"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
                {sales.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-text-muted">
                      No sales records found matching the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
              {sales.length > 0 && (
                <tfoot>
                  <tr className="bg-gray-50 border-t border-portal-border font-bold">
                    <td colSpan={2} className="px-5 py-3.5 text-xs uppercase tracking-wider text-text-primary">
                      Total / Average
                    </td>
                    <td className="px-5 py-3.5 text-sm text-emerald-600 font-black">
                      {formatMoney(metrics.totalRevenue)}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-accent-blue font-black">
                      {formatPercent(metrics.averageGrossMargin)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        {/* Daily Summaries Card */}
        <div className="portal-card overflow-hidden">
          <div className="border-b border-portal-border-sub bg-white px-5 py-4">
            <h2 className="m-0 text-sm font-bold text-text-primary">Daily Summaries</h2>
            <p className="m-0 mt-1 text-[11px] text-text-muted">Grouped totals and average margin per day</p>
          </div>

          <div className="overflow-x-auto">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Total Revenue</th>
                  <th>Avg Margin</th>
                </tr>
              </thead>
              <tbody>
                {dailySummaries.map((summary) => (
                  <tr key={summary.date} className="hover:bg-gray-50">
                    <td>
                      <span className="font-semibold text-text-secondary">
                        {summary.date}
                      </span>
                    </td>
                    <td className="font-bold text-emerald-600">
                      {formatMoney(summary.totalRevenue)}
                    </td>
                    <td className="font-bold text-accent-gold">
                      {formatPercent(summary.averageGrossMargin)}
                    </td>
                  </tr>
                ))}
                {dailySummaries.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-5 py-10 text-center text-text-muted">
                      No data to summarize.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
