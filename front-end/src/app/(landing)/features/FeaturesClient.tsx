'use client';

import { useState } from 'react';
import { getDictionary } from '../../../i18n/dictionaries';
import { Server, Database, Shield, Zap } from 'lucide-react';

export default function FeaturesClient({ locale }: { locale: string }) {
  const [activeTab, setActiveTab] = useState(0);
  const t = getDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-slate-50 relative overflow-hidden py-24">
      {/* Role Switcher */}
      <section className="z-10 w-full max-w-5xl px-4 mb-24">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-slate-900">
          {t.features.rolesTitle}
        </h1>

        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-slate-200/50 p-1.5 rounded-full border border-slate-200/60">
            {t.features.roles.map((role, idx) => (
              <button
                key={role.id}
                onClick={() => setActiveTab(idx)}
                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === idx
                    ? 'bg-white text-indigo-600 shadow-md transform scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative min-h-[400px] bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40 p-8 overflow-hidden">
          {t.features.roles.map((role, idx) => (
            <div
              key={role.id}
              className={`absolute inset-0 p-8 transition-opacity duration-500 ease-in-out ${
                activeTab === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <div className="flex flex-col md:flex-row gap-8 h-full">
                <div className="flex-1 space-y-6">
                  <h3 className="text-2xl font-bold text-slate-800">{role.label} Dashboard</h3>
                  <ul className="space-y-4">
                    {role.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-3 text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center relative overflow-hidden">
                   {/* Placeholder for dashboard screenshot */}
                   <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100 opacity-50" />
                   <span className="text-slate-400 font-medium relative z-10">UI Preview</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Showcase */}
      <section className="z-10 w-full max-w-5xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t.features.techTitle}</h2>
          <p className="text-lg text-slate-600">{t.features.techDesc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: Server, name: 'Nginx', desc: 'Load Balancing & Reverse Proxy' },
            { icon: Zap, name: 'Express / Next.js', desc: 'High-performance Backend & SSR' },
            { icon: Database, name: 'Redis', desc: 'In-memory Caching & BullMQ' },
            { icon: Shield, name: 'MinIO', desc: 'S3-compatible Secure Storage' }
          ].map((tech, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-slate-200/60 p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-500/30 group">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition-colors">
                <tech.icon className="w-8 h-8 text-slate-700 group-hover:text-indigo-600 transition-colors" />
              </div>
              <h4 className="font-bold text-slate-800 mb-2">{tech.name}</h4>
              <p className="text-sm text-slate-500">{tech.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
