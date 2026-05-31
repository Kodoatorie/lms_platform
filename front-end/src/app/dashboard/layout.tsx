'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchCurrentUser, logoutUser } from '../../store/auth/authSlice';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import apiClient from '../../lib/api/client';
import { APP_NAME } from '../../lib/constants';

interface Notification {
  id: number;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/notifications');
      setNotifications(data);
    } catch {
      // Notifications are non-critical — fail silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll every 30s for new notifications
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllRead = async () => {
    try {
      await apiClient.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {/* silent */}
  };

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen((o) => !o); if (!open) fetchNotifications(); }}
        className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-80 bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <h3 className="font-semibold text-sm text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-indigo-600 hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 mx-auto" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">No notifications yet</div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className={`px-4 py-3 text-sm ${n.is_read ? 'opacity-60' : 'bg-indigo-50/50'}`}>
                  <p className="text-slate-800">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(n.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      router.push('/login');
    } else if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [user, dispatch, router]);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push('/login');
  };

  const studentNav = [
    { name: 'Dashboard',       href: '/dashboard',                icon: '🏠' },
    { name: 'Courses',         href: '/dashboard/courses',        icon: '📚' },
    { name: 'My Grades',       href: '/dashboard/grades',         icon: '🎯' },
    { name: 'Notifications',   href: '/dashboard/notifications',  icon: '🔔' },
    { name: 'Certificates',    href: '/dashboard/certificates',   icon: '🏅' },
    { name: 'Reviews',         href: '/dashboard/reviews',        icon: '⭐' },
    { name: 'Profile',         href: '/dashboard/profile',        icon: '👤' },
  ];

  const teacherNav = [
    { name: 'Dashboard',          href: '/dashboard',             icon: '🏠' },
    { name: 'Manage Courses',     href: '/dashboard/courses',     icon: '📚' },
    { name: 'Grading',            href: '/dashboard/grading',     icon: '✏️' },
    { name: 'Students',           href: '/dashboard/students',    icon: '👥' },
    { name: 'Analytics',          href: '/dashboard/analytics',   icon: '📊' },
    { name: 'Reviews',            href: '/dashboard/reviews',     icon: '⭐' },
    { name: 'Profile',            href: '/dashboard/profile',     icon: '👤' },
  ];

  const navItems = user?.role === 'teacher' ? teacherNav : studentNav;

  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!isAuthenticated && !user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">

      {/* ── Mobile header ── */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-30">
        <span className="font-bold text-xl text-indigo-600">{APP_NAME}</span>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Sidebar — mobile overlay + desktop fixed ── */}
      {/* Overlay backdrop (mobile only) */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed md:relative top-0 left-0 h-full md:h-auto
        w-64 bg-white border-r border-slate-200 flex-shrink-0
        flex flex-col z-30 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 hidden md:flex items-center justify-between">
          <span className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            {APP_NAME}
          </span>
          <NotificationBell />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center mb-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-2 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{user?.email}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content — wrapped in ErrorBoundary ── */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="p-4 md:p-8">
          <ErrorBoundary context="Dashboard">
            {children}
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}