'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock lesson data (in real app, this comes from Redux/API)
const MOCK_LESSONS = [
 { id: 1, title: 'Introduction to the Course', type: 'video', isCompleted: true },
 { id: 2, title: 'Setting Up Your Environment', type: 'text', isCompleted: false },
 { id: 3, title: 'First Practice Exercise', type: 'practice', isCompleted: false },
 { id: 4, title: 'Core Concepts Part 1', type: 'video', isCompleted: false },
];

export default function LessonPage() {
 const [activeTab, setActiveTab] = useState<'content' | 'assignments'>('content');
 const [lessonContent, setLessonContent] = useState('Loading...');

 // Mock fetching content
 useEffect(() => {
 const timer = setTimeout(() => {
 setLessonContent('This is the detailed text or video content for the lesson. It supports Markdown and embedded YouTube links as specified in the backend requirements.');
 }, 500);
 return () => clearTimeout(timer);
 }, []);

 return (
 <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col md:flex-row -m-4 md:-m-8">
 {/* Sidebar with lesson list */}
 <div className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
 <div className="p-4 border-b border-slate-200 flex items-center justify-between">
 <Link href="/dashboard/courses/1" className="text-sm font-medium text-slate-500 hover:text-slate-900 :text-white transition-colors flex items-center">
 <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
 </svg>
 Back to Course
 </Link>
 </div>
 <div className="flex-1 overflow-y-auto p-4 space-y-2">
 <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Module 1: Basics</h3>
 
 {MOCK_LESSONS.map((lesson, idx) => {
 const isActive = idx === 1; // mock active state
 return (
 <button
 key={lesson.id}
 className={`w-full flex items-center text-left px-3 py-3 rounded-lg text-sm transition-colors ${
 isActive 
 ? 'bg-indigo-50 text-indigo-700 ' 
 : 'text-slate-700 hover:bg-slate-100 :bg-slate-800'
 }`}
 >
 <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
 lesson.isCompleted 
 ? 'bg-green-100 text-green-600 ' 
 : 'bg-slate-100 text-slate-400 '
 }`}>
 {lesson.isCompleted ? (
 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
 </svg>
 ) : (
 <span className="text-xs font-medium">{idx + 1}</span>
 )}
 </div>
 <div className="flex-1 min-w-0">
 <p className="truncate font-medium">{lesson.title}</p>
 <p className="text-xs opacity-70 flex items-center mt-0.5">
 {lesson.type === 'video' && (
 <svg className="w-3 h-3 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 )}
 {lesson.type === 'text' && (
 <svg className="w-3 h-3 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
 </svg>
 )}
 {lesson.type === 'practice' && (
 <svg className="w-3 h-3 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
 </svg>
 )}
 <span className="capitalize">{lesson.type}</span>
 </p>
 </div>
 </button>
 );
 })}
 </div>
 </div>

 {/* Main Content Area */}
 <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
 <div className="bg-white border-b border-slate-200 p-6 flex-shrink-0">
 <div className="flex items-center justify-between">
 <h1 className="text-2xl font-bold text-slate-900 ">Setting Up Your Environment</h1>
 <button className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
 Mark Complete
 </button>
 </div>
 
 <div className="mt-6 flex border-b border-slate-200 ">
 <button
 onClick={() => setActiveTab('content')}
 className={`pb-4 px-4 text-sm font-medium transition-colors border-b-2 ${
 activeTab === 'content' 
 ? 'border-indigo-500 text-indigo-600 ' 
 : 'border-transparent text-slate-500 hover:text-slate-700 :text-slate-300'
 }`}
 >
 Lesson Content
 </button>
 <button
 onClick={() => setActiveTab('assignments')}
 className={`pb-4 px-4 text-sm font-medium transition-colors border-b-2 ${
 activeTab === 'assignments' 
 ? 'border-indigo-500 text-indigo-600 ' 
 : 'border-transparent text-slate-500 hover:text-slate-700 :text-slate-300'
 }`}
 >
 Assignments (1)
 </button>
 </div>
 </div>

 <div className="flex-1 overflow-y-auto p-6 md:p-10">
 <div className="mx-auto max-w-3xl">
 {activeTab === 'content' ? (
 <div className="prose max-w-none">
 <div className="bg-white rounded-xl p-8 shadow-sm ring-1 ring-slate-200 ">
 {lessonContent}
 </div>
 </div>
 ) : (
 <div className="bg-white rounded-xl p-8 shadow-sm ring-1 ring-slate-200 ">
 <h3 className="text-lg font-bold text-slate-900 mb-2">Practice Task: Install Node.js</h3>
 <p className="text-slate-600 mb-6">
 Please install Node.js version 18+ and submit a screenshot of your terminal running `node -v`.
 </p>
 <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 ">
 <label className="block text-sm font-medium text-slate-700 mb-2">
 Your Submission
 </label>
 <textarea 
 className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[150px] mb-4"
 placeholder="Enter your text answer or link here..."
 />
 <button className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
 Submit Answer
 </button>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 );
}
