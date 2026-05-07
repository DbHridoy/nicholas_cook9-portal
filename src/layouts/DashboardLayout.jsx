import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, FileText, LogOut, User, Menu } from 'lucide-react';
import Logo from '../components/Logo';

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Basic logout logic
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Sales', path: '/dashboard/sales', icon: ShoppingCart },
    { name: 'Reports', path: '/dashboard/reports', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-200 shrink-0">
          <div className="scale-75 origin-left">
            <Logo subtitle="Portal" showIcon={false} />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#111827] text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
          <button className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#111827]">
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin User</span>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#F8F9FA] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
