'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, GraduationCap } from 'lucide-react';
import { getLocale } from '../../lib/i18n/useTranslation';
import { getDictionary } from '../../i18n/dictionaries';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { APP_NAME } from '../../lib/constants';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [locale, setLocale] = useState('ru');
  const pathname = usePathname();

  useEffect(() => {
    const currentLocale = getLocale();
    if (currentLocale) {
      setLocale(currentLocale);
    }
  }, []);

  const normalizedLocale = locale === 'kz' ? 'kk' : locale;
  const t = getDictionary(normalizedLocale);

  const navLinks = [
    { href: `/features`, label: t.layout.nav.features, active: pathname === '/features' },
    { href: `/pricing`, label: t.layout.nav.pricing, active: pathname === '/pricing' },
    { href: `/contacts`, label: t.layout.nav.contacts, active: pathname === '/contacts' },
  ];

  return (
    <nav className="top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/60 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-300">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 font-display">
                {APP_NAME}
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 ${link.active ? 'text-indigo-600 font-semibold' : 'text-slate-600'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-4 py-2"
            >
              {t.layout.nav.login}
            </Link>
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-full bg-indigo-600 px-5 text-sm font-medium text-white shadow-md shadow-indigo-600/10 transition-all duration-300 hover:bg-indigo-700 hover:-translate-y-0.5"
            >
              {t.layout.nav.start}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-xl transition-all duration-300 ease-in-out origin-top ${isOpen ? 'opacity-100 translate-y-0 scale-y-100 visible' : 'opacity-0 -translate-y-4 scale-y-95 invisible'
          }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-4">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2.5 rounded-xl text-base font-medium transition-all ${link.active
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex justify-center items-center h-12 w-full rounded-xl border border-slate-200 text-base font-medium text-slate-700 hover:bg-slate-50 transition-all"
            >
              {t.layout.nav.login}
            </Link>
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex justify-center items-center h-12 w-full rounded-xl bg-indigo-600 text-base font-medium text-white shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 transition-all"
            >
              {t.layout.nav.start}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
