'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useAppSelector } from '../../../../../../store/hooks';
import { ErrorBoundary } from '../../../../../../components/ErrorBoundary';
import apiClient from '../../../../../../lib/api/client';

type LessonError = { status: 403 | 404 | 500 | null; message: string };

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

function LessonErrorState({ error, courseId }: { error: LessonError; courseId: number }) {
  if (error.status === 403) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        <div className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-amber-200 max-w-md w-full text-center space-y-4">
          <div className="text-5xl">🔒</div>
          <h2 className="text-xl font-bold text-slate-900">Lesson not available yet</h2>
          <p className="text-sm text-slate-500">
            This lesson hasn't opened yet. Check back when the access date arrives.
          </p>
          <Link
            href={`/dashboard/courses/${courseId}`}
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:underline"
          >
            ← Back to course
          </Link>
        </div>
      </div>
    );
  }

  if (error.status === 404) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        <div className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-slate-200 max-w-md w-full text-center space-y-4">
          <div className="text-5xl">📭</div>
          <h2 className="text-xl font-bold text-slate-900">Lesson not found</h2>
          <p className="text-sm text-slate-500">
            This lesson may have been removed by the teacher.
          </p>
          <Link
            href={`/dashboard/courses/${courseId}`}
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:underline"
          >
            ← Back to course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full p-10">
      <div className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-red-200 max-w-md w-full text-center space-y-4">
        <div className="text-5xl">⚠️</div>
        <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
        <p className="text-sm text-slate-500">{error.message}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500"
          >
            Retry
          </button>
          <Link
            href={`/dashboard/courses/${courseId}`}
            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200"
          >
            Back to course
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LessonPage({ params }: { params: Promise<{ id: string; lessonId: string }> }) {
  const { id, lessonId: lessonIdStr } = use(params);
  const courseId = parseInt(id, 10);
  const currentLessonId = parseInt(lessonIdStr, 10);

  const { user } = useAppSelector((s) => s.auth);
  const isTeacher = user?.role === 'teacher';

  const [curriculum, setCurriculum] = useState<any[]>([]);
  const [lesson, setLesson] = useState<any>(null);
  const [lessonProgress, setLessonProgress] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lessonError, setLessonError] = useState<LessonError | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const isCompleted = !!lessonProgress[currentLessonId];

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setLessonError(null);

      try {
        // Fetch curriculum (always works) and lesson detail separately
        // so a locked lesson doesn't kill the sidebar
        const curriculumRes = await apiClient.get(`/courses/${courseId}/curriculum`);
        if (!cancelled) setCurriculum(curriculumRes.data);
      } catch {
        if (!cancelled) setCurriculum([]);
      }

      try {
        const lessonRes = await apiClient.get(`/lessons/${currentLessonId}`);
        if (!cancelled) setLesson(lessonRes.data);
      } catch (err: any) {
        if (cancelled) return;
        const status = err.response?.status;
        if (status === 403) {
          setLessonError({ status: 403, message: 'This lesson is not available yet.' });
        } else if (status === 404) {
          setLessonError({ status: 404, message: 'Lesson not found.' });
        } else {
          setLessonError({ status: 500, message: err.response?.data?.message || 'Failed to load lesson.' });
        }
      }

      if (user?.role === 'student') {
        try {
          const { data } = await apiClient.get(`/courses/${courseId}/progress`);
          if (!cancelled) {
            const map: Record<number, boolean> = {};
            (data.completedLessons || []).forEach((lid: number) => { map[lid] = true; });
            setLessonProgress(map);
          }
        } catch {/* non-critical */}
      }

      if (!cancelled) setIsLoading(false);
    };

    load();
    return () => { cancelled = true; };
  }, [courseId, currentLessonId, user]);

  const handleCompleteLesson = async () => {
    if (isCompleted || isCompleting) return;
    setIsCompleting(true);
    try {
      await apiClient.post(`/lessons/${currentLessonId}/complete`);
      setLessonProgress((prev) => ({ ...prev, [currentLessonId]: true }));
      const { data } = await apiClient.get(`/courses/${courseId}/curriculum`);
      setCurriculum(data);
    } catch (err: any) {
      console.error('Mark complete failed:', err.response?.data?.message || err.message);
    } finally {
      setIsCompleting(false);
    }
  };

  const renderContent = () => {
    if (!lesson) return null;
    if (lesson.content_type === 'video') {
      const videoId = getYouTubeId(lesson.content || '');
      if (!videoId) {
        return (
          <div className="bg-white rounded-xl p-8 ring-1 ring-slate-200 text-center text-slate-500">
            <p className="font-medium">Invalid YouTube URL</p>
            {lesson.content && (
              <a href={lesson.content} target="_blank" rel="noopener noreferrer"
                className="mt-2 inline-block text-indigo-600 hover:underline text-sm">{lesson.content}</a>
            )}
          </div>
        );
      }
      return (
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-4">
            <a href={lesson.content} target="_blank" rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-indigo-500 transition-colors">{lesson.content}</a>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl p-8 shadow-sm ring-1 ring-slate-200">
        {lesson.author_name && (
          <p className="text-xs text-slate-400 mb-5 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Author: <span className="font-medium text-slate-600">{lesson.author_name}</span>
          </p>
        )}
        <div className="prose max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
          {lesson.content || <span className="italic text-slate-400">No content provided for this lesson.</span>}
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary context="Lesson">
      <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col md:flex-row -m-4 md:-m-8">
        {/* ── Sidebar ── */}
        <div className="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-slate-200">
            <Link href={`/dashboard/courses/${courseId}`}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Course
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {curriculum.map((mod: any) => (
              <div key={mod.module_id}>
                <div className="flex items-center gap-1 mb-2">
                  {mod.is_final && <span className="text-xs">🏁</span>}
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {mod.module_title}
                  </h3>
                </div>
                <div className="space-y-1">
                  {mod.lessons.map((l: any, idx: number) => {
                    const isActive = l.id === currentLessonId;
                    const isDone = !!lessonProgress[l.id];
                    const isLocked = l.available_from && new Date(l.available_from) > new Date();

                    if (isLocked && !isTeacher) {
                      return (
                        <div key={l.id}
                          className="flex items-center px-3 py-2.5 rounded-lg opacity-40 cursor-not-allowed">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center mr-3 text-xs text-slate-400 flex-shrink-0">🔒</div>
                          <div className="min-w-0">
                            <p className="truncate text-slate-500 text-xs font-medium">{l.title}</p>
                            <p className="text-[10px] text-slate-400">
                              Opens {new Date(l.available_from).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <Link key={l.id}
                        href={`/dashboard/courses/${courseId}/lessons/${l.id}`}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs font-semibold flex-shrink-0 ${
                          isDone ? 'bg-green-100 text-green-600'
                          : isActive ? 'bg-indigo-200 text-indigo-700'
                          : 'bg-slate-100 text-slate-500'
                        }`}>
                          {isDone ? (
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd" />
                            </svg>
                          ) : idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`truncate font-medium text-xs ${isDone ? 'line-through text-slate-400' : ''}`}>
                            {l.title}
                          </p>
                          <p className="text-[10px] opacity-60 capitalize mt-0.5">{l.content_type}</p>
                        </div>
                      </Link>
                    );
                  })}
                  {mod.lessons.length === 0 && (
                    <p className="text-xs text-slate-400 italic px-3">No lessons</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main ── */}
        <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse space-y-4 w-full max-w-3xl p-10">
                <div className="h-8 bg-slate-200 rounded w-1/2" />
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-5/6" />
                <div className="h-64 bg-slate-200 rounded-xl" />
              </div>
            </div>
          ) : lessonError ? (
            <LessonErrorState error={lessonError} courseId={courseId} />
          ) : !lesson ? (
            <LessonErrorState error={{ status: 404, message: 'Lesson not found.' }} courseId={courseId} />
          ) : (
            <>
              {/* Header */}
              <div className="bg-white border-b border-slate-200 px-6 py-5 flex-shrink-0">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <h1 className="text-2xl font-bold text-slate-900 truncate">{lesson.title}</h1>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span className="capitalize">{lesson.content_type} lesson</span>
                      {lesson.author_name && (
                        <>
                          <span>·</span>
                          <span>by <strong className="text-slate-700">{lesson.author_name}</strong></span>
                        </>
                      )}
                      {lesson.deadline && (
                        <>
                          <span>·</span>
                          <span className={new Date(lesson.deadline) < new Date() ? 'text-red-500' : 'text-amber-600'}>
                            Due: {new Date(lesson.deadline).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {!isTeacher && (
                    <button
                      onClick={handleCompleteLesson}
                      disabled={isCompleted || isCompleting}
                      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all flex-shrink-0 ${
                        isCompleted
                          ? 'bg-green-100 text-green-700 cursor-default ring-1 ring-green-200'
                          : isCompleting
                          ? 'bg-slate-100 text-slate-500 cursor-wait'
                          : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd" />
                          </svg>
                          Completed
                        </>
                      ) : isCompleting ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Marking…
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Mark Complete
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="mx-auto max-w-3xl">
                  {renderContent()}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}