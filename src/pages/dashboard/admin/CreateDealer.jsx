import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, ShieldCheck, Save } from 'lucide-react';

export default function CreateDealer() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock dealer creation
    alert('Dealer created successfully!');
    navigate('/dashboard/dealers');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/dealers')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Create New Dealer</h1>
          <p className="text-sm text-gray-500">Register a new dealership to the portal.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#111827] mb-6">Dealer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Dealership Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  required
                  type="text"
                  placeholder="e.g. Skyline Motors"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#111827] focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Primary Contact Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  required
                  type="email"
                  placeholder="dealer@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#111827] focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  required
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#111827] focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Region</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#111827] focus:border-transparent outline-none appearance-none bg-white">
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  rows="3"
                  placeholder="Enter full business address..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#111827] focus:border-transparent outline-none"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#111827] mb-6">Account Credentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Initial Password</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#111827] focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex items-end">
              <p className="text-xs text-gray-500 pb-2">
                The dealer will be prompted to change this password upon their first login.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/dealers')}
            className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center px-6 py-2.5 bg-[#111827] text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            <Save className="h-4 w-4 mr-2" />
            Create Dealer Account
          </button>
        </div>
      </form>
    </div>
  );
}
