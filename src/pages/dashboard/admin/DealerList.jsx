import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowUpRight, Ban, CheckCircle2, ExternalLink, MoreVertical, Plus, Search, Store, Users } from 'lucide-react';
import { api } from '../../../lib/api';

const getInitials = (name = '') => name
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase())
  .join('') || 'D';

const StatCard = ({ label, value, subtext, icon: Icon, tone }) => {
  const tones = {
    gold: 'stat-icon-gold',
    blue: 'stat-icon-blue',
    green: 'stat-icon-green',
    red: 'stat-icon-red',
  };

  return (
    <div className="portal-card" style={{ padding: 18, minHeight: 104 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</p>
          <div style={{ marginTop: 8, fontSize: 26, lineHeight: 1, fontWeight: 800, color: 'var(--text-primary)' }}>{value}</div>
          <p style={{ margin: '5px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>{subtext}</p>
        </div>
        <div className={tones[tone]} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
};

export default function DealerList() {
  const navigate = useNavigate();
  const currentRole = useSelector((state) => state.auth.role);
  const isSuperAdmin = currentRole === 'super_admin';
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api.listUsers()
      .then((data) => {
        if (active) setUsers(data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : `Unable to load ${isSuperAdmin ? 'users' : 'dealers'}.`);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isSuperAdmin]);

  const manageableUsers = useMemo(
    () => (isSuperAdmin ? users : users.filter((user) => user.role === 'dealer')),
    [isSuperAdmin, users],
  );
  const activeCount = manageableUsers.filter((user) => user.status === 'active').length;
  const blockedCount = manageableUsers.filter((user) => user.status === 'blocked').length;
  const adminCount = manageableUsers.filter((user) => user.role === 'admin').length;
  const dealerCount = manageableUsers.filter((user) => user.role === 'dealer').length;
  const filtered = useMemo(() => manageableUsers.filter((user) => {
    const q = search.toLowerCase();
    const matchSearch = !q || user.name?.toLowerCase().includes(q) || user.email?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchSearch && matchStatus;
  }), [manageableUsers, search, statusFilter]);
  const pageTitle = isSuperAdmin ? 'Users' : 'Dealers';
  const createLabel = isSuperAdmin ? 'Create User' : 'Create Dealer';
  const entityLabel = isSuperAdmin ? 'user' : 'dealer';

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            {pageTitle}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '5px 0 0' }}>
            {isSuperAdmin
              ? 'Manage admin and dealer access, account status, and onboarding.'
              : 'Manage dealer access, account status, and onboarding.'}
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/dealers/create')}
          className="portal-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', fontSize: 13 }}
        >
          <Plus size={15} />
          {createLabel}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14 }}>
        <StatCard label={isSuperAdmin ? 'Total Users' : 'Total Dealers'} value={manageableUsers.length} subtext="Registered portal accounts" icon={Store} tone="blue" />
        <StatCard label="Active" value={activeCount} subtext="Able to access portal" icon={CheckCircle2} tone="green" />
        <StatCard label="Blocked" value={blockedCount} subtext="Access currently disabled" icon={Ban} tone="red" />
        <StatCard
          label={isSuperAdmin ? 'Admins / Dealers' : 'Onboarding'}
          value={loading ? '...' : isSuperAdmin ? `${adminCount} / ${dealerCount}` : Math.max(manageableUsers.length - activeCount - blockedCount, 0)}
          subtext={isSuperAdmin ? 'Role split' : 'Pending operational setup'}
          icon={Users}
          tone="gold"
        />
      </div>

      {error && (
        <div style={{ padding: '10px 14px', border: '1px solid rgba(220,38,38,0.18)', background: 'rgba(220,38,38,0.07)', color: '#dc2626', borderRadius: 8, fontSize: 13 }}>
          {error}
        </div>
      )}

      <div className="portal-card" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '15px 18px',
          borderBottom: '1px solid #e9ecef',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          alignItems: 'center',
        }}>
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 520 }}>
            <Search size={14} style={{
              position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${isSuperAdmin ? 'users' : 'dealers'} by name or email...`}
              className="portal-input"
              style={{ width: '100%', padding: '9px 12px 9px 34px', fontSize: 13 }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="portal-input"
            style={{ padding: '9px 12px', fontSize: 13, minWidth: 140 }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
            {filtered.length} shown
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="portal-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>{isSuperAdmin ? 'User' : 'Dealer'}</th>
                {isSuperAdmin && <th style={{ textAlign: 'left' }}>Role</th>}
                <th style={{ textAlign: 'left' }}>Status</th>
                <th style={{ textAlign: 'left' }}>Created</th>
                <th style={{ textAlign: 'left' }}>Access</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={isSuperAdmin ? 6 : 5} style={{ padding: '44px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading {isSuperAdmin ? 'users' : 'dealers'}...</td></tr>
              )}
              {!loading && filtered.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 260 }}>
                      <div style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #152231, #334155)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}>
                        {getInitials(user.name)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 13 }}>{user.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  {isSuperAdmin && (
                    <td style={{ textTransform: 'capitalize' }}>{user.role?.replace('_', ' ')}</td>
                  )}
                  <td>
                    <span className={user.status === 'active' ? 'badge-resolved' : 'badge-unresolved'}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: user.status === 'active' ? '#059669' : '#dc2626', fontSize: 12, fontWeight: 700 }}>
                      <ArrowUpRight size={13} />
                      {user.status === 'active' ? 'Portal enabled' : 'Portal disabled'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                      <button
                        onClick={() => navigate(`/dashboard/dealers/${user._id}`)}
                        style={{
                          background: 'rgba(37,99,235,0.07)',
                          border: '1px solid rgba(37,99,235,0.18)',
                          borderRadius: 7,
                          padding: '6px 10px',
                          color: '#2563eb',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        <ExternalLink size={13} /> View
                      </button>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: 6 }}>
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={isSuperAdmin ? 6 : 5} style={{ padding: '44px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>No {entityLabel}s found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
