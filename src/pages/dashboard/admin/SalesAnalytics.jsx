import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ShoppingBag, Users } from 'lucide-react';
import { api } from '../../../lib/api';

const defaultAnalytics = { totalContracts: 0, activeDealers: 0, avgContractsPerDealer: 0, chartData: [] };

const StatCard = ({ title, value, detail, icon: Icon, tone }) => {
  const tones = {
    gold: ['rgba(232,160,32,0.12)', '#b7791f'],
    blue: ['rgba(37,99,235,0.10)', '#2563eb'],
    green: ['rgba(16,185,129,0.10)', '#059669'],
    slate: ['rgba(100,116,139,0.12)', '#475569'],
  };
  const [bg, color] = tones[tone];

  return (
    <div className="portal-card" style={{ padding: 18, minHeight: 118 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {title}
          </p>
          <h3 style={{ margin: '9px 0 4px', fontSize: 28, lineHeight: 1, fontWeight: 800, color: 'var(--text-primary)' }}>
            {value}
          </h3>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>{detail}</p>
        </div>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

export default function SalesAnalytics() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(defaultAnalytics);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const maxVal = useMemo(() => Math.max(...analyticsData.chartData.flatMap(d => [d.contracts, d.claims]), 1), [analyticsData]);

  useEffect(() => {
    let active = true;

    api.getAnalytics()
      .then((data) => {
        if (active) setAnalyticsData({ ...defaultAnalytics, ...data, chartData: data?.chartData ?? [] });
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load analytics.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            Sales Analytics
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '5px 0 0' }}>
            Aggregated performance across dealer contracts and claims.
          </p>
        </div>
        <button className="portal-btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', fontSize: 13 }}>
          <CalendarDays size={14} />
          Jan 1 - Jun 30
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14 }}>
        <StatCard title="Total Contracts" value={loading ? '...' : analyticsData.totalContracts.toLocaleString()} detail="All contract records" icon={ShoppingBag} tone="slate" />
        <StatCard title="Active Dealers" value={loading ? '...' : analyticsData.activeDealers} detail={`${analyticsData.avgContractsPerDealer} avg contracts`} icon={Users} tone="blue" />
      </div>

      {error && <div style={{ padding: '10px 14px', border: '1px solid rgba(220,38,38,0.18)', background: 'rgba(220,38,38,0.07)', color: '#dc2626', borderRadius: 8, fontSize: 13 }}>{error}</div>}

      <div className="portal-card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 18 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Monthly Contract Volume</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>Total contracts compared with claims.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
              <span style={{ width: 9, height: 9, borderRadius: 99, background: '#111827' }} /> Total Contracts
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
              <span style={{ width: 9, height: 9, borderRadius: 99, background: '#e8a020' }} /> Claims
            </span>
          </div>
        </div>

        <div style={{ height: 318, display: 'grid', gridTemplateColumns: '40px 1fr', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: 11, paddingBottom: 28 }}>
            <span>{maxVal}</span>
            <span>{Math.round(maxVal / 2)}</span>
            <span>0</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${analyticsData.chartData.length}, minmax(42px, 1fr))`, alignItems: 'end', gap: 14, borderLeft: '1px solid #eef2f7', borderBottom: '1px solid #eef2f7', padding: '8px 6px 0' }}>
            {analyticsData.chartData.map((data, index) => {
              const contractHeight = Math.max((data.contracts / maxVal) * 100, 4);
              const claimsHeight = Math.max((data.claims / maxVal) * 100, 4);

              return (
                <div
                  key={data.month}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 8, position: 'relative', minWidth: 42 }}
                >
                  {hoveredIndex === index && (
                    <div style={{ position: 'absolute', top: -4, transform: 'translateY(-100%)', background: '#111827', color: '#fff', borderRadius: 8, padding: '8px 10px', fontSize: 11, boxShadow: '0 10px 24px rgba(15,23,42,0.22)', whiteSpace: 'nowrap', zIndex: 2 }}>
                      <div style={{ fontWeight: 800, marginBottom: 3 }}>{data.month}</div>
                      <div>Total Contracts: {data.contracts}</div>
                      <div>Claims: {data.claims}</div>
                    </div>
                  )}
                  <div style={{ height: 250, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 5 }}>
                    <div style={{ height: `${contractHeight}%`, width: 16, borderRadius: '5px 5px 0 0', background: '#111827' }} />
                    <div style={{ height: `${claimsHeight}%`, width: 16, borderRadius: '5px 5px 0 0', background: 'linear-gradient(180deg, #f5bc50, #e8a020)' }} />
                  </div>
                  <span style={{ height: 20, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
