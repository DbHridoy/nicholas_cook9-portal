import React, { useState } from 'react';
import { Package, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

const growthData = {
  weekly: [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ],
  monthly: [
    { name: 'Week 1', sales: 14000 },
    { name: 'Week 2', sales: 23000 },
    { name: 'Week 3', sales: 12000 },
    { name: 'Week 4', sales: 27800 },
  ],
  yearly: [
    { name: 'Jan', sales: 40000 },
    { name: 'Feb', sales: 30000 },
    { name: 'Mar', sales: 20000 },
    { name: 'Apr', sales: 27800 },
    { name: 'May', sales: 18900 },
    { name: 'Jun', sales: 23900 },
    { name: 'Jul', sales: 34900 },
    { name: 'Aug', sales: 42000 },
    { name: 'Sep', sales: 31000 },
    { name: 'Oct', sales: 25000 },
    { name: 'Nov', sales: 38000 },
    { name: 'Dec', sales: 45000 },
  ],
};

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="p-2 bg-gray-50 rounded-lg">
        <Icon className="h-5 w-5 text-[#111827]" />
      </div>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-bold text-[#111827]">{value}</span>
      {trend && (
        <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.isPositive ? '+' : '-'}{trend.value}%
        </span>
      )}
    </div>
  </div>
);

export default function DashboardMetrics() {
  const [timeframe, setTimeframe] = useState('monthly');

  // Calculate max sales to scale the bar chart
  const maxSales = Math.max(...growthData[timeframe].map(d => d.sales));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your personal metrics and growth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Products Sold" 
          value="1,284" 
          icon={Package} 
          trend={{ value: 12.5, isPositive: true }} 
        />
        <StatCard 
          title="Selling Growth" 
          value="+24%" 
          icon={TrendingUp} 
          trend={{ value: 4.1, isPositive: true }} 
        />
        <StatCard 
          title="Total Claims Resolved" 
          value="156" 
          icon={CheckCircle} 
        />
        <StatCard 
          title="Total Unresolved Claims" 
          value="12" 
          icon={AlertCircle} 
          trend={{ value: 2.4, isPositive: false }} 
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#111827]">Selling Growth</h2>
          <div className="flex p-1 bg-gray-100 rounded-lg">
            {['weekly', 'monthly', 'yearly'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
                  timeframe === tf 
                    ? 'bg-white text-[#111827] shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-80 w-full flex items-end justify-between gap-2 pt-8 pb-2">
          {growthData[timeframe].map((item, i) => {
            const heightPercent = (item.sales / maxSales) * 100;
            
            return (
              <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
                <div 
                  className="w-full bg-[#E5E7EB] group-hover:bg-[#111827] rounded-t-sm transition-colors relative"
                  style={{ height: `${heightPercent}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-[#111827] text-white text-xs py-1.5 px-2.5 rounded shadow-lg whitespace-nowrap transition-opacity pointer-events-none z-10">
                    ${item.sales.toLocaleString()}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#111827]"></div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-3 truncate w-full text-center">{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
