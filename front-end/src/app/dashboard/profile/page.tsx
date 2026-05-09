'use client';

import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

export default function ProfilePage() {
 const { user } = useAppSelector((state) => state.auth);

 if (!user) return null;

 return (
 <div className="max-w-4xl space-y-8">
 <header>
 <h1 className="text-3xl font-bold tracking-tight text-slate-900 ">
 Profile Settings
 </h1>
 <p className="mt-2 text-sm text-slate-600 ">
 Manage your account settings and preferences.
 </p>
 </header>

 <div className="bg-white shadow-sm ring-1 ring-slate-200 sm:rounded-2xl">
 <div className="px-4 py-6 sm:p-8">
 <div className="flex items-center gap-x-6 mb-8">
 <div className="h-24 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
 {user.email.charAt(0).toUpperCase()}
 </div>
 <div>
 <Button variant="outline" size="sm">Change avatar</Button>
 <p className="mt-2 text-xs leading-5 text-slate-500 ">
 JPG, GIF or PNG. 1MB max.
 </p>
 </div>
 </div>

 <form className="max-w-2xl space-y-6">
 <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
 <div className="sm:col-span-3">
 <Input
 label="Email address"
 type="email"
 value={user.email}
 disabled
 />
 </div>

 <div className="sm:col-span-3">
 <Input
 label="Role"
 type="text"
 value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
 disabled
 />
 </div>

 <div className="sm:col-span-full">
 <Input
 label="Full name"
 type="text"
 placeholder="e.g. Jane Doe"
 />
 </div>
 
 {user.role === 'teacher' && (
 <div className="sm:col-span-full">
 <label className="text-sm font-medium text-slate-700 block mb-1.5">
 Bio
 </label>
 <textarea 
 className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
 placeholder="Tell students about yourself..."
 />
 </div>
 )}
 </div>
 
 <div className="flex items-center gap-x-4 pt-4 border-t border-slate-200 ">
 <Button type="button" variant="primary">
 Save changes
 </Button>
 <Button type="button" variant="ghost">
 Cancel
 </Button>
 </div>
 </form>
 </div>
 </div>
 </div>
 );
}
