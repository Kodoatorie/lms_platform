'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { loginUser, clearError } from '../../../store/auth/authSlice';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { APP_NAME } from '../../../lib/constants';

export default function LoginPage() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const dispatch = useAppDispatch();
 const { isLoading, error } = useAppSelector((state) => state.auth);
 const router = useRouter();

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (error) dispatch(clearError());

 const resultAction = await dispatch(loginUser({ email, password }));
 if (loginUser.fulfilled.match(resultAction)) {
 router.push('/dashboard');
 }
 };

 return (
 <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">

 {/* Decorative background blobs */}
 <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
 <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none" />

 <div className="w-full max-w-md space-y-8 z-10 relative bg-white/60 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20 ">
 <div>
 <h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-slate-900 ">
 Welcome to {APP_NAME}
 </h2>
 <p className="mt-2 text-center text-sm text-slate-600 ">
 Sign in to your account
 </p>
 </div>

 <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
 {error && (
 <div className="rounded-md bg-red-50 p-4 border border-red-200 ">
 <div className="text-sm text-red-700 ">{error}</div>
 </div>
 )}
 <div className="space-y-4">
 <Input
 id="email"
 name="email"
 type="email"
 autoComplete="email"
 required
 label="Email address"
 placeholder="you@example.com"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 />
 <Input
 id="password"
 name="password"
 type="password"
 autoComplete="current-password"
 required
 label="Password"
 placeholder="••••••••"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 />
 </div>

 <div className="flex items-center justify-between">
 <div className="flex items-center">
 <input
 id="remember-me"
 name="remember-me"
 type="checkbox"
 className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 :bg-indigo-500"
 />
 <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 ">
 Remember me
 </label>
 </div>

 <div className="text-sm">
 <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 :text-indigo-300 transition-colors">
 Forgot your password?
 </a>
 </div>
 </div>

 <div>
 <Button
 type="submit"
 className="w-full"
 size="lg"
 isLoading={isLoading}
 >
 Sign in
 </Button>
 </div>
 </form>

 <p className="text-center text-sm text-slate-600 ">
 Don't have an account?{' '}
 <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 :text-indigo-300 transition-colors">
 Register here
 </a>
 </p>
 </div>
 </div>
 );
}
