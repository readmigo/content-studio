'use client';

import { cn } from '@/lib/utils';
import { ReaderTheme } from './theme-switcher';
import '@/styles/reader-theme/base.css';
import '@/styles/reader-theme/light.css';
import '@/styles/reader-theme/sepia.css';
import '@/styles/reader-theme/dark.css';

interface ReaderContentProps {
  html: string;
  theme: ReaderTheme;
  className?: string;
}

export function ReaderContent({ html, theme, className }: ReaderContentProps) {
  const themeClass = `reader-theme-${theme}`;

  return (
    <div
      className={cn('reader-content', themeClass, className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
