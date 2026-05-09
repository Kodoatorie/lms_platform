import Link from 'next/link';
import { APP_NAME } from '../lib/constants';

export default function LandingPage() {
 return (
 <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
 
 {/* Decorative background blobs */}
 <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
 <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/20 blur-[120px] pointer-events-none" />

 <main className="z-10 text-center max-w-3xl space-y-8">
 <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 ">
 The future of learning with <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">{APP_NAME}</span>
 </h1>
 
 <p className="text-xl text-slate-600 max-w-2xl mx-auto">
 A premium, scalable Learning Management System designed to empower students and teachers with modern tools and analytics.
 </p>

 <div className="flex items-center justify-center gap-4 pt-4">
 <Link 
 href="/login"
 className="inline-flex h-12 items-center justify-center rounded-full bg-indigo-600 px-8 text-sm font-medium text-white shadow-lg transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 :ring-offset-slate-950"
 >
 Get Started
 </Link>
 <Link 
 href="/dashboard"
 className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-8 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 :bg-slate-800 :ring-offset-slate-950"
 >
 Go to Dashboard
 </Link>
 </div>
 </main>

 </div>
 );
}
