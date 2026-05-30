'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppSelector } from '../../../store/hooks';
import apiClient from '../../../lib/api/client';

interface Review {
  id: number;
  student_name: string | null;
  rating: number;
  comment: string | null;
  course_title: string;
  course_id: number;
  teacher_id: number;
  teacher_name?: string;
  created_at: string;
}

interface TeacherOption {
  id: number;
  name: string;
}

function StarRating({ rating, interactive = false, onSet }: {
  rating: number;
  interactive?: boolean;
  onSet?: (n: number) => void;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          onClick={() => interactive && onSet?.(n)}
          className={`w-4 h-4 transition-colors ${
            n <= rating ? 'text-amber-400' : 'text-slate-200'
          } ${interactive ? 'cursor-pointer hover:text-amber-300' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review, highlight }: { review: Review; highlight?: boolean }) {
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm ring-1 ${highlight ? 'ring-indigo-200 bg-indigo-50/30' : 'ring-slate-200'}`}>
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
        <div className="text-right">
          <p className="text-xs text-slate-400">{new Date(review.created_at).toLocaleDateString()}</p>
          {review.course_title && (
            <Link href={`/dashboard/courses/${review.course_id}`}
              className="text-xs text-indigo-500 hover:underline">{review.course_title}</Link>
          )}
        </div>
      </div>
      {review.comment && (
        <p className="mt-3 text-sm text-slate-700 pl-12 leading-relaxed">{review.comment}</p>
      )}
      {highlight && (
        <div className="mt-3 pl-12">
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">Your course</span>
        </div>
      )}
    </div>
  );
}

export default function ReviewsPage() {
  const { user, isLoading: authLoading } = useAppSelector((s) => s.auth);
  const isTeacher = user?.role === 'teacher';

  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState<number | 0>(0); // 0 = all

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch all reviews by fetching teacher-specific reviews for each teacher
        // Since we expose GET /api/teachers/:id/reviews, we need teacher list first
        const coursesRes = await apiClient.get('/courses');
        const courses = coursesRes.data;

        // Collect unique teachers from courses
        const teacherMap: Record<number, string> = {};
        courses.forEach((c: any) => {
          if (c.teacher_id && c.teacher_name) {
            teacherMap[c.teacher_id] = c.teacher_name;
          }
        });
        const teacherList = Object.entries(teacherMap).map(([id, name]) => ({
          id: Number(id),
          name,
        }));
        setTeachers(teacherList);

        // Fetch reviews for each teacher in parallel
        const reviewArrays = await Promise.all(
          teacherList.map((t) =>
            apiClient.get(`/teachers/${t.id}/reviews`)
              .then(({ data }) => data.map((r: any) => ({ ...r, teacher_name: t.name })))
              .catch(() => [])
          )
        );
        const merged: Review[] = reviewArrays.flat();
        // Sort newest first
        merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setAllReviews(merged);

        // Default filter to own reviews if teacher
        if (user?.role === 'teacher' && user.id) {
          const myEntry = teacherList.find(t => Number(t.id) === Number(user.id));
          if (myEntry) setSelectedTeacherId(myEntry.id);
        }
      } catch (err) {
        console.error('Failed to load reviews', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (!authLoading && user) load();
  }, [authLoading, user]);

  const filtered = allReviews.filter((r) => {
    const matchTeacher = selectedTeacherId === 'all' || r.teacher_id === selectedTeacherId;
    const matchRating = ratingFilter === 0 || r.rating === ratingFilter;
    return matchTeacher && matchRating;
  });

  const avgRating = filtered.length
    ? (filtered.reduce((s, r) => s + r.rating, 0) / filtered.length).toFixed(1)
    : '—';

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
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reviews</h1>
        <p className="mt-1 text-sm text-slate-600">
          {isTeacher
            ? 'See all student reviews across the platform. Your course reviews are highlighted.'
            : 'Student reviews for courses and teachers.'}
        </p>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-2xl font-bold text-slate-900">{allReviews.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total reviews</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-2xl font-bold text-slate-900">{avgRating}</p>
          <p className="text-xs text-slate-500 mt-1">Avg rating (filtered)</p>
        </div>
        {isTeacher && (
          <div className="bg-indigo-50 rounded-2xl p-4 shadow-sm ring-1 ring-indigo-200">
            <p className="text-2xl font-bold text-indigo-700">{myReviewCount}</p>
            <p className="text-xs text-indigo-500 mt-1">Reviews for your courses</p>
          </div>
        )}
        <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-2xl font-bold text-slate-900">{teachers.length}</p>
          <p className="text-xs text-slate-500 mt-1">Teachers reviewed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200 space-y-3">
        {/* Teacher filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-sm font-medium text-slate-700 flex-shrink-0">Teacher:</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTeacherId('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedTeacherId === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              All teachers
            </button>
            {teachers.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTeacherId(t.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedTeacherId === t.id
                    ? Number(t.id) === Number(user?.id)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-white'
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
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${ratingFilter === n ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {'⭐'.repeat(n)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-slate-200 animate-pulse rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500">
          <div className="text-4xl mb-3">💬</div>
          <p className="font-medium">No reviews found</p>
          <p className="text-sm mt-1">Try changing the filters above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 pl-1">{filtered.length} review{filtered.length !== 1 ? 's' : ''}</p>
          {filtered.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              highlight={isTeacher && Number(review.teacher_id) === Number(user?.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}