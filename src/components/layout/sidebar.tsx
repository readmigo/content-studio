'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Settings2,
  GraduationCap,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import { useSidebarStore } from '@/stores/sidebar-store';
import { EnvSwitcher } from './env-switcher';
import { LocaleSwitcher } from './locale-switcher';
import { useEnvStore } from '@/stores/env-store';

const navItems = [
  {
    titleKey: 'books',
    href: '/',
    icon: BookOpen,
  },
  {
    titleKey: 'rules',
    href: '/rules',
    icon: Settings2,
  },
  {
    titleKey: 'ruleMigration',
    href: '/rules/migration',
    icon: ArrowLeftRight,
  },
  {
    titleKey: 'learning',
    href: '/learning',
    icon: GraduationCap,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const tEnv = useTranslations('env');
  const { collapsed, toggle } = useSidebarStore();
  const { isProduction } = useEnvStore();

  return (
    <aside
      className={cn(
        'glass-panel flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo & Toggle */}
      <div className="p-3 border-b border-[rgba(139,185,255,0.2)] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 min-w-10 rounded-xl bg-[var(--brand-gradient-button)] flex items-center justify-center text-white">
            <BookOpen className="w-6 h-6" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg text-[var(--gray-800)] whitespace-nowrap">
              书籍排版
            </span>
          )}
        </Link>
        <button
          onClick={toggle}
          className="w-8 h-8 min-w-8 flex items-center justify-center rounded-lg hover:bg-[rgba(139,185,255,0.15)] text-[var(--gray-500)] transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'nav-item-glass',
                isActive && 'active',
                collapsed && 'justify-center px-0'
              )}
              title={collapsed ? t(item.titleKey) : undefined}
            >
              <item.icon className="w-5 h-5 min-w-5" />
              {!collapsed && <span>{t(item.titleKey)}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Tools Section */}
      <div className="border-t border-[rgba(139,185,255,0.2)] p-2 space-y-2">
        {/* Production Warning */}
        {isProduction() && !collapsed && (
          <div className="alert-glass alert-error text-xs py-1.5 px-2 mb-2">
            <AlertTriangle className="w-3 h-3" />
            <span>{tEnv('productionWarning')}</span>
          </div>
        )}
        {isProduction() && collapsed && (
          <div className="flex justify-center mb-2" title={tEnv('productionWarning')}>
            <AlertTriangle className="w-5 h-5 text-[var(--destructive)]" />
          </div>
        )}

        {/* Environment Switcher */}
        <EnvSwitcher collapsed={collapsed} />

        {/* Locale Switcher */}
        <LocaleSwitcher collapsed={collapsed} />

        {/* Logout */}
        <button
          onClick={() => {
            window.location.href = '/login';
          }}
          className={cn(
            'w-full flex items-center gap-3 py-2 px-3 rounded-[var(--radius-md)] text-[var(--gray-600)] hover:bg-[rgba(255,107,107,0.1)] hover:text-[var(--destructive)] transition-colors',
            collapsed && 'justify-center px-0'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 min-w-5" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>

      {/* Version */}
      {!collapsed && (
        <div className="px-4 py-2 border-t border-[rgba(139,185,255,0.2)] text-xs text-[var(--gray-400)]">
          <p>书籍排版 v1.0.0</p>
        </div>
      )}
    </aside>
  );
}
