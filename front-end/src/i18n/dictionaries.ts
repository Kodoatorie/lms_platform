export const dictionaries = {
  ru: {
    seo: {
      home: {
        title: "EduTech — Инновационная LMS для Казахстана (Алматы, Астана, Шымкент)",
        description: "EduTech: масштабируемая система управления обучением (LMS) для компаний и школ в Алматы, Астане и Шымкенте. Автоматизируйте образование с нами.",
      },
      pricing: {
        title: "Тарифы EduTech — Доступные решения для обучения в Казахстане",
        description: "Гибкие тарифные планы EduTech для бизнеса в Казахстане. Оплата в KZT, интеграция со Stripe, закрывающие документы для ТОО и ИП.",
      },
      features: {
        title: "Возможности EduTech — Платформа для обучения (LMS)",
        description: "Узнайте о возможностях EduTech: роли (Студент, Учитель, Администратор), надежная архитектура (Nginx, Redis, MinIO), автогенерация сертификатов.",
      },
      contacts: {
        title: "Контакты EduTech — Офисы в Алматы и Астане",
        description: "Свяжитесь с командой EduTech. Наши офисы: БЦ на Аль-Фараби (Алматы) и EXPO-центр (Астана).",
      }
    },
    home: {
      heroTitle: "Будущее обучения с",
      heroSubtitle: "Автоматизация образования для компаний, учебных центров и школ в Алматы, Астане и по всему Казахстану.",
      ctaStart: "Начать обучение",
      ctaDemo: "Демо для бизнеса",
      stats: [
        { value: "15,000+", label: "Студентов по РК" },
        { value: "200+", label: "Курсов" },
        { value: "98%", label: "Успешных завершений" },
        { value: "KZT/USD", label: "Поддержка валют" }
      ],
      benefitsTitle: "Почему выбирают нас",
      benefits: [
        { title: "Трёхязычный UI", desc: "Поддержка RU, KZ, EN из коробки." },
        { title: "Платежи Stripe", desc: "Нативная интеграция и прием платежей." },
        { title: "Хранилище MinIO", desc: "Безопасное хранение файлов и видео." },
        { title: "PDF-сертификаты", desc: "Автоматическая генерация по завершению." },
        { title: "Очереди BullMQ", desc: "Надежная фоновая обработка задач." },
        { title: "Отказоустойчивость", desc: "Nginx для балансировки нагрузки." }
      ],
      testimonialsTitle: "Отзывы клиентов из Казахстана",
      testimonials: [
        { text: "Отличная платформа, мы перевели весь наш центр в Астане на эту LMS за неделю.", author: "CEO EdTech-центра", location: "Астана" },
        { text: "Удобный интерфейс и поддержка оплат в тенге. Мои ученики в восторге.", author: "Частный преподаватель", location: "Алматы" },
        { text: "Техническая стабильность и авто-сертификаты экономят нам массу времени.", author: "Директор школы", location: "Шымкент" }
      ]
    },
    pricing: {
      toggleMonthly: "Ежемесячно",
      toggleYearly: "Ежегодно (-20%)",
      plans: [
        { name: "Базовый", price: "15 000", features: ["До 100 студентов", "Базовая аналитика", "Поддержка по email"] },
        { name: "Бизнес", price: "45 000", features: ["До 1000 студентов", "Интеграция со Stripe", "Выдача сертификатов", "Приоритетная поддержка"], highlight: true },
        { name: "Корпоративный", price: "Индивидуально", features: ["Безлимит", "Собственное хранилище (MinIO)", "API доступ", "Персональный менеджер"] }
      ],
      faqTitle: "Частые вопросы",
      faqs: [
        { q: "Какой аптайм у платформы?", a: "Мы гарантируем аптайм 99.9% благодаря надежной архитектуре." },
        { q: "Принимаете ли вы платежи в KZT?", a: "Да, благодаря нативной интеграции со Stripe." },
        { q: "Где хранятся наши данные?", a: "Все данные надежно зашифрованы и хранятся в защищенном хранилище MinIO." },
        { q: "Предоставляете ли вы закрывающие документы?", a: "Да, для ТОО и ИП в РК." },
        { q: "Можно ли брендировать портал?", a: "Да, в Корпоративном тарифе доступна полная кастомизация (White-label)." }
      ]
    },
    features: {
      rolesTitle: "Интерфейсы для каждой роли",
      roles: [
        { id: "student", label: "Студент", features: ["Просмотр курсов", "Сдача тестов", "Получение сертификатов"] },
        { id: "teacher", label: "Учитель", features: ["Создание уроков", "Проверка заданий", "Аналитика успеваемости"] },
        { id: "admin", label: "Администратор", features: ["Управление пользователями", "Логи платежей Stripe", "Настройки платформы"] }
      ],
      techTitle: "Технический стек",
      techDesc: "Современная и отказоустойчивая архитектура."
    },
    contacts: {
      officesTitle: "Наши офисы в Казахстане",
      offices: [
        { city: "Алматы", address: "БЦ на Аль-Фараби / Almaty Hub", phone: "+7 707 123 4567", email: "almaty@edutech.kz" },
        { city: "Астана", address: "EXPO-центр / Astana Hub", phone: "+7 701 987 6543", email: "astana@edutech.kz" }
      ],
      formTitle: "Связаться с нами",
      formName: "Имя",
      formEmail: "Email",
      formMessage: "Сообщение",
      formSubmit: "Отправить заявку"
    }
  },
  kk: {
    seo: {
      home: {
        title: "EduTech — Қазақстанға арналған инновациялық LMS (Алматы, Астана, Шымкент)",
        description: "EduTech: Алматы, Астана және Шымкенттегі компаниялар мен мектептерге арналған масштабталатын оқытуды басқару жүйесі.",
      },
      pricing: {
        title: "EduTech Тарифтері — Қазақстандағы қолжетімді оқыту шешімдері",
        description: "Қазақстандағы бизнеске арналған EduTech икемді тарифтік жоспарлары. KZT төлемі, Stripe.",
      },
      features: {
        title: "EduTech Мүмкіндіктері — Оқыту платформасы (LMS)",
        description: "EduTech мүмкіндіктері туралы біліңіз: рөлдер, сенімді архитектура.",
      },
      contacts: {
        title: "EduTech Контактілері — Алматы және Астанадағы кеңселер",
        description: "EduTech командасымен байланысыңыз. Біздің кеңселер: Әл-Фарабидегі БО (Алматы) және EXPO-орталық (Астана).",
      }
    },
    home: {
      heroTitle: "Оқытудың болашағы",
      heroSubtitle: "Алматы, Астана және бүкіл Қазақстан бойынша компаниялар, оқу орталықтары мен мектептер үшін білім беруді автоматтандыру.",
      ctaStart: "Оқуды бастау",
      ctaDemo: "Бизнеске арналған демо",
      stats: [
        { value: "15,000+", label: "ҚР бойынша студенттер" },
        { value: "200+", label: "Курстар" },
        { value: "98%", label: "Сәтті аяқтау" },
        { value: "KZT/USD", label: "Валюталарды қолдау" }
      ],
      benefitsTitle: "Неліктен бізді таңдайды",
      benefits: [
        { title: "Үш тілді UI", desc: "Қораптан RU, KZ, EN қолдауы." },
        { title: "Stripe төлемдері", desc: "Нативті интеграция және төлемдерді қабылдау." },
        { title: "MinIO қоймасы", desc: "Файлдар мен видеоларды қауіпсіз сақтау." },
        { title: "PDF-сертификаттар", desc: "Аяқтаған кезде автоматты түрде жасау." },
        { title: "BullMQ кезектері", desc: "Тапсырмаларды сенімді өңдеу." },
        { title: "Ақауларға төзімділік", desc: "Жүктемені теңестіруге арналған Nginx." }
      ],
      testimonialsTitle: "Қазақстандағы клиенттердің пікірлері",
      testimonials: [
        { text: "Керемет платформа, біз Астанадағы барлық орталығымызды осы LMS-ке бір апта ішінде ауыстырдық.", author: "EdTech орталығының бас директоры", location: "Астана" },
        { text: "Қолайлы интерфейс және теңгемен төлем жасауды қолдау. Менің оқушыларым риза.", author: "Жеке оқытушы", location: "Алматы" },
        { text: "Техникалық тұрақтылық және авто-сертификаттар біздің уақытымызды үнемдейді.", author: "Мектеп директоры", location: "Шымкент" }
      ]
    },
    pricing: {
      toggleMonthly: "Ай сайын",
      toggleYearly: "Жыл сайын (-20%)",
      plans: [
        { name: "Базалық", price: "15 000", features: ["100 студентке дейін", "Базалық аналитика", "Email арқылы қолдау"] },
        { name: "Бизнес", price: "45 000", features: ["1000 студентке дейін", "Stripe интеграциясы", "Сертификаттар беру", "Басымдықты қолдау"], highlight: true },
        { name: "Корпоративті", price: "Жеке", features: ["Шексіз", "Жеке қойма (MinIO)", "API қолжетімділігі", "Жеке менеджер"] }
      ],
      faqTitle: "Жиі қойылатын сұрақтар",
      faqs: [
        { q: "Платформаның аптаймы қандай?", a: "Сенімді архитектураның арқасында 99.9% аптаймға кепілдік береміз." },
        { q: "KZT төлемдерін қабылдайсыз ба?", a: "Иә, Stripe-пен нативті интеграцияның арқасында." },
        { q: "Деректеріміз қайда сақталады?", a: "Барлық деректер шифрланған және MinIO қоймасында қауіпсіз сақталады." },
        { q: "Жабу құжаттарын ұсынасыз ба?", a: "Иә, ҚР ЖШС және ЖК үшін." },
        { q: "Порталды брендтеуге бола ма?", a: "Иә, Корпоративті тарифте толық кастомизация (White-label) қолжетімді." }
      ]
    },
    features: {
      rolesTitle: "Әр рөлге арналған интерфейстер",
      roles: [
        { id: "student", label: "Студент", features: ["Курстарды көру", "Тесттер тапсыру", "Сертификаттар алу"] },
        { id: "teacher", label: "Мұғалім", features: ["Сабақтар жасау", "Тапсырмаларды тексеру", "Үлгерім аналитикасы"] },
        { id: "admin", label: "Әкімші", features: ["Пайдаланушыларды басқару", "Stripe төлемдер журналы", "Платформа параметрлері"] }
      ],
      techTitle: "Техникалық стек",
      techDesc: "Заманауи және ақауларға төзімді архитектура."
    },
    contacts: {
      officesTitle: "Қазақстандағы біздің кеңселер",
      offices: [
        { city: "Алматы", address: "Әл-Фарабидегі БО / Almaty Hub", phone: "+7 707 123 4567", email: "almaty@edutech.kz" },
        { city: "Астана", address: "EXPO-орталық / Astana Hub", phone: "+7 701 987 6543", email: "astana@edutech.kz" }
      ],
      formTitle: "Бізбен байланысыңыз",
      formName: "Аты",
      formEmail: "Email",
      formMessage: "Хабарлама",
      formSubmit: "Өтінім жіберу"
    }
  },
  en: {
    seo: {
      home: {
        title: "EduTech — Innovative LMS for Kazakhstan (Almaty, Astana, Shymkent)",
        description: "EduTech: Scalable Learning Management System (LMS) for companies and schools in Almaty, Astana, and Shymkent. Automate education with us.",
      },
      pricing: {
        title: "EduTech Pricing — Affordable Learning Solutions in Kazakhstan",
        description: "Flexible EduTech pricing plans for business in Kazakhstan. Pay in KZT, Stripe integration, closing documents for LLP and IE.",
      },
      features: {
        title: "EduTech Features — Learning Platform (LMS)",
        description: "Learn about EduTech features: roles (Student, Teacher, Admin), reliable architecture (Nginx, Redis, MinIO), auto-generation of certificates.",
      },
      contacts: {
        title: "EduTech Contacts — Offices in Almaty and Astana",
        description: "Contact the EduTech team. Our offices: Business Center on Al-Farabi (Almaty) and EXPO Center (Astana).",
      }
    },
    home: {
      heroTitle: "The future of learning with",
      heroSubtitle: "Educational automation for companies, learning centers, and schools in Almaty, Astana, and across Kazakhstan.",
      ctaStart: "Start Learning",
      ctaDemo: "Demo for Business",
      stats: [
        { value: "15,000+", label: "Students in KZ" },
        { value: "200+", label: "Courses" },
        { value: "98%", label: "Completion Rate" },
        { value: "KZT/USD", label: "Currency Support" }
      ],
      benefitsTitle: "Why Choose Us",
      benefits: [
        { title: "Tri-lingual UI", desc: "Out of the box support for RU, KZ, EN." },
        { title: "Stripe Payments", desc: "Native integration and payment processing." },
        { title: "MinIO Storage", desc: "Secure storage for files and videos." },
        { title: "PDF Certificates", desc: "Auto-generation upon completion." },
        { title: "BullMQ Queues", desc: "Reliable background task processing." },
        { title: "Fault Tolerance", desc: "Nginx for load balancing." }
      ],
      testimonialsTitle: "Feedback from Clients in Kazakhstan",
      testimonials: [
        { text: "Great platform, we moved our entire center in Astana to this LMS in a week.", author: "CEO of EdTech Center", location: "Astana" },
        { text: "User-friendly interface and support for payments in tenge. My students are thrilled.", author: "Private Tutor", location: "Almaty" },
        { text: "Technical stability and auto-certificates save us a ton of time.", author: "School Principal", location: "Shymkent" }
      ]
    },
    pricing: {
      toggleMonthly: "Monthly",
      toggleYearly: "Yearly (-20%)",
      plans: [
        { name: "Basic", price: "15,000", features: ["Up to 100 students", "Basic analytics", "Email support"] },
        { name: "Business", price: "45,000", features: ["Up to 1000 students", "Stripe integration", "Certificate issuance", "Priority support"], highlight: true },
        { name: "Enterprise", price: "Custom", features: ["Unlimited", "Private storage (MinIO)", "API access", "Dedicated manager"] }
      ],
      faqTitle: "Frequently Asked Questions",
      faqs: [
        { q: "What is the platform's uptime?", a: "We guarantee 99.9% uptime thanks to a reliable architecture." },
        { q: "Do you accept payments in KZT?", a: "Yes, thanks to native integration with Stripe." },
        { q: "Where is our data stored?", a: "All data is securely encrypted and stored in secure MinIO storage." },
        { q: "Do you provide closing documents?", a: "Yes, for LLPs and IEs in Kazakhstan." },
        { q: "Can the portal be branded?", a: "Yes, full customization (White-label) is available in the Enterprise plan." }
      ]
    },
    features: {
      rolesTitle: "Interfaces for Every Role",
      roles: [
        { id: "student", label: "Student", features: ["View courses", "Take tests", "Get certificates"] },
        { id: "teacher", label: "Teacher", features: ["Create lessons", "Grade assignments", "Performance analytics"] },
        { id: "admin", label: "Admin", features: ["Manage users", "Stripe payment logs", "Platform settings"] }
      ],
      techTitle: "Tech Stack",
      techDesc: "Modern and fault-tolerant architecture."
    },
    contacts: {
      officesTitle: "Our Offices in Kazakhstan",
      offices: [
        { city: "Almaty", address: "BC on Al-Farabi / Almaty Hub", phone: "+7 707 123 4567", email: "almaty@edutech.kz" },
        { city: "Astana", address: "EXPO Center / Astana Hub", phone: "+7 701 987 6543", email: "astana@edutech.kz" }
      ],
      formTitle: "Contact Us",
      formName: "Name",
      formEmail: "Email",
      formMessage: "Message",
      formSubmit: "Submit Request"
    }
  }
} as const;

export type Locale = keyof typeof dictionaries;

export function getDictionary(locale: string) {
  return dictionaries[locale as Locale] ?? dictionaries.ru;
}
