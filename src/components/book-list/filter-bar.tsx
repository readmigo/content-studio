'use client';

import { Search } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  sourceFilter: string;
  onSourceFilterChange: (value: string) => void;
}

export function FilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sourceFilter,
  onSourceFilterChange,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-4 p-4 glass-panel-light">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gray-400)]" />
        <input
          type="text"
          placeholder="搜索书名/作者..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-glass pl-11"
        />
      </div>

      {/* Status Filter */}
      <Select.Root value={statusFilter} onValueChange={onStatusFilterChange}>
        <Select.Trigger className="flex items-center gap-2 px-4 py-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[rgba(255,255,255,0.8)] min-w-[140px] transition-all hover:border-[var(--brand-purple)]">
          <Select.Value placeholder="状态" />
          <ChevronDown className="w-4 h-4 text-[var(--gray-400)]" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="glass-panel p-1 z-50">
            <Select.Viewport>
              <Select.Item value="all" className="px-3 py-2 rounded-[var(--radius-md)] cursor-pointer hover:bg-[rgba(139,185,255,0.15)] outline-none">
                <Select.ItemText>全部状态</Select.ItemText>
              </Select.Item>
              <Select.Item value="pending" className="px-3 py-2 rounded-[var(--radius-md)] cursor-pointer hover:bg-[rgba(139,185,255,0.15)] outline-none">
                <Select.ItemText>待处理</Select.ItemText>
              </Select.Item>
              <Select.Item value="auto_fixed" className="px-3 py-2 rounded-[var(--radius-md)] cursor-pointer hover:bg-[rgba(139,185,255,0.15)] outline-none">
                <Select.ItemText>自动修复</Select.ItemText>
              </Select.Item>
              <Select.Item value="in_review" className="px-3 py-2 rounded-[var(--radius-md)] cursor-pointer hover:bg-[rgba(139,185,255,0.15)] outline-none">
                <Select.ItemText>审核中</Select.ItemText>
              </Select.Item>
              <Select.Item value="approved" className="px-3 py-2 rounded-[var(--radius-md)] cursor-pointer hover:bg-[rgba(139,185,255,0.15)] outline-none">
                <Select.ItemText>已批准</Select.ItemText>
              </Select.Item>
              <Select.Item value="published" className="px-3 py-2 rounded-[var(--radius-md)] cursor-pointer hover:bg-[rgba(139,185,255,0.15)] outline-none">
                <Select.ItemText>已发布</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {/* Source Filter */}
      <Select.Root value={sourceFilter} onValueChange={onSourceFilterChange}>
        <Select.Trigger className="flex items-center gap-2 px-4 py-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[rgba(255,255,255,0.8)] min-w-[160px] transition-all hover:border-[var(--brand-purple)]">
          <Select.Value placeholder="来源" />
          <ChevronDown className="w-4 h-4 text-[var(--gray-400)]" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="glass-panel p-1 z-50">
            <Select.Viewport>
              <Select.Item value="all" className="px-3 py-2 rounded-[var(--radius-md)] cursor-pointer hover:bg-[rgba(139,185,255,0.15)] outline-none">
                <Select.ItemText>全部来源</Select.ItemText>
              </Select.Item>
              <Select.Item value="standard_ebooks" className="px-3 py-2 rounded-[var(--radius-md)] cursor-pointer hover:bg-[rgba(139,185,255,0.15)] outline-none">
                <Select.ItemText>Standard Ebooks</Select.ItemText>
              </Select.Item>
              <Select.Item value="gutenberg" className="px-3 py-2 rounded-[var(--radius-md)] cursor-pointer hover:bg-[rgba(139,185,255,0.15)] outline-none">
                <Select.ItemText>Gutenberg</Select.ItemText>
              </Select.Item>
              <Select.Item value="internet_archive" className="px-3 py-2 rounded-[var(--radius-md)] cursor-pointer hover:bg-[rgba(139,185,255,0.15)] outline-none">
                <Select.ItemText>Internet Archive</Select.ItemText>
              </Select.Item>
              <Select.Item value="upload" className="px-3 py-2 rounded-[var(--radius-md)] cursor-pointer hover:bg-[rgba(139,185,255,0.15)] outline-none">
                <Select.ItemText>手动上传</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
