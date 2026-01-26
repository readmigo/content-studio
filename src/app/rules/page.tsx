'use client';

import { useState, useEffect } from 'react';
import { CorrectionRule } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Plus,
  Search,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Pencil,
  Trash2,
  ChevronDown,
  Construction,
} from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Select from '@radix-ui/react-select';

export default function RulesPage() {
  const [rules, setRules] = useState<CorrectionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    // TODO: Fetch rules from API when available
    // For now, just set loading to false with empty data
    const timer = setTimeout(() => {
      setRules([]);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleToggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === ruleId ? { ...r, isActive: !r.isActive } : r
      )
    );
  };

  const filteredRules = rules.filter((rule) => {
    // Tab filter
    if (activeTab !== 'all' && rule.source !== activeTab) {
      return false;
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      if (!rule.name.toLowerCase().includes(searchLower) &&
          !rule.description.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // Category filter
    if (categoryFilter !== 'all' && rule.category !== categoryFilter) {
      return false;
    }

    return true;
  });

  const counts = {
    all: rules.length,
    builtin: rules.filter((r) => r.source === 'builtin').length,
    learned: rules.filter((r) => r.source === 'learned').length,
    custom: rules.filter((r) => r.source === 'custom').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">规则管理</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          新建规则
        </button>
      </div>

      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex gap-1 border-b">
          <Tabs.Trigger
            value="all"
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors relative',
              activeTab === 'all' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            全部规则
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-muted">{counts.all}</span>
            {activeTab === 'all' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </Tabs.Trigger>
          <Tabs.Trigger
            value="builtin"
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors relative',
              activeTab === 'builtin' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            内置规则
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-muted">{counts.builtin}</span>
            {activeTab === 'builtin' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </Tabs.Trigger>
          <Tabs.Trigger
            value="learned"
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors relative',
              activeTab === 'learned' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            学习规则
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-muted">{counts.learned}</span>
            {activeTab === 'learned' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </Tabs.Trigger>
          <Tabs.Trigger
            value="custom"
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors relative',
              activeTab === 'custom' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            自定义规则
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-muted">{counts.custom}</span>
            {activeTab === 'custom' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索规则..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Select.Root value={categoryFilter} onValueChange={setCategoryFilter}>
          <Select.Trigger className="flex items-center gap-2 px-3 py-2 rounded-md border bg-white dark:bg-zinc-900 min-w-[140px]">
            <Select.Value placeholder="类型" />
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg border p-1 z-50">
              <Select.Viewport>
                <Select.Item value="all" className="px-3 py-2 rounded cursor-pointer hover:bg-muted outline-none">
                  <Select.ItemText>全部类型</Select.ItemText>
                </Select.Item>
                <Select.Item value="formatting" className="px-3 py-2 rounded cursor-pointer hover:bg-muted outline-none">
                  <Select.ItemText>格式化</Select.ItemText>
                </Select.Item>
                <Select.Item value="cleanup" className="px-3 py-2 rounded cursor-pointer hover:bg-muted outline-none">
                  <Select.ItemText>清理</Select.ItemText>
                </Select.Item>
                <Select.Item value="structure" className="px-3 py-2 rounded cursor-pointer hover:bg-muted outline-none">
                  <Select.ItemText>结构</Select.ItemText>
                </Select.Item>
                <Select.Item value="style" className="px-3 py-2 rounded cursor-pointer hover:bg-muted outline-none">
                  <Select.ItemText>样式</Select.ItemText>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      {/* Rules list */}
      <div className="space-y-3">
        {rules.length === 0 ? (
          <div className="border rounded-lg p-8 text-center">
            <Construction className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold mb-2">功能开发中</h2>
            <p className="text-muted-foreground">
              规则管理功能正在开发中，敬请期待。
            </p>
          </div>
        ) : filteredRules.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            没有找到符合条件的规则
          </div>
        ) : (
          filteredRules.map((rule) => (
            <div
              key={rule.id}
              className={cn(
                'border rounded-lg p-4 bg-white dark:bg-zinc-900',
                !rule.isActive && 'opacity-60'
              )}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleToggleRule(rule.id)}
                  className="mt-1"
                >
                  {rule.isActive ? (
                    <ToggleRight className="w-8 h-5 text-primary" />
                  ) : (
                    <ToggleLeft className="w-8 h-5 text-muted-foreground" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{rule.name}</h3>
                    <span className={cn(
                      'px-2 py-0.5 rounded text-xs',
                      rule.source === 'builtin' && 'bg-gray-100 text-gray-700',
                      rule.source === 'learned' && 'bg-blue-100 text-blue-700',
                      rule.source === 'custom' && 'bg-purple-100 text-purple-700',
                    )}>
                      {rule.source === 'builtin' && '内置'}
                      {rule.source === 'learned' && '学习'}
                      {rule.source === 'custom' && '自定义'}
                    </span>
                    <span className={cn(
                      'px-2 py-0.5 rounded text-xs',
                      rule.category === 'formatting' && 'bg-green-100 text-green-700',
                      rule.category === 'cleanup' && 'bg-yellow-100 text-yellow-700',
                      rule.category === 'structure' && 'bg-red-100 text-red-700',
                      rule.category === 'style' && 'bg-indigo-100 text-indigo-700',
                    )}>
                      {rule.category}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mt-1">
                    {rule.description}
                  </p>

                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>选择器: <code className="bg-muted px-1 rounded">{rule.selector}</code></span>
                    <span>置信度: {Math.round(rule.confidence * 100)}%</span>
                    <span>应用: {rule.occurrences}次</span>
                    <span>成功率: {Math.round(rule.successRate * 100)}%</span>
                  </div>

                  {rule.learnedFromBooks && rule.learnedFromBooks.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      学习自 {rule.learnedFromBooks.length} 本书籍
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-muted rounded-md" title="编辑">
                    <Pencil className="w-4 h-4" />
                  </button>
                  {rule.source !== 'builtin' && (
                    <button className="p-2 hover:bg-muted rounded-md text-red-600" title="删除">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
