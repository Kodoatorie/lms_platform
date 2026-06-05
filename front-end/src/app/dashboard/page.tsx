'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen, Users, BarChart3, CheckCircle2,
  Star, Clock, TrendingUp, Award, ChevronRight,
  GraduationCap, ClipboardList, Loader2, AlertCircle,
  Target, Zap,
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import apiClient from '../../lib/api/client';
import { useTranslation } from '../../lib/i18n/useTranslation';

// ── Types ────────────────────────────────────────────────────────────────────

interface UserStats {
  total_courses: number;
  completed_courses: number;
  average_score: number;
  total_assignments?: number;
  submitted_assignments?: number;
}

interface EnrolledCourse {
  course_id: number;
  course_title: string;
  progress_pct: number | null;
  enrolled_at: string;
  completed: boolean;
}

interface TeacherCourse {
  id: number;
  title: string;
  description?: string;
  student_count?: number;
  avg_score?: number | null;
  created_at: string;
}

interface PendingSubmission {
  submission_id: number;
  assignment_title: string;
  lesson_title: string;
  course_title: string;
  course_id: number;
  submitted_at: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: 'indigo' | 'green' | 'purple' | 'amber' | 'sky';
  loading?: boolean;
}) {
  const colorMap = {
    indigo: 'bg-indigo-500/10 text-indigo-600',
    green:  'bg-emerald-500/10 text-emerald-600',
    purple: 'bg-purple-500/10 text-purple-600',
    amber:  'bg-amber-500/10 text-amber-600',
    sky:    'bg-sky-500/10 text-sky-600',
  };
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-3 ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="h-8 w-16 bg-slate-200 animate-pulse rounded-lg" />
        ) : (
          <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
        )}
        <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  const clamped = Math.min(100, Math.max(0, pct));
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

