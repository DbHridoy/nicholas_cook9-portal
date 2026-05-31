import { ShieldCheck } from 'lucide-react';

export default function Logo({ subtitle = 'Protection Claims Portal', showIcon = true }) {
  return (
    <div className="flex flex-col items-center mb-8">
      {showIcon && (
        <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{ background: 'var(--gradient-accent)', boxShadow: '0 10px 24px rgba(232,160,32,0.28)' }}>
          <ShieldCheck className="text-white" size={24} />
        </div>
      )}
      <h1 className="text-2xl font-bold text-[#111827]">Nicholas Cook</h1>
      <p className="text-sm text-gray-500 mt-1 uppercase tracking-wide">{subtitle}</p>
    </div>
  );
}
