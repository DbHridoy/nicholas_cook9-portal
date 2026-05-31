import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Building2, Package, MessageSquare } from 'lucide-react';

const complaintData = {
  'CLM-8091': {
    customer: 'Acme Corp',
    dealer: 'Main Street Motors',
    product: 'EcoPower Generator X1',
    date: '2026-05-01',
    status: 'Resolved',
    description: 'The generator failed to start after 2 hours of continuous use. Customer reports a burning smell.',
    resolution: 'Dealer replaced the control module. Unit tested and confirmed working.',
    history: [
      { date: '2026-05-01', event: 'Claim submitted by Acme Corp via Main Street Motors' },
      { date: '2026-05-02', event: 'Dealer inspection completed' },
      { date: '2026-05-03', event: 'Parts ordered' },
      { date: '2026-05-04', event: 'Repair completed and claim resolved' },
    ]
  },
  'CLM-8092': {
    customer: 'Globex Inc',
    dealer: 'Downtown Auto',
    product: 'SmartHub Controller Pro',
    date: '2026-05-03',
    status: 'Unresolved',
    description: 'Firmware update caused the device to enter a boot loop. Multiple devices affected.',
    resolution: 'Pending investigation by engineering team.',
    history: [
      { date: '2026-05-03', event: 'Claim submitted by Globex Inc via Downtown Auto' },
      { date: '2026-05-04', event: 'Escalated to engineering' },
    ]
  }
};

export default function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const claim = complaintData[id] || complaintData['CLM-8092']; // Fallback for demo

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/complaints')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#111827]">{id}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              claim.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {claim.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Submitted on {claim.date}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#111827] mb-4">Claim Description</h2>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700 leading-relaxed">
                {claim.description}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#111827] mb-4">Resolution Details</h2>
              <div className={`p-4 rounded-lg border text-sm leading-relaxed ${
                claim.status === 'Resolved' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-blue-50 border-blue-100 text-blue-800'
              }`}>
                {claim.resolution}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-[#111827] mb-6">Activity Timeline</h2>
            <div className="space-y-6">
              {claim.history.map((item, index) => (
                <div key={index} className="flex gap-4 relative">
                  {index !== claim.history.length - 1 && (
                    <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gray-100"></div>
                  )}
                  <div className={`h-6 w-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center shrink-0 z-10 ${
                    index === 0 ? 'bg-blue-500' : index === claim.history.length - 1 && claim.status === 'Resolved' ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.event}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Entity Details</h2>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Customer</p>
                <p className="text-sm font-semibold text-gray-900">{claim.customer}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Building2 className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Dealer</p>
                <p className="text-sm font-semibold text-gray-900">{claim.dealer}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Package className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Product</p>
                <p className="text-sm font-semibold text-gray-900">{claim.product}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button className="w-full py-2.5 bg-[#111827] text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Contact Dealer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
