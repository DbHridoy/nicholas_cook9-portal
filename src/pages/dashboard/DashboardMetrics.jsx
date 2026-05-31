import { useEffect, useMemo, useState } from 'react';
import { FileText, CheckCircle2, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
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
    case 'pending': return { className: 'bg-amber-100 text-amber-600', label: 'Pending' };
    case 'approved': return { className: 'bg-emerald-100 text-emerald-600', label: 'Approved' };
    case 'denied': return { className: 'bg-red-100 text-red-600', label: 'Denied' };
    default:          return { className: 'bg-slate-100 text-slate-500' };
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
        iconClassName: 'bg-slate-100 text-slate-500',
        trend: dashboard.stats.totalContracts.trend,
      },
      {
        title: 'Claims Submitted',
        value: dashboard.stats.claimsSubmitted.value,
        icon: FileText,
        iconClassName: 'bg-blue-50 text-accent-blue',
        trend: dashboard.stats.claimsSubmitted.trend,
      },
      {
        title: 'Claims Approved',
        value: dashboard.stats.claimsApproved.value,
        icon: CheckCircle2,
        iconClassName: 'bg-emerald-100 text-emerald-600',
        trend: dashboard.stats.claimsApproved.trend,
      },
    ];

    if (isSuperAdmin) {
      cards.unshift({
        title: 'Total Users',
        value: dashboard.stats.users.total,
        icon: Users,
        iconClassName: 'bg-purple-100 text-purple-600',
        trend: `${dashboard.stats.users.admins} admins / ${dashboard.stats.users.dealers} dealers`,
      });
    }

    return cards;
  }, [dashboard, isSuperAdmin]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Dashboard Header */}
      <div className="flex flex-wrap items-center justify-between gap-3.5">
        <div>
          <h1 className="m-0 text-[26px] font-extrabold text-text-primary">
            Dashboard
          </h1>
          <p className="m-0 mt-1 text-sm text-gray-500">
            {isSuperAdmin
              ? 'Here is the full portal view across admins, dealers, contracts, and claims.'
              : "Here's what's happening with your protection program."}
          </p>
        </div>
        
      </div>

      {error && (
        <div className="rounded-lg border border-red-600/20 bg-red-600/10 px-3.5 py-2.5 text-[13px] text-red-600">
          {error}
        </div>
      )}

      {/* Stat Cards Row */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        {statCards.map((card, idx) => (
          <div key={idx} className="portal-card flex flex-col gap-4 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="m-0 mb-2 text-xs font-semibold text-text-secondary">{card.title}</p>
                <div className="text-[28px] font-bold leading-none text-text-primary">{loading ? '...' : card.value}</div>
              </div>
              <div className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full ${card.iconClassName}`}>
                <card.icon size={20} />
              </div>
            </div>
            <p className="m-0 text-xs font-semibold text-emerald-600">
              {card.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Split */}
      <div className="grid items-start gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Claims Overview Donut Chart */}
        <div className="portal-card flex h-full flex-col p-6">
          <h2 className="mb-8 text-base font-bold text-text-primary">Claims Overview</h2>
          
          <div className="flex flex-1 flex-col items-center">
            {/* CSS Donut Chart */}
            <div style={{
              width: 180, height: 180, borderRadius: '50%',
              background: dashboard.claimsOverview.total
                ? `conic-gradient(${dashboard.claimsOverview.byStatus.map((item, index, items) => {
                  const start = items.slice(0, index).reduce((sum, current) => sum + current.pct, 0);
                  return `${item.color} ${start}% ${start + item.pct}%`;
                }).join(', ')})`
                : '#f1f5f9',
              boxShadow: 'inset 0 0 0 2px #fff',
              position: 'relative'
            }} className="flex h-[180px] w-[180px] items-center justify-center rounded-full">
              {/* White inner circle to make it a donut */}
              <div className="flex h-[130px] w-[130px] flex-col items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
                <span className="text-[32px] font-extrabold leading-tight text-text-primary">{loading ? '...' : dashboard.claimsOverview.total}</span>
                <span className="text-[13px] font-medium text-gray-500">Total</span>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 flex w-full flex-col gap-3">
              {dashboard.claimsOverview.byStatus.map(item => (
                <div key={item.label} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                    <span className="font-semibold text-text-primary">{item.label}</span>
                  </div>
                  <div className="flex gap-2 text-text-secondary">
                    <span className="w-5 text-right font-semibold">{item.count}</span>
                    <span className="w-9 text-gray-500">({item.pct}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 text-right">
            <Link to={claimsPath} className="text-[13px] font-semibold text-accent-blue no-underline">
              View all claims →
            </Link>
          </div>
        </div>

        {/* Recent Claims Table */}
        <div className="portal-card overflow-x-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="m-0 text-base font-bold text-text-primary">Recent Claims</h2>
            <Link to={claimsPath} className="text-[13px] font-semibold text-accent-blue no-underline">
              View all →
            </Link>
          </div>

          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="border-b border-gray-100 pb-4 text-xs font-semibold text-gray-500">Claim #</th>
                <th className="border-b border-gray-100 pb-4 text-xs font-semibold text-gray-500">Customer</th>
                <th className="border-b border-gray-100 pb-4 text-xs font-semibold text-gray-500">Status</th>
                <th className="border-b border-gray-100 pb-4 text-xs font-semibold text-gray-500">Date Submitted</th>
                <th className="border-b border-gray-100 pb-4 text-xs font-semibold text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody>
              {!loading && dashboard.recentClaims.map((claim, idx) => {
                const badge = getStatusBadge(claim.status);
                const borderClass = idx !== dashboard.recentClaims.length - 1 ? 'border-b border-gray-100' : '';
                return (
                  <tr key={idx}>
                    <td className={`py-4 text-[13px] font-semibold text-text-primary ${borderClass}`}>
                      {claim.id}
                    </td>
                    <td className={`py-4 text-[13px] font-medium text-text-secondary ${borderClass}`}>
                      {claim.customer}
                    </td>
                    <td className={`py-4 ${borderClass}`}>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${badge.className}`}>
                        {badge.label ?? claim.status}
                      </span>
                    </td>
                    <td className={`py-4 text-[13px] font-medium text-text-secondary ${borderClass}`}>
                      {formatDate(claim.date)}
                    </td>
                    <td className={`py-4 text-[13px] font-semibold text-text-primary ${borderClass}`}>
                      {formatAmount(claim.amount)}
                    </td>
                  </tr>
                );
              })}
              {loading && (
                <tr><td colSpan={5} className="py-9 text-center text-gray-500">Loading recent claims...</td></tr>
              )}
              {!loading && dashboard.recentClaims.length === 0 && (
                <tr><td colSpan={5} className="py-9 text-center text-gray-500">No recent claims found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Stats Widget — Dealer only */}
      {/* {!isAdminPortal && <DailyStatsWidget />} */}
    </div>
  );
}
