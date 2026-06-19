import { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '../../i18n/dictionaries';
import { APP_NAME } from '../../lib/constants';
import { Layers, CreditCard, HardDrive, FileText, Activity, ShieldCheck } from 'lucide-react';

const icons = [Layers, CreditCard, HardDrive, FileText, Activity, ShieldCheck];

type Props = {
  params: Promise<{ landing: string }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.landing || 'ru';
  const t = getDictionary(locale);

  return {
    title: t.seo.home.title,
    description: t.seo.home.description,
    alternates: {
      canonical: `https://edutech.kz/${locale}`,
      languages: {
        'ru-KZ': 'https://edutech.kz/ru',
        'kk-KZ': 'https://edutech.kz/kk',
        'en-US': 'https://edutech.kz/en',
      },
    },
  };
}

export default async function LandingPage({ params }: Props) {
  const resolvedParams = await params;
  const locale = resolvedParams.landing || 'ru';
  const t = getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "EduTech",
    "url": "https://edutech.kz",
    "logo": "https://edutech.kz/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Almaty",
      "addressRegion": "Almaty Region",
      "addressCountry": "KZ"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Almaty"
      },
      {
        "@type": "City",
        "name": "Astana"
      },
      {
        "@type": "City",
        "name": "Shymkent"
      }
    ]
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-slate-50 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-500 to-purple-400 blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-cyan-400 to-blue-500 blur-3xl opacity-40 pointer-events-none" />

      {/* Hero Section */}
      <main className="z-10 text-center max-w-4xl px-4 py-24 space-y-8 mt-12">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
          {t.home.heroTitle} <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500">{APP_NAME}</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {t.home.heroSubtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link
            href="/login"
            className="inline-flex h-14 items-center justify-center rounded-full bg-indigo-600 px-8 text-base font-medium text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-indigo-700 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {t.home.ctaStart}
          </Link>
          <Link
            href={`/${locale}/contacts`}
            className="inline-flex h-14 items-center justify-center rounded-full border border-slate-200/60 bg-white px-8 text-base font-medium text-slate-700 shadow-sm transition-all duration-300 ease-in-out hover:bg-slate-50 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 group"
          >
            {t.home.ctaDemo}
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </main>

      {/* Stats Section */}
      <section className="z-10 w-full max-w-6xl px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {t.home.stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center space-y-2">
              <span className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">{stat.value}</span>
              <span className="text-sm md:text-base text-slate-500 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits (Bento Grid) */}
      <section className="z-10 w-full max-w-6xl px-4 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-slate-800">{t.home.benefitsTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.home.benefits.map((benefit, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div key={i} className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col items-start gap-4">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="z-10 w-full max-w-6xl px-4 py-24 mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-slate-800">{t.home.testimonialsTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.home.testimonials.map((test, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md">
              <p className="text-slate-600 italic mb-6 leading-relaxed">&quot;{test.text}&quot;</p>
              <div>
                <p className="font-semibold text-slate-900">{test.author}</p>
                <p className="text-sm text-indigo-500">{test.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
