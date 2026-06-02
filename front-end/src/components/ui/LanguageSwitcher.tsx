'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LOCALES, Locale } from '../../lib/i18n/translations';
import { getLocale, setLocale } from '../../lib/i18n/useTranslation';
import { Globe, ChevronDown, Check } from 'lucide-react';

export function LanguageSwitcher() {
  const current = getLocale();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentMeta = LOCALES.find((l) => l.code === current) || LOCALES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center" ref={containerRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center gap-1.5 w-9 h-9 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 bg-white rounded-xl shadow-xl ring-1 ring-slate-200 overflow-hidden min-w-[140px]">
          {LOCALES.map((loc) => {
            const isActive = current === loc.code;
            return (
              <button
                key={loc.code}
                onClick={() => {
                  setLocale(loc.code as Locale);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 ${
                  isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700'
                }`}
              >
                <span className="text-base">{loc.flag}</span>
                <span>{loc.label}</span>
                {isActive && <Check className="w-4 h-4 ml-auto text-indigo-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}