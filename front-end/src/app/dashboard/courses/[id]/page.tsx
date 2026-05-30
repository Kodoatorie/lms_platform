'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
  fetchCourseById,
  clearCurrentCourse,
  updateCourse,
  deleteCourse,
} from '../../../../store/courses/coursesSlice';
import apiClient from '../../../../lib/api/client';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';

// ─── Types ───────────────────────────────────────────────────
interface LessonData {
  id: number;
  title: string;
  content_type: 'text' | 'video' | 'practice';
  content: string;
  order_index: number;
}
interface ModuleData {
  module_id: number;
  module_title: string;
  lessons: LessonData[];
}

// ─── Small reusable modal wrapper ────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const courseId = parseInt(unwrappedParams.id, 10);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { currentCourse, isLoading, error } = useAppSelector((state) => state.courses);
  const { user } = useAppSelector((state) => state.auth);
  const [curriculum, setCurriculum] = useState<ModuleData[]>([]);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Course edit
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete course
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add Module
  const [showAddModule, setShowAddModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [isAddingModule, setIsAddingModule] = useState(false);

  // Add Lesson
  const [addLessonFor, setAddLessonFor] = useState<number | null>(null); // moduleId
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonType, setLessonType] = useState<'text' | 'video' | 'practice'>('text');
  const [lessonContent, setLessonContent] = useState('');
  const [isAddingLesson, setIsAddingLesson] = useState(false);

  // Edit Lesson
  const [editLesson, setEditLesson] = useState<LessonData | null>(null);
  const [editLessonTitle, setEditLessonTitle] = useState('');
  const [editLessonType, setEditLessonType] = useState<'text' | 'video' | 'practice'>('text');
  const [editLessonContent, setEditLessonContent] = useState('');
  const [isSavingLesson, setIsSavingLesson] = useState(false);

  // Add Assignment
  const [addAssignmentFor, setAddAssignmentFor] = useState<number | null>(null); // lessonId
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignMaxScore, setAssignMaxScore] = useState('100');
  const [assignDueDate, setAssignDueDate] = useState('');
  const [isAddingAssign, setIsAddingAssign] = useState(false);

  const isTeacher = user?.role === 'teacher';

  const loadCurriculum = async () => {
    try {
      const { data } = await apiClient.get(`/courses/${courseId}/curriculum`);
      setCurriculum(data);
    } catch (err) {
      console.error('Failed to load curriculum', err);
    }
  };

  useEffect(() => {
    dispatch(fetchCourseById(courseId));
    loadCurriculum();
    return () => { dispatch(clearCurrentCourse()); };
  }, [dispatch, courseId]);

  // ── Enroll ──
  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      await apiClient.post(`/courses/${courseId}/enroll`);
      alert('Successfully enrolled!');
    } catch (err: any) {
      alert(err.response?.data?.message === 'Already enrolled'
        ? 'You are already enrolled in this course.'
        : 'Failed to enroll: ' + (err.response?.data?.message || err.message));
    } finally { setIsEnrolling(false); }
  };

  // ── Course edit ──
  const openEditModal = () => {
    if (!currentCourse) return;
    setEditTitle(currentCourse.title);
    setEditDescription(currentCourse.description || '');
    setIsEditing(true);
  };
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const result = await dispatch(updateCourse({ id: courseId, title: editTitle, description: editDescription }));
    setIsSaving(false);
    if (updateCourse.fulfilled.match(result)) setIsEditing(false);
  };

  // ── Delete course ──
  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await dispatch(deleteCourse(courseId));
    setIsDeleting(false);
    if (deleteCourse.fulfilled.match(result)) router.push('/dashboard/courses');
  };

  // ── Add module ──
  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;
    setIsAddingModule(true);
    try {
      await apiClient.post(`/courses/${courseId}/modules`, { title: newModuleTitle });
      setNewModuleTitle('');
      setShowAddModule(false);
      await loadCurriculum();
    } catch (err: any) {
      alert('Failed to add module: ' + (err.response?.data?.message || err.message));
    } finally { setIsAddingModule(false); }
  };

  // ── Delete module ──
  const handleDeleteModule = async (moduleId: number) => {
    if (!confirm('Delete this module and all its lessons?')) return;
    try {
      await apiClient.delete(`/modules/${moduleId}`);
      await loadCurriculum();
    } catch (err: any) {
      alert('Failed to delete module: ' + (err.response?.data?.message || err.message));
    }
  };

  // ── Add lesson ──
  const openAddLesson = (moduleId: number) => {
    setAddLessonFor(moduleId);
    setLessonTitle('');
    setLessonType('text');
    setLessonContent('');
  };
  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addLessonFor) return;
    setIsAddingLesson(true);
    try {
      await apiClient.post(`/modules/${addLessonFor}/lessons`, {
        title: lessonTitle,
        content_type: lessonType,
        content: lessonContent,
        contentType: lessonType,
      });
      setAddLessonFor(null);
      await loadCurriculum();
    } catch (err: any) {
      alert('Failed to add lesson: ' + (err.response?.data?.message || err.message));
    } finally { setIsAddingLesson(false); }
  };

  // ── Edit lesson ──
  const openEditLesson = (lesson: LessonData) => {
    setEditLesson(lesson);
    setEditLessonTitle(lesson.title);
    setEditLessonType(lesson.content_type);
    setEditLessonContent(lesson.content || '');
  };
  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLesson) return;
    setIsSavingLesson(true);
    try {
      await apiClient.patch(`/lessons/${editLesson.id}`, {
        title: editLessonTitle,
        content_type: editLessonType,
        contentType: editLessonType,
        content: editLessonContent,
      });
      setEditLesson(null);
      await loadCurriculum();
    } catch (err: any) {
      alert('Failed to update lesson: ' + (err.response?.data?.message || err.message));
    } finally { setIsSavingLesson(false); }
  };

  // ── Delete lesson ──
  const handleDeleteLesson = async (lessonId: number) => {
    if (!confirm('Delete this lesson?')) return;
    try {
      await apiClient.delete(`/lessons/${lessonId}`);
      await loadCurriculum();
    } catch (err: any) {
      alert('Failed to delete lesson: ' + (err.response?.data?.message || err.message));
    }
  };

  // ── Add assignment ──
  const openAddAssignment = (lessonId: number) => {
    setAddAssignmentFor(lessonId);
    setAssignTitle('');
    setAssignDesc('');
    setAssignMaxScore('100');
    setAssignDueDate('');
  };
  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addAssignmentFor) return;
    setIsAddingAssign(true);
    try {
      await apiClient.post(`/lessons/${addAssignmentFor}/assignments`, {
        title: assignTitle,
        description: assignDesc,
        max_score: parseFloat(assignMaxScore),
        due_date: assignDueDate || null,
      });
      setAddAssignmentFor(null);
      alert('Assignment added successfully!');
    } catch (err: any) {
      alert('Failed to add assignment: ' + (err.response?.data?.message || err.message));
    } finally { setIsAddingAssign(false); }
  };

  // ─────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-48 bg-slate-200 rounded-3xl" />
        <div className="h-8 w-1/3 bg-slate-200 rounded" />
      </div>
    );
  }
  if (error || !currentCourse) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold text-slate-900">Failed to load course</h3>
        <p className="mt-2 text-slate-500">{error || 'Course not found'}</p>
        <Link href="/dashboard/courses" className="mt-4 inline-block text-indigo-600 hover:underline">&larr; Back to courses</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Banner ── */}
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
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl mb-4">{currentCourse.title}</h1>
            <p className="text-lg text-indigo-100">{currentCourse.description || 'A comprehensive guide to mastering this subject.'}</p>
          </div>
          <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3">
            {isTeacher ? (
              <>
                <Button variant="secondary" size="lg" className="shadow-lg" onClick={openEditModal}>✏️ Edit Course</Button>
                <Button variant="ghost" size="lg" className="shadow-lg bg-red-500/20 hover:bg-red-500/40 text-white border-white/20" onClick={() => setIsDeleteConfirm(true)}>🗑 Delete</Button>
              </>
            ) : (
              <Button variant="secondary" size="lg" className="shadow-lg" onClick={handleEnroll} disabled={isEnrolling}>
                {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Curriculum ── */}
      <section className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Curriculum</h2>
          {isTeacher && (
            <Button variant="outline" size="sm" onClick={() => setShowAddModule(true)}>+ Add Module</Button>
          )}
        </div>

        <div className="space-y-4">
          {curriculum.length === 0 ? (
            <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
              {isTeacher ? 'No modules yet. Click "Add Module" to get started.' : 'No content available yet.'}
            </div>
          ) : (
            curriculum.map((mod) => (
              <div key={mod.module_id} className="border border-slate-200 rounded-xl overflow-hidden">
                {/* Module header */}
                <div className="bg-slate-50 px-4 py-3 flex justify-between items-center">
                  <span className="font-semibold text-slate-900">{mod.module_title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">{mod.lessons.length} lessons</span>
                    {isTeacher && (
                      <>
                        <button
                          onClick={() => openAddLesson(mod.module_id)}
                          className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2 py-1 rounded transition-colors"
                        >
                          + Lesson
                        </button>
                        <button
                          onClick={() => handleDeleteModule(mod.module_id)}
                          className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Lessons */}
                <div className="divide-y divide-slate-100">
                  {mod.lessons.map((lesson, idx) => (
                    <div key={lesson.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors">
                      <Link href={`/dashboard/courses/${courseId}/lessons/${lesson.id}`} className="flex items-center flex-1 min-w-0 group">
                        <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-semibold mr-3 flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors truncate">{lesson.title}</p>
                          <p className="text-xs text-slate-400 capitalize">{lesson.content_type}</p>
                        </div>
                      </Link>
                      {isTeacher && (
                        <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                          <button
                            onClick={() => openAddAssignment(lesson.id)}
                            className="text-xs text-amber-600 hover:text-amber-800 hover:bg-amber-50 px-2 py-1 rounded transition-colors"
                            title="Add assignment"
                          >
                            + HW
                          </button>
                          <button
                            onClick={() => openEditLesson(lesson)}
                            className="text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-2 py-1 rounded transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                          >
                            Del
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {mod.lessons.length === 0 && (
                    <div className="px-4 py-3 text-sm text-slate-400 italic">No lessons yet</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ══════════════ MODALS ══════════════ */}

      {/* Edit Course */}
      {isEditing && (
        <Modal title="Edit Course" onClose={() => setIsEditing(false)}>
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <Input label="Course Title" type="text" required value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="submit" variant="primary" isLoading={isSaving}>Save Changes</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Course */}
      {isDeleteConfirm && (
        <Modal title="Delete Course" onClose={() => setIsDeleteConfirm(false)}>
          <div className="space-y-4">
            <p className="text-sm text-slate-700">Are you sure you want to delete <strong>"{currentCourse.title}"</strong>? All modules, lessons, and student data will be permanently removed.</p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsDeleteConfirm(false)}>Cancel</Button>
              <button onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium disabled:opacity-50">
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Module */}
      {showAddModule && (
        <Modal title="Add Module" onClose={() => setShowAddModule(false)}>
          <form onSubmit={handleAddModule} className="space-y-4">
            <Input label="Module Title" type="text" required placeholder="e.g. Introduction" value={newModuleTitle} onChange={(e) => setNewModuleTitle(e.target.value)} />
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setShowAddModule(false)}>Cancel</Button>
              <Button type="submit" variant="primary" isLoading={isAddingModule}>Add Module</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Lesson */}
      {addLessonFor !== null && (
        <Modal title="Add Lesson" onClose={() => setAddLessonFor(null)}>
          <form onSubmit={handleAddLesson} className="space-y-4">
            <Input label="Lesson Title" type="text" required placeholder="e.g. Variables & Data Types" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Content Type</label>
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={lessonType} onChange={(e) => setLessonType(e.target.value as any)}>
                <option value="text">📝 Text Lecture</option>
                <option value="video">🎬 YouTube Video</option>
                <option value="practice">💻 Practice Task</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {lessonType === 'video' ? 'YouTube URL' : 'Content'}
              </label>
              {lessonType === 'text' || lessonType === 'practice' ? (
                <textarea className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]" placeholder={lessonType === 'text' ? 'Write your lecture content here...' : 'Describe the practice task...'} value={lessonContent} onChange={(e) => setLessonContent(e.target.value)} />
              ) : (
                <Input type="url" placeholder="https://www.youtube.com/watch?v=..." value={lessonContent} onChange={(e) => setLessonContent(e.target.value)} />
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setAddLessonFor(null)}>Cancel</Button>
              <Button type="submit" variant="primary" isLoading={isAddingLesson}>Add Lesson</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Lesson */}
      {editLesson && (
        <Modal title="Edit Lesson" onClose={() => setEditLesson(null)}>
          <form onSubmit={handleSaveLesson} className="space-y-4">
            <Input label="Lesson Title" type="text" required value={editLessonTitle} onChange={(e) => setEditLessonTitle(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Content Type</label>
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={editLessonType} onChange={(e) => setEditLessonType(e.target.value as any)}>
                <option value="text">📝 Text Lecture</option>
                <option value="video">🎬 YouTube Video</option>
                <option value="practice">💻 Practice Task</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {editLessonType === 'video' ? 'YouTube URL' : 'Content'}
              </label>
              {editLessonType === 'video' ? (
                <Input type="url" placeholder="https://www.youtube.com/watch?v=..." value={editLessonContent} onChange={(e) => setEditLessonContent(e.target.value)} />
              ) : (
                <textarea className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]" value={editLessonContent} onChange={(e) => setEditLessonContent(e.target.value)} />
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setEditLesson(null)}>Cancel</Button>
              <Button type="submit" variant="primary" isLoading={isSavingLesson}>Save Changes</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Assignment */}
      {addAssignmentFor !== null && (
        <Modal title="Add Homework Assignment" onClose={() => setAddAssignmentFor(null)}>
          <form onSubmit={handleAddAssignment} className="space-y-4">
            <Input label="Title" type="text" required placeholder="e.g. Build a calculator app" value={assignTitle} onChange={(e) => setAssignTitle(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]" placeholder="Describe what students need to do..." value={assignDesc} onChange={(e) => setAssignDesc(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Max Score" type="number" required min="1" value={assignMaxScore} onChange={(e) => setAssignMaxScore(e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Deadline (optional)</label>
                <input type="datetime-local" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={assignDueDate} onChange={(e) => setAssignDueDate(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setAddAssignmentFor(null)}>Cancel</Button>
              <Button type="submit" variant="primary" isLoading={isAddingAssign}>Add Assignment</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}