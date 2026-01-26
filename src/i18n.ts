import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export type Locale = 'zh' | 'en';

export const locales: Locale[] = ['zh', 'en'];
export const defaultLocale: Locale = 'zh';

export const localeNames: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
};

export default getRequestConfig(async () => {
  // Try to get locale from cookie first
  const cookieStore = await cookies();
  let locale = cookieStore.get('locale')?.value as Locale | undefined;

  // Fall back to Accept-Language header
  if (!locale || !locales.includes(locale)) {
    const headerStore = await headers();
    const acceptLanguage = headerStore.get('accept-language') || '';

    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().split('-')[0])
      .find((lang) => locales.includes(lang as Locale)) as Locale | undefined;

    locale = preferredLocale || defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
