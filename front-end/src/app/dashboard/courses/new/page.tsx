'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../../../store/hooks';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';

export default function CreateCoursePage() {
 const { user } = useAppSelector((state) => state.auth);
 const router = useRouter();
 const [title, setTitle] = useState('');
 const [description, setDescription] = useState('');
 const [isSubmitting, setIsSubmitting] = useState(false);

 if (user?.role !== 'teacher') {
 return (
 <div className="text-center py-12">
 <h2 className="text-2xl font-bold text-red-600 ">Access Denied</h2>
 <p className="mt-2 text-slate-600 ">
 Only teachers can create new courses.
 </p>
 </div>
 );
 }

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setIsSubmitting(true);
 // In a real app, this would dispatch a Redux action to create the course
 setTimeout(() => {
 setIsSubmitting(false);
 router.push('/dashboard/courses');
 }, 1000);
 };

 return (
 <div className="max-w-3xl space-y-8">
 <header>
 <h1 className="text-3xl font-bold tracking-tight text-slate-900 ">
 Create New Course
 </h1>
 <p className="mt-2 text-sm text-slate-600 ">
 Fill in the details below to start building your new course. You can add modules and lessons later.
 </p>
 </header>

 <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-slate-200 sm:rounded-2xl p-6 sm:p-8 space-y-6">
 <Input
 label="Course Title"
 type="text"
 placeholder="e.g. Introduction to Machine Learning"
 required
 value={title}
 onChange={(e) => setTitle(e.target.value)}
 />
 
 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1.5">
 Course Description
 </label>
 <textarea 
 required
 className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[150px]"
 placeholder="Describe what students will learn in this course..."
 value={description}
 onChange={(e) => setDescription(e.target.value)}
 />
 </div>

 <div className="pt-4 border-t border-slate-200 flex justify-end gap-4">
 <Button type="button" variant="ghost" onClick={() => router.push('/dashboard/courses')}>
 Cancel
 </Button>
 <Button type="submit" variant="primary" isLoading={isSubmitting}>
 Create Course
 </Button>
 </div>
 </form>
 </div>
 );
}
