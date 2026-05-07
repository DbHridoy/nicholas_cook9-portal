import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Package, MessageSquare, Clock } from 'lucide-react';

export default function ClaimDetails() {
  const { id } = useParams();

  // Mock data for the specific claim
  const claimDetails = {
    claimId: id || 'CLM-8092',
    date: 'May 03, 2026',
    status: 'Unresolved',
    orderId: 'ORD-9821',
    customer: {
      name: 'Globex Inc',
      email: 'support@globex.com',
      phone: '+1 (555) 987-6543',
    },
    product: {
      id: 'PRD-001',
      name: 'Enterprise Router X1',
      category: 'Networking',
    },
    claimMessage: 'The router keeps dropping the connection every 30 minutes. We have tried factory resetting it, but the issue persists. Please advise or process a replacement.',
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/reports" className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Claim {claimDetails.claimId}</h1>
          <p className="text-sm text-gray-500 mt-1">Submitted on {claimDetails.date}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link to={`/dashboard/sales/${claimDetails.orderId}`} className="text-sm font-medium text-blue-600 hover:text-blue-800 underline">
            View Order {claimDetails.orderId}
          </Link>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            claimDetails.status === 'Resolved' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {claimDetails.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Customer Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-bold text-[#111827]">Customer</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Name / Company</p>
                <p className="text-sm font-medium text-[#111827]">{claimDetails.customer.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm font-medium text-[#111827]">{claimDetails.customer.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <p className="text-sm font-medium text-[#111827]">{claimDetails.customer.phone}</p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-bold text-[#111827]">Product Issue</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Product Name</p>
                <p className="text-sm font-medium text-[#111827]">{claimDetails.product.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Product ID / SKU</p>
                <p className="text-sm font-medium text-[#111827]">{claimDetails.product.id}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {/* Claim Message */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
            <div className="p-6 border-b border-gray-100 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-bold text-[#111827]">Claim Reason / Message</h2>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-[#111827] uppercase tracking-wider">Customer Statement</span>
                  <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
                </div>
                <p className="text-gray-700 leading-relaxed italic text-sm">
                  "{claimDetails.claimMessage}"
                </p>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>Submitted on {claimDetails.date}</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-sm font-bold text-[#111827] mb-4">Internal Action</h3>
                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    Approve Claim
                  </button>
                  <button className="flex-1 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                    Reject Claim
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
