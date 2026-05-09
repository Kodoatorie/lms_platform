'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchCourses } from '../../../store/courses/coursesSlice';
import { Button } from '../../../components/ui/button';

export default function CoursesPage() {
 const dispatch = useAppDispatch();
 const { items, isLoading, error } = useAppSelector((state) => state.courses);
 const { user } = useAppSelector((state) => state.auth);

 useEffect(() => {
 dispatch(fetchCourses());
 }, [dispatch]);

 const isTeacher = user?.role === 'teacher';

 return (
 <div className="space-y-6">
 <header className="flex items-center justify-between">
 <div>
 <h1 className="text-3xl font-bold tracking-tight text-slate-900 ">
 Courses
 </h1>
 <p className="mt-2 text-sm text-slate-600 ">
 {isTeacher ? 'Manage your courses and curriculum.' : 'Explore available courses to enhance your skills.'}
 </p>
 </div>
 {isTeacher && (
 <Button variant="primary" onClick={() => window.location.href = '/dashboard/courses/new'}>
 + Create Course
 </Button>
 )}
 </header>

 {error && (
 <div className="rounded-md bg-red-50 p-4 border border-red-200 ">
 <p className="text-sm text-red-700 ">{error}</p>
 </div>
 )}

 {isLoading ? (
 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
 {[1, 2, 3, 4, 5, 6].map((i) => (
 <div key={i} className="animate-pulse flex flex-col rounded-2xl bg-white overflow-hidden ring-1 ring-slate-200 ">
 <div className="h-40 bg-slate-200 " />
 <div className="flex-1 p-6 space-y-4">
 <div className="h-4 bg-slate-200 rounded w-3/4" />
 <div className="h-4 bg-slate-200 rounded w-1/2" />
 <div className="h-10 bg-slate-200 rounded mt-4" />
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
 {items.map((course) => (
 <Link 
 key={course.id} 
 href={`/dashboard/courses/${course.id}`}
 className="group flex flex-col rounded-2xl bg-white overflow-hidden ring-1 ring-slate-200 shadow-sm transition-all hover:shadow-md hover:ring-indigo-500 :ring-indigo-400"
 >
 <div className="relative h-40 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-6 text-center">
 {/* Fallback pattern for course image */}
 <h3 className="text-xl font-bold text-white line-clamp-2 drop-shadow-md">
 {course.title}
 </h3>
 </div>
 <div className="flex flex-1 flex-col justify-between p-6">
 <div>
 <p className="text-sm text-slate-500 mb-2">
 Added {new Date(course.created_at).toLocaleDateString()}
 </p>
 <p className="text-sm text-slate-700 line-clamp-3">
 {course.description || "No description provided."}
 </p>
 </div>
 <div className="mt-6 flex items-center justify-between">
 <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 ">
 {isTeacher ? 'Manage' : 'View Course'}
 </span>
 <svg className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 :text-indigo-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
 <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
 </svg>
 </div>
 </div>
 </Link>
 ))}
 
 {items.length === 0 && !isLoading && (
 <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-300 rounded-2xl">
 <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
 </svg>
 <h3 className="mt-2 text-sm font-semibold text-slate-900 ">No courses</h3>
 <p className="mt-1 text-sm text-slate-500 ">
 {isTeacher ? 'Get started by creating a new course.' : 'No courses are available at the moment.'}
 </p>
 {isTeacher && (
 <div className="mt-6">
 <Button variant="outline" onClick={() => window.location.href = '/dashboard/courses/new'}>
 + Create Course
 </Button>
 </div>
 )}
 </div>
 )}
 </div>
 )}
 </div>
 );
}
