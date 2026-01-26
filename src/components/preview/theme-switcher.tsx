'use client';

import { cn } from '@/lib/utils';

export type ReaderTheme = 'light' | 'sepia' | 'dark';

interface ThemeSwitcherProps {
  theme: ReaderTheme;
  onThemeChange: (theme: ReaderTheme) => void;
}

export function ThemeSwitcher({ theme, onThemeChange }: ThemeSwitcherProps) {
  const themes: { id: ReaderTheme; label: string; bg: string; text: string }[] = [
    { id: 'light', label: '亮', bg: '#ffffff', text: '#1a1a1a' },
    { id: 'sepia', label: '暗', bg: '#f4ecd8', text: '#5b4636' },
    { id: 'dark', label: '夜', bg: '#1a1a1a', text: '#e0e0e0' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => onThemeChange(t.id)}
          className={cn(
            'w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium transition-all',
            theme === t.id
              ? 'ring-2 ring-primary ring-offset-2'
              : 'hover:opacity-80'
          )}
          style={{
            backgroundColor: t.bg,
            color: t.text,
          }}
          title={`${t.label}色主题`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
