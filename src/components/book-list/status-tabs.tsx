'use client';

import { cn } from '@/lib/utils';

interface StatusTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: {
    PENDING: number;
    IN_REVIEW: number;
    APPROVED: number;
    PUBLISHED: number;
  };
}

export function StatusTabs({ activeTab, onTabChange, counts }: StatusTabsProps) {
  const tabs = [
    { id: 'PENDING', label: '待处理', count: counts.PENDING },
    { id: 'IN_REVIEW', label: '审核中', count: counts.IN_REVIEW },
    { id: 'APPROVED', label: '已批准', count: counts.APPROVED },
    { id: 'PUBLISHED', label: '已发布', count: counts.PUBLISHED },
  ];

  return (
    <div className="tabs-glass">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'tab-glass',
            activeTab === tab.id && 'active'
          )}
        >
          {tab.label}
          <span className={cn(
            'ml-2 px-2 py-0.5 rounded-full text-xs font-medium',
            activeTab === tab.id
              ? 'bg-[var(--brand-gradient-button)] text-white'
              : 'bg-[rgba(139,185,255,0.15)] text-[var(--gray-500)]'
          )}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}
