'use client';

import { cn } from '@/lib/utils';

export type FixFilter = 'all' | 'auto_applied' | 'pending_confirm' | 'suggestion' | 'manual';

interface FixFilterBarProps {
  filter: FixFilter;
  onFilterChange: (filter: FixFilter) => void;
  counts: {
    all: number;
    auto_applied: number;
    pending_confirm: number;
    suggestion: number;
    manual: number;
  };
}

export function FixFilterBar({ filter, onFilterChange, counts }: FixFilterBarProps) {
  const filters: { id: FixFilter; label: string; color: string }[] = [
    { id: 'all', label: '全部', color: 'bg-gray-100 text-gray-700' },
    { id: 'auto_applied', label: '自动✓', color: 'bg-green-100 text-green-700' },
    { id: 'pending_confirm', label: '待确认⚠', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'suggestion', label: '建议💡', color: 'bg-blue-100 text-blue-700' },
    { id: 'manual', label: '手动修复', color: 'bg-purple-100 text-purple-700' },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => onFilterChange(f.id)}
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium transition-all',
            filter === f.id
              ? `${f.color} ring-2 ring-offset-1 ring-current`
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          {f.label}
          <span className="ml-1 opacity-70">{counts[f.id]}</span>
        </button>
      ))}
    </div>
  );
}
