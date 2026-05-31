import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Building2, FileCheck, CheckCircle2, Clock, MessageSquare } from 'lucide-react';
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

const formatDate = (value) => value ? new Date(value).toLocaleString() : '-';

export default function AdminClaimDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let active = true;

    api.getClaim(id)
      .then((data) => {
        if (active) setClaim(data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load claim.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const updateStatus = async (status) => {
    setUpdating(true);
    setError('');

    try {
      const updated = await api.updateClaimStatus(id, status);
      setClaim(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update claim status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="portal-card" style={{ padding: 24 }}>Loading claim...</div>;
  }

  if (!claim) {
    return <div className="portal-card" style={{ padding: 24, color: '#dc2626' }}>{error || 'Claim not found.'}</div>;
  }

  const isResolved = claim.status === 'approved';

  return (
    <div className="animate-fade-in" style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => navigate('/dashboard/complaints')}
          style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 9, padding: '7px 10px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft size={16} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'monospace' }}>{claim._id}</h1>
            <span className={statusClass[claim.status] ?? 'badge-pending'}>{statusLabel[claim.status] ?? claim.status}</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>Submitted on {formatDate(claim.createdAt)}</p>
        </div>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', border: '1px solid rgba(220,38,38,0.18)', background: 'rgba(220,38,38,0.07)', color: '#dc2626', borderRadius: 8, fontSize: 13 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 16, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="portal-card" style={{ padding: 22 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 14px' }}>Claim Description</h2>
            <div style={{ padding: '14px 16px', background: '#f9fafb', border: '1px solid #e9ecef', borderRadius: 10, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {claim.description}
            </div>
          </div>

          <div className="portal-card" style={{ padding: 22 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 14px' }}>Review Action</h2>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                disabled={updating || claim.status === 'approved'}
                onClick={() => updateStatus('approved')}
                className="portal-btn-primary"
                style={{ padding: '10px 14px', fontSize: 13, opacity: claim.status === 'approved' ? 0.65 : 1 }}
              >
                Approve Claim
              </button>
              <button
                disabled={updating || claim.status === 'denied'}
                onClick={() => updateStatus('denied')}
                className="portal-btn-ghost"
                style={{ padding: '10px 14px', fontSize: 13, color: '#dc2626', opacity: claim.status === 'denied' ? 0.65 : 1 }}
              >
                Deny Claim
              </button>
            </div>
          </div>

          <div className="portal-card" style={{ padding: 22 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px' }}>Activity Timeline</h2>
            {[
              { date: formatDate(claim.createdAt), event: `Claim submitted by ${claim.name}` },
              { date: formatDate(claim.updatedAt), event: `Current status: ${statusLabel[claim.status] ?? claim.status}` },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, position: 'relative' }}>
                {i < 1 && (
                  <div style={{ position: 'absolute', left: 9, top: 22, bottom: 0, width: 1, background: '#e2e8f0' }} />
                )}
                <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: i === 0 ? '#3b82f6' : isResolved ? '#e8a020' : '#e2e8f0', border: '3px solid #ffffff', marginTop: 2, position: 'relative', zIndex: 1 }} />
                <div style={{ paddingBottom: 20 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>{item.event}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}><Clock size={10} style={{ display: 'inline', marginRight: 3 }} />{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="portal-card" style={{ padding: 20 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 16px' }}>Entity Details</p>
          {[
            { label: 'Customer', value: claim.name, icon: User, cls: 'stat-icon-blue' },
            { label: 'Email', value: claim.email, icon: Building2, cls: 'stat-icon-purple' },
            { label: 'Order / Flooring', value: `${claim.orderId} / ${claim.flooringType}`, icon: FileCheck, cls: 'stat-icon-green' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: i < 2 ? 16 : 0 }}>
              <div className={row.cls} style={{ padding: 8, flexShrink: 0 }}><row.icon size={14} /></div>
              <div>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0 }}>{row.label}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '2px 0 0', overflowWrap: 'anywhere' }}>{row.value}</p>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid #e9ecef' }}>
            <a href={`mailto:${claim.email}`} className="portal-btn-primary" style={{ width: '100%', padding: '10px', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, textDecoration: 'none' }}>
              <MessageSquare size={14} /> Contact Customer
            </a>
            {isResolved && (
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center' }}>
                <CheckCircle2 size={13} style={{ color: '#059669' }} />
                <span style={{ fontSize: 12, color: '#059669', fontWeight: 500 }}>Claim approved</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
