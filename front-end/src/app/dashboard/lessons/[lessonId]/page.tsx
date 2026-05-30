'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/src/store/hooks';
import apiClient from '@/src/lib/api/client';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';

interface Assignment {
  id: number;
  title: string;
  description?: string;
  max_score: number;
  due_date?: string;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function LessonPage({ params }: { params: Promise<{ id: string; lessonId: string }> }) {
  const unwrappedParams = use(params);
  const courseId = parseInt(unwrappedParams.id, 10);
  const currentLessonId = parseInt(unwrappedParams.lessonId, 10);
  const { user } = useAppSelector((state) => state.auth);
  const isTeacher = user?.role === 'teacher';

  const [activeTab, setActiveTab] = useState<'content' | 'assignments'>('content');
  const [curriculum, setCurriculum] = useState<any[]>([]);
  const [lesson, setLesson] = useState<any>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Student submission
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit assignment (teacher)
  const [editAssign, setEditAssign] = useState<Assignment | null>(null);
  const [editAssignTitle, setEditAssignTitle] = useState('');
  const [editAssignDesc, setEditAssignDesc] = useState('');
  const [editAssignScore, setEditAssignScore] = useState('');
  const [editAssignDue, setEditAssignDue] = useState('');
  const [isSavingAssign, setIsSavingAssign] = useState(false);

  // Mark complete
  const [isCompleting, setIsCompleting] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [curriculumRes, lessonRes, assignRes] = await Promise.all([
        apiClient.get(`/courses/${courseId}/curriculum`),
        apiClient.get(`/lessons/${currentLessonId}`),
        apiClient.get(`/lessons/${currentLessonId}/assignments`),
      ]);
      setCurriculum(curriculumRes.data);
      setLesson(lessonRes.data);
      setAssignments(assignRes.data);
    } catch (err) {
      console.error('Failed to load lesson data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [courseId, currentLessonId]);

  const handleCompleteLesson = async () => {
    setIsCompleting(true);
    try {
      const res = await apiClient.post(`/lessons/${currentLessonId}/complete`);
      alert('Lesson marked as complete!');
      if (res.data?.progressPercent === 100) alert('🎉 Course complete! Your certificate is being generated.');
      const { data } = await apiClient.get(`/courses/${courseId}/curriculum`);
      setCurriculum(data);
    } catch (err: any) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
    } finally { setIsCompleting(false); }
  };

  const handleSubmitAssignment = async (assignmentId: number) => {
    if (!submissionText.trim()) return alert('Please enter your submission.');
    setIsSubmitting(true);
    try {
      await apiClient.post(`/assignments/${assignmentId}/submit`, { content: submissionText });
      setSubmissionText('');
      alert('Submitted successfully!');
    } catch (err: any) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
    } finally { setIsSubmitting(false); }
  };

