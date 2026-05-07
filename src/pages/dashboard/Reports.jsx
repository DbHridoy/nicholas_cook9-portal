import React from 'react';
import { Filter, Eye, MoreHorizontal } from 'lucide-react';

const mockClaims = [
  { id: 'CLM-8091', customer: 'Acme Corp', product: 'Gateway Firewall Pro', date: '2026-05-01', status: 'Resolved' },
  { id: 'CLM-8092', customer: 'Globex Inc', product: 'Enterprise Router X1', date: '2026-05-03', status: 'Unresolved' },
  { id: 'CLM-8093', customer: 'Initech', product: 'SecureSwitch 48-Port', date: '2026-05-04', status: 'Resolved' },
  { id: 'CLM-8094', customer: 'Umbrella Corp', product: 'Cloud Storage Node 8TB', date: '2026-05-06', status: 'Unresolved' },
  { id: 'CLM-8095', customer: 'Stark Industries', product: 'Gateway Firewall Pro', date: '2026-05-07', status: 'Resolved' },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Customer Claims</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage claims submitted by customers.</p>
        </div>
        
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          <Filter className="h-4 w-4 mr-2 text-gray-500" />
          Filter Claims
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827]">{claim.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{claim.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{claim.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{claim.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      claim.status === 'Resolved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
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
