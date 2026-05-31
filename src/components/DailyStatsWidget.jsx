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
    <div className="portal-card animate-fade-in" style={{ padding: 24, marginTop: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="stat-icon-purple" style={{ padding: 8 }}>
            <CalendarDays size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Daily Stats Report
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, marginTop: 1 }}>
              Enter today's performance data
            </p>
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Auto-calculate</span>
          <div
            onClick={() => setAutoCalc(p => !p)}
            style={{
              width: 36, height: 20, borderRadius: 10, cursor: 'pointer',
              background: autoCalc ? 'var(--accent-blue)' : '#d1d5db',
              position: 'relative', transition: 'background 0.25s',
            }}
          >
            <div style={{
              position: 'absolute', top: 2, left: autoCalc ? 18 : 2,
              width: 16, height: 16, borderRadius: '50%',
              background: '#fff',
              transition: 'left 0.25s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            }} />
          </div>
        </label>
      </div>

      {/* Form Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Report Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={e => handleChange('date', e.target.value)}
            className="portal-input"
            style={{ width: '100%', padding: '9px 12px', fontSize: 13, colorScheme: 'dark' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <Users size={11} style={{ display: 'inline', marginRight: 4 }} />
            Customers / Day
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 12"
            value={form.customers}
            onChange={e => handleChange('customers', e.target.value)}
            className="portal-input"
            style={{ width: '100%', padding: '9px 12px', fontSize: 13 }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <FileCheck size={11} style={{ display: 'inline', marginRight: 4 }} />
            Contracts Sold
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 5"
            value={form.contractsSold}
            onChange={e => handleChange('contractsSold', e.target.value)}
            className="portal-input"
            style={{ width: '100%', padding: '9px 12px', fontSize: 13 }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <DollarSign size={11} style={{ display: 'inline', marginRight: 4 }} />
            Avg Sale Value ($)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 750"
            value={form.avgSaleValue}
            onChange={e => handleChange('avgSaleValue', e.target.value)}
            className="portal-input"
            style={{ width: '100%', padding: '9px 12px', fontSize: 13 }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <BarChart2 size={11} style={{ display: 'inline', marginRight: 4 }} />
            Total Sales ($)
            {autoCalc && <span style={{ color: 'var(--accent-blue)', marginLeft: 4 }}>auto</span>}
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 3750"
            value={form.totalSales}
            onChange={e => handleChange('totalSales', e.target.value)}
            disabled={autoCalc}
            className="portal-input"
            style={{ width: '100%', padding: '9px 12px', fontSize: 13, opacity: autoCalc ? 0.5 : 1, cursor: autoCalc ? 'not-allowed' : 'text' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <TrendingUp size={11} style={{ display: 'inline', marginRight: 4 }} />
            Conversion Rate (%)
            {autoCalc && <span style={{ color: 'var(--accent-blue)', marginLeft: 4 }}>auto</span>}
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
            className="portal-input"
            style={{ width: '100%', padding: '9px 12px', fontSize: 13, opacity: autoCalc ? 0.5 : 1, cursor: autoCalc ? 'not-allowed' : 'text' }}
          />
        </div>
      </div>

      {/* Save Button */}
      {error && (
        <div style={{ marginBottom: 12, padding: '9px 14px', background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.18)', borderRadius: 8, fontSize: 12, color: '#dc2626' }}>
          {error}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={handleSave}
          disabled={!isValid}
          className="portal-btn-primary"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 22px', fontSize: 13,
            opacity: isValid ? 1 : 0.45,
            cursor: isValid ? 'pointer' : 'not-allowed',
          }}
        >
          {saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
          {saved ? 'Saved!' : 'Save Daily Report'}
        </button>
        {saved && (
          <span style={{ fontSize: 12, color: '#059669', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
            <CheckCircle2 size={13} />
            Report saved for {savedData?.date}
          </span>
        )}
      </div>

      {/* Saved Metrics Preview */}
      {savedData && (
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #e9ecef' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Report Summary — {savedData.date}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
            {metrics.map((m, i) => (
              <div key={i} style={{
                background: '#f9fafb',
                border: '1px solid #e9ecef',
                borderRadius: 10,
                padding: '12px 14px',
                display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className={m.cls} style={{ padding: 5 }}>
                    <m.icon size={12} />
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>{m.label}</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{m.value}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.suffix}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
