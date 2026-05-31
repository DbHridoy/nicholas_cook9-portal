import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowUpRight, Ban, CheckCircle2, ExternalLink, Plus, Search, Store, Users } from 'lucide-react';
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
    <div className="portal-card min-h-26 p-[18px]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.07em] text-text-muted">{label}</p>
          <div className="mt-2 text-[26px] font-extrabold leading-none text-text-primary">{value}</div>
          <p className="m-0 mt-1.25 text-xs text-text-secondary">{subtext}</p>
        </div>
        <div className={`${tones[tone]} flex h-10 w-10 items-center justify-center`}>
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
  const [updatingUserId, setUpdatingUserId] = useState(null);

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

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'active' ? 'blocked' : 'active';
    setError('');
    setUpdatingUserId(user._id);

    try {
      const updated = await api.updateUserStatus(user._id, nextStatus);
      setUsers(prev => prev.map(item => item._id === user._id ? updated : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update user status.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="flex flex-col gap-5.5 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3.5">
        <div>
          <h1 className="m-0 text-2xl font-extrabold text-text-primary">
            {pageTitle}
          </h1>
          <p className="m-0 mt-1.25 text-[13px] text-text-muted">
            {isSuperAdmin
              ? 'Manage admin and dealer access, account status, and onboarding.'
              : 'Manage dealer access, account status, and onboarding.'}
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/dealers/create')}
          className="portal-btn-primary flex items-center gap-2 px-4 py-2.5 text-[13px]"
        >
          <Plus size={15} />
          {createLabel}
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3.5">
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
        <div className="rounded-lg border border-red-600/20 bg-red-600/10 px-3.5 py-2.5 text-[13px] text-red-600">
          {error}
        </div>
      )}

      <div className="portal-card overflow-hidden">
        <div className="flex flex-wrap items-center gap-2.5 border-b border-portal-border-sub px-[18px] py-[15px]">
          <div className="relative max-w-xl flex-[1_1_260px]">
            <Search size={14} className="pointer-events-none absolute left-2.75 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${isSuperAdmin ? 'users' : 'dealers'} by name or email...`}
              className="portal-input w-full py-2.25 pl-8.5 pr-3 text-[13px]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="portal-input min-w-35 px-3 py-2.25 text-[13px]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
          <span className="ml-auto text-xs font-semibold text-text-muted">
            {filtered.length} shown
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th>{isSuperAdmin ? 'User' : 'Dealer'}</th>
                {isSuperAdmin && <th>Role</th>}
                <th>Status</th>
                <th>Created</th>
                <th>Access</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={isSuperAdmin ? 6 : 5} className="px-5 py-11 text-center text-text-muted">Loading {isSuperAdmin ? 'users' : 'dealers'}...</td></tr>
              )}
              {!loading && filtered.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="flex min-w-65 items-center gap-3">
                      <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,#152231,#334155)] text-xs font-extrabold text-white">
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-bold text-text-primary">{user.name}</div>
                        <div className="truncate text-xs text-text-muted">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  {isSuperAdmin && (
                    <td className="capitalize">{user.role?.replace('_', ' ')}</td>
                  )}
                  <td>
                    <span className={user.status === 'active' ? 'badge-resolved' : 'badge-unresolved'}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</td>
                  <td>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${user.status === 'active' ? 'text-emerald-600' : 'text-red-600'}`}>
                      <ArrowUpRight size={13} />
                      {user.status === 'active' ? 'Portal enabled' : 'Portal disabled'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/dashboard/dealers/${user._id}`)}
                        className="flex cursor-pointer items-center gap-1.25 rounded-[7px] border border-accent-blue/20 bg-accent-blue/10 px-2.5 py-1.5 text-xs font-semibold text-accent-blue"
                      >
                        <ExternalLink size={13} /> View
                      </button>
                      {isSuperAdmin && (
                        <button
                          onClick={() => handleToggleStatus(user)}
                          disabled={updatingUserId === user._id}
                          className={`rounded-[7px] border px-2.5 py-1.5 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-60 ${
                            user.status === 'active'
                              ? 'border-red-600/20 bg-red-600/10 text-red-600'
                              : 'border-emerald-600/20 bg-emerald-600/10 text-emerald-600'
                          }`}
                        >
                          {updatingUserId === user._id ? 'Saving...' : user.status === 'active' ? 'Block' : 'Activate'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={isSuperAdmin ? 6 : 5} className="px-5 py-11 text-center text-text-muted">No {entityLabel}s found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
