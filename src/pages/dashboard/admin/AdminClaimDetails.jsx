import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Building2, FileCheck, CheckCircle2, Clock, MessageSquare } from 'lucide-react';

const claimData = {
  'CLM-8091': {
    customer: 'Acme Corp', dealer: 'Main Street Motors', product: 'EcoPower Generator X1',
    date: '2026-05-01', status: 'Resolved',
    description: 'The generator failed to start after 2 hours of continuous use. Customer reports a burning smell.',
    resolution: 'Dealer replaced the control module. Unit tested and confirmed working.',
    history: [
      { date: '2026-05-01', event: 'Claim submitted by Acme Corp via Main Street Motors' },
      { date: '2026-05-02', event: 'Dealer inspection completed' },
      { date: '2026-05-03', event: 'Parts ordered' },
      { date: '2026-05-04', event: 'Repair completed and claim resolved' },
    ],
  },
  'CLM-8092': {
    customer: 'Globex Inc', dealer: 'Downtown Auto', product: 'SmartHub Controller Pro',
    date: '2026-05-03', status: 'Unresolved',
    description: 'Firmware update caused the device to enter a boot loop. Multiple devices affected.',
    resolution: 'Pending investigation by engineering team.',
    history: [
      { date: '2026-05-03', event: 'Claim submitted by Globex Inc via Downtown Auto' },
      { date: '2026-05-04', event: 'Escalated to engineering' },
    ],
  },
};

export default function AdminClaimDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const claim = claimData[id] || claimData['CLM-8092'];
  const isResolved = claim.status === 'Resolved';

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'monospace' }}>{id}</h1>
            <span className={isResolved ? 'badge-resolved' : 'badge-unresolved'}>{claim.status}</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>Submitted on {claim.date}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 16, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="portal-card" style={{ padding: 22 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 14px' }}>Claim Description</h2>
            <div style={{ padding: '14px 16px', background: '#f9fafb', border: '1px solid #e9ecef', borderRadius: 10, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {claim.description}
            </div>
          </div>

          <div className="portal-card" style={{ padding: 22 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 14px' }}>Resolution Details</h2>
            <div style={{ padding: '14px 16px', background: isResolved ? 'rgba(16,185,129,0.07)' : 'rgba(37,99,235,0.06)', border: `1px solid ${isResolved ? 'rgba(16,185,129,0.22)' : 'rgba(37,99,235,0.18)'}`, borderRadius: 10, fontSize: 13, color: isResolved ? '#059669' : '#2563eb', lineHeight: 1.7 }}>
              {claim.resolution}
            </div>
          </div>

          <div className="portal-card" style={{ padding: 22 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px' }}>Activity Timeline</h2>
            {claim.history.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, position: 'relative' }}>
                {i < claim.history.length - 1 && (
                  <div style={{ position: 'absolute', left: 9, top: 22, bottom: 0, width: 1, background: '#e2e8f0' }} />
                )}
                <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: i === 0 ? '#3b82f6' : (i === claim.history.length - 1 && isResolved) ? '#e8a020' : '#e2e8f0', border: '3px solid #ffffff', marginTop: 2, position: 'relative', zIndex: 1 }} />
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
            { label: 'Customer', value: claim.customer, icon: User, cls: 'stat-icon-blue' },
            { label: 'Dealer', value: claim.dealer, icon: Building2, cls: 'stat-icon-purple' },
            { label: 'Contract / Product', value: claim.product, icon: FileCheck, cls: 'stat-icon-green' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: i < 2 ? 16 : 0 }}>
              <div className={row.cls} style={{ padding: 8, flexShrink: 0 }}><row.icon size={14} /></div>
              <div>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0 }}>{row.label}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '2px 0 0' }}>{row.value}</p>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid #e9ecef' }}>
            <button className="portal-btn-primary" style={{ width: '100%', padding: '10px', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
              <MessageSquare size={14} /> Contact Dealer
            </button>
            {isResolved && (
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center' }}>
                <CheckCircle2 size={13} style={{ color: '#059669' }} />
                <span style={{ fontSize: 12, color: '#059669', fontWeight: 500 }}>Claim resolved</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