  const openEditAssign = (a: Assignment) => {
    setEditAssign(a);
    setEditAssignTitle(a.title);
    setEditAssignDesc(a.description || '');
    setEditAssignScore(String(a.max_score));
    setEditAssignDue(a.due_date ? a.due_date.slice(0, 16) : '');
  };
  const handleSaveAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAssign) return;
    setIsSavingAssign(true);
    try {
      await apiClient.patch(`/assignments/${editAssign.id}`, {
        title: editAssignTitle,
        description: editAssignDesc,
        maxScore: parseFloat(editAssignScore),
        due_date: editAssignDue || null,
      });
      setEditAssign(null);
      await fetchData();
    } catch (err: any) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
    } finally { setIsSavingAssign(false); }
  };
  const handleDeleteAssign = async (id: number) => {
    if (!confirm('Delete this assignment?')) return;
    try {
      await apiClient.delete(`/assignments/${id}`);
      await fetchData();
    } catch (err: any) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col md:flex-row -m-4 md:-m-8">
      {/* ── Sidebar ── */}
      <div className="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-slate-200">
          <Link href={`/dashboard/courses/${courseId}`} className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Course
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {curriculum.map((mod: any) => (
            <div key={mod.module_id}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{mod.module_title}</h3>
              <div className="space-y-1">
                {mod.lessons.map((l: any, idx: number) => {
                  const isActive = l.id === currentLessonId;
                  return (
                    <Link key={l.id} href={`/dashboard/courses/${courseId}/lessons/${l.id}`}
                      className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs font-medium ${isActive ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-xs">{l.title}</p>
                        <p className="text-xs opacity-60 capitalize">{l.content_type}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex items-center justify-center h-full">
            <div className="animate-pulse space-y-4 w-full max-w-3xl">
              <div className="h-8 bg-slate-200 rounded w-1/2" />
              <div className="h-4 bg-slate-200 rounded w-full" />
            </div>
          </div>
        ) : !lesson ? (
          <div className="p-8 flex items-center justify-center h-full text-slate-500">Lesson not found</div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-white border-b border-slate-200 p-6 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-slate-900">{lesson.title}</h1>
                {!isTeacher && (
                  <button onClick={handleCompleteLesson} disabled={isCompleting}
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60">
                    {isCompleting ? 'Marking...' : '✓ Mark Complete'}
                  </button>
                )}
              </div>
              <div className="flex border-b border-slate-200">
                {(['content', 'assignments'] as const).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-4 text-sm font-medium transition-colors border-b-2 capitalize ${activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                    {tab === 'assignments' ? `Assignments (${assignments.length})` : 'Lesson Content'}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10">
              <div className="mx-auto max-w-3xl">
                {activeTab === 'content' ? (
                  <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
                    {lesson.content_type === 'video' ? (
                      (() => {
                        const videoId = getYouTubeId(lesson.content || '');
                        return videoId ? (
                          <div>
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                              <iframe
                                className="absolute inset-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title={lesson.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                            <div className="p-6">
                              <h2 className="text-lg font-semibold text-slate-900 mb-2">{lesson.title}</h2>
                              <a href={lesson.content} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline">{lesson.content}</a>
                            </div>
                          </div>
                        ) : (
                          <div className="p-8 text-center text-slate-500">
                            <p>Invalid YouTube URL.</p>
                            <a href={lesson.content} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-indigo-600 hover:underline text-sm">{lesson.content}</a>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="p-8 prose max-w-none text-slate-700 whitespace-pre-wrap">
                        {lesson.content || 'No content provided for this lesson.'}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Assignments tab */
                  <div className="space-y-4">
                    {assignments.length === 0 ? (
                      <div className="bg-white rounded-xl p-8 text-center text-slate-500 ring-1 ring-slate-200">
                        No assignments for this lesson yet.
                      </div>
                    ) : (
                      assignments.map((a) => (
                        <div key={a.id} className="bg-white rounded-xl p-6 ring-1 ring-slate-200 shadow-sm space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-slate-900">{a.title}</h3>
                              {a.description && <p className="mt-1 text-sm text-slate-600">{a.description}</p>}
                              <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                                <span className="inline-flex items-center gap-1">
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                                  </svg>
                                  Max score: {a.max_score}
                                </span>
                                {a.due_date && (
                                  <span className={`inline-flex items-center gap-1 ${new Date(a.due_date) < new Date() ? 'text-red-500' : 'text-amber-600'}`}>
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Due: {new Date(a.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                )}
                              </div>
                            </div>
                            {isTeacher && (
                              <div className="flex gap-2 flex-shrink-0">
                                <button onClick={() => openEditAssign(a)} className="text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-2 py-1 rounded transition-colors">Edit</button>
                                <button onClick={() => handleDeleteAssign(a.id)} className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors">Delete</button>
                              </div>
                            )}
                          </div>

                          {/* Student submission form */}
                          {!isTeacher && (
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                              <label className="block text-sm font-medium text-slate-700 mb-2">Your Submission</label>
                              <textarea
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px] mb-3"
                                placeholder="Enter your answer or paste a link to your work..."
                                value={submissionText}
                                onChange={(e) => setSubmissionText(e.target.value)}
                              />
                              <button
                                onClick={() => handleSubmitAssignment(a.id)}
                                disabled={isSubmitting}
                                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                              >
                                {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Assignment Modal */}
      {editAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Edit Assignment</h2>
              <button onClick={() => setEditAssign(null)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSaveAssign} className="p-6 space-y-4">
              <Input label="Title" type="text" required value={editAssignTitle} onChange={(e) => setEditAssignTitle(e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <textarea className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]" value={editAssignDesc} onChange={(e) => setEditAssignDesc(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Max Score" type="number" min="1" required value={editAssignScore} onChange={(e) => setEditAssignScore(e.target.value)} />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Deadline</label>
                  <input type="datetime-local" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={editAssignDue} onChange={(e) => setEditAssignDue(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setEditAssign(null)}>Cancel</Button>
                <Button type="submit" variant="primary" isLoading={isSavingAssign}>Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}