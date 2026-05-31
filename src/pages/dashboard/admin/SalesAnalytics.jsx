import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ShoppingBag, Users } from 'lucide-react';
import { api } from '../../../lib/api';

const defaultAnalytics = { totalContracts: 0, activeDealers: 0, avgContractsPerDealer: 0, chartData: [] };

const StatCard = ({ title, value, detail, icon: Icon, tone }) => {
  const tones = {
    gold: 'bg-accent-gold/15 text-yellow-700',
    blue: 'bg-accent-blue/10 text-accent-blue',
    green: 'bg-emerald-500/10 text-emerald-600',
    slate: 'bg-slate-500/10 text-slate-600',
  };

  return (
    <div className="portal-card min-h-[118px] p-[18px]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="m-0 text-xs font-bold uppercase tracking-[0.06em] text-text-muted">
            {title}
          </p>
          <h3 className="mb-1 mt-2.25 text-[28px] font-extrabold leading-none text-text-primary">
            {value}
          </h3>
          <p className="m-0 text-xs text-text-secondary">{detail}</p>
        </div>
        <div className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] ${tones[tone]}`}>
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
    <div className="flex flex-col gap-5.5 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3.5">
        <div>
          <h1 className="m-0 text-2xl font-extrabold text-text-primary">
            Sales Analytics
          </h1>
          <p className="m-0 mt-1.25 text-[13px] text-text-muted">
            Aggregated performance across dealer contracts and claims.
          </p>
        </div>
        <button className="portal-btn-ghost flex items-center gap-2 px-3.5 py-2.25 text-[13px]">
          <CalendarDays size={14} />
          Jan 1 - Jun 30
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3.5">
        <StatCard title="Total Contracts" value={loading ? '...' : analyticsData.totalContracts.toLocaleString()} detail="All contract records" icon={ShoppingBag} tone="slate" />
        <StatCard title="Active Dealers" value={loading ? '...' : analyticsData.activeDealers} detail={`${analyticsData.avgContractsPerDealer} avg contracts`} icon={Users} tone="blue" />
      </div>

      {error && <div className="rounded-lg border border-red-600/20 bg-red-600/10 px-3.5 py-2.5 text-[13px] text-red-600">{error}</div>}

      <div className="portal-card p-5">
        <div className="mb-[18px] flex items-center justify-between gap-3.5">
          <div>
            <h2 className="m-0 text-base font-extrabold text-text-primary">Monthly Contract Volume</h2>
            <p className="m-0 mt-1 text-xs text-text-muted">Total contracts compared with claims.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3.5">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
              <span className="h-[9px] w-[9px] rounded-full bg-text-primary" /> Total Contracts
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
              <span className="h-[9px] w-[9px] rounded-full bg-accent-gold" /> Claims
            </span>
          </div>
        </div>

        <div className="grid h-[318px] grid-cols-[40px_1fr] gap-3">
          <div className="flex flex-col justify-between pb-7 text-[11px] text-text-muted">
            <span>{maxVal}</span>
            <span>{Math.round(maxVal / 2)}</span>
            <span>0</span>
          </div>
          <div className="grid items-end gap-3.5 border-b border-l border-slate-100 px-1.5 pt-2" style={{ gridTemplateColumns: `repeat(${analyticsData.chartData.length}, minmax(42px, 1fr))` }}>
            {analyticsData.chartData.map((data, index) => {
              const contractHeight = Math.max((data.contracts / maxVal) * 100, 4);
              const claimsHeight = Math.max((data.claims / maxVal) * 100, 4);

              return (
                <div
                  key={data.month}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative flex h-full min-w-[42px] flex-col items-center justify-end gap-2"
                >
                  {hoveredIndex === index && (
                    <div className="absolute -top-1 z-2 -translate-y-full whitespace-nowrap rounded-lg bg-text-primary px-2.5 py-2 text-[11px] text-white shadow-[0_10px_24px_rgba(15,23,42,0.22)]">
                      <div className="mb-0.75 font-extrabold">{data.month}</div>
                      <div>Total Contracts: {data.contracts}</div>
                      <div>Claims: {data.claims}</div>
                    </div>
                  )}
                  <div className="flex h-[250px] w-full items-end justify-center gap-1.25">
                    <div className="w-4 rounded-t-[5px] bg-text-primary" style={{ height: `${contractHeight}%` }} />
                    <div className="w-4 rounded-t-[5px] bg-[linear-gradient(180deg,#f5bc50,#e8a020)]" style={{ height: `${claimsHeight}%` }} />
                  </div>
                  <span className="h-5 text-xs font-semibold text-text-muted">{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
