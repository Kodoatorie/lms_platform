'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import apiClient from '../../../../../../lib/api/client';

export default function LessonPage({ params }: { params: Promise<{ id: string, lessonId: string }> }) {
  const unwrappedParams = use(params);
  const courseId = parseInt(unwrappedParams.id, 10);
  const currentLessonId = parseInt(unwrappedParams.lessonId, 10);

  const [activeTab, setActiveTab] = useState<'content' | 'assignments'>('content');
  const [curriculum, setCurriculum] = useState<any[]>([]);
  const [lesson, setLesson] = useState<any>(null);
  const [proctoringSession, setProctoringSession] = useState<any>(null);
  const [isProctoringLoading, setIsProctoringLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real content
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch curriculum for sidebar and current lesson details
        const [curriculumRes, lessonRes] = await Promise.all([
          apiClient.get(`/courses/${courseId}/curriculum`),
          apiClient.get(`/lessons/${currentLessonId}`)
        ]);
        setCurriculum(curriculumRes.data);
        setLesson(lessonRes.data);
      } catch (err) {
        console.error('Failed to load lesson data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [courseId, currentLessonId]);

  const startProctoring = async () => {
    setIsProctoringLoading(true);
    try {
      const { data } = await apiClient.post('/proctoring/sessions', { courseId: 1 });
      setProctoringSession(data);
    } catch (err) {
      console.error('Failed to start proctoring', err);
    } finally {
      setIsProctoringLoading(false);
    }
  };

  const endProctoring = async () => {
    if (!proctoringSession) return;
    try {
      await apiClient.post(`/proctoring/sessions/${proctoringSession.id}/end`);
      setProctoringSession(null);
    } catch (err) {
      console.error('Failed to end proctoring', err);
    }
  };

  const [isCompleting, setIsCompleting] = useState(false);
  const handleCompleteLesson = async () => {
    setIsCompleting(true);
    try {
      const res = await apiClient.post(`/lessons/${currentLessonId}/complete`);
      alert('Lesson marked as complete!');
      // Check if certificate was generated indirectly by course progress being 100%
      // A more robust way would be listening to websockets, but for now we just alert.
      if (res.data?.progressPercent === 100) {
        alert('Congratulations! You completed the course. Your certificate is being generated.');
      }
      // Re-fetch curriculum to update sidebar states
      const { data } = await apiClient.get(`/courses/${courseId}/curriculum`);
      setCurriculum(data);
    } catch (err: any) {
      alert('Failed to complete lesson: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsCompleting(false);
    }
  };

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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {curriculum.map((mod: any) => (
            <div key={mod.module_id}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {mod.module_title}
              </h3>
              <div className="space-y-1">
                {mod.lessons.map((l: any, idx: number) => {
                  const isActive = l.id === currentLessonId;
                  const isCompleted = false; // TODO: Check actual completion status when enrollment stats are integrated
                  return (
                    <Link
                      key={l.id}
                      href={`/dashboard/courses/${courseId}/lessons/${l.id}`}
                      className={`w-full flex items-center text-left px-3 py-3 rounded-lg text-sm transition-colors ${isActive
                        ? 'bg-indigo-50 text-indigo-700 '
                        : 'text-slate-700 hover:bg-slate-100 :bg-slate-800'
                        }`}
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${isCompleted
                        ? 'bg-green-100 text-green-600 '
                        : 'bg-slate-100 text-slate-400 '
                        }`}>
                        {isCompleted ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-xs font-medium">{idx + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">{l.title}</p>
                        <p className="text-xs opacity-70 flex items-center mt-0.5">
                          {l.content_type === 'video' && (
                            <svg className="w-3 h-3 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {l.content_type === 'text' && (
                            <svg className="w-3 h-3 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          )}
                          <span className="capitalize">{l.content_type}</span>
                        </p>
                      </div>
                    </Link>
                  );
                })}
                {mod.lessons.length === 0 && <p className="text-xs text-slate-500 italic px-3">No lessons</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex items-center justify-center h-full">
            <div className="animate-pulse space-y-4 w-full max-w-3xl">
              <div className="h-8 bg-slate-200 rounded w-1/2"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
          </div>
        ) : !lesson ? (
          <div className="p-8 flex items-center justify-center h-full text-slate-500">
            Lesson not found
          </div>
        ) : (
          <>
            <div className="bg-white border-b border-slate-200 p-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 ">{lesson.title}</h1>
                <button 
                  onClick={handleCompleteLesson} 
                  disabled={isCompleting}
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  {isCompleting ? 'Marking...' : 'Mark Complete'}
                </button>
              </div>

              <div className="mt-6 flex border-b border-slate-200 ">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`pb-4 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'content'
                    ? 'border-indigo-500 text-indigo-600 '
                    : 'border-transparent text-slate-500 hover:text-slate-700 :text-slate-300'
                    }`}
                >
                  Lesson Content
                </button>
                <button
                  onClick={() => setActiveTab('assignments')}
                  className={`pb-4 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'assignments'
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
                      {lesson.content || 'No content provided for this lesson.'}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-8 shadow-sm ring-1 ring-slate-200 ">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Practice Task</h3>
                      {proctoringSession ? (
                        <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200 text-sm font-medium">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          <span>Proctoring Active</span>
                          <button onClick={endProctoring} className="ml-2 text-xs underline hover:text-green-800">End</button>
                        </div>
                      ) : (
                        <button
                          onClick={startProctoring}
                          disabled={isProctoringLoading}
                          className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-100 transition-colors"
                        >
                          {isProctoringLoading ? 'Starting...' : 'Start Proctored Mode'}
                        </button>
                      )}
                    </div>

                    <p className="text-slate-600 mb-6">
                      Please submit your assignment for "{lesson.title}".
                      {proctoringSession && (
                        <span className="block mt-2 text-sm text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                          👁️ Your webcam and screen are being monitored for academic integrity.
                        </span>
                      )}
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
          </>
        )}
      </div>
    </div>
  );
}
