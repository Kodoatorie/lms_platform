'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../../../store/hooks';
import apiClient from '../../../../lib/api/client';
import { getLocale } from '../../../../lib/i18n/useTranslation';
import { getDictionary } from '../../../../i18n/dictionaries';
import { 
  BookOpen, 
  Clock, 
  Video, 
  FileText, 
  Code, 
  ArrowRight,
  GraduationCap,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface LessonData {
  id: number;
  title: string;
  content_type: 'text' | 'video' | 'practice';
  order_index: number;
}

interface ModuleData {
  module_id: number;
  module_title: string;
  is_final: boolean;
  lessons: LessonData[];
}

export default function PublicCourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [curriculum, setCurriculum] = useState<ModuleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeLocale, setActiveLocale] = useState('ru');
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const currentLocale = getLocale();
    if (currentLocale) {
      setActiveLocale(currentLocale);
    }

    const fetchCourseData = async () => {
      try {
        const courseRes = await apiClient.get(`/courses/${id}`);
        setCourse(courseRes.data);

        const curriculumRes = await apiClient.get(`/courses/${id}/curriculum`);
        setCurriculum(curriculumRes.data || []);
        
        // Expand all modules by default
        const expansions: Record<number, boolean> = {};
        (curriculumRes.data || []).forEach((mod: ModuleData) => {
          expansions[mod.module_id] = true;
        });
        setExpandedModules(expansions);
      } catch (err) {
        console.error('Failed to load course details', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const normalizedLocale = activeLocale === 'kz' ? 'kk' : activeLocale;
  const t = getDictionary(normalizedLocale);

  const toggleModule = (modId: number) => {
    setExpandedModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  // Local trilingual labels
  const labels = {
    backToCatalog: {
      ru: '← Назад в каталог',
      en: '← Back to Catalog',
      kk: '← Каталогқа оралу'
    },
    lifetimeAccess: {
      ru: 'Пожизненный доступ к материалам',
      en: 'Lifetime access to materials',
      kk: 'Материалдарға өмірлік қолжетімділік'
    },
    buyBtn: {
      ru: 'Зарегистрироваться и купить',
      en: 'Register and Buy',
      kk: 'Тіркелу және сатып алу'
    },
    startBtn: {
      ru: 'Начать обучение',
      en: 'Start Learning',
      kk: 'Оқуды бастау'
    },
    curriculumTitle: {
      ru: 'Программа курса',
      en: 'Course Curriculum',
      kk: 'Курс бағдарламасы'
    },
    instructorTitle: {
      ru: 'Преподаватель',
      en: 'Instructor',
      kk: 'Оқытушы'
    },
    courseContent: {
      ru: 'Содержание курса',
      en: 'Course Content',
      kk: 'Курс мазмұны'
    },
    free: {
      ru: 'Бесплатно',
      en: 'Free',
      kk: 'Тегін'
    },
    practiceType: {
      ru: 'Практика',
      en: 'Practice',
      kk: 'Тәжірибе'
    },
    videoType: {
      ru: 'Видеоурок',
      en: 'Video Lesson',
      kk: 'Бейне сабақ'
    },
    textType: {
      ru: 'Теория',
      en: 'Theory',
      kk: 'Теория'
    },
    noCurriculum: {
      ru: 'Программа курса наполняется преподавателем.',
      en: 'Curriculum is being prepared by the instructor.',
      kk: 'Курс бағдарламасы оқытушымен толтырылуда.'
    },
    coursePriceLabel: {
      ru: 'Цена курса',
      en: 'Course Price',
      kk: 'Курс бағасы'
    }
  };

  const getLabel = (key: keyof typeof labels) => {
    const section = labels[key] as any;
    return section[normalizedLocale] ?? section['ru'];
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col justify-center items-center bg-slate-50 space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Курс не найден / Course not found</h2>
        <Link href="/" className="text-indigo-600 font-medium hover:underline">
          {getLabel('backToCatalog')}
        </Link>
      </div>
    );
  }

  const price = Number(course.price);
  const targetUrl = user 
    ? `/dashboard/courses/${course.id}` 
    : '/login';

  return (
    <div className="min-h-screen bg-slate-50 py-28 relative overflow-hidden">
      {/* Background canvas decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 space-y-10 relative z-10">
        {/* Back link */}
        <div className="text-left">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
            {getLabel('backToCatalog')}
          </Link>
        </div>

        {/* Hero course details card */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row justify-between gap-8 items-start">
          <div className="space-y-6 max-w-xl text-left">
            <div className="flex items-center gap-2 text-indigo-600">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {getLabel('lifetimeAccess')}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {course.title}
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-1 text-slate-500 text-sm font-medium bg-slate-100 px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4" />
                <span>3-6 месяцев</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 text-sm font-medium bg-slate-100 px-3 py-1.5 rounded-full">
                <GraduationCap className="w-4 h-4" />
                <span>EduTech Team</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 w-full md:w-80 space-y-6 flex flex-col justify-between shrink-0">
            <div className="space-y-1">
              <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">{getLabel('coursePriceLabel')}</span>
              <div className="flex items-baseline gap-2">
                {price > 0 ? (
                  <>
                    <span className="text-4xl font-extrabold text-slate-900">{price}</span>
                    <span className="text-slate-500 font-bold">USD</span>
                  </>
                ) : (
                  <span className="text-3xl font-extrabold text-slate-900">{getLabel('free')}</span>
                )}
              </div>
            </div>

            <Link
              href={targetUrl}
              className="flex w-full items-center justify-center gap-2 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all duration-300"
            >
              {price > 0 ? getLabel('buyBtn') : getLabel('startBtn')}
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>
          </div>
        </div>

        {/* Curriculum Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 text-left">
            {getLabel('curriculumTitle')}
          </h2>

          {curriculum.length === 0 ? (
            <div className="bg-white border border-slate-200/60 rounded-2xl p-8 text-center text-slate-500">
              {getLabel('noCurriculum')}
            </div>
          ) : (
            <div className="space-y-4">
              {curriculum.map((mod) => {
                const isExpanded = !!expandedModules[mod.module_id];
                return (
                  <div key={mod.module_id} className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm transition-all duration-200">
                    {/* Header */}
                    <button
                      onClick={() => toggleModule(mod.module_id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center font-bold text-sm text-indigo-600">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-800 text-lg">
                          {mod.module_title}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Lessons list */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 divide-y divide-slate-100 bg-slate-50/30">
                        {mod.lessons && mod.lessons.length > 0 ? (
                          mod.lessons.map((lesson) => {
                            const iconMap = {
                              video: <Video className="w-4 h-4 text-pink-500" />,
                              text: <FileText className="w-4 h-4 text-indigo-500" />,
                              practice: <Code className="w-4 h-4 text-emerald-500" />
                            };
                            const labelMap = {
                              video: getLabel('videoType'),
                              text: getLabel('textType'),
                              practice: getLabel('practiceType')
                            };
                            return (
                              <div key={lesson.id} className="px-6 py-4 flex items-center justify-between gap-4 text-left">
                                <div className="flex items-center gap-3">
                                  {iconMap[lesson.content_type]}
                                  <span className="text-slate-700 text-sm font-medium">
                                    {lesson.title}
                                  </span>
                                </div>
                                <span className="text-slate-400 text-xs font-semibold uppercase bg-white px-2.5 py-1 rounded-md border border-slate-200/50 shrink-0">
                                  {labelMap[lesson.content_type]}
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <div className="px-6 py-4 text-slate-400 text-sm">Нет уроков / No lessons</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
