import React, { useState } from 'react';
import { Upload, FilePlus, Search, Download } from 'lucide-react';

const mockProducts = [
  { id: 'PRD-001', name: 'Enterprise Router X1', category: 'Networking', price: '$899.00', stock: 45 },
  { id: 'PRD-002', name: 'SecureSwitch 48-Port', category: 'Networking', price: '$1,299.00', stock: 12 },
  { id: 'PRD-003', name: 'Cloud Storage Node 8TB', category: 'Storage', price: '$2,499.00', stock: 8 },
  { id: 'PRD-004', name: 'Gateway Firewall Pro', category: 'Security', price: '$1,850.00', stock: 24 },
];

export default function Sales() {
  const [products] = useState(mockProducts);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Sales & Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product catalog and view sales details.</p>
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
        <h3 className="text-sm font-medium text-[#111827] mb-1">Upload Product CSV</h3>
        <p className="text-xs text-gray-500">Drag and drop or click to browse files</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827]">{product.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${product.stock < 15 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                      {product.stock} in stock
                    </span>
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
