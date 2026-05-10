import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, MoreVertical, MessageSquare } from 'lucide-react';

const claims = [
  { id: 'CLM-8091', customer: 'Acme Corp', dealer: 'Main Street Motors', status: 'Resolved', date: '2026-05-01' },
  { id: 'CLM-8092', customer: 'Globex Inc', dealer: 'Downtown Auto', status: 'Unresolved', date: '2026-05-03' },
  { id: 'CLM-8093', customer: 'Initech', dealer: 'Elite Vehicles', status: 'Resolved', date: '2026-05-04' },
  { id: 'CLM-8094', customer: 'Umbrella Corp', dealer: 'Valley Ford', status: 'Unresolved', date: '2026-05-06' },
  { id: 'CLM-8095', customer: 'Stark Industries', dealer: 'Main Street Motors', status: 'Resolved', date: '2026-05-07' },
];

export default function Claims() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [dealerFilter, setDealerFilter] = useState('all');

  const filtered = claims.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.id.toLowerCase().includes(q) || c.customer.toLowerCase().includes(q) || c.dealer.toLowerCase().includes(q);
    const matchDealer = dealerFilter === 'all' || c.dealer === dealerFilter;
    return matchSearch && matchDealer;
  });

  const dealers = [...new Set(claims.map(c => c.dealer))];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            Claims Management
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, margin: '4px 0 0' }}>
            Review and manage all customer claims submitted across all dealers.
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(124,58,237,0.1)',
          border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: 8,
          padding: '6px 14px',
        }}>
          <MessageSquare size={14} style={{ color: '#9d5cf6' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#9d5cf6' }}>
            {claims.filter(c => c.status === 'Unresolved').length} Open
          </span>
        </div>
      </div>

      {/* Table Card */}
      <div className="portal-card" style={{ overflow: 'hidden' }}>
        {/* Filters */}
        <div style={{
          padding: '14px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
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
              placeholder="Search by customer, dealer or claim ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="portal-input"
              style={{ width: '100%', padding: '8px 12px 8px 32px', fontSize: 13 }}
            />
          </div>
          <select
            value={dealerFilter}
            onChange={e => setDealerFilter(e.target.value)}
            className="portal-input"
            style={{ padding: '8px 12px', fontSize: 13, cursor: 'pointer' }}
          >
            <option value="all">All Dealers</option>
            {dealers.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <button className="portal-btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', fontSize: 13 }}>
            <Filter size={13} /> Filter
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="portal-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Claim ID</th>
                <th style={{ textAlign: 'left' }}>Customer</th>
                <th style={{ textAlign: 'left' }}>Dealer</th>
                <th style={{ textAlign: 'left' }}>Status</th>
                <th style={{ textAlign: 'left' }}>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: 13 }}>
                      {item.id}
                    </span>
                  </td>
                  <td>{item.customer}</td>
                  <td>{item.dealer}</td>
                  <td>
                    <span className={item.status === 'Resolved' ? 'badge-resolved' : 'badge-unresolved'}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.date}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                      <button
                        onClick={() => navigate(`/dashboard/complaints/${item.id}`)}
                        style={{
                          background: 'rgba(124,58,237,0.1)',
                          border: '1px solid rgba(124,58,237,0.2)',
                          borderRadius: 7,
                          padding: '6px 10px',
                          color: '#9d5cf6',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 5,
                          fontSize: 12, fontWeight: 500,
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,58,237,0.1)'}
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
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
