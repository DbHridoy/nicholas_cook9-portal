import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, CheckCircle, Clock, AlertTriangle, Mail, Phone, MapPin } from 'lucide-react';

const dealerStats = {
  1: {
    name: 'Main Street Motors',
    email: 'contact@mainstreet.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Springfield, IL',
    totalSales: 142,
    warrantedSales: 98,
    resolvedClaims: 42,
    pendingClaims: 3,
    rejectedClaims: 1,
    performance: [
      { month: 'Jan', sales: 24, claims: 2 },
      { month: 'Feb', sales: 18, claims: 1 },
      { month: 'Mar', sales: 32, claims: 5 },
      { month: 'Apr', sales: 28, claims: 2 },
      { month: 'May', sales: 40, claims: 4 },
    ]
  },
  // Add more mock data if needed
};

export default function DealerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dealer = dealerStats[id] || dealerStats[1]; // Fallback to first dealer for demo

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/dealers')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">{dealer.name}</h1>
          <p className="text-sm text-gray-500">Dealer performance and statistics overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="font-bold text-[#111827]">Contact Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>{dealer.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{dealer.phone}</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              <span>{dealer.address}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Total Sales</p>
              <p className="text-xl font-bold text-[#111827]">{dealer.totalSales}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Resolved Claims</p>
              <p className="text-xl font-bold text-[#111827]">{dealer.resolvedClaims}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Pending Claims</p>
              <p className="text-xl font-bold text-[#111827]">{dealer.pendingClaims}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Rejected Claims</p>
              <p className="text-xl font-bold text-[#111827]">{dealer.rejectedClaims}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-[#111827] mb-6">Recent Performance</h2>
        <div className="h-64 flex items-end gap-2 pt-8 pb-2 px-4 border-b border-gray-100">
          {dealer.performance.map((item) => {
            const height = (item.sales / 40) * 100;
            return (
              <div key={item.month} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                <div 
                  className="w-full bg-[#111827] rounded-t-sm transition-all duration-300 group-hover:bg-blue-600"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[10px] text-gray-500 mt-2">{item.month}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex justify-between text-xs text-gray-500">
          <span>Monthly Sales trend for the last 5 months.</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#111827] rounded-full"></div>
            <span>Sales Volume</span>
          </div>
        </div>
      </div>
    </div>
  );
}
