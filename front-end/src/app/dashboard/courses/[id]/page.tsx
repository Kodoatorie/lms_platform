'use client';

import React, { useEffect, use } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { fetchCourseById, clearCurrentCourse } from '../../../../store/courses/coursesSlice';
import { Button } from '../../../../components/ui/button';

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
 const unwrappedParams = use(params);
 const courseId = parseInt(unwrappedParams.id, 10);
 const dispatch = useAppDispatch();
 const { currentCourse, isLoading, error } = useAppSelector((state) => state.courses);

 useEffect(() => {
 dispatch(fetchCourseById(courseId));
 return () => {
 dispatch(clearCurrentCourse());
 };
 }, [dispatch, courseId]);

 if (isLoading) {
 return (
 <div className="animate-pulse space-y-8">
 <div className="h-48 bg-slate-200 rounded-3xl" />
 <div className="h-8 w-1/3 bg-slate-200 rounded" />
 <div className="space-y-4">
 <div className="h-4 w-full bg-slate-200 rounded" />
 <div className="h-4 w-5/6 bg-slate-200 rounded" />
 <div className="h-4 w-4/6 bg-slate-200 rounded" />
 </div>
 </div>
 );
 }

 if (error || !currentCourse) {
 return (
 <div className="text-center py-12">
 <h3 className="text-xl font-bold text-slate-900 ">Failed to load course</h3>
 <p className="mt-2 text-slate-500 ">{error || 'Course not found'}</p>
 <Link href="/dashboard/courses" className="mt-4 inline-block text-indigo-600 hover:underline">
 &larr; Back to courses
 </Link>
 </div>
 );
 }

 return (
 <div className="space-y-8">
 {/* Course Header Banner */}
 <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-16 sm:px-12 sm:py-24 shadow-xl">
 <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-800/90 mix-blend-multiply" />
 
 <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
 <div className="max-w-2xl text-white">
 <Link href="/dashboard/courses" className="inline-flex items-center text-sm font-medium text-white/70 hover:text-white mb-6 transition-colors">
 <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
 </svg>
 Back to courses
 </Link>
 <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-4">
 {currentCourse.title}
 </h1>
 <p className="text-lg text-indigo-100">
 A comprehensive guide to mastering this subject.
 </p>
 </div>
 <div className="flex-shrink-0">
 <Button variant="secondary" size="lg" className="shadow-lg">
 Enroll Now
 </Button>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Main Content */}
 <div className="lg:col-span-2 space-y-8">
 <section className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-200 ">
 <h2 className="text-2xl font-bold text-slate-900 mb-4">About this course</h2>
 <div className="prose max-w-none text-slate-600 ">
 {currentCourse.description || 'No detailed description available.'}
 </div>
 </section>

 <section className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-200 ">
 <h2 className="text-2xl font-bold text-slate-900 mb-4">Curriculum</h2>
 <div className="space-y-4">
 {/* Mock Module */}
 <div className="border border-slate-200 rounded-xl overflow-hidden">
 <div className="bg-slate-50 p-4 font-semibold text-slate-900 flex justify-between items-center">
 <span>Module 1: Introduction</span>
 <span className="text-sm font-normal text-slate-500">2 lessons</span>
 </div>
 <div className="divide-y divide-slate-100 ">
 <Link href={`/dashboard/courses/${courseId}/lessons/1`} className="flex items-center justify-between p-4 hover:bg-slate-50 :bg-slate-800/50 transition-colors">
 <div className="flex items-center">
 <svg className="w-5 h-5 text-indigo-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 <span className="text-slate-700 ">1. Welcome to the course</span>
 </div>
 <span className="text-xs text-slate-500">05:00</span>
 </Link>
 <Link href={`/dashboard/courses/${courseId}/lessons/2`} className="flex items-center justify-between p-4 hover:bg-slate-50 :bg-slate-800/50 transition-colors">
 <div className="flex items-center">
 <svg className="w-5 h-5 text-indigo-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
 </svg>
 <span className="text-slate-700 ">2. Setup your environment</span>
 </div>
 <span className="text-xs text-slate-500">10:00</span>
 </Link>
 </div>
 </div>
 </div>
 </section>
 </div>

 {/* Sidebar / Meta Info */}
 <div className="space-y-6">
 <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-200 ">
 <h3 className="text-lg font-semibold text-slate-900 mb-4">Course details</h3>
 <ul className="space-y-4">
 <li className="flex items-center text-slate-600 ">
 <svg className="h-5 w-5 mr-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 Self-paced
 </li>
 <li className="flex items-center text-slate-600 ">
 <svg className="h-5 w-5 mr-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
 </svg>
 Certificate of completion
 </li>
 <li className="flex items-center text-slate-600 ">
 <svg className="h-5 w-5 mr-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
 </svg>
 Added {new Date(currentCourse.created_at).toLocaleDateString()}
 </li>
 </ul>
 </div>
 </div>
 </div>
 </div>
 );
}
