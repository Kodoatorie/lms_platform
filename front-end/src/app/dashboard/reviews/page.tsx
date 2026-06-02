'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Star,
  BookOpen,
  GraduationCap,
  PenLine,
  X,
  ChevronDown,
  MessageSquare,
  BarChart3,
  Users,
  Award,
} from 'lucide-react';
import { useAppSelector } from '../../../store/hooks';
import apiClient from '../../../lib/api/client';

// ── Types ────────────────────────────────────────────────────────────────────

type ReviewTarget = 'course' | 'teacher';

interface Review {
  id: number;
  student_name: string | null;
  rating: number;
  comment: string | null;
  course_title?: string;
  course_id?: number;
  teacher_id: number | null;
  teacher_name?: string;
  created_at: string;
  // discriminator used only on the client
  _target?: ReviewTarget;
}

interface CourseOption {
  id: number;
  title: string;
  teacher_id: number;
  teacher_name?: string;
}

interface TeacherOption {
  id: number;
  name: string;
}

// ── Star rating ──────────────────────────────────────────────────────────────

function StarRating({
  rating,
  interactive = false,
  onSet,
  size = 'sm',
}: {
  rating: number;
  interactive?: boolean;
  onSet?: (n: number) => void;
  size?: 'sm' | 'lg';
}) {
  const [hovered, setHovered] = useState(0);
  const px = size === 'lg' ? 'w-7 h-7' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${px} transition-colors ${
            n <= (hovered || rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'
          } ${interactive ? 'cursor-pointer hover:text-amber-300 hover:fill-amber-300' : ''}`}
          onClick={() => interactive && onSet?.(n)}
          onMouseEnter={() => interactive && setHovered(n)}
          onMouseLeave={() => interactive && setHovered(0)}
        />
      ))}
    </div>
  );
}

// ── Review card ──────────────────────────────────────────────────────────────

function ReviewCard({ review, highlight }: { review: Review; highlight?: boolean }) {
  const isTeacherReview = review._target === 'teacher' || (!review.course_id && review.teacher_id);
  return (
    <div
      className={`bg-white rounded-2xl p-5 shadow-sm ring-1 ${
        highlight ? 'ring-indigo-200 bg-indigo-50/30' : 'ring-slate-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {(review.student_name || 'S').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm">{review.student_name || 'Student'}</p>
            <StarRating rating={review.rating} />
          </div>
        </div>
        <div className="text-right space-y-1">
          <p className="text-xs text-slate-400">{new Date(review.created_at).toLocaleDateString()}</p>
          {/* Target badge */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              isTeacherReview
                ? 'bg-purple-100 text-purple-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {isTeacherReview ? (
              <><GraduationCap className="w-3 h-3" /> Teacher</>
            ) : (
              <><BookOpen className="w-3 h-3" /> Course</>
            )}
          </span>
          {review.course_id && review.course_title && (
            <div>
              <Link
                href={`/dashboard/courses/${review.course_id}`}
                className="text-xs text-indigo-500 hover:underline"
              >
                {review.course_title}
              </Link>
            </div>
          )}
          {isTeacherReview && review.teacher_name && (
            <p className="text-xs text-slate-400">{review.teacher_name}</p>
          )}
        </div>
      </div>
      {review.comment && (
        <p className="mt-3 text-sm text-slate-700 pl-12 leading-relaxed">{review.comment}</p>
      )}
      {highlight && (
        <div className="mt-3 pl-12">
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
            Your course
          </span>
        </div>
      )}
    </div>
  );
}

// ── Write Review Modal ───────────────────────────────────────────────────────

