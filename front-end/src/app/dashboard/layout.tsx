'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchCurrentUser, logoutUser } from '../../store/auth/authSlice';
import { APP_NAME } from '../../lib/constants';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Basic auth check
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

  const studentNavItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Courses', href: '/dashboard/courses' },
    { name: 'Certificates', href: '/dashboard/certificates' },
    { name: 'Profile', href: '/dashboard/profile' },
  ];

  const teacherNavItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Manage Courses', href: '/dashboard/courses' },
    { name: 'Students & Analytics', href: '/dashboard/analytics' },
    { name: 'Profile', href: '/dashboard/profile' },
  ];

  const navItems = user?.role === 'teacher' ? teacherNavItems : studentNavItems;

  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated && !user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 ">
        <span className="font-bold text-xl text-indigo-600 ">{APP_NAME}</span>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-slate-500 hover:text-slate-700 :text-slate-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
 ${isSidebarOpen ? 'block' : 'hidden'} 
 md:block w-full md:w-64 bg-white border-r border-slate-200 
 flex-shrink-0 transition-all duration-300 ease-in-out relative z-10
 `}>
        <div className="h-full flex flex-col">
          <div className="p-6 hidden md:block">
            <span className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              {APP_NAME}
            </span>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`
 flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors
 ${pathname === item.href
                    ? 'bg-indigo-50 text-indigo-700 '
                    : 'text-slate-700 hover:bg-slate-100 :bg-slate-800'}
 `}
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-200 ">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-700 ">{user?.email}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 :bg-slate-800 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