function EmptyState({ icon: Icon, title, sub, href, linkLabel }: {
  icon: React.ElementType; title: string; sub: string; href?: string; linkLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-slate-400" />
      </div>
      <p className="font-semibold text-slate-700">{title}</p>
      <p className="text-sm text-slate-400 mt-1">{sub}</p>
      {href && linkLabel && (
        <Link href={href}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500">
          {linkLabel} <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

// ── Teacher dashboard ────────────────────────────────────────────────────────

function TeacherDashboard({ userId, t }: { userId: number; t: (section: 'dashboard', key: any) => string }) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [pending, setPending] = useState<PendingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, coursesRes] = await Promise.all([
          apiClient.get('/analytics/me'),
          apiClient.get(`/courses?teacherId=${userId}`),
        ]);
        setStats(statsRes.data);
        const myCourses: TeacherCourse[] = coursesRes.data;
        setCourses(myCourses);

        // Fetch per-course analytics for student counts
        const courseDetails = await Promise.allSettled(
          myCourses.slice(0, 6).map((c) =>
            apiClient.get(`/analytics/courses/${c.id}`).then(({ data }) => ({
              id: c.id,
              student_count: data.students?.length ?? 0,
              avg_score: data.stats?.avg_score ?? null,
            }))
          )
        );
        const detailMap: Record<number, { student_count: number; avg_score: number | null }> = {};
        courseDetails.forEach((r) => {
          if (r.status === 'fulfilled') detailMap[r.value.id] = r.value;
        });
        setCourses((prev) =>
          prev.map((c) => ({ ...c, ...(detailMap[c.id] ?? {}) }))
        );

        // Pending (ungraded) submissions across teacher's courses
        const subArrays = await Promise.allSettled(
          myCourses.slice(0, 6).map((c) =>
            apiClient.get(`/courses/${c.id}/submissions`).then(({ data }) =>
              (data as any[])
                .filter((s: any) => s.grade_id === null || s.score === null || s.score === undefined)
                .map((s: any) => ({ ...s, course_title: c.title, course_id: c.id }))
            )
          )
        );
        const allPending: PendingSubmission[] = [];
        subArrays.forEach((r) => {
          if (r.status === 'fulfilled') allPending.push(...r.value);
        });
        setPending(allPending.slice(0, 5));
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const totalStudents = courses.reduce((s, c) => s + (c.student_count ?? 0), 0);
  const avgCompletion = stats
    ? stats.total_courses > 0
      ? Math.round((stats.completed_courses / stats.total_courses) * 100)
      : 0
    : 0;

  if (error) {
    return (
      <div className="flex items-center gap-2 bg-red-50 text-red-700 rounded-2xl px-5 py-4 text-sm ring-1 ring-red-200">
        <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Users}       label={t('dashboard', 'totalStudents')}      value={loading ? '—' : totalStudents}                     color="indigo" loading={loading} />
        <StatCard icon={BookOpen}    label={t('dashboard', 'activeCourses')}       value={loading ? '—' : courses.length}                   color="green"  loading={loading} />
        <StatCard icon={BarChart3}   label={t('dashboard', 'avgCompletionRate')}  value={loading ? '—' : `${avgCompletion}%`}               color="purple" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses list */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">{t('dashboard', 'yourCourses')}</h2>
            <Link href="/dashboard/manage-courses"
              className="text-xs text-indigo-600 hover:text-indigo-500 font-medium flex items-center gap-0.5">
              {t('dashboard', 'manage')} <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3].map((i) => <div key={i} className="h-14 bg-slate-100 animate-pulse rounded-xl" />)}
            </div>
          ) : courses.length === 0 ? (
            <EmptyState icon={BookOpen} title={t('dashboard', 'noCourseTitle')}
              sub={t('dashboard', 'noCourseSub')}
              href="/dashboard/manage-courses" linkLabel={t('dashboard', 'createCourse')} />
          ) : (
            <ul className="divide-y divide-slate-100">
              {courses.slice(0, 6).map((course) => (
                <li key={course.id}>
                  <Link href={`/dashboard/courses/${course.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600">
                      {(course as any).cover_url ? (
                        <img src={(course as any).cover_url} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                          {course.title.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{course.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {course.student_count != null ? `${course.student_count} ${t('dashboard', 'students')}` : t('dashboard', 'loading')}
                        {course.avg_score != null && ` · ${t('dashboard', 'avg')} ${course.avg_score.toFixed(0)}%`}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pending submissions */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">{t('dashboard', 'pendingReviews')}</h2>
            <Link href="/dashboard/grading"
              className="text-xs text-indigo-600 hover:text-indigo-500 font-medium flex items-center gap-0.5">
              {t('dashboard', 'allLink')} <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3].map((i) => <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-xl" />)}
            </div>
          ) : pending.length === 0 ? (
            <EmptyState icon={CheckCircle2} title={t('dashboard', 'allCaughtUp')}
              sub={t('dashboard', 'noSubmissions')} />
          ) : (
            <ul className="divide-y divide-slate-100">
              {pending.map((s) => (
                <li key={s.submission_id}>
                  <Link href="/dashboard/grading"
                    className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ClipboardList className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{s.assignment_title}</p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{s.course_title}</p>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {new Date(s.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Student dashboard ────────────────────────────────────────────────────────

function StudentDashboard({ userId, t }: { userId: number; t: (section: 'dashboard', key: any) => string }) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([]);
  const [pendingGrades, setPendingGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, enrollRes] = await Promise.all([
          apiClient.get('/analytics/me'),
          apiClient.get('/me/enrollments'),
        ]);
        setStats(statsRes.data);
        setEnrollments(enrollRes.data);

        // Pending (ungraded) submissions
        const gradesRes = await apiClient.get('/me/grades/pending').catch(() => ({ data: [] }));
        setPendingGrades(gradesRes.data.slice(0, 4));
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const inProgress = enrollments.filter((e) => !e.completed);
  const completed   = enrollments.filter((e) =>  e.completed);

  if (error) {
    return (
      <div className="flex items-center gap-2 bg-red-50 text-red-700 rounded-2xl px-5 py-4 text-sm ring-1 ring-red-200">
        <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen}      label={t('dashboard', 'enrolledCourses')}  value={loading ? '—' : enrollments.length}                      color="indigo" loading={loading} />
        <StatCard icon={CheckCircle2}  label={t('dashboard', 'completed')}         value={loading ? '—' : completed.length}                         color="green"  loading={loading} />
        <StatCard icon={Zap}           label={t('dashboard', 'inProgress')}       value={loading ? '—' : inProgress.length}                        color="amber"  loading={loading} />
        <StatCard icon={Target}        label={t('dashboard', 'avgScore')}
          value={loading ? '—' : stats?.average_score ? `${Number(stats.average_score).toFixed(0)}%` : '—'}
          color="purple" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue learning */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">{t('dashboard', 'continueLearning')}</h2>
            <Link href="/dashboard/courses"
              className="text-xs text-indigo-600 hover:text-indigo-500 font-medium flex items-center gap-0.5">
              {t('dashboard', 'allCourses')} <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="p-6 space-y-4">
              {[1,2,3].map((i) => <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-xl" />)}
            </div>
          ) : inProgress.length === 0 && completed.length === 0 ? (
            <EmptyState icon={BookOpen} title={t('dashboard', 'noEnrolledTitle')}
              sub={t('dashboard', 'noEnrolledSub')}
              href="/dashboard/courses" linkLabel={t('dashboard', 'exploreCourses')} />
          ) : (
            <ul className="divide-y divide-slate-100">
              {[...inProgress, ...completed.slice(0, 2)].slice(0, 6).map((enrollment) => {
                const pct = enrollment.progress_pct ?? 0;
                return (
                  <li key={enrollment.course_id}>
                    <Link
                      href={`/dashboard/courses/${enrollment.course_id}`}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                        enrollment.completed
                          ? 'bg-gradient-to-br from-emerald-400 to-green-600'
                          : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                      }`}>
                        {enrollment.completed
                          ? <CheckCircle2 className="w-4 h-4" />
                          : enrollment.course_title.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-900 truncate">{enrollment.course_title}</p>
                          <span className={`text-xs font-bold flex-shrink-0 ${
                            enrollment.completed ? 'text-emerald-600' : 'text-indigo-600'
                          }`}>{Math.round(pct)}%</span>
                        </div>
                        <div className="mt-1.5">
                          <ProgressBar pct={pct} />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {enrollment.completed ? t('dashboard', 'completedCheck') : `${Math.round(pct)}${t('dashboard', 'percentComplete')}`}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Awaiting grades */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">{t('dashboard', 'awaitingGrades')}</h2>
            <Link href="/dashboard/grades"
              className="text-xs text-indigo-600 hover:text-indigo-500 font-medium flex items-center gap-0.5">
              {t('dashboard', 'allGrades')} <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3].map((i) => <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-xl" />)}
            </div>
          ) : pendingGrades.length === 0 ? (
            <EmptyState icon={Award} title={t('dashboard', 'noPendingTitle')}
              sub={t('dashboard', 'noPendingSub')} />
          ) : (
            <ul className="divide-y divide-slate-100">
              {pendingGrades.map((s, idx) => (
                <li key={idx}>
                  <Link href="/dashboard/grades"
                    className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {s.assignment_title}
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{s.course_title}</p>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {new Date(s.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAppSelector((s) => s.auth);
  const { t } = useTranslation();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return t('dashboard', 'goodMorning');
    if (h < 18) return t('dashboard', 'goodAfternoon');
    return t('dashboard', 'goodEvening');
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('dashboard', 'title')}</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            {greeting()}! {user.role === 'teacher'
              ? t('dashboard', 'subtitleTeacher')
              : t('dashboard', 'subtitleStudent')}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-2.5 shadow-sm ring-1 ring-slate-200">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900 leading-tight">{user.email}</p>
            <p className="text-xs text-slate-400 capitalize leading-tight">{user.role}</p>
          </div>
        </div>
      </header>

      {user.role === 'teacher' ? (
        <TeacherDashboard userId={user.id} t={t} />
      ) : (
        <StudentDashboard userId={user.id} t={t} />
      )}
    </div>
  );
}
