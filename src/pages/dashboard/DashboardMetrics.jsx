import { useEffect, useMemo, useState } from 'react';
import { FileText, CheckCircle2, Calendar, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DailyStatsWidget from '../../components/DailyStatsWidget';
import { api } from '../../lib/api';

const defaultDashboard = {
  period: { label: 'This month' },
  stats: {
    totalContracts: { value: 0, trend: 'No comparison available' },
    claimsSubmitted: { value: 0, trend: 'No comparison available' },
    claimsApproved: { value: 0, trend: 'No comparison available' },
    users: { total: 0, admins: 0, dealers: 0, active: 0, blocked: 0 },
  },
  claimsOverview: {
    total: 0,
    byStatus: [
      { status: 'pending', label: 'Pending', color: '#f59e0b', count: 0, pct: 0 },
      { status: 'approved', label: 'Approved', color: '#10b981', count: 0, pct: 0 },
      { status: 'denied', label: 'Denied', color: '#ef4444', count: 0, pct: 0 },
    ],
  },
  recentClaims: [],
};

const normalizeDashboard = (value) => ({
  ...defaultDashboard,
  ...(value ?? {}),
  period: {
    ...defaultDashboard.period,
    ...(value?.period ?? {}),
  },
  stats: {
    ...defaultDashboard.stats,
    ...(value?.stats ?? {}),
    totalContracts: {
      ...defaultDashboard.stats.totalContracts,
      ...(value?.stats?.totalContracts ?? {}),
    },
    claimsSubmitted: {
      ...defaultDashboard.stats.claimsSubmitted,
      ...(value?.stats?.claimsSubmitted ?? {}),
    },
    claimsApproved: {
      ...defaultDashboard.stats.claimsApproved,
      ...(value?.stats?.claimsApproved ?? {}),
    },
    users: {
      ...defaultDashboard.stats.users,
      ...(value?.stats?.users ?? {}),
    },
  },
  claimsOverview: {
    ...defaultDashboard.claimsOverview,
    ...(value?.claimsOverview ?? {}),
    byStatus: value?.claimsOverview?.byStatus ?? defaultDashboard.claimsOverview.byStatus,
  },
  recentClaims: value?.recentClaims ?? defaultDashboard.recentClaims,
});

const formatDate = (value) => value ? new Date(value).toLocaleDateString() : '-';
const formatAmount = (value) => typeof value === 'number'
  ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  : '—';

const getStatusBadge = (status) => {
  switch (status) {
    case 'pending': return { bg: '#fef3c7', color: '#d97706', label: 'Pending' };
    case 'approved': return { bg: '#dcfce7', color: '#059669', label: 'Approved' };
    case 'denied': return { bg: '#fee2e2', color: '#dc2626', label: 'Denied' };
    default:          return { bg: '#f1f5f9', color: '#64748b' };
  }
};

export default function DashboardMetrics() {
  const { role: userRole } = useSelector((state) => state.auth);
  const isAdminPortal = userRole === 'admin' || userRole === 'super_admin';
  const isSuperAdmin = userRole === 'super_admin';
  const claimsPath = isAdminPortal ? '/dashboard/complaints' : '/dashboard/reports';
  const [dashboard, setDashboard] = useState(defaultDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    api.getDashboard()
      .then((data) => {
        if (active) setDashboard(normalizeDashboard(data));
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load dashboard metrics.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const statCards = useMemo(() => {
    const cards = [
      {
        title: 'Total Active Contracts',
        value: dashboard.stats.totalContracts.value,
        icon: FileText,
        iconColor: '#64748b',
        iconBg: '#f1f5f9',
        trend: dashboard.stats.totalContracts.trend,
      },
      {
        title: 'Claims Submitted',
        value: dashboard.stats.claimsSubmitted.value,
        icon: FileText,
        iconColor: '#2563eb',
        iconBg: '#eff6ff',
        trend: dashboard.stats.claimsSubmitted.trend,
      },
      {
        title: 'Claims Approved',
        value: dashboard.stats.claimsApproved.value,
        icon: CheckCircle2,
        iconColor: '#059669',
        iconBg: '#dcfce7',
        trend: dashboard.stats.claimsApproved.trend,
      },
    ];

    if (isSuperAdmin) {
      cards.unshift({
        title: 'Total Users',
        value: dashboard.stats.users.total,
        icon: Users,
        iconColor: '#9333ea',
        iconBg: '#f3e8ff',
        trend: `${dashboard.stats.users.admins} admins / ${dashboard.stats.users.dealers} dealers`,
      });
    }

    return cards;
  }, [dashboard, isSuperAdmin]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Dashboard Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>
            Dashboard
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0' }}>
            {isSuperAdmin
              ? 'Here is the full portal view across admins, dealers, contracts, and claims.'
              : "Here's what's happening with your protection program."}
          </p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8,
          padding: '8px 14px', fontSize: 13, fontWeight: 500, color: '#4b5563',
          cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
        }}>
          {dashboard.period.label}
          <Calendar size={14} style={{ color: '#9ca3af' }} />
        </button>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', border: '1px solid rgba(220,38,38,0.18)', background: 'rgba(220,38,38,0.07)', color: '#dc2626', borderRadius: 8, fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Stat Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {statCards.map((card, idx) => (
          <div key={idx} className="portal-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#4b5563', margin: '0 0 8px 0' }}>{card.title}</p>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', lineHeight: 1 }}>{loading ? '...' : card.value}</div>
              </div>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <card.icon size={20} style={{ color: card.iconColor }} />
              </div>
            </div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#059669', margin: 0 }}>
              {card.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Claims Overview Donut Chart */}
        <div className="portal-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 32px' }}>Claims Overview</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            {/* CSS Donut Chart */}
            <div style={{
              width: 180, height: 180, borderRadius: '50%',
              background: dashboard.claimsOverview.total
                ? `conic-gradient(${dashboard.claimsOverview.byStatus.map((item, index, items) => {
                  const start = items.slice(0, index).reduce((sum, current) => sum + current.pct, 0);
                  return `${item.color} ${start}% ${start + item.pct}%`;
                }).join(', ')})`
                : '#f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'inset 0 0 0 2px #fff',
              position: 'relative'
            }}>
              {/* White inner circle to make it a donut */}
              <div style={{ 
                width: 130, height: 130, borderRadius: '50%', 
                background: '#ffffff', 
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>{loading ? '...' : dashboard.claimsOverview.total}</span>
                <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Total</span>
              </div>
            </div>

            {/* Legend */}
            <div style={{ width: '100%', marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {dashboard.claimsOverview.byStatus.map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                    <span style={{ fontWeight: 600, color: '#111827' }}>{item.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, color: '#4b5563' }}>
                    <span style={{ fontWeight: 600, width: 20, textAlign: 'right' }}>{item.count}</span>
                    <span style={{ color: '#6b7280', width: 36 }}>({item.pct}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Link to={claimsPath} style={{ color: '#2563eb', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              View all claims →
            </Link>
          </div>
        </div>

        {/* Recent Claims Table */}
        <div className="portal-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Recent Claims</h2>
            <Link to={claimsPath} style={{ color: '#2563eb', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              View all →
            </Link>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ paddingBottom: 16, borderBottom: '1px solid #f3f4f6', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Claim #</th>
                <th style={{ paddingBottom: 16, borderBottom: '1px solid #f3f4f6', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Customer</th>
                <th style={{ paddingBottom: 16, borderBottom: '1px solid #f3f4f6', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Status</th>
                <th style={{ paddingBottom: 16, borderBottom: '1px solid #f3f4f6', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Date Submitted</th>
                <th style={{ paddingBottom: 16, borderBottom: '1px solid #f3f4f6', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {!loading && dashboard.recentClaims.map((claim, idx) => {
                const badge = getStatusBadge(claim.status);
                return (
                  <tr key={idx}>
                    <td style={{ padding: '16px 0', fontSize: 13, fontWeight: 600, color: '#111827', borderBottom: idx !== dashboard.recentClaims.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                      {claim.id}
                    </td>
                    <td style={{ padding: '16px 0', fontSize: 13, color: '#4b5563', fontWeight: 500, borderBottom: idx !== dashboard.recentClaims.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                      {claim.customer}
                    </td>
                    <td style={{ padding: '16px 0', borderBottom: idx !== dashboard.recentClaims.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                      <span style={{ 
                        background: badge.bg, color: badge.color, 
                        padding: '4px 10px', borderRadius: 999, 
                        fontSize: 11, fontWeight: 600 
                      }}>
                        {badge.label ?? claim.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 0', fontSize: 13, color: '#4b5563', fontWeight: 500, borderBottom: idx !== dashboard.recentClaims.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                      {formatDate(claim.date)}
                    </td>
                    <td style={{ padding: '16px 0', fontSize: 13, fontWeight: 600, color: '#111827', borderBottom: idx !== dashboard.recentClaims.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                      {formatAmount(claim.amount)}
                    </td>
                  </tr>
                );
              })}
              {loading && (
                <tr><td colSpan={5} style={{ padding: '36px 0', color: '#6b7280', textAlign: 'center' }}>Loading recent claims...</td></tr>
              )}
              {!loading && dashboard.recentClaims.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '36px 0', color: '#6b7280', textAlign: 'center' }}>No recent claims found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Stats Widget — Dealer only */}
      {!isAdminPortal && <DailyStatsWidget />}

      <style>{`
        /* Make sure the layout shifts to 1 column on small screens */
        @media (max-width: 1024px) {
          .animate-fade-in > div:nth-child(3) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
