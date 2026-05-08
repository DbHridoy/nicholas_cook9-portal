import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MoreVertical, ExternalLink } from 'lucide-react';

const dealers = [
  { id: 1, name: 'Main Street Motors', email: 'contact@mainstreet.com', region: 'North', sales: 142, claims: 5, status: 'Active' },
  { id: 2, name: 'Downtown Auto', email: 'info@downtownauto.com', region: 'South', sales: 89, claims: 2, status: 'Active' },
  { id: 3, name: 'Elite Vehicles', email: 'sales@elite.com', region: 'East', sales: 210, claims: 12, status: 'Active' },
  { id: 4, name: 'Valley Ford', email: 'support@valleyford.com', region: 'West', sales: 56, claims: 1, status: 'Inactive' },
];

export default function DealerList() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Dealers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and view performance of all registered dealers.</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/dealers/create')}
          className="flex items-center px-4 py-2 bg-[#111827] text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Dealer
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search dealers by name, email or region..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#111827] focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#111827] outline-none">
              <option>All Regions</option>
              <option>North</option>
              <option>South</option>
              <option>East</option>
              <option>West</option>
            </select>
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#111827] outline-none">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dealer Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Region</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sales</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Claims</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dealers.map((dealer) => (
                <tr key={dealer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{dealer.name}</span>
                      <span className="text-xs text-gray-500">{dealer.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{dealer.region}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">{dealer.sales}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{dealer.claims}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      dealer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {dealer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/dashboard/dealers/${dealer.id}`)}
                        className="p-2 text-gray-400 hover:text-[#111827] transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
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
