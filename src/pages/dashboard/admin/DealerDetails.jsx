import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, CheckCircle, Clock, AlertTriangle, Mail } from 'lucide-react';
import { api } from '../../../lib/api';

const formatMoney = (value) => `$${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

export default function DealerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dealer, setDealer] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api.getUser(id)
      .then((data) => {
        if (active) setDealer(data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load user.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">Loading user...</div>;
  if (!dealer) return <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-red-600">{error || 'User not found.'}</div>;

  const isDealer = dealer.role === 'dealer';
  const maxContracts = isDealer ? Math.max(...(dealer.performance || []).map((item) => item.contracts), 1) : 1;
  const pageDescription = isDealer
    ? 'Portal account and dealer performance overview.'
    : 'Basic portal account information.';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard/dealers')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">{dealer.name}</h1>
          <p className="text-sm text-gray-500">{pageDescription}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="font-bold text-[#111827]">Account Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>{dealer.email}</span>
            </div>
            <div className="text-sm text-gray-600">Role: <span className="font-semibold capitalize">{dealer.role}</span></div>
            <div className="text-sm text-gray-600">Status: <span className="font-semibold capitalize">{dealer.status}</span></div>
          </div>
        </div>

        {isDealer && (
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ShoppingCart className="h-5 w-5" /></div>
              <div><p className="text-xs font-medium text-gray-500">Total Contracts</p><p className="text-xl font-bold text-[#111827]">{dealer.stats.totalContracts}</p></div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle className="h-5 w-5" /></div>
              <div><p className="text-xs font-medium text-gray-500">Total Sales</p><p className="text-xl font-bold text-[#111827]">{formatMoney(dealer.stats.totalSales)}</p></div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
              <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><Clock className="h-5 w-5" /></div>
              <div><p className="text-xs font-medium text-gray-500">Pending Claims</p><p className="text-xl font-bold text-[#111827]">{dealer.stats.pendingClaims}</p></div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertTriangle className="h-5 w-5" /></div>
              <div><p className="text-xs font-medium text-gray-500">Denied Claims</p><p className="text-xl font-bold text-[#111827]">{dealer.stats.deniedClaims}</p></div>
            </div>
          </div>
        )}
      </div>

      {isDealer && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#111827] mb-6">Recent Performance</h2>
          <div className="h-64 flex items-end gap-2 pt-8 pb-2 px-4 border-b border-gray-100">
            {(dealer.performance || []).map((item) => {
              const height = Math.max((item.contracts / maxContracts) * 100, 4);
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  <div className="w-full bg-[#111827] rounded-t-sm transition-all duration-300 group-hover:bg-blue-600" style={{ height: `${height}%` }} />
                  <span className="text-[10px] text-gray-500 mt-2">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
