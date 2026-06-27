import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Building2, FileCheck, CheckCircle2, Clock, Image as ImageIcon, MessageSquare } from 'lucide-react';
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
const getAttachmentName = (url, index) => decodeURIComponent(url.split('/').pop() || `Photo ${index + 1}`);

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
    return <div className="portal-card p-6">Loading claim...</div>;
  }

  if (!claim) {
    return <div className="portal-card p-6 text-red-600">{error || 'Claim not found.'}</div>;
  }

  const isResolved = claim.status === 'approved';
  const attachments = Array.isArray(claim.attachments) ? claim.attachments : [];

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard/complaints')}
          className="flex cursor-pointer items-center rounded-[9px] border border-slate-200 bg-slate-100 px-2.5 py-1.75 text-text-secondary"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="m-0 font-mono text-xl font-extrabold text-text-primary">{claim.claimId ?? claim._id}</h1>
            <span className={statusClass[claim.status] ?? 'badge-pending'}>{statusLabel[claim.status] ?? claim.status}</span>
          </div>
          <p className="mt-0.75 text-xs text-text-muted">Submitted on {formatDate(claim.createdAt)}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-600/20 bg-red-600/10 px-3.5 py-2.5 text-[13px] text-red-600">
          {error}
        </div>
      )}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.6fr)_320px]">
        <div className="flex flex-col gap-4">
          <div className="portal-card p-5.5">
            <h2 className="mb-3.5 text-sm font-bold text-text-primary">Claim Description</h2>
            <div className="rounded-[10px] border border-portal-border-sub bg-gray-50 px-4 py-3.5 text-[13px] leading-relaxed text-text-secondary">
              {claim.description}
            </div>
          </div>

          {attachments.length > 0 && (
            <div className="portal-card p-5.5">
              <div className="mb-3.5 flex items-center gap-2">
                <ImageIcon size={16} className="text-text-muted" />
                <h2 className="m-0 text-sm font-bold text-text-primary">Claim Photos</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {attachments.map((url, index) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="block overflow-hidden rounded-[10px] border border-portal-border-sub bg-gray-50 no-underline"
                  >
                    <img
                      src={url}
                      alt={getAttachmentName(url, index)}
                      className="h-36 w-full object-cover"
                      loading="lazy"
                    />
                    <div className="truncate px-3 py-2 text-[11px] font-medium text-text-secondary">
                      {getAttachmentName(url, index)}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="portal-card p-5.5">
            <h2 className="mb-3.5 text-sm font-bold text-text-primary">Review Action</h2>
            <div className="flex flex-wrap gap-2.5">
              <button
                disabled={updating || claim.status === 'approved'}
                onClick={() => updateStatus('approved')}
                className="portal-btn-primary px-3.5 py-2.5 text-[13px] disabled:opacity-65"
              >
                Approve Claim
              </button>
              <button
                disabled={updating || claim.status === 'denied'}
                onClick={() => updateStatus('denied')}
                className="portal-btn-ghost px-3.5 py-2.5 text-[13px] text-red-600 disabled:opacity-65"
              >
                Deny Claim
              </button>
            </div>
          </div>

          <div className="portal-card p-5.5">
            <h2 className="mb-5 text-sm font-bold text-text-primary">Activity Timeline</h2>
            {[
              { date: formatDate(claim.createdAt), event: `Claim submitted by ${claim.name}` },
              { date: formatDate(claim.updatedAt), event: `Current status: ${statusLabel[claim.status] ?? claim.status}` },
            ].map((item, i) => (
              <div key={i} className="relative flex gap-3.5">
                {i < 1 && (
                  <div className="absolute bottom-0 left-[9px] top-[22px] w-px bg-slate-200" />
                )}
                <div className={`relative z-1 mt-0.5 h-5 w-5 shrink-0 rounded-full border-[3px] border-white ${i === 0 ? 'bg-blue-500' : isResolved ? 'bg-accent-gold' : 'bg-slate-200'}`} />
                <div className="pb-5">
                  <p className="m-0 text-[13px] font-medium text-text-primary">{item.event}</p>
                  <p className="mt-0.75 text-[11px] text-text-muted"><Clock size={10} className="mr-0.75 inline" />{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="portal-card p-5">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted">Entity Details</p>
          {[
            { label: 'Customer', value: claim.name, icon: User, cls: 'stat-icon-blue' },
            { label: 'Email', value: claim.email, icon: Building2, cls: 'stat-icon-purple' },
            { label: 'Order / Flooring', value: `${claim.orderId} / ${claim.flooringType}`, icon: FileCheck, cls: 'stat-icon-green' },
          ].map((row, i) => (
            <div key={i} className={`flex items-start gap-3 ${i < 2 ? 'mb-4' : ''}`}>
              <div className={`${row.cls} shrink-0 p-2`}><row.icon size={14} /></div>
              <div>
                <p className="m-0 text-[10px] text-text-muted">{row.label}</p>
                <p className="mt-0.5 break-words text-[13px] font-semibold text-text-primary">{row.value}</p>
              </div>
            </div>
          ))}
          <div className="mt-[18px] border-t border-portal-border-sub pt-4">
            <a href={`mailto:${claim.email}`} className="portal-btn-primary flex w-full items-center justify-center gap-1.75 p-2.5 text-[13px] no-underline">
              <MessageSquare size={14} /> Contact Customer
            </a>
            {isResolved && (
              <div className="mt-2.5 flex items-center justify-center gap-1.25">
                <CheckCircle2 size={13} className="text-emerald-600" />
                <span className="text-xs font-medium text-emerald-600">Claim approved</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
