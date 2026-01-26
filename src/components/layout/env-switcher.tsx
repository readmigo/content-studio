'use client';

import { useEnvStore } from '@/stores/env-store';
import { ENVIRONMENTS, EnvironmentName } from '@/config/environments';
import { cn } from '@/lib/utils';
import { ChevronDown, AlertTriangle } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface EnvSwitcherProps {
  collapsed?: boolean;
}

export function EnvSwitcher({ collapsed = false }: EnvSwitcherProps) {
  const { currentEnv, config, setEnvironment } = useEnvStore();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] border transition-all w-full',
            'btn-secondary-glass focus:outline-none focus:ring-2 focus:ring-[var(--brand-purple)]',
            currentEnv === 'production' && 'border-[var(--destructive)] bg-[rgba(255,107,107,0.1)]',
            collapsed && 'justify-center px-0'
          )}
          title={collapsed ? config.name : undefined}
        >
          <span className="text-lg">{config.icon}</span>
          {!collapsed && (
            <>
              <span className="font-medium text-sm flex-1 text-left">{config.name}</span>
              <ChevronDown className="w-4 h-4 text-[var(--gray-400)]" />
            </>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[200px] glass-panel p-1 z-50"
          sideOffset={5}
          side={collapsed ? 'right' : 'top'}
          align="start"
        >
          {(Object.keys(ENVIRONMENTS) as EnvironmentName[]).map((env) => {
            const envConfig = ENVIRONMENTS[env];
            const isSelected = env === currentEnv;

            return (
              <DropdownMenu.Item
                key={env}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] cursor-pointer outline-none transition-colors',
                  'hover:bg-[rgba(139,185,255,0.15)] focus:bg-[rgba(139,185,255,0.15)]',
                  isSelected && 'bg-[rgba(139,185,255,0.2)]'
                )}
                onSelect={() => setEnvironment(env)}
              >
                <span className="text-lg">{envConfig.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{envConfig.name}</div>
                  <div className="text-xs text-[var(--gray-400)]">
                    {env === 'local' && '开发环境'}
                    {env === 'debug' && '测试环境'}
                    {env === 'staging' && '预发布'}
                    {env === 'production' && '生产环境'}
                  </div>
                </div>
                {env === 'production' && (
                  <AlertTriangle className="w-4 h-4 text-[var(--destructive)]" />
                )}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
