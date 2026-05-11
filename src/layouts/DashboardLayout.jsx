import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, FileText, LogOut, User,
  Menu, TrendingUp, Package, MessageSquare, X, ChevronRight,
  FileCheck, Bell, ChevronDown,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import Logo from '../components/Logo';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { role: userRole, user: userEmail, isAuthenticated } = useSelector((state) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const dealerNavItems = [
    { name: 'Dashboard',  path: '/dashboard',          icon: LayoutDashboard, exact: true },
    { name: 'Contracts',  path: '/dashboard/sales',    icon: FileCheck },
    { name: 'Products',   path: '/dashboard/products', icon: Package },
    { name: 'Claims',     path: '/dashboard/reports',  icon: FileText },
  ];

  const adminNavItems = [
    { name: 'Dashboard',       path: '/dashboard',               icon: LayoutDashboard, exact: true },
    { name: 'Dealers',         path: '/dashboard/dealers',       icon: User },
    { name: 'Sales Analytics', path: '/dashboard/analytics',     icon: TrendingUp },
    { name: 'Claims',          path: '/dashboard/complaints',    icon: MessageSquare },
  ];

  const navItems = userRole === 'admin' ? adminNavItems : dealerNavItems;

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{
        height: 68,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Gold "L"-style logo mark */}
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, #e8a020 0%, #f5bc50 100%)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 900, color: '#fff',
            boxShadow: '0 4px 14px rgba(232,160,32,0.40)',
            letterSpacing: '-0.03em',
          }}>N</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.01em' }}>
              Nicholas Cook
            </div>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {userRole} Portal
            </div>
          </div>
        </div>
        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          style={{ display: 'none', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}
          className="mobile-close-btn"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav section label */}
      <div style={{ padding: '20px 20px 6px' }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.10em' }}>
          {userRole === 'admin' ? 'Admin' : 'Dealer'} Portal
        </span>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '4px 10px', overflowY: 'auto' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.exact}
            onClick={() => setMobileOpen(false)}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 9,
              marginBottom: 2,
              fontSize: 13.5,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#ffffff' : '#94a3b8',
              textDecoration: 'none',
              background: isActive
                ? 'rgba(255,255,255,0.10)'
                : 'transparent',
              borderLeft: 'none',
              transition: 'all 0.18s ease',
              position: 'relative',
            })}
            className="sidebar-nav-link"
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={17}
                  style={{ color: isActive ? '#e8a020' : '#475569', flexShrink: 0 }}
                />
                <span style={{ flex: 1 }}>{item.name}</span>
                {isActive && (
                  <div style={{
                    width: 3, height: 18, borderRadius: 2,
                    background: 'linear-gradient(180deg, #e8a020, #f5bc50)',
                    position: 'absolute', right: 10,
                  }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Need Help block */}
      <div style={{
        margin: '0 10px 12px',
        padding: '12px 14px',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#cbd5e1', marginBottom: 4 }}>Need Help?</div>
        <div style={{ fontSize: 11, color: '#64748b' }}>(866) ledger-24</div>
        <div style={{ fontSize: 11, color: '#64748b' }}>support@portal.com</div>
      </div>

      {/* User info + logout */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 10,
          marginBottom: 8,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg, #e8a020, #f5bc50)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {userEmail ? userEmail[0].toUpperCase() : 'U'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userEmail}
            </div>
            <div style={{ fontSize: 10, color: '#64748b', textTransform: 'capitalize' }}>{userRole}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '9px 14px',
            background: 'rgba(239,68,68,0.07)',
            border: '1px solid rgba(239,68,68,0.14)',
            borderRadius: 9,
            color: '#f87171',
            fontSize: 13, fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.14)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.07)'}
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--portal-bg)', display: 'flex' }}>
      {/* Desktop Sidebar */}
      <aside style={{
        width: 232,
        background: 'var(--gradient-sidebar)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'none',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }} className="desktop-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(2px)',
            zIndex: 40,
          }}
        />
      )}
      <aside style={{
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        width: 232,
        background: 'var(--gradient-sidebar)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        zIndex: 50,
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        flexDirection: 'column',
      }} className="mobile-sidebar">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header style={{
          height: 60,
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          zIndex: 30,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={() => setMobileOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '6px',
                color: '#6b7280',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Menu size={20} />
            </button>
            <div style={{ fontSize: 14, color: '#4b5563', display: 'flex', alignItems: 'center', gap: 6 }}>
              Welcome back, <span style={{ fontWeight: 600, color: '#111827' }}>Touch of Color Flooring</span> 👋
              <ChevronDown size={14} style={{ color: '#6b7280', marginTop: 2 }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Bell Icon */}
            <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={20} style={{ color: '#4b5563' }} />
              <div style={{
                position: 'absolute', top: -2, right: -2, width: 8, height: 8,
                background: '#ef4444', borderRadius: '50%', border: '2px solid #fff'
              }} />
            </div>

            {/* Avatar & User Details */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#111827',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 600, color: '#fff',
              }}>
                JS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>John Smith</span>
                <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 500 }}>Dealer Admin</span>
              </div>
              <ChevronDown size={14} style={{ color: '#6b7280', marginLeft: 4 }} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '28px 24px',
          background: 'var(--portal-bg)',
        }}>
          <Outlet />
        </main>
      </div>

      {/* Responsive + hover CSS */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-sidebar { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          .mobile-sidebar  { display: none !important; }
        }
        .sidebar-nav-link:hover {
          background: rgba(255,255,255,0.07) !important;
          color: #e2e8f0 !important;
        }
        .mobile-close-btn { display: block !important; }
        @media (min-width: 768px) {
          .mobile-close-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
}
