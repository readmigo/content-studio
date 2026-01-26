'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Locale, defaultLocale, locales } from '../i18n';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: defaultLocale,
      setLocale: (locale: Locale) => {
        if (locales.includes(locale)) {
          // Set cookie for server-side
          document.cookie = `locale=${locale};path=/;max-age=31536000`;
          set({ locale });
          // Reload to apply new locale
          window.location.reload();
        }
      },
    }),
    {
      name: 'content-studio-locale',
    },
  ),
);
