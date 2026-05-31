import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Package, MessageSquare, Clock, Image as ImageIcon } from 'lucide-react';
import { api } from '../../lib/api';

const statusClass = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
};

const statusLabel = {
  pending: 'Pending',
  approved: 'Approved',
  denied: 'Denied',
};

const formatDate = (value) => value ? new Date(value).toLocaleDateString() : '-';
const getAttachmentName = (url, index) => decodeURIComponent(url.split('/').pop() || `Photo ${index + 1}`);

export default function ClaimDetails() {
  const { id } = useParams();
  const [claim, setClaim] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">Loading claim...</div>;
  }

  if (!claim) {
    return <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-red-600">{error || 'Claim not found.'}</div>;
  }

  const attachments = Array.isArray(claim.attachments) ? claim.attachments : [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/reports" className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Claim {claim.claimId ?? claim._id}</h1>
          <p className="text-sm text-gray-500 mt-1">Submitted on {formatDate(claim.createdAt)}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusClass[claim.status] ?? statusClass.pending}`}>
            {statusLabel[claim.status] ?? claim.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-bold text-[#111827]">Customer</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Name / Company</p>
                <p className="text-sm font-medium text-[#111827]">{claim.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm font-medium text-[#111827]">{claim.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Order ID</p>
                <p className="text-sm font-medium text-[#111827]">{claim.orderId}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-bold text-[#111827]">Product Issue</h2>
            </div>
            <p className="text-sm font-medium text-[#111827]">{claim.flooringType}</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-bold text-[#111827]">Claim Reason / Message</h2>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <p className="text-gray-700 leading-relaxed italic text-sm">"{claim.description}"</p>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>Submitted on {formatDate(claim.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {attachments.length > 0 && (
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-bold text-[#111827]">Claim Photos</h2>
              </div>
              <div className="grid gap-3 p-6 sm:grid-cols-2">
                {attachments.map((url, index) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="group block overflow-hidden rounded-lg border border-gray-100 bg-gray-50 no-underline"
                  >
                    <img
                      src={url}
                      alt={getAttachmentName(url, index)}
                      className="h-40 w-full object-cover transition-transform group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <div className="truncate px-3 py-2 text-xs font-medium text-gray-600">
                      {getAttachmentName(url, index)}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
