import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, LogOut, User,
  Menu, TrendingUp, MessageSquare, X,
  FileCheck, Bell, ChevronDown,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, setUser } from '../store/authSlice';
import { api } from '../lib/api';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { role: rawRole, user: userEmail, name, isAuthenticated, avatar } = useSelector((state) => state.auth);
  const userRole = rawRole === 'super_admin' ? 'admin' : rawRole;
  const roleLabel = rawRole === 'super_admin' ? 'Super Admin' : userRole === 'admin' ? 'Admin' : 'Dealer';
  const displayName = name || userEmail || 'Portal User';
  const avatarText = useMemo(() => {
    const source = name || userEmail || 'PU';
    return source
      .split(/[\s@.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'PU';
  }, [name, userEmail]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    } else {
      api.getMyProfile()
        .then((userData) => {
          dispatch(setUser(userData));
        })
        .catch((err) => {
          console.error('Failed to load profile:', err);
        });
    }
  }, [isAuthenticated, navigate, dispatch]);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // Local logout should still proceed if the token is already expired.
    }
    dispatch(logout());
    navigate('/');
  };

  const dealerNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Contracts', path: '/dashboard/sales', icon: FileCheck },
    // { name: 'Products', path: '/dashboard/products', icon: Package },
    { name: 'Claims', path: '/dashboard/reports', icon: FileText },
  ];

  const adminNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: rawRole === 'super_admin' ? 'Users' : 'Dealers', path: '/dashboard/dealers', icon: User },
    { name: 'Sales Analytics', path: '/dashboard/analytics', icon: TrendingUp },
    { name: 'Claims', path: '/dashboard/complaints', icon: MessageSquare },
  ];

  const navItems = userRole === 'admin' ? adminNavItems : dealerNavItems;

  const renderSidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-white/10 px-5">
        <div className="flex items-center gap-2.5">
          {/* Gold "L"-style logo mark */}
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-[linear-gradient(135deg,#e8a020_0%,#f5bc50_100%)] text-[15px] font-black text-white shadow-[0_4px_14px_rgba(232,160,32,0.40)]">
            N
          </div>
          <div>
            <div className="text-[13px] font-bold text-slate-50">
              Axisone
            </div>
            <div className="text-[10px] font-medium uppercase tracking-[0.06em] text-slate-500">
              Portal
            </div>
          </div>
        </div>
        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="block cursor-pointer border-0 bg-transparent p-1 text-slate-500 md:hidden"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto px-2.5 pb-1 pt-5">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.exact}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => [
              'relative mb-0.5 flex items-center gap-3 rounded-[9px] px-3.5 py-2.5 text-[13.5px] no-underline transition hover:bg-white/10 hover:text-slate-200',
              isActive ? 'bg-white/10 font-semibold text-white' : 'font-normal text-slate-400',
            ].join(' ')}
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={17}
                  className={`shrink-0 ${isActive ? 'text-accent-gold' : 'text-slate-600'}`}
                />
                <span className="flex-1">{item.name}</span>
                {isActive && (
                  <div className="absolute right-2.5 h-[18px] w-[3px] rounded-sm bg-[linear-gradient(180deg,#e8a020,#f5bc50)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/10 px-2.5 py-3">
        <button
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-2 rounded-[9px] border border-red-500/15 bg-red-500/10 px-3.5 py-2.5 text-[13px] font-medium text-red-400 transition hover:bg-red-500/15"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-portal-bg">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[232px] shrink-0 flex-col border-r border-white/10 bg-[linear-gradient(180deg,#152231_0%,#0f1c2b_100%)] md:flex">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]"
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[232px] flex-col border-r border-white/10 bg-[linear-gradient(180deg,#152231_0%,#0f1c2b_100%)] transition-transform duration-300 ease-out md:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {renderSidebarContent()}
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-[60px] shrink-0 items-center justify-between border-b border-portal-border bg-white px-6 shadow-sm max-sm:px-3.5">
          <div className="flex min-w-0 items-center gap-3.5">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex cursor-pointer items-center border-0 bg-transparent p-1.5 text-gray-500 md:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="flex min-w-0 items-center gap-1.5 text-sm text-text-secondary">
              <span className="text-gray-500 max-sm:hidden">Welcome back,</span>
              <span className="max-w-60 truncate font-bold text-text-primary">{displayName}</span>
              <ChevronDown size={14} className="mt-0.5 text-gray-500" />
            </div>
          </div>

          <div className="flex items-center gap-5 max-sm:gap-3">
            {/* Bell Icon */}
            <button
              type="button"
              onClick={() => navigate('/dashboard/notifications')}
              className="relative flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-1 text-text-secondary transition hover:bg-slate-100 hover:text-text-primary"
              aria-label="Open notifications"
            >
              <Bell size={20} />
              <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
            </button>

            {/* Avatar & User Details */}
            <div
              onClick={() => navigate('/dashboard/profile')}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1 transition hover:scale-[1.02] hover:bg-slate-100"
            >
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-text-primary text-xs font-semibold text-white">
                {avatar ? (
                  <img src={avatar} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  avatarText
                )}
              </div>
              <div className="flex flex-col max-sm:hidden">
                <span className="max-w-45 truncate text-[13px] font-bold leading-tight text-text-primary">{displayName}</span>
                <span className="text-[11px] font-medium text-gray-500">{roleLabel}</span>
              </div>
              <ChevronDown size={14} className="ml-1 text-gray-500 max-sm:hidden" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-portal-bg px-6 py-7 max-sm:px-3.5 max-sm:py-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
