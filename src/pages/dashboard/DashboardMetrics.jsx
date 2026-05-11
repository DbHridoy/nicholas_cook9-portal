import React from 'react';
import { FileText, CheckCircle2, DollarSign, Calendar } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DailyStatsWidget from '../../components/DailyStatsWidget';

const statCards = [
  {
    title: 'Total Active Contracts',
    value: '842',
    icon: FileText,
    iconColor: '#64748b',
    iconBg: '#f1f5f9',
    trend: '+12% vs Apr 1 - Apr 30',
  },
  {
    title: 'Claims Submitted',
    value: '23',
    icon: FileText,
    iconColor: '#2563eb',
    iconBg: '#eff6ff',
    trend: '+15% vs Apr 1 - Apr 30',
  },
  {
    title: 'Claims Approved',
    value: '17',
    icon: CheckCircle2,
    iconColor: '#059669',
    iconBg: '#dcfce7',
    trend: '+13% vs Apr 1 - Apr 30',
  },
  {
    title: 'Payouts This Month',
    value: '$18,642',
    icon: DollarSign,
    iconColor: '#9333ea',
    iconBg: '#f3e8ff',
    trend: '+18% vs Apr 1 - Apr 30',
  },
];

const recentClaims = [
  { id: 'CLM-2024-1023', customer: 'Sarah Johnson', status: 'In Review', date: 'May 31, 2024', amount: '$1,250' },
  { id: 'CLM-2024-1022', customer: 'Mike Anderson', status: 'Pending', date: 'May 30, 2024', amount: '—' },
  { id: 'CLM-2024-1021', customer: 'Emily Davis', status: 'Approved', date: 'May 30, 2024', amount: '$875' },
  { id: 'CLM-2024-1020', customer: 'Robert Martinez', status: 'In Review', date: 'May 29, 2024', amount: '$2,150' },
  { id: 'CLM-2024-1019', customer: 'Jennifer Lee', status: 'Denied', date: 'May 28, 2024', amount: '—' },
];

const getStatusBadge = (status) => {
  switch (status) {
    case 'In Review': return { bg: '#eff6ff', color: '#2563eb' };
    case 'Pending':   return { bg: '#fef3c7', color: '#d97706' };
    case 'Approved':  return { bg: '#dcfce7', color: '#059669' };
    case 'Denied':    return { bg: '#fee2e2', color: '#dc2626' };
    default:          return { bg: '#f1f5f9', color: '#64748b' };
  }
};

export default function DashboardMetrics() {
  const { role: userRole } = useSelector((state) => state.auth);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Dashboard Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>
            Dashboard
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0' }}>
            Here's what's happening with your protection program.
          </p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8,
          padding: '8px 14px', fontSize: 13, fontWeight: 500, color: '#4b5563',
          cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
        }}>
          May 1 – May 31, 2024
          <Calendar size={14} style={{ color: '#9ca3af' }} />
        </button>
      </div>

      {/* Stat Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {statCards.map((card, idx) => (
          <div key={idx} className="portal-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#4b5563', margin: '0 0 8px 0' }}>{card.title}</p>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', lineHeight: 1 }}>{card.value}</div>
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
              background: 'conic-gradient(#f59e0b 0% 34%, #3b82f6 34% 64%, #10b981 64% 86%, #ef4444 86% 100%)',
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
                <span style={{ fontSize: 32, fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>23</span>
                <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Total</span>
              </div>
            </div>

            {/* Legend */}
            <div style={{ width: '100%', marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Pending', color: '#f59e0b', count: 8, pct: '34%' },
                { label: 'In Review', color: '#3b82f6', count: 7, pct: '30%' },
                { label: 'Approved', color: '#10b981', count: 5, pct: '22%' },
                { label: 'Denied', color: '#ef4444', count: 3, pct: '14%' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                    <span style={{ fontWeight: 600, color: '#111827' }}>{item.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, color: '#4b5563' }}>
                    <span style={{ fontWeight: 600, width: 20, textAlign: 'right' }}>{item.count}</span>
                    <span style={{ color: '#6b7280', width: 36 }}>({item.pct})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Link to="/dashboard/reports" style={{ color: '#2563eb', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              View all claims →
            </Link>
          </div>
        </div>

        {/* Recent Claims Table */}
        <div className="portal-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Recent Claims</h2>
            <Link to="/dashboard/reports" style={{ color: '#2563eb', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
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
              {recentClaims.map((claim, idx) => {
                const badge = getStatusBadge(claim.status);
                return (
                  <tr key={idx}>
                    <td style={{ padding: '16px 0', fontSize: 13, fontWeight: 600, color: '#111827', borderBottom: idx !== recentClaims.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                      {claim.id}
                    </td>
                    <td style={{ padding: '16px 0', fontSize: 13, color: '#4b5563', fontWeight: 500, borderBottom: idx !== recentClaims.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                      {claim.customer}
                    </td>
                    <td style={{ padding: '16px 0', borderBottom: idx !== recentClaims.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                      <span style={{ 
                        background: badge.bg, color: badge.color, 
                        padding: '4px 10px', borderRadius: 999, 
                        fontSize: 11, fontWeight: 600 
                      }}>
                        {claim.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 0', fontSize: 13, color: '#4b5563', fontWeight: 500, borderBottom: idx !== recentClaims.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                      {claim.date}
                    </td>
                    <td style={{ padding: '16px 0', fontSize: 13, fontWeight: 600, color: '#111827', borderBottom: idx !== recentClaims.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                      {claim.amount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Stats Widget — Dealer only */}
      {userRole !== 'admin' && <DailyStatsWidget />}

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
