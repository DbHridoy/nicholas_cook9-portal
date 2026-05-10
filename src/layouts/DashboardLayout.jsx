import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, FileText, LogOut, User,
  Menu, TrendingUp, Package, MessageSquare, X, ChevronRight,
  FileCheck,
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
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 800, color: '#fff',
            boxShadow: '0 4px 14px rgba(124,58,237,0.4)',
          }}>N</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.01em' }}>
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

      {/* Role Badge */}
      <div style={{ padding: '16px 16px 8px' }}>
        <div style={{
          background: userRole === 'admin'
            ? 'rgba(124,58,237,0.12)'
            : 'rgba(59,130,246,0.12)',
          border: `1px solid ${userRole === 'admin' ? 'rgba(124,58,237,0.25)' : 'rgba(59,130,246,0.25)'}`,
          borderRadius: 8,
          padding: '8px 12px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: userRole === 'admin' ? '#9d5cf6' : '#60a5fa',
          }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: userRole === 'admin' ? '#9d5cf6' : '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {userRole === 'admin' ? 'Administrator' : 'Dealer Account'}
          </span>
        </div>
      </div>

      {/* Nav label */}
      <div style={{ padding: '8px 20px 4px' }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Navigation
        </span>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '4px 12px', overflowY: 'auto' }}>
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
              borderRadius: 10,
              marginBottom: 2,
              fontSize: 14,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#f1f5f9' : '#64748b',
              textDecoration: 'none',
              background: isActive
                ? 'linear-gradient(90deg, rgba(124,58,237,0.28) 0%, rgba(59,130,246,0.12) 100%)'
                : 'transparent',
              borderLeft: isActive ? '2px solid #7c3aed' : '2px solid transparent',
              transition: 'all 0.2s ease',
              position: 'relative',
            })}
            className="sidebar-nav-link"
          >
            {({ isActive }) => (
              <>
                <item.icon size={17} style={{ color: isActive ? '#9d5cf6' : '#475569', flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{item.name}</span>
                {isActive && <ChevronRight size={14} style={{ color: '#7c3aed', opacity: 0.7 }} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 10,
          marginBottom: 8,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {userEmail ? userEmail[0].toUpperCase() : 'U'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userEmail}
            </div>
            <div style={{ fontSize: 10, color: '#475569', textTransform: 'capitalize' }}>{userRole}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '9px 14px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.15)',
            borderRadius: 9,
            color: '#f87171',
            fontSize: 13, fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
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
        width: 240,
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
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(2px)',
            zIndex: 40,
          }}
        />
      )}
      <aside style={{
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        width: 240,
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
        {/* Header */}
        <header style={{
          height: 60,
          background: 'rgba(14,14,36,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}>
          <button
            onClick={() => setMobileOpen(true)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              padding: '6px 10px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            className="mobile-menu-btn"
          >
            <Menu size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Portal Label */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '5px 14px',
              background: userRole === 'admin'
                ? 'rgba(124,58,237,0.1)'
                : 'rgba(59,130,246,0.1)',
              border: `1px solid ${userRole === 'admin' ? 'rgba(124,58,237,0.2)' : 'rgba(59,130,246,0.2)'}`,
              borderRadius: 999,
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: userRole === 'admin' ? '#9d5cf6' : '#60a5fa',
                animation: 'pulse-glow 2.4s ease-in-out infinite',
              }} />
              <span style={{
                fontSize: 12, fontWeight: 600,
                color: userRole === 'admin' ? '#9d5cf6' : '#60a5fa',
                textTransform: 'capitalize',
              }}>
                {userRole} Portal
              </span>
            </div>

            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(124,58,237,0.35)',
            }}>
              {userEmail ? userEmail[0].toUpperCase() : 'U'}
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

      {/* Inline CSS for responsive sidebar */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-sidebar { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          .mobile-sidebar { display: none !important; }
        }
        .sidebar-nav-link:hover {
          background: rgba(124,58,237,0.1) !important;
          color: #e2e8f0 !important;
        }
      `}</style>
    </div>
  );
}
