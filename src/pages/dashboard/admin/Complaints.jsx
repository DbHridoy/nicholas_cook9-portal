import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, MoreVertical, MessageSquare } from 'lucide-react';

const complaints = [
  { id: 'CLM-8091', customer: 'Acme Corp', dealer: 'Main Street Motors', status: 'Resolved', date: '2026-05-01' },
  { id: 'CLM-8092', customer: 'Globex Inc', dealer: 'Downtown Auto', status: 'Unresolved', date: '2026-05-03' },
  { id: 'CLM-8093', customer: 'Initech', dealer: 'Elite Vehicles', status: 'Resolved', date: '2026-05-04' },
  { id: 'CLM-8094', customer: 'Umbrella Corp', dealer: 'Valley Ford', status: 'Unresolved', date: '2026-05-06' },
  { id: 'CLM-8095', customer: 'Stark Industries', dealer: 'Main Street Motors', status: 'Resolved', date: '2026-05-07' },
];

export default function Complaints() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Complaint Management</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage all customer claims submitted across all dealers.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer, dealer or claim ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#111827] outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#111827] outline-none">
              <option>All Dealers</option>
              <option>Main Street Motors</option>
              <option>Downtown Auto</option>
              <option>Elite Vehicles</option>
            </select>
            <button className="flex items-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Claim ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dealer</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {complaints.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.dealer}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/dashboard/complaints/${item.id}`)}
                        className="p-2 text-gray-400 hover:text-[#111827] transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
