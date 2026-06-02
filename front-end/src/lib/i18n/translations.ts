// ─── Supported locales ────────────────────────────────────────────────────────
export type Locale = 'en' | 'ru' | 'kz';

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'kz', label: 'Қазақша', flag: '🇰🇿' },
];

// ─── Translation map ──────────────────────────────────────────────────────────
export const translations = {
    // ── Nav ──────────────────────────────────────────────────────────────────
    nav: {
        dashboard:     { en: 'Dashboard',       ru: 'Главная',           kz: 'Басты бет'        },
        courses:       { en: 'Courses',          ru: 'Курсы',             kz: 'Курстар'          },
        manageCourses: { en: 'Manage Courses',   ru: 'Управление курсами',kz: 'Курстарды басқару'},
        grading:       { en: 'Grading',          ru: 'Проверка заданий', kz: 'Тапсырмаларды тексеру' },
        students:      { en: 'Students',         ru: 'Студенты',          kz: 'Студенттер'       },
        analytics:     { en: 'Analytics',        ru: 'Аналитика',         kz: 'Талдау'           },
        reviews:       { en: 'Reviews',          ru: 'Отзывы',            kz: 'Пікірлер'         },
        profile:       { en: 'Profile',          ru: 'Профиль',           kz: 'Профиль'          },
        myGrades:      { en: 'My Grades',        ru: 'Мои оценки',        kz: 'Менің бағаларым'  },
        notifications: { en: 'Notifications',    ru: 'Уведомления',       kz: 'Хабарламалар'     },
        certificates:  { en: 'Certificates',     ru: 'Сертификаты',       kz: 'Сертификаттар'    },
        signOut:       { en: 'Sign out',         ru: 'Выйти',             kz: 'Шығу'             },
    },
    // ── Common ───────────────────────────────────────────────────────────────
    common: {
        loading:       { en: 'Loading…',         ru: 'Загрузка…',         kz: 'Жүктелуде…'       },
        save:          { en: 'Save',             ru: 'Сохранить',         kz: 'Сақтау'           },
        saveChanges:   { en: 'Save Changes',     ru: 'Сохранить изменения',kz: 'Өзгерістерді сақтау' },
        cancel:        { en: 'Cancel',           ru: 'Отмена',            kz: 'Болдырмау'        },
        delete:        { en: 'Delete',           ru: 'Удалить',           kz: 'Жою'              },
        edit:          { en: 'Edit',             ru: 'Редактировать',     kz: 'Өңдеу'            },
        create:        { en: 'Create',           ru: 'Создать',           kz: 'Жасау'            },
        back:          { en: 'Back',             ru: 'Назад',             kz: 'Артқа'            },
        search:        { en: 'Search…',          ru: 'Поиск…',            kz: 'Іздеу…'           },
        noResults:     { en: 'No results found', ru: 'Ничего не найдено', kz: 'Ештеңе табылмады' },
        submit:        { en: 'Submit',           ru: 'Отправить',         kz: 'Жіберу'           },
        close:         { en: 'Close',            ru: 'Закрыть',           kz: 'Жабу'             },
        error:         { en: 'Something went wrong', ru: 'Что-то пошло не так', kz: 'Бір нәрсе дұрыс болмады' },
        retry:         { en: 'Try again',        ru: 'Попробовать снова', kz: 'Қайталап көру'    },
        required:      { en: 'Required',         ru: 'Обязательно',       kz: 'Міндетті'         },
    },
    // ── Auth ──────────────────────────────────────────────────────────────────
    auth: {
        login:         { en: 'Sign In',          ru: 'Войти',             kz: 'Кіру'             },
        register:      { en: 'Register',         ru: 'Регистрация',       kz: 'Тіркелу'         },
        email:         { en: 'Email address',    ru: 'Email адрес',       kz: 'Email мекенжай'   },
        password:      { en: 'Password',         ru: 'Пароль',            kz: 'Құпия сөз'        },
        fullName:      { en: 'Full Name',        ru: 'Полное имя',        kz: 'Толық аты-жөні'   },
        role:          { en: 'Role',             ru: 'Роль',              kz: 'Рөл'              },
        student:       { en: 'Student',          ru: 'Студент',           kz: 'Студент'          },
        teacher:       { en: 'Teacher',          ru: 'Преподаватель',     kz: 'Оқытушы'          },
        haveAccount:   { en: 'Already have an account?', ru: 'Уже есть аккаунт?', kz: 'Аккаунт бар ма?' },
        noAccount:     { en: "Don't have an account?", ru: 'Нет аккаунта?', kz: 'Аккаунт жоқ па?' },
    },
    // ── Courses ───────────────────────────────────────────────────────────────
    courses: {
        title:          { en: 'Courses',              ru: 'Курсы',                kz: 'Курстар'              },
        createCourse:   { en: 'Create Course',        ru: 'Создать курс',         kz: 'Курс жасау'           },
        courseTitle:    { en: 'Course Title',         ru: 'Название курса',       kz: 'Курс атауы'           },
        description:    { en: 'Description',          ru: 'Описание',             kz: 'Сипаттама'            },
        instructor:     { en: 'Instructor',           ru: 'Преподаватель',        kz: 'Оқытушы'              },
        enroll:         { en: 'Enroll Now',           ru: 'Записаться',           kz: 'Тіркелу'              },
        enrolled:       { en: 'Enrolled',             ru: 'Записан',              kz: 'Тіркелді'             },
        enrolling:      { en: 'Enrolling…',           ru: 'Запись…',              kz: 'Тіркелуде…'           },
        curriculum:     { en: 'Curriculum',           ru: 'Учебная программа',    kz: 'Оқу бағдарламасы'     },
        addModule:      { en: '+ Add Module',         ru: '+ Добавить модуль',    kz: '+ Модуль қосу'        },
        addLesson:      { en: '+ Lesson',             ru: '+ Урок',               kz: '+ Сабақ'              },
        addAssignment:  { en: '+ HW',                 ru: '+ ДЗ',                 kz: '+ ҮЖ'                 },
        noCourses:      { en: 'No courses',           ru: 'Нет курсов',           kz: 'Курстар жоқ'          },
        viewCourse:     { en: 'View Course',          ru: 'Открыть курс',         kz: 'Курсты ашу'           },
        manage:         { en: 'Manage',               ru: 'Управлять',            kz: 'Басқару'              },
        editCourse:     { en: 'Edit Course',          ru: 'Редактировать курс',   kz: 'Курсты өңдеу'         },
        deleteCourse:   { en: 'Delete Course',        ru: 'Удалить курс',         kz: 'Курсты жою'           },
        searchCourses:  { en: 'Search courses…',      ru: 'Поиск курсов…',        kz: 'Курстарды іздеу…'     },
        finalModule:    { en: 'Final Module',         ru: 'Финальный модуль',     kz: 'Соңғы модуль'         },
        noModules:      { en: 'No modules yet.',      ru: 'Пока нет модулей.',    kz: 'Әзірге модульдер жоқ.' },
        backToCourses:  { en: 'Back to courses',      ru: 'К списку курсов',      kz: 'Курстарға оралу'      },
    },
    // ── Lessons ───────────────────────────────────────────────────────────────
    lessons: {
        markComplete:   { en: 'Mark Complete',     ru: 'Отметить выполненным', kz: 'Орындалды деп белгілеу' },
        completed:      { en: 'Completed',         ru: 'Выполнено',            kz: 'Орындалды'              },
        marking:        { en: 'Marking…',          ru: 'Отмечаем…',            kz: 'Белгіленуде…'           },
        by:             { en: 'by',                ru: 'автор:',               kz: 'авторы:'                },
        due:            { en: 'Due:',              ru: 'Срок:',                kz: 'Мерзім:'                },
        opensOn:        { en: 'Opens',             ru: 'Открывается',          kz: 'Ашылады'                },
        lockedLesson:   { en: 'Lesson not available yet', ru: 'Урок ещё не открыт', kz: 'Сабақ әлі ашылмаған' },
        backToCourse:   { en: 'Back to Course',    ru: 'К курсу',              kz: 'Курсқа оралу'           },
        lessonContent:  { en: 'Lesson Content',    ru: 'Содержание урока',     kz: 'Сабақ мазмұны'          },
        textLesson:     { en: 'Text Lecture',      ru: 'Текстовая лекция',     kz: 'Мәтіндік дәріс'         },
        videoLesson:    { en: 'YouTube Video',     ru: 'Видеолекция (YouTube)',kz: 'Бейне дәріс (YouTube)'  },
        practiceLesson: { en: 'Practice Task',     ru: 'Практическое задание', kz: 'Практикалық тапсырма'   },
        noContent:      { en: 'No content provided for this lesson.', ru: 'Содержание урока не добавлено.', kz: 'Сабақ мазмұны қосылмаған.' },
    },
    // ── Assignments / Grades ──────────────────────────────────────────────────
    grades: {
        title:          { en: 'My Grades',         ru: 'Мои оценки',           kz: 'Менің бағаларым'        },
        graded:         { en: 'Graded',            ru: 'Оценено',              kz: 'Бағаланды'              },
        pending:        { en: 'Pending',           ru: 'Ожидает проверки',     kz: 'Тексерілуде'            },
        awaitingReview: { en: 'Awaiting review',   ru: 'Ожидает проверки',     kz: 'Тексеруді күтуде'       },
        feedback:       { en: 'Teacher Feedback',  ru: 'Комментарий преподавателя', kz: 'Оқытушының пікірі'  },
        noFeedback:     { en: 'No written feedback provided.', ru: 'Письменный комментарий не оставлен.', kz: 'Жазбаша пікір берілмеген.' },
        yourSubmission: { en: 'Your Submission',   ru: 'Ваш ответ',            kz: 'Сіздің жауабыңыз'       },
        score:          { en: 'Score',             ru: 'Оценка',               kz: 'Баға'                   },
        maxScore:       { en: 'Max score',         ru: 'Максимальный балл',     kz: 'Максималды ұпай'        },
        avgScore:       { en: 'Average score',     ru: 'Средний балл',          kz: 'Орташа балл'            },
        best:           { en: 'Best',              ru: 'Лучший',               kz: 'Үздік'                  },
        submitAnswer:   { en: 'Submit Answer',     ru: 'Отправить ответ',      kz: 'Жауапты жіберу'         },
        submitting:     { en: 'Submitting…',       ru: 'Отправка…',            kz: 'Жіберілуде…'            },
    },
    // ── Certificates ─────────────────────────────────────────────────────────
    certificates: {
        title:          { en: 'My Certificates',   ru: 'Мои сертификаты',      kz: 'Менің сертификаттарым'  },
        download:       { en: 'Download PDF',      ru: 'Скачать PDF',          kz: 'PDF жүктеу'             },
        downloading:    { en: 'Downloading…',      ru: 'Скачивание…',          kz: 'Жүктелуде…'             },
        issued:         { en: 'Issued:',           ru: 'Выдан:',               kz: 'Берілді:'               },
        generating:     { en: 'Generating PDF…',   ru: 'Генерируется PDF…',    kz: 'PDF жасалуда…'          },
        noCerts:        { en: 'No certificates yet', ru: 'Сертификатов пока нет', kz: 'Сертификаттар жоқ'   },
        complete:       { en: 'Complete a course to earn your first certificate!', ru: 'Завершите курс, чтобы получить первый сертификат!', kz: 'Алғашқы сертификатыңызды алу үшін курсты аяқтаңыз!' },
        courseCompleted:{ en: 'Course Completed!', ru: 'Курс завершён!',        kz: 'Курс аяқталды!'         },
        getCert:        { en: 'Get My Certificate',ru: 'Получить сертификат',   kz: 'Сертификатымды алу'     },
        congrats:       { en: 'Congratulations! You\'ve successfully completed', ru: 'Поздравляем! Вы успешно завершили', kz: 'Құттықтаймыз! Сіз сәтті аяқтадыңыз' },
        certReady:      { en: 'Your certificate is ready to be claimed.', ru: 'Ваш сертификат готов к получению.', kz: 'Сертификатыңыз алуға дайын.' },
    },
    // ── Notifications ─────────────────────────────────────────────────────────
    notifications: {
        title:          { en: 'Notifications',     ru: 'Уведомления',          kz: 'Хабарламалар'           },
        markAllRead:    { en: 'Mark all as read',  ru: 'Отметить всё как прочитанное', kz: 'Барлығын оқылды деп белгілеу' },
        noNotifs:       { en: 'No notifications yet', ru: 'Уведомлений пока нет', kz: 'Хабарламалар жоқ'    },
        allCaughtUp:    { en: 'You\'re all caught up!', ru: 'Всё прочитано!',   kz: 'Барлығы оқылды!'        },
        gradeReceived:  { en: 'Grade received',    ru: 'Получена оценка',       kz: 'Баға алынды'            },
        courseCompleted:{ en: 'Course completed',  ru: 'Курс завершён',         kz: 'Курс аяқталды'          },
        justNow:        { en: 'Just now',          ru: 'Только что',            kz: 'Жаңа ғана'              },
        unread:         { en: 'Unread',            ru: 'Непрочитанные',         kz: 'Оқылмаған'              },
        all:            { en: 'All',               ru: 'Все',                   kz: 'Барлығы'                },
    },
    // ── Reviews ───────────────────────────────────────────────────────────────
    reviews: {
        title:          { en: 'Reviews',           ru: 'Отзывы',               kz: 'Пікірлер'               },
        leaveReview:    { en: 'Leave a Review',    ru: 'Оставить отзыв',       kz: 'Пікір қалдыру'          },
        rating:         { en: 'Rating',            ru: 'Оценка',               kz: 'Рейтинг'                },
        comment:        { en: 'Comment (optional)',ru: 'Комментарий (необязательно)', kz: 'Пікір (міндетті емес)' },
        submitReview:   { en: 'Submit Review',     ru: 'Отправить отзыв',      kz: 'Пікірді жіберу'         },
        noReviews:      { en: 'No reviews yet for this course.', ru: 'Отзывов для этого курса пока нет.', kz: 'Бұл курс үшін пікірлер жоқ.' },
        yourCourse:     { en: 'Your course',       ru: 'Ваш курс',             kz: 'Сіздің курсыңыз'         },
    },
    // ── Analytics ─────────────────────────────────────────────────────────────
    analytics: {
        title:          { en: 'Students & Analytics', ru: 'Студенты и аналитика', kz: 'Студенттер мен талдау' },
        activeStudents: { en: 'Active Students',    ru: 'Активных студентов',   kz: 'Белсенді студенттер'    },
        avgCompletion:  { en: 'Avg. Completion',    ru: 'Средн. завершение',    kz: 'Орт. аяқтау'           },
        avgScore:       { en: 'Avg. Score',         ru: 'Средний балл',          kz: 'Орташа балл'            },
        totalEnrolled:  { en: 'Total Enrolled',     ru: 'Всего записан',         kz: 'Барлық тіркелгендер'    },
        progress:       { en: 'Progress',           ru: 'Прогресс',             kz: 'Прогресс'               },
    },
    // ── Grading page ──────────────────────────────────────────────────────────
    grading: {
        title:          { en: 'Grading',           ru: 'Проверка заданий',     kz: 'Тапсырмаларды тексеру'  },
        pending:        { en: 'Pending',           ru: 'Ожидает проверки',     kz: 'Тексерілуде'            },
        graded:         { en: 'Graded',            ru: 'Оценено',              kz: 'Бағаланды'              },
        all:            { en: 'All',               ru: 'Все',                  kz: 'Барлығы'                },
        allGraded:      { en: '🎉 All submissions are graded!', ru: '🎉 Все задания проверены!', kz: '🎉 Барлық тапсырмалар тексерілді!' },
        studentAnswer:  { en: "Student's Answer",  ru: 'Ответ студента',       kz: 'Студенттің жауабы'      },
        submitGrade:    { en: 'Submit Grade',      ru: 'Выставить оценку',     kz: 'Баға қою'               },
        updateGrade:    { en: 'Update Grade',      ru: 'Изменить оценку',      kz: 'Бағаны өзгерту'         },
        writeFeedback:  { en: 'Write feedback for the student…', ru: 'Напишите комментарий студенту…', kz: 'Студентке пікір жазыңыз…' },
    },
} as const;

export type TranslationKey = keyof typeof translations;
export type TranslationSubKey<T extends TranslationKey> = keyof (typeof translations)[T];