import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, TrendingUp, Users } from 'lucide-react';

const analyticsData = {
  totalSales: 4567,
  warrantedSales: 3284,
  activeDealers: 48,
  avgSalesPerDealer: 95,
  chartData: [
    { month: 'Jan', total: 400, warranted: 300 },
    { month: 'Feb', total: 350, warranted: 280 },
    { month: 'Mar', total: 500, warranted: 410 },
    { month: 'Apr', total: 480, warranted: 390 },
    { month: 'May', total: 600, warranted: 520 },
    { month: 'Jun', total: 550, warranted: 460 },
  ]
};

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-[#111827]">{value}</h3>
      </div>
    </div>
  </div>
);

export default function SalesAnalytics() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const maxVal = Math.max(...analyticsData.chartData.map(d => d.total));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Sales Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Aggregated performance data across all dealers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Sales" 
          value={analyticsData.totalSales.toLocaleString()} 
          icon={ShoppingBag} 
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard 
          title="Warranted Sales" 
          value={analyticsData.warrantedSales.toLocaleString()} 
          icon={ShieldCheck} 
          colorClass="bg-green-50 text-green-600"
        />
        <StatCard 
          title="Active Dealers" 
          value={analyticsData.activeDealers} 
          icon={Users} 
          colorClass="bg-purple-50 text-purple-600"
        />
        <StatCard 
          title="Growth Rate" 
          value="+12.4%" 
          icon={TrendingUp} 
          colorClass="bg-orange-50 text-orange-600"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">Sales Overview</h2>
            <p className="text-xs text-gray-500">Comparison between Total and Warranted sales.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#111827] rounded-full"></div>
              <span className="text-xs text-gray-600 font-medium">Total Sales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-xs text-gray-600 font-medium">Warranted</span>
            </div>
          </div>
        </div>

        <div className="h-80 flex items-end gap-4 sm:gap-8 lg:gap-12 px-4">
          {analyticsData.chartData.map((data, index) => {
            const totalHeight = (data.total / maxVal) * 100;
            const warrantedHeight = (data.warranted / maxVal) * 100;

            return (
              <div 
                key={data.month} 
                className="flex-1 flex flex-col items-center group relative h-full justify-end"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="w-full flex justify-center gap-1 h-full items-end">
                  <div 
                    className="w-1/3 bg-[#111827] rounded-t-sm transition-all duration-300 group-hover:opacity-80"
                    style={{ height: `${totalHeight}%` }}
                  />
                  <div 
                    className="w-1/3 bg-blue-400 rounded-t-sm transition-all duration-300 group-hover:opacity-80"
                    style={{ height: `${warrantedHeight}%` }}
                  />
                </div>
                
                {hoveredIndex === index && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white border border-gray-100 shadow-xl rounded-lg p-2 z-10 whitespace-nowrap">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{data.month}</p>
                    <p className="text-xs font-bold text-[#111827]">Total: {data.total}</p>
                    <p className="text-xs font-bold text-blue-500">Warranted: {data.warranted}</p>
                  </div>
                )}
                
                <span className="mt-4 text-xs font-medium text-gray-500">{data.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
