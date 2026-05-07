import React from 'react';
import { Shield } from 'lucide-react';

export default function Logo({ subtitle = "Enterprise Asset Management System", showIcon = true }) {
  return (
    <div className="flex flex-col items-center mb-8">
      {showIcon && (
        <div className="bg-[#111827] w-12 h-12 rounded-lg flex items-center justify-center mb-3">
          <Shield className="text-white" size={24} />
        </div>
      )}
      <h1 className="text-2xl font-bold text-[#111827]">DealerPortal</h1>
      <p className="text-sm text-gray-500 mt-1 uppercase tracking-wide">{subtitle}</p>
    </div>
  );
}
