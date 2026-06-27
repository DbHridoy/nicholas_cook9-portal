import { useEffect, useMemo, useState } from 'react';
import { BellRing, CheckCheck, Filter, FileText, Search } from 'lucide-react';
import { api } from '../../lib/api';

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'claims', label: 'Claims' },
];

const formatRelativeTime = (value) => {
  if (!value) return '';

  const diffMs = Date.now() - new Date(value).getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;

  return new Date(value).toLocaleDateString();
};

const toNotificationView = (notification) => ({
  id: notification._id,
  title: notification.title,
  description: notification.message,
  category: notification.type === 'claim_created' ? 'claims' : 'system',
  timestamp: formatRelativeTime(notification.createdAt),
  unread: !notification.readAt,
  icon: notification.type === 'claim_created' ? FileText : BellRing,
});

const notifyUnreadCount = (notifications) => {
  window.dispatchEvent(new CustomEvent('notifications:updated', {
    detail: {
      unreadCount: notifications.filter((item) => item.unread).length,
    },
  }));
};

export default function Notifications() {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api.listNotifications()
      .then(({ notifications: data }) => {
        if (active) {
          const nextNotifications = data.map(toNotificationView);
          setNotifications(nextNotifications);
          notifyUnreadCount(nextNotifications);
        }
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load notifications.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const unreadCount = useMemo(() => notifications.filter((item) => item.unread).length, [notifications]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return notifications.filter((item) => {
      const matchTab = activeTab === 'all'
        || (activeTab === 'unread' && item.unread)
        || item.category === activeTab;
      const matchSearch = !q
        || item.title.toLowerCase().includes(q)
        || item.description.toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [activeTab, notifications, search]);

  const markAllRead = async () => {
    const previous = notifications;
    const nextNotifications = notifications.map((item) => ({ ...item, unread: false }));
    setNotifications(nextNotifications);
    notifyUnreadCount(nextNotifications);

    try {
      await api.markAllNotificationsRead();
    } catch (err) {
      setNotifications(previous);
      notifyUnreadCount(previous);
      setError(err instanceof Error ? err.message : 'Unable to mark notifications as read.');
    }
  };

  const markOneRead = async (id) => {
    const item = notifications.find((notification) => notification.id === id);
    if (!item?.unread) return;

    const previous = notifications;
    const nextNotifications = notifications.map((item) => (item.id === id ? { ...item, unread: false } : item));
    setNotifications(nextNotifications);
    notifyUnreadCount(nextNotifications);

    try {
      await api.markNotificationRead(id);
    } catch (err) {
      setNotifications(previous);
      notifyUnreadCount(previous);
      setError(err instanceof Error ? err.message : 'Unable to mark notification as read.');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-text-muted">Inbox</p>
          <h1 className="m-0 text-2xl font-extrabold text-text-primary">Notifications</h1>
          <p className="m-0 mt-1 text-[13px] text-text-muted">
            Track claims, security alerts, and portal activity in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          className="portal-btn-ghost flex items-center gap-2 px-4 py-2.5 text-[13px]"
          disabled={unreadCount === 0}
        >
          <CheckCheck size={15} />
          Mark all read
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="portal-card p-0 overflow-hidden">
          {error && (
            <div className="border-b border-red-600/20 bg-red-600/10 px-4.5 py-3 text-[13px] text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 border-b border-portal-border-sub px-4.5 py-3.5">
            <div className="relative flex-1">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notifications..."
                className="portal-input w-full py-2 pl-9 pr-3 text-[13px]"
              />
            </div>

            <button type="button" className="portal-btn-ghost flex items-center gap-2 px-3.5 py-2 text-[13px]">
              <Filter size={14} />
              Filter
            </button>
          </div>

          <div className="flex flex-wrap gap-2 px-4.5 py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? 'border-accent-blue/20 bg-accent-blue/10 text-accent-blue'
                    : 'border-slate-200 bg-white text-text-secondary hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="divide-y divide-portal-border-sub">
            {loading && (
              <div className="px-4.5 py-12 text-center text-sm text-text-muted">
                Loading notifications...
              </div>
            )}

            {!loading && filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => markOneRead(item.id)}
                  className={`flex w-full items-start gap-4 px-4.5 py-4 text-left transition hover:bg-slate-50 ${
                    item.unread ? 'bg-[rgba(37,99,235,0.04)]' : ''
                  }`}
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    item.category === 'security'
                      ? 'bg-red-100 text-red-600'
                      : item.category === 'claims'
                        ? 'bg-amber-100 text-amber-600'
                        : item.category === 'reports'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-blue-100 text-accent-blue'
                  }`}>
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="truncate text-sm font-bold text-text-primary">{item.title}</h2>
                          {item.unread && <span className="h-2 w-2 rounded-full bg-accent-blue" />}
                        </div>
                        <p className="mt-1 text-[13px] leading-snug text-text-secondary">{item.description}</p>
                      </div>
                      <span className="shrink-0 text-[11px] font-semibold text-text-muted">{item.timestamp}</span>
                    </div>
                  </div>
                </button>
              );
            })}

            {!loading && filtered.length === 0 && (
              <div className="px-4.5 py-12 text-center">
                <p className="m-0 text-sm font-semibold text-text-primary">No notifications found</p>
                <p className="m-0 mt-1 text-[13px] text-text-muted">Try a different search or tab.</p>
              </div>
            )}
          </div>
        </div>

        {/* <aside className="portal-card h-fit p-5">
          <p className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.08em] text-text-muted">Summary</p>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Unread</span>
              <span className="font-bold text-text-primary">{unreadCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Total</span>
              <span className="font-bold text-text-primary">{notifications.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Claims</span>
              <span className="font-bold text-text-primary">{notifications.filter((item) => item.category === 'claims').length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Security</span>
              <span className="font-bold text-text-primary">0</span>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-accent-blue/20 bg-accent-blue/10 p-3.5">
            <p className="m-0 text-[12px] font-semibold leading-snug text-accent-blue">
              Clicking a notification marks it as read for your account.
            </p>
          </div>
        </aside> */}
      </div>
    </div>
  );
}
