import { useEffect, useState } from 'react';
import { Users, FileCheck, DollarSign, TrendingUp, BarChart2, Save, CalendarDays, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api';

const defaultForm = {
  date: new Date().toISOString().slice(0, 10),
  customers: '',
  contractsSold: '',
  avgSaleValue: '',
  totalSales: '',
  conversionRate: '',
};

export default function DailyStatsWidget() {
  const [form, setForm] = useState(defaultForm);
  const [saved, setSaved] = useState(false);
  const [savedData, setSavedData] = useState(null);
  const [autoCalc, setAutoCalc] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    api.listDailyStats()
      .then((data) => {
        if (!active || data.length === 0) return;

        const latest = data[0];
        setSavedData({
          date: latest.date?.slice(0, 10) ?? defaultForm.date,
          customers: String(latest.customers ?? ''),
          contractsSold: String(latest.contractsSold ?? ''),
          avgSaleValue: String(latest.avgSaleValue ?? ''),
          totalSales: String(latest.totalSales ?? ''),
          conversionRate: String(latest.conversionRate ?? ''),
        });
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load daily stats.');
      });

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value };
    // Auto-calculate totals when autoCalc is on
    if (autoCalc) {
      const c = parseFloat(updated.customers) || 0;
      const cs = parseFloat(updated.contractsSold) || 0;
      const avg = parseFloat(updated.avgSaleValue) || 0;
      if (field !== 'totalSales' && cs && avg) {
        updated.totalSales = (cs * avg).toFixed(2);
      }
      if (field !== 'conversionRate' && c && cs) {
        updated.conversionRate = ((cs / c) * 100).toFixed(1);
      }
    }
    setForm(updated);
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      const savedStat = await api.saveDailyStat({
        date: form.date,
        customers: Number(form.customers),
        contractsSold: Number(form.contractsSold),
        avgSaleValue: Number(form.avgSaleValue || 0),
        totalSales: Number(form.totalSales || 0),
        conversionRate: Number(form.conversionRate || 0),
      });
      setSavedData({
        date: savedStat.date?.slice(0, 10) ?? form.date,
        customers: String(savedStat.customers),
        contractsSold: String(savedStat.contractsSold),
        avgSaleValue: String(savedStat.avgSaleValue),
        totalSales: String(savedStat.totalSales),
        conversionRate: String(savedStat.conversionRate),
      });
      setSaved(true);
      setError('');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save daily stats.');
    }
  };

  const isValid = form.customers && form.contractsSold;

  const metrics = savedData ? [
    {
      label: 'Customers',
      value: savedData.customers,
      suffix: 'today',
      icon: Users,
      cls: 'stat-icon-blue',
    },
    {
      label: 'Contracts Sold',
      value: savedData.contractsSold,
      suffix: 'contracts',
      icon: FileCheck,
      cls: 'stat-icon-purple',
    },
    {
      label: 'Avg Sale Value',
      value: savedData.avgSaleValue ? `$${parseFloat(savedData.avgSaleValue).toLocaleString()}` : '—',
      suffix: 'per contract',
      icon: DollarSign,
      cls: 'stat-icon-green',
    },
    {
      label: 'Total Sales',
      value: savedData.totalSales ? `$${parseFloat(savedData.totalSales).toLocaleString()}` : '—',
      suffix: 'revenue',
      icon: BarChart2,
      cls: 'stat-icon-purple',
    },
    {
      label: 'Conversion Rate',
      value: savedData.conversionRate ? `${savedData.conversionRate}%` : '—',
      suffix: 'of customers',
      icon: TrendingUp,
      cls: 'stat-icon-blue',
    },
  ] : [];

  return (
    <div className="portal-card mt-6 p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="stat-icon-purple p-2">
            <CalendarDays size={18} />
          </div>
          <div>
            <h2 className="m-0 text-[15px] font-bold text-text-primary">
              Daily Stats Report
            </h2>
            <p className="m-0 mt-px text-xs text-text-muted">
              Enter today's performance data
            </p>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2">
          <span className="text-xs text-text-muted">Auto-calculate</span>
          <div
            onClick={() => setAutoCalc(p => !p)}
            className={`relative h-5 w-9 cursor-pointer rounded-full transition ${autoCalc ? 'bg-accent-blue' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${autoCalc ? 'left-[18px]' : 'left-0.5'}`} />
          </div>
        </label>
      </div>

      {/* Form Grid */}
      <div className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
            Report Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={e => handleChange('date', e.target.value)}
            className="portal-input w-full px-3 py-2.25 text-[13px]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
            <Users size={11} className="mr-1 inline" />
            Customers / Day
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 12"
            value={form.customers}
            onChange={e => handleChange('customers', e.target.value)}
            className="portal-input w-full px-3 py-2.25 text-[13px]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
            <FileCheck size={11} className="mr-1 inline" />
            Contracts Sold
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 5"
            value={form.contractsSold}
            onChange={e => handleChange('contractsSold', e.target.value)}
            className="portal-input w-full px-3 py-2.25 text-[13px]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
            <DollarSign size={11} className="mr-1 inline" />
            Avg Sale Value ($)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 750"
            value={form.avgSaleValue}
            onChange={e => handleChange('avgSaleValue', e.target.value)}
            className="portal-input w-full px-3 py-2.25 text-[13px]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
            <BarChart2 size={11} className="mr-1 inline" />
            Total Sales ($)
            {autoCalc && <span className="ml-1 text-accent-blue">auto</span>}
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 3750"
            value={form.totalSales}
            onChange={e => handleChange('totalSales', e.target.value)}
            disabled={autoCalc}
            className={`portal-input w-full px-3 py-2.25 text-[13px] ${autoCalc ? 'cursor-not-allowed opacity-50' : 'cursor-text'}`}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
            <TrendingUp size={11} className="mr-1 inline" />
            Conversion Rate (%)
            {autoCalc && <span className="ml-1 text-accent-blue">auto</span>}
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            placeholder="e.g. 41.6"
            value={form.conversionRate}
            onChange={e => handleChange('conversionRate', e.target.value)}
            disabled={autoCalc}
            className={`portal-input w-full px-3 py-2.25 text-[13px] ${autoCalc ? 'cursor-not-allowed opacity-50' : 'cursor-text'}`}
          />
        </div>
      </div>

      {/* Save Button */}
      {error && (
        <div className="mb-3 rounded-lg border border-red-600/20 bg-red-600/10 px-3.5 py-2.25 text-xs text-red-600">
          {error}
        </div>
      )}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`portal-btn-primary flex items-center gap-2 px-5.5 py-2.5 text-[13px] ${isValid ? 'opacity-100' : 'cursor-not-allowed opacity-45'}`}
        >
          {saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
          {saved ? 'Saved!' : 'Save Daily Report'}
        </button>
        {saved && (
          <span className="flex items-center gap-1.25 text-xs font-medium text-emerald-600">
            <CheckCircle2 size={13} />
            Report saved for {savedData?.date}
          </span>
        )}
      </div>

      {/* Saved Metrics Preview */}
      {savedData && (
        <div className="mt-5 border-t border-portal-border-sub pt-5">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">
            Report Summary — {savedData.date}
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-2.5">
            {metrics.map((m, i) => (
              <div key={i} className="flex flex-col gap-1.5 rounded-[10px] border border-portal-border-sub bg-gray-50 px-3.5 py-3">
                <div className="flex items-center gap-1.5">
                  <div className={`${m.cls} p-1.25`}>
                    <m.icon size={12} />
                  </div>
                  <span className="text-[10px] font-medium text-text-muted">{m.label}</span>
                </div>
                <div className="text-lg font-bold text-text-primary">{m.value}</div>
                <div className="text-[10px] text-text-muted">{m.suffix}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
