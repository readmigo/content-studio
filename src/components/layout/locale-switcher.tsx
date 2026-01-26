'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const locales = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
];

interface LocaleSwitcherProps {
  collapsed?: boolean;
}

export function LocaleSwitcher({ collapsed = false }: LocaleSwitcherProps) {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const currentLocale = locales.find((l) => l.code === locale) || locales[0];

  function onSelectChange(value: string) {
    startTransition(() => {
      document.cookie = `locale=${value}; path=/; max-age=31536000`;
      window.location.reload();
    });
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] w-full transition-colors',
            'text-[var(--gray-600)] hover:bg-[rgba(139,185,255,0.15)]',
            collapsed && 'justify-center px-0'
          )}
          disabled={isPending}
          title={collapsed ? currentLocale.label : undefined}
        >
          <Globe className="w-5 h-5 min-w-5" />
          {!collapsed && <span className="text-sm">{currentLocale.label}</span>}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="glass-panel p-1 z-50 min-w-[120px]"
          sideOffset={5}
          side={collapsed ? 'right' : 'top'}
          align="start"
        >
          {locales.map((l) => (
            <DropdownMenu.Item
              key={l.code}
              className={cn(
                'px-3 py-2 text-sm cursor-pointer rounded-[var(--radius-md)] outline-none',
                'hover:bg-[rgba(139,185,255,0.15)] focus:bg-[rgba(139,185,255,0.15)]',
                l.code === locale && 'bg-[rgba(139,185,255,0.2)]'
              )}
              onSelect={() => onSelectChange(l.code)}
            >
              {l.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
