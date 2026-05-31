import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Search } from 'lucide-react';
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

export default function Reports() {
  const [claims, setClaims] = useState([]);
  const [search, setSearch] = useState('');
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
    return !q
      || claim._id?.toLowerCase().includes(q)
      || claim.name?.toLowerCase().includes(q)
      || claim.email?.toLowerCase().includes(q)
      || claim.orderId?.toLowerCase().includes(q);
  }), [claims, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Customer Claims</h1>
          <p className="text-sm text-gray-500 mt-1">Review claims tied to your contract order IDs.</p>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search claims by customer, email, order ID or claim ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#111827] focus:border-transparent"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flooring</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">Loading claims...</td></tr>
              )}
              {!loading && filtered.map((claim) => (
                <tr key={claim._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827]">{claim._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{claim.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{claim.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{claim.flooringType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(claim.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass[claim.status] ?? statusClass.pending}`}>
                      {statusLabel[claim.status] ?? claim.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/dashboard/reports/${claim._id}`} className="inline-flex p-1 text-gray-400 hover:text-blue-600 transition-colors" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">No claims found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
