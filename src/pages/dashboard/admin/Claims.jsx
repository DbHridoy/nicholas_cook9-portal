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
      || claim._id?.toLowerCase().includes(q)
      || claim.name?.toLowerCase().includes(q)
      || claim.email?.toLowerCase().includes(q)
      || claim.orderId?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || claim.status === statusFilter;
    return matchSearch && matchStatus;
  }), [claims, search, statusFilter]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            Claims Management
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, margin: '4px 0 0' }}>
            Review and manage all customer claims submitted through the website.
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(37,99,235,0.08)',
          border: '1px solid rgba(37,99,235,0.18)',
          borderRadius: 8,
          padding: '6px 14px',
        }}>
          <MessageSquare size={14} style={{ color: '#2563eb' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#2563eb' }}>
            {claims.filter(c => c.status === 'pending').length} Open
          </span>
        </div>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', border: '1px solid rgba(220,38,38,0.18)', background: 'rgba(220,38,38,0.07)', color: '#dc2626', borderRadius: 8, fontSize: 13 }}>
          {error}
        </div>
      )}

      <div className="portal-card" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '14px 18px',
          borderBottom: '1px solid #e9ecef',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          alignItems: 'center',
        }}>
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <Search size={14} style={{
              position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="Search by customer, email, order ID or claim ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="portal-input"
              style={{ width: '100%', padding: '8px 12px 8px 32px', fontSize: 13 }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="portal-input"
            style={{ padding: '8px 12px', fontSize: 13, cursor: 'pointer' }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="denied">Denied</option>
          </select>
          <button className="portal-btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', fontSize: 13 }}>
            <Filter size={13} /> Filter
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="portal-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Claim ID</th>
                <th style={{ textAlign: 'left' }}>Customer</th>
                <th style={{ textAlign: 'left' }}>Order ID</th>
                <th style={{ textAlign: 'left' }}>Flooring</th>
                <th style={{ textAlign: 'left' }}>Status</th>
                <th style={{ textAlign: 'left' }}>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>Loading claims...</td></tr>
              )}
              {!loading && filtered.map((item) => (
                <tr key={item._id}>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: 13 }}>
                      {item._id}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{item.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.email}</span>
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
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                      <button
                        onClick={() => navigate(`/dashboard/complaints/${item._id}`)}
                        style={{
                          background: 'rgba(37,99,235,0.07)',
                          border: '1px solid rgba(37,99,235,0.18)',
                          borderRadius: 7,
                          padding: '6px 10px',
                          color: '#2563eb',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 5,
                          fontSize: 12, fontWeight: 500,
                        }}
                      >
                        <Eye size={13} /> View
                      </button>
                      <button style={{
                        background: 'transparent', border: 'none',
                        color: 'var(--text-muted)', cursor: 'pointer', padding: '6px',
                        borderRadius: 6,
                      }}>
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
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
