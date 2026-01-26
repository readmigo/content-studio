'use client';

import { useState, useEffect } from 'react';
import { LearnedPattern } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  GraduationCap,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Construction,
} from 'lucide-react';

export default function LearningPage() {
  const [patterns, setPatterns] = useState<LearnedPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    // TODO: Fetch patterns from API when available
    // For now, just set loading to false with empty data
    const timer = setTimeout(() => {
      setPatterns([]);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleApprove = (patternId: string) => {
    setPatterns((prev) =>
      prev.map((p) =>
        p.id === patternId ? { ...p, status: 'approved' as const } : p
      )
    );
  };

  const handleReject = (patternId: string) => {
    setPatterns((prev) =>
      prev.map((p) =>
        p.id === patternId ? { ...p, status: 'rejected' as const } : p
      )
    );
  };

  const filteredPatterns = patterns.filter((p) => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  const stats = {
    total: patterns.length,
    pending: patterns.filter((p) => p.status === 'pending').length,
    approved: patterns.filter((p) => p.status === 'approved').length,
    rejected: patterns.filter((p) => p.status === 'rejected').length,
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
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="w-7 h-7" />
            学习报告
          </h1>
          <p className="text-muted-foreground mt-1">
            查看和管理从人工校正中学习到的模式
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">总模式数</div>
        </div>
        <div className="border rounded-lg p-4 bg-yellow-50 dark:bg-yellow-950">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-yellow-700">待审核</div>
        </div>
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950">
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-sm text-green-700">已批准</div>
        </div>
        <div className="border rounded-lg p-4 bg-red-50 dark:bg-red-950">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-red-700">已拒绝</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b pb-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              'px-4 py-2 rounded-t-md text-sm font-medium transition-colors',
              statusFilter === status
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            {status === 'all' && '全部'}
            {status === 'pending' && '待审核'}
            {status === 'approved' && '已批准'}
            {status === 'rejected' && '已拒绝'}
          </button>
        ))}
      </div>

      {/* Patterns list */}
      <div className="space-y-4">
        {patterns.length === 0 ? (
          <div className="border rounded-lg p-8 text-center">
            <Construction className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold mb-2">功能开发中</h2>
            <p className="text-muted-foreground">
              学习报告功能正在开发中，敬请期待。
            </p>
          </div>
        ) : filteredPatterns.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            没有符合条件的学习模式
          </div>
        ) : (
          filteredPatterns.map((pattern) => (
            <div
              key={pattern.id}
              className={cn(
                'border rounded-lg overflow-hidden',
                pattern.status === 'approved' && 'border-green-200 bg-green-50/50 dark:bg-green-950/20',
                pattern.status === 'rejected' && 'border-red-200 bg-red-50/50 dark:bg-red-950/20'
              )}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                    pattern.status === 'pending' && 'bg-yellow-100 text-yellow-600',
                    pattern.status === 'approved' && 'bg-green-100 text-green-600',
                    pattern.status === 'rejected' && 'bg-red-100 text-red-600',
                  )}>
                    {pattern.status === 'pending' && <Clock className="w-5 h-5" />}
                    {pattern.status === 'approved' && <CheckCircle className="w-5 h-5" />}
                    {pattern.status === 'rejected' && <XCircle className="w-5 h-5" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {pattern.actionType.toUpperCase()}
                      </span>
                      <code className="text-sm bg-muted px-2 py-0.5 rounded">
                        {pattern.selectorPattern}
                      </code>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        出现 {pattern.occurrences} 次
                      </span>
                      <span>涉及 {pattern.distinctBooks} 本书</span>
                      <span className={cn(
                        'px-2 py-0.5 rounded',
                        pattern.confidence >= 0.9 ? 'bg-green-100 text-green-700' :
                        pattern.confidence >= 0.8 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      )}>
                        置信度: {Math.round(pattern.confidence * 100)}%
                      </span>
                    </div>

                    {pattern.convertedRuleId && (
                      <p className="text-sm text-green-600 mt-2">
                        已转化为规则: {pattern.convertedRuleId}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {pattern.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(pattern.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          批准
                        </button>
                        <button
                          onClick={() => handleReject(pattern.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-red-600 text-red-600 hover:bg-red-50 text-sm"
                        >
                          <XCircle className="w-4 h-4" />
                          拒绝
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setExpandedId(expandedId === pattern.id ? null : pattern.id)}
                      className="p-2 hover:bg-muted rounded-md"
                    >
                      {expandedId === pattern.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded samples */}
              {expandedId === pattern.id && pattern.samples.length > 0 && (
                <div className="border-t bg-muted/30 p-4">
                  <h4 className="text-sm font-medium mb-3">样本预览:</h4>
                  <div className="space-y-2">
                    {pattern.samples.map((sample, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        <span className="text-muted-foreground">{sample.bookTitle}:</span>
                        <code className="bg-white dark:bg-zinc-800 px-2 py-1 rounded text-xs">
                          {sample.context}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
