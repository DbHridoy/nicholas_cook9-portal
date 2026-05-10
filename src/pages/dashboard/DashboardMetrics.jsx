import React, { useState } from 'react';
import { FileCheck, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import DailyStatsWidget from '../../components/DailyStatsWidget';

const growthData = {
  weekly: [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ],
  monthly: [
    { name: 'Week 1', sales: 14000 },
    { name: 'Week 2', sales: 23000 },
    { name: 'Week 3', sales: 12000 },
    { name: 'Week 4', sales: 27800 },
  ],
  yearly: [
    { name: 'Jan', sales: 40000 },
    { name: 'Feb', sales: 30000 },
    { name: 'Mar', sales: 20000 },
    { name: 'Apr', sales: 27800 },
    { name: 'May', sales: 18900 },
    { name: 'Jun', sales: 23900 },
    { name: 'Jul', sales: 34900 },
    { name: 'Aug', sales: 42000 },
    { name: 'Sep', sales: 31000 },
    { name: 'Oct', sales: 25000 },
    { name: 'Nov', sales: 38000 },
    { name: 'Dec', sales: 45000 },
  ],
};

const statCards = [
  {
    title: 'Total Contracts Sold',
    value: '1,284',
    icon: FileCheck,
    iconCls: 'stat-icon-purple',
    trend: { value: 12.5, isPositive: true },
  },
  {
    title: 'Selling Growth',
    value: '+24%',
    icon: TrendingUp,
    iconCls: 'stat-icon-blue',
    trend: { value: 4.1, isPositive: true },
  },
  {
    title: 'Total Claims Resolved',
    value: '156',
    icon: CheckCircle,
    iconCls: 'stat-icon-green',
  },
  {
    title: 'Total Unresolved Claims',
    value: '12',
    icon: AlertCircle,
    iconCls: 'stat-icon-red',
    trend: { value: 2.4, isPositive: false },
  },
];

const StatCard = ({ title, value, icon: Icon, iconCls, trend }) => (
  <div
    className="portal-card animate-fade-in"
    style={{ padding: '20px 22px', transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s' }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 30px rgba(124,58,237,0.15)';
      e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.borderColor = 'rgba(124,58,237,0.18)';
    }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
        {title}
      </p>
      <div className={iconCls} style={{ padding: 8, flexShrink: 0 }}>
        <Icon size={16} />
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <span style={{ fontSize: 30, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
        {value}
      </span>
      {trend && (
        <span style={{
          fontSize: 12, fontWeight: 600,
          color: trend.isPositive ? '#34d399' : '#f87171',
          background: trend.isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          padding: '2px 7px', borderRadius: 99,
        }}>
          {trend.isPositive ? '+' : '-'}{trend.value}%
        </span>
      )}
    </div>
    {trend && (
      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, margin: '6px 0 0' }}>
        vs. last period
      </p>
    )}
  </div>
);

export default function DashboardMetrics() {
  const [timeframe, setTimeframe] = useState('monthly');
  const { role: userRole } = useSelector((state) => state.auth);
  const maxSales = Math.max(...growthData[timeframe].map(d => d.sales));

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, margin: '4px 0 0' }}>
          Overview of your {userRole === 'admin' ? 'platform-wide' : 'store'} metrics and performance.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Chart Card */}
      <div className="portal-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Contract Sales Growth
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '3px 0 0' }}>
              Revenue trend over time
            </p>
          </div>

          {/* Timeframe Toggle */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 8,
            padding: 3,
            gap: 2,
          }}>
            {['weekly', 'monthly', 'yearly'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                style={{
                  padding: '5px 14px',
                  borderRadius: 6,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s',
                  background: timeframe === tf
                    ? 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)'
                    : 'transparent',
                  color: timeframe === tf ? '#fff' : 'var(--text-muted)',
                  boxShadow: timeframe === tf ? '0 2px 10px rgba(124,58,237,0.3)' : 'none',
                }}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div style={{ height: 260, display: 'flex', alignItems: 'flex-end', gap: 6, paddingTop: 20 }}>
          {growthData[timeframe].map((item, i) => {
            const heightPercent = (item.sales / maxSales) * 100;
            return (
              <div
                key={i}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end', gap: 8 }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${heightPercent}%`,
                    background: 'linear-gradient(180deg, #7c3aed 0%, #3b82f6 100%)',
                    borderRadius: '6px 6px 0 0',
                    opacity: 0.3,
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s, transform 0.2s',
                    minHeight: 4,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(124,58,237,0.5)';
                    e.currentTarget.querySelector('.bar-tooltip').style.opacity = '1';
                    e.currentTarget.querySelector('.bar-tooltip').style.transform = 'translateY(0) translateX(-50%)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.opacity = '0.3';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.querySelector('.bar-tooltip').style.opacity = '0';
                    e.currentTarget.querySelector('.bar-tooltip').style.transform = 'translateY(4px) translateX(-50%)';
                  }}
                >
                  <div
                    className="bar-tooltip"
                    style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateY(4px) translateX(-50%)',
                      background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '4px 9px',
                      borderRadius: 6,
                      whiteSpace: 'nowrap',
                      opacity: 0,
                      transition: 'opacity 0.2s, transform 0.2s',
                      pointerEvents: 'none',
                      zIndex: 10,
                      marginBottom: 6,
                      boxShadow: '0 4px 14px rgba(124,58,237,0.4)',
                    }}
                  >
                    ${item.sales.toLocaleString()}
                  </div>
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textAlign: 'center' }}>
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Stats Widget — Dealer only */}
      {userRole !== 'admin' && <DailyStatsWidget />}
    </div>
  );
}
