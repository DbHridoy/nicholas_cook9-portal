import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, FilePlus, Search, Download, Eye } from 'lucide-react';

const mockOrders = [
  { id: 'ORD-9821', customer: 'John Doe', product: 'SecureSwitch 48-Port', total: '$1,299.00', status: 'Delivered' },
  { id: 'ORD-9822', customer: 'Jane Smith', product: 'Enterprise Router X1', total: '$899.00', status: 'Processing' },
  { id: 'ORD-9823', customer: 'Bob Johnson', product: 'Cloud Storage Node 8TB', total: '$2,499.00', status: 'Shipped' },
  { id: 'ORD-9824', customer: 'Alice Williams', product: 'Gateway Firewall Pro', total: '$1,850.00', status: 'Delivered' },
];

export default function Sales() {
  const [orders] = useState(mockOrders);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Sales & Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your sales orders and view detailed transaction history.</p>
        </div>
        
        <button 
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#111827] hover:bg-gray-800 transition-colors"
          onClick={() => document.getElementById('csv-upload').click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Import CSV
        </button>
        <input type="file" id="csv-upload" className="hidden" accept=".csv" />
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => document.getElementById('csv-upload').click()}>
        <FilePlus className="h-10 w-10 text-gray-400 mx-auto mb-3" />
        <h3 className="text-sm font-medium text-[#111827] mb-1">Upload Sales CSV</h3>
        <p className="text-xs text-gray-500">Import your sales data from a CSV file</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-full max-sm:max-w-xs sm:max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111827] focus:border-transparent text-sm"
            />
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
            <Download className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827]">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Delivered' 
                        ? 'bg-green-100 text-green-800' 
                        : order.status === 'Shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/dashboard/sales/${order.id}`} className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Eye className="h-5 w-5 inline" />
                    </Link>
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
