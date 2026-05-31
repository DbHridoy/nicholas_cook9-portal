import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, MoreVertical, MessageSquare } from 'lucide-react';
import { api } from '../../../lib/api';

const statusLabel = {
  pending: 'Pending',
  approved: 'Approved',
  denied: 'Denied',
};

const statusClass = {
  pending: 'badge-pending',
  approved: 'badge-resolved',
  denied: 'badge-unresolved',
};

const formatDate = (value) => value ? new Date(value).toLocaleDateString() : '-';

export default function Claims() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api.listClaims()
      .then((data) => {
        if (active) setClaims(data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load claims.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => claims.filter((claim) => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || claim.claimId?.toLowerCase().includes(q)
      || claim._id?.toLowerCase().includes(q)
      || claim.name?.toLowerCase().includes(q)
      || claim.email?.toLowerCase().includes(q)
      || claim.orderId?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || claim.status === statusFilter;
    return matchSearch && matchStatus;
  }), [claims, search, statusFilter]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="m-0 text-[22px] font-extrabold text-text-primary">
            Claims Management
          </h1>
          <p className="m-0 mt-1 text-[13px] text-text-muted">
            Review and manage all customer claims submitted through the website.
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-accent-blue/20 bg-accent-blue/10 px-3.5 py-1.5">
          <MessageSquare size={14} className="text-accent-blue" />
          <span className="text-[13px] font-semibold text-accent-blue">
            {claims.filter(c => c.status === 'pending').length} Open
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-600/20 bg-red-600/10 px-3.5 py-2.5 text-[13px] text-red-600">
          {error}
        </div>
      )}

      <div className="portal-card overflow-hidden">
        <div className="flex flex-wrap items-center gap-2.5 border-b border-portal-border-sub px-[18px] py-3.5">
          <div className="relative flex-[1_1_220px]">
            <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search by customer, email, order ID or claim ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="portal-input w-full py-2 pl-8 pr-3 text-[13px]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="portal-input cursor-pointer px-3 py-2 text-[13px]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="denied">Denied</option>
          </select>
          <button className="portal-btn-ghost flex items-center gap-1.5 px-3.5 py-2 text-[13px]">
            <Filter size={13} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Customer</th>
                <th>Order ID</th>
                <th>Flooring</th>
                <th>Status</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-text-muted">Loading claims...</td></tr>
              )}
              {!loading && filtered.map((item) => (
                <tr key={item._id}>
                  <td>
                    <span className="font-mono text-[13px] font-semibold text-text-primary">
                      {item.claimId ?? item._id}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      <span className="text-[11px] text-text-muted">{item.email}</span>
                    </div>
                  </td>
                  <td>{item.orderId}</td>
                  <td>{item.flooringType}</td>
                  <td>
                    <span className={statusClass[item.status] ?? 'badge-pending'}>
                      {statusLabel[item.status] ?? item.status}
                    </span>
                  </td>
                  <td>{formatDate(item.createdAt)}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/dashboard/complaints/${item._id}`)}
                        className="flex cursor-pointer items-center gap-1.25 rounded-[7px] border border-accent-blue/20 bg-accent-blue/10 px-2.5 py-1.5 text-xs font-medium text-accent-blue"
                      >
                        <Eye size={13} /> View
                      </button>
                      <button className="cursor-pointer rounded-md border-0 bg-transparent p-1.5 text-text-muted">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-text-muted">
                    No claims found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
