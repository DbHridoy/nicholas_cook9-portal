import { useMemo, useState } from 'react';
import { Activity, BarChart3, CalendarDays, ShieldCheck, ShoppingBag, TrendingUp, Users } from 'lucide-react';

const analyticsData = {
  totalSales: 4567,
  warrantedSales: 3284,
  activeDealers: 48,
  avgSalesPerDealer: 95,
  chartData: [
    { month: 'Jan', total: 400, warranted: 300, claims: 18 },
    { month: 'Feb', total: 350, warranted: 280, claims: 15 },
    { month: 'Mar', total: 500, warranted: 410, claims: 24 },
    { month: 'Apr', total: 480, warranted: 390, claims: 20 },
    { month: 'May', total: 600, warranted: 520, claims: 23 },
    { month: 'Jun', total: 550, warranted: 460, claims: 19 },
  ],
  leaders: [
    { name: 'Touch of Color Flooring', sales: 420, warrantyRate: 82, claims: 9 },
    { name: 'Northline Surfaces', sales: 366, warrantyRate: 74, claims: 6 },
    { name: 'Cedar & Stone Floors', sales: 312, warrantyRate: 69, claims: 11 },
    { name: 'Urban Plank Studio', sales: 284, warrantyRate: 78, claims: 4 },
  ],
};

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
  const maxVal = useMemo(() => Math.max(...analyticsData.chartData.map(d => d.total)), []);
  const warrantyAttachRate = Math.round((analyticsData.warrantedSales / analyticsData.totalSales) * 100);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            Sales Analytics
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '5px 0 0' }}>
            Aggregated performance across dealer contracts and warranty coverage.
          </p>
        </div>
        <button className="portal-btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', fontSize: 13 }}>
          <CalendarDays size={14} />
          Jan 1 - Jun 30
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14 }}>
        <StatCard title="Total Contracts" value={analyticsData.totalSales.toLocaleString()} detail="+12.4% from prior period" icon={ShoppingBag} tone="slate" />
        <StatCard title="Warranted Sales" value={analyticsData.warrantedSales.toLocaleString()} detail={`${warrantyAttachRate}% attach rate`} icon={ShieldCheck} tone="green" />
        <StatCard title="Active Dealers" value={analyticsData.activeDealers} detail={`${analyticsData.avgSalesPerDealer} avg contracts`} icon={Users} tone="blue" />
        <StatCard title="Program Growth" value="+12.4%" detail="Six-month blended rate" icon={TrendingUp} tone="gold" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(300px, 0.8fr)', gap: 16, alignItems: 'stretch' }}>
        <div className="portal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 18 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Monthly Contract Volume</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>Total contracts compared with warranty-backed contracts.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
                <span style={{ width: 9, height: 9, borderRadius: 99, background: '#111827' }} /> Total
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
                <span style={{ width: 9, height: 9, borderRadius: 99, background: '#e8a020' }} /> Warranted
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
                const totalHeight = Math.max((data.total / maxVal) * 100, 4);
                const warrantedHeight = Math.max((data.warranted / maxVal) * 100, 4);

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
                        <div>Total: {data.total}</div>
                        <div>Warranted: {data.warranted}</div>
                      </div>
                    )}
                    <div style={{ height: 250, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 5 }}>
                      <div style={{ height: `${totalHeight}%`, width: 16, borderRadius: '5px 5px 0 0', background: '#111827' }} />
                      <div style={{ height: `${warrantedHeight}%`, width: 16, borderRadius: '5px 5px 0 0', background: 'linear-gradient(180deg, #f5bc50, #e8a020)' }} />
                    </div>
                    <span style={{ height: 20, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{data.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="portal-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="stat-icon-gold" style={{ padding: 9 }}><Activity size={17} /></div>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Program Health</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>Coverage and claims indicators.</p>
            </div>
          </div>

          {[
            { label: 'Warranty attach rate', value: warrantyAttachRate, color: '#059669' },
            { label: 'Claim pressure', value: 23, color: '#e8a020' },
            { label: 'Dealer participation', value: 88, color: '#2563eb' },
          ].map((item) => (
            <div key={item.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 7 }}>
                <span>{item.label}</span>
                <span>{item.value}%</span>
              </div>
              <div style={{ height: 8, borderRadius: 99, background: '#eef2f7', overflow: 'hidden' }}>
                <div style={{ width: `${item.value}%`, height: '100%', background: item.color, borderRadius: 99 }} />
              </div>
            </div>
          ))}

          <div style={{ borderTop: '1px solid #eef2f7', paddingTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#059669', fontSize: 13, fontWeight: 700 }}>
              <BarChart3 size={15} />
              Warranty-backed contracts are outpacing total sales growth.
            </div>
          </div>
        </div>
      </div>

      <div className="portal-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 18px', borderBottom: '1px solid #e9ecef' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Dealer Leaderboard</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>Top dealers by warranty-backed sales activity.</p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="portal-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Dealer</th>
                <th style={{ textAlign: 'left' }}>Contracts</th>
                <th style={{ textAlign: 'left' }}>Attach Rate</th>
                <th style={{ textAlign: 'left' }}>Claims</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.leaders.map((dealer) => (
                <tr key={dealer.name}>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{dealer.name}</td>
                  <td>{dealer.sales}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 160 }}>
                      <div style={{ flex: 1, height: 7, borderRadius: 99, background: '#eef2f7', overflow: 'hidden' }}>
                        <div style={{ width: `${dealer.warrantyRate}%`, height: '100%', background: '#059669' }} />
                      </div>
                      <span style={{ fontWeight: 700, color: '#059669', fontSize: 12 }}>{dealer.warrantyRate}%</span>
                    </div>
                  </td>
                  <td>{dealer.claims}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