function WriteReviewModal({
  enrolledCourses,
  teachers,
  onClose,
  onSuccess,
}: {
  enrolledCourses: CourseOption[];
  teachers: TeacherOption[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<'pick-type' | 'form'>('pick-type');
  const [reviewType, setReviewType] = useState<ReviewTarget | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [courseId, setCourseId] = useState<number | null>(enrolledCourses[0]?.id ?? null);
  const [teacherId, setTeacherId] = useState<number | null>(teachers[0]?.id ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handlePickType = (type: ReviewTarget) => {
    setReviewType(type);
    setStep('form');
  };

  const handleSubmit = async () => {
    setError('');
    if (reviewType === 'course' && !courseId) {
      setError('Please select a course.');
      return;
    }
    if (reviewType === 'teacher' && !teacherId) {
      setError('Please select a teacher.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (reviewType === 'course') {
        await apiClient.post(`/courses/${courseId}/reviews`, {
          rating,
          comment: comment || null,
        });
      } else {
        // teacher review — POST to teacher endpoint
        // If the backend uses /courses/:id/reviews with teacherId:
        // pick the course whose teacher matches and send teacherId
        const course = enrolledCourses.find((c) => c.teacher_id === teacherId);
        await apiClient.post(`/teachers/${teacherId}/reviews`, {
          rating,
          comment: comment || null,
          ...(course ? { courseId: course.id } : {}),
        });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step === 'form' && (
              <button
                onClick={() => { setStep('pick-type'); setReviewType(null); setError(''); }}
                className="text-slate-400 hover:text-slate-600 transition-colors mr-1"
              >
                <ChevronDown className="w-5 h-5 rotate-90" />
              </button>
            )}
            <PenLine className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">
              {step === 'pick-type' ? 'Write a Review' : reviewType === 'course' ? 'Review a Course' : 'Review a Teacher'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {step === 'pick-type' ? (
            /* Step 1 — pick review type */
            <div className="space-y-3">
              <p className="text-sm text-slate-500 mb-4">What would you like to review?</p>
              <button
                onClick={() => handlePickType('course')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl ring-1 ring-slate-200 hover:ring-indigo-300 hover:bg-indigo-50/40 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Course Review</p>
                  <p className="text-sm text-slate-500 mt-0.5">Share your experience with the course material, structure, and content.</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 ml-auto flex-shrink-0 -rotate-90" />
              </button>

              <button
                onClick={() => handlePickType('teacher')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl ring-1 ring-slate-200 hover:ring-purple-300 hover:bg-purple-50/40 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Teacher Review</p>
                  <p className="text-sm text-slate-500 mt-0.5">Rate the teacher's communication, expertise, and teaching style.</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 ml-auto flex-shrink-0 -rotate-90" />
              </button>
            </div>
          ) : (
            /* Step 2 — fill form */
            <div className="space-y-4">
              {/* Target selector */}
              {reviewType === 'course' ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Course <span className="text-red-500">*</span>
                  </label>
                  {enrolledCourses.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">You are not enrolled in any courses yet.</p>
                  ) : (
                    <select
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={courseId ?? ''}
                      onChange={(e) => setCourseId(Number(e.target.value))}
                    >
                      {enrolledCourses.map((c) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Teacher <span className="text-red-500">*</span>
                  </label>
                  {teachers.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">No teachers found.</p>
                  ) : (
                    <select
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={teacherId ?? ''}
                      onChange={(e) => setTeacherId(Number(e.target.value))}
                    >
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* Star rating */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                <div className="flex items-center gap-3">
                  <StarRating rating={rating} interactive onSet={setRating} size="lg" />
                  <span className="text-sm font-semibold text-slate-600">{rating} / 5</span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Comment (optional)</label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder={
                    reviewType === 'course'
                      ? 'Share your experience with this course…'
                      : 'Describe the teacher\'s teaching style, communication, expertise…'
                  }
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
              )}

              <div className="flex justify-end gap-3 pt-1">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    (reviewType === 'course' && !courseId) ||
                    (reviewType === 'teacher' && !teacherId)
                  }
                  className={`px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60 transition-colors ${
                    reviewType === 'teacher'
                      ? 'bg-purple-600 hover:bg-purple-500'
                      : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                >
                  {isSubmitting ? 'Submitting…' : 'Submit Review'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function ReviewsPage() {
  const { user, isLoading: authLoading } = useAppSelector((s) => s.auth);
  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';

  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<CourseOption[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [typeFilter, setTypeFilter] = useState<'all' | ReviewTarget>('all');
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | 'all'>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);

  // Modal
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const coursesRes = await apiClient.get('/courses');
      const courses: CourseOption[] = coursesRes.data;

      const teacherMap: Record<number, string> = {};
      courses.forEach((c: any) => {
        if (c.teacher_id && c.teacher_name) teacherMap[c.teacher_id] = c.teacher_name;
      });
      const teacherList = Object.entries(teacherMap).map(([id, name]) => ({ id: Number(id), name }));
      setTeachers(teacherList);

      // Course reviews
      const courseReviewArrays = await Promise.all(
        courses.map((c) =>
          apiClient.get(`/courses/${c.id}/reviews`)
            .then(({ data }) =>
              data.map((r: any) => ({
                ...r,
                course_title: c.title,
                course_id: c.id,
                teacher_name: teacherMap[r.teacher_id] || teacherMap[c.teacher_id] || undefined,
                _target: 'course' as ReviewTarget,
              }))
            )
            .catch(() => [])
        )
      );

      // Teacher reviews
      const teacherReviewArrays = await Promise.all(
        teacherList.map((t) =>
          apiClient.get(`/teachers/${t.id}/reviews`)
            .then(({ data }) =>
              data.map((r: any) => ({
                ...r,
                teacher_name: t.name,
                _target: 'teacher' as ReviewTarget,
              }))
            )
            .catch(() => [])
        )
      );

      const merged: Review[] = [
        ...courseReviewArrays.flat(),
        ...teacherReviewArrays.flat(),
      ];
      // Deduplicate by id+target (same id may appear in both endpoints)
      const seen = new Set<string>();
      const unique = merged.filter((r) => {
        const key = `${r._target}-${r.id}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      unique.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setAllReviews(unique);

      if (isTeacher && user?.id) {
        const mine = teacherList.find((t) => Number(t.id) === Number(user.id));
        if (mine) setSelectedTeacherId(mine.id);
      }
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      loadReviews();
      if (isStudent) {
        apiClient.get('/enrollments/my')
          .then(({ data }) =>
            setEnrolledCourses(
              data.map((e: any) => ({
                id: e.course_id,
                title: e.course_title || `Course #${e.course_id}`,
                teacher_id: e.teacher_id,
                teacher_name: e.teacher_name,
              }))
            )
          )
          .catch(() =>
            apiClient.get('/courses')
              .then(({ data }) => setEnrolledCourses(data))
              .catch(() => {})
          );
      }
    }
  }, [authLoading, user]);

  const handleReviewSuccess = async () => {
    setShowWriteModal(false);
    setSuccessMsg('Your review was submitted successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
    await loadReviews();
  };

  const filtered = allReviews.filter((r) => {
    if (typeFilter !== 'all' && r._target !== typeFilter) return false;
    if (selectedTeacherId !== 'all' && r.teacher_id !== selectedTeacherId) return false;
    if (ratingFilter !== 0 && r.rating !== ratingFilter) return false;
    return true;
  });

  const avgRating = filtered.length
    ? (filtered.reduce((s, r) => s + r.rating, 0) / filtered.length).toFixed(1)
    : '—';

  const courseReviewCount = allReviews.filter((r) => r._target === 'course').length;
  const teacherReviewCount = allReviews.filter((r) => r._target === 'teacher').length;
  const myReviewCount = isTeacher
    ? allReviews.filter((r) => Number(r.teacher_id) === Number(user?.id)).length
    : 0;

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reviews</h1>
          <p className="mt-1 text-sm text-slate-600">
            {isTeacher
              ? 'See all student reviews. Your course reviews are highlighted.'
              : 'Browse course and teacher reviews across the platform.'}
          </p>
        </div>
        {isStudent && (
          <button
            onClick={() => setShowWriteModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm transition-colors"
          >
            <PenLine className="w-4 h-4" />
            Write a Review
          </button>
        )}
      </header>

      {/* Success banner */}
      {successMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm font-medium">
          <Award className="w-4 h-4 text-green-600 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between mb-1">
            <MessageSquare className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{allReviews.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total reviews</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between mb-1">
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{avgRating}</p>
          <p className="text-xs text-slate-500 mt-0.5">Avg rating</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between mb-1">
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{courseReviewCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">Course reviews</p>
        </div>
        {isTeacher ? (
          <div className="bg-indigo-50 rounded-2xl p-4 shadow-sm ring-1 ring-indigo-200">
            <div className="flex items-center justify-between mb-1">
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-bold text-indigo-700">{myReviewCount}</p>
            <p className="text-xs text-indigo-500 mt-0.5">Reviews for you</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between mb-1">
              <GraduationCap className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-purple-600">{teacherReviewCount}</p>
            <p className="text-xs text-slate-500 mt-0.5">Teacher reviews</p>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200 space-y-3">
        {/* Type filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-sm font-medium text-slate-700 flex-shrink-0">Type:</label>
          <div className="flex gap-2">
            {([
              { key: 'all', label: 'All', icon: <MessageSquare className="w-3.5 h-3.5" /> },
              { key: 'course', label: 'Courses', icon: <BookOpen className="w-3.5 h-3.5" /> },
              { key: 'teacher', label: 'Teachers', icon: <GraduationCap className="w-3.5 h-3.5" /> },
            ] as const).map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setTypeFilter(key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  typeFilter === key
                    ? key === 'course'
                      ? 'bg-blue-600 text-white'
                      : key === 'teacher'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {icon}{label}
              </button>
            ))}
          </div>
        </div>

        {/* Teacher filter (only visible for teacher type or all) */}
        {teachers.length > 0 && typeFilter !== 'course' && (
          <div className="flex items-center gap-3 flex-wrap">
            <label className="text-sm font-medium text-slate-700 flex-shrink-0">Teacher:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTeacherId('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedTeacherId === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                All
              </button>
              {teachers.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTeacherId(t.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedTeacherId === t.id
                      ? Number(t.id) === Number(user?.id) ? 'bg-purple-600 text-white' : 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t.name}
                  {Number(t.id) === Number(user?.id) && isTeacher && (
                    <span className="ml-1 opacity-70">(you)</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Rating filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-sm font-medium text-slate-700 flex-shrink-0">Rating:</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setRatingFilter(0)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${ratingFilter === 0 ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map((n) => (
              <button
                key={n}
                onClick={() => setRatingFilter(n)}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  ratingFilter === n ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Star className={`w-3 h-3 ${ratingFilter === n ? 'fill-white text-white' : 'fill-amber-400 text-amber-400'}`} />
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="font-medium">No reviews found</p>
          <p className="text-sm mt-1">Try adjusting the filters above.</p>
          {isStudent && (
            <button
              onClick={() => setShowWriteModal(true)}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              <PenLine className="w-4 h-4" />
              Be the first to write a review
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 pl-1">
            {filtered.length} review{filtered.length !== 1 ? 's' : ''}
          </p>
          {filtered.map((review) => (
            <ReviewCard
              key={`${review._target}-${review.id}`}
              review={review}
              highlight={isTeacher && Number(review.teacher_id) === Number(user?.id)}
            />
          ))}
        </div>
      )}

      {/* Write Review Modal */}
      {showWriteModal && (
        <WriteReviewModal
          enrolledCourses={enrolledCourses}
          teachers={teachers}
          onClose={() => setShowWriteModal(false)}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
}
