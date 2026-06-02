'use client';

import { useCallback } from 'react';
import { translations, Locale, TranslationKey, TranslationSubKey } from '@/src/lib/i18n/translations';

// Read locale from localStorage, fallback to 'en'
export function getLocale(): Locale {
    if (typeof window === 'undefined') return 'en';
    return (localStorage.getItem('locale') as Locale) || 'en';
}

export function setLocale(locale: Locale) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('locale', locale);
    window.location.reload(); // simplest way to re-render everything
}

// Hook: returns a t() function
export function useTranslation() {
    const locale = getLocale();

    const t = useCallback(
        <S extends TranslationKey>(
            section: S,
            key: TranslationSubKey<S>
        ): string => {
            const section_ = translations[section] as any;
            const entry = section_?.[key as string];
            if (!entry) return String(key);
            return entry[locale] ?? entry['en'] ?? String(key);
        },
        [locale]
    );

    return { t, locale };
}