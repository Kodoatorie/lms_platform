'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GraduationCap, MapPin, Phone, Mail } from 'lucide-react';
import { getLocale } from '../../lib/i18n/useTranslation';
import { getDictionary } from '../../i18n/dictionaries';
import { APP_NAME } from '../../lib/constants';

export default function Footer() {
  const [locale, setLocale] = useState('ru');

  useEffect(() => {
    const currentLocale = getLocale();
    if (currentLocale) {
      setLocale(currentLocale);
    }
  }, []);

  const normalizedLocale = locale === 'kz' ? 'kk' : locale;
  const t = getDictionary(normalizedLocale);

  return (
    <footer className="bg-white border-t border-slate-200/60 text-slate-600 py-16 relative overflow-hidden z-10">
      {/* Subtle bottom blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-gradient-to-t from-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/10">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 font-display">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              {t.layout.footer.desc}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">{t.layout.footer.company}</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/features" className="hover:text-indigo-600 transition-colors">
                  {t.layout.footer.features}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-indigo-600 transition-colors">
                  {t.layout.footer.pricing}
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="hover:text-indigo-600 transition-colors">
                  {t.layout.footer.contacts}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details / Offices */}
          <div className="space-y-4 md:col-span-2">
            <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">{t.layout.footer.offices}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              {t.contacts.offices.map((office, idx) => (
                <div key={idx} className="space-y-2">
                  <span className="font-semibold text-slate-700">{office.city}</span>
                  <div className="space-y-1.5 text-slate-500">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{office.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>{office.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>{office.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} {APP_NAME}. {t.layout.footer.rights}
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-indigo-600 transition-colors">
              {t.layout.footer.privacy}
            </Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">
              {t.layout.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
