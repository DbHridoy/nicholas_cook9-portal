import { useEffect, useMemo, useState } from 'react';
import { Package, TrendingUp, TrendingDown, ShieldAlert, CheckCircle2, Search, Filter } from 'lucide-react';
import { api } from '../../lib/api';

const PerformanceBadge = ({ score }) => {
  let color = 'text-green-600 bg-green-50 border-green-100';
  let label = 'Excellent';
  
  if (score < 70) {
    color = 'text-red-600 bg-red-50 border-red-100';
    label = 'Critical';
  } else if (score < 90) {
    color = 'text-yellow-600 bg-yellow-50 border-yellow-100';
    label = 'Warning';
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${color}`}>
      {label}
    </span>
  );
};

export default function Products() {
  const [performance, setPerformance] = useState({ averageReliability: 0, totalProducts: 0, atRiskProducts: 0, products: [] });
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api.getProductPerformance()
      .then((data) => {
        if (active) setPerformance({ averageReliability: 0, totalProducts: 0, atRiskProducts: 0, products: [], ...data });
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load product performance.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const products = useMemo(() => performance.products.filter((product) => {
    const q = search.toLowerCase();
    return !q || product.name.toLowerCase().includes(q) || product.category.toLowerCase().includes(q);
  }), [performance.products, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Product Performance</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor product reliability and warranty claim rates.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">Average Reliability</p>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-[#111827]">{loading ? '...' : `${performance.averageReliability}%`}</h3>
          <p className="text-xs text-gray-500 mt-1 font-medium">Based on current contracts and claims</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">Total Products</p>
            <Package className="h-5 w-5 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-[#111827]">{loading ? '...' : performance.totalProducts}</h3>
          <p className="text-xs text-gray-500 mt-1">Across 4 categories</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">At Risk Products</p>
            <ShieldAlert className="h-5 w-5 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-[#111827]">{loading ? '...' : performance.atRiskProducts}</h3>
          <p className="text-xs text-red-600 mt-1 font-medium">Immediate review required</p>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#111827] outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Units Sold</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Claim Rate</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const claimRate = product.claimRate.toFixed(1);
                const performanceScore = product.performanceScore;
                const isUnderperforming = performanceScore < 70;

                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{product.name}</span>
                        <span className="text-xs text-gray-500">{product.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.sold.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`text-sm font-semibold ${isUnderperforming ? 'text-red-600' : 'text-gray-900'}`}>
                          {claimRate}%
                        </span>
                        <span className="text-[10px] text-gray-400">{product.claims} claims</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-[100px]">
                          <div 
                            className={`h-full rounded-full ${
                              performanceScore < 70 ? 'bg-red-500' : performanceScore < 90 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.max(0, performanceScore)}%` }}
                          />
                        </div>
                        <PerformanceBadge score={performanceScore} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isUnderperforming ? (
                        <div className="flex items-center text-red-600 gap-1">
                          <TrendingDown className="h-4 w-4" />
                          <span className="text-xs font-medium">Declining</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-green-600 gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-xs font-medium">Stable</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
