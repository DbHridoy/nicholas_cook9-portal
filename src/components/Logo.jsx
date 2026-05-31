import { ShieldCheck } from 'lucide-react';

export default function Logo({ subtitle = 'Protection Claims Portal', showIcon = true }) {
  return (
    <div className="flex flex-col items-center mb-8">
      {showIcon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#e8a020_0%,#f5bc50_100%)] shadow-[0_10px_24px_rgba(232,160,32,0.28)]">
          <ShieldCheck className="text-white" size={24} />
        </div>
      )}
      <h1 className="text-2xl font-bold text-text-primary">Nicholas Cook</h1>
      <p className="mt-1 text-sm uppercase tracking-wide text-gray-500">{subtitle}</p>
    </div>
  );
}
