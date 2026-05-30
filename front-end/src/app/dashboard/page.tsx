'use client';

import { useAppSelector } from '../../store/hooks';

export default function DashboardPage() {
 const { user } = useAppSelector((state) => state.auth);

 return (
 <div className="space-y-6">
 <header>
 <h1 className="text-3xl font-bold tracking-tight text-slate-900 ">
 Dashboard
 </h1>
 <p className="mt-2 text-sm text-slate-600 ">
 Welcome back! Here's what's happening with your courses today.
 </p>
 </header>

 {/* Stats Cards */}
 {user?.role === 'teacher' ? (
 <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
 {/* Teacher Card 1 */}
 <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
 <dt>
 <div className="absolute rounded-xl bg-indigo-500/10 p-3">
 <svg className="h-6 w-6 text-indigo-600 " fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
 </svg>
 </div>
 <p className="ml-16 truncate text-sm font-medium text-slate-500 ">Total Students</p>
 </dt>
 <dd className="ml-16 flex items-baseline pb-1">
 <p className="text-2xl font-semibold text-slate-900 ">24</p>
 </dd>
 </div>

 {/* Teacher Card 2 */}
 <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
 <dt>
 <div className="absolute rounded-xl bg-green-500/10 p-3">
 <svg className="h-6 w-6 text-green-600 " fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 </div>
 <p className="ml-16 truncate text-sm font-medium text-slate-500 ">Active Courses</p>
 </dt>
 <dd className="ml-16 flex items-baseline pb-1">
 <p className="text-2xl font-semibold text-slate-900 ">3</p>
 </dd>
 </div>

 {/* Teacher Card 3 */}
 <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
 <dt>
 <div className="absolute rounded-xl bg-purple-500/10 p-3">
 <svg className="h-6 w-6 text-purple-600 " fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
 </svg>
 </div>
 <p className="ml-16 truncate text-sm font-medium text-slate-500 ">Avg Completion Rate</p>
 </dt>
 <dd className="ml-16 flex items-baseline pb-1">
 <p className="text-2xl font-semibold text-slate-900 ">68%</p>
 </dd>
 </div>
 </div>
 ) : (
 <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
 {/* Card 1 */}
 <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
 <dt>
 <div className="absolute rounded-xl bg-indigo-500/10 p-3">
 <svg className="h-6 w-6 text-indigo-600 " fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
 </svg>
 </div>
 <p className="ml-16 truncate text-sm font-medium text-slate-500 ">Total Courses</p>
 </dt>
 <dd className="ml-16 flex items-baseline pb-1">
 <p className="text-2xl font-semibold text-slate-900 ">12</p>
 </dd>
 </div>

 {/* Card 2 */}
 <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
 <dt>
 <div className="absolute rounded-xl bg-green-500/10 p-3">
 <svg className="h-6 w-6 text-green-600 " fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 </div>
 <p className="ml-16 truncate text-sm font-medium text-slate-500 ">Completed</p>
 </dt>
 <dd className="ml-16 flex items-baseline pb-1">
 <p className="text-2xl font-semibold text-slate-900 ">4</p>
 </dd>
 </div>

 {/* Card 3 */}
 <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
 <dt>
 <div className="absolute rounded-xl bg-purple-500/10 p-3">
 <svg className="h-6 w-6 text-purple-600 " fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
 </svg>
 </div>
 <p className="ml-16 truncate text-sm font-medium text-slate-500 ">Average Score</p>
 </dt>
 <dd className="ml-16 flex items-baseline pb-1">
 <p className="text-2xl font-semibold text-slate-900 ">92%</p>
 </dd>
 </div>
 </div>
 )}

 {/* Recent Activity or Courses snippet */}
 <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 ">
 <h2 className="text-lg font-semibold text-slate-900 mb-4">Continue Learning</h2>
 <div className="h-48 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-500 ">
 Course progress components will go here.
 </div>
 </div>
 </div>
 );
}
