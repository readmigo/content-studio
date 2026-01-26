'use client';

import { cn } from '@/lib/utils';
import { Fix } from '@/lib/types';
import { Check, X, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FixItemProps {
  fix: Fix;
  onConfirm: (fixId: string) => void;
  onRevert: (fixId: string) => void;
  onEdit: (fixId: string) => void;
}

export function FixItem({ fix, onConfirm, onRevert, onEdit }: FixItemProps) {
  const [expanded, setExpanded] = useState(false);

  const statusConfig = {
    auto_applied: {
      label: '自动修复',
      className: 'fix-auto-applied',
      icon: '✓',
    },
    pending_confirm: {
      label: '待确认',
      className: 'fix-pending-confirm',
      icon: '⚠',
    },
    suggestion: {
      label: '建议',
      className: 'fix-suggestion',
      icon: '💡',
    },
    manual: {
      label: '手动',
      className: 'fix-manual',
      icon: '✎',
    },
    confirmed: {
      label: '已确认',
      className: 'fix-auto-applied',
      icon: '✓',
    },
    reverted: {
      label: '已撤销',
      className: 'fix-reverted',
      icon: '✗',
    },
  };

  const config = statusConfig[fix.status];

  return (
    <div className={cn('rounded-lg p-3 mb-2', config.className)}>
      <div className="flex items-start gap-2">
        <span className="text-lg">{config.icon}</span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">
              第{fix.lineNumber || '?'}行：{fix.ruleName || fix.type}
            </span>
            {fix.confidence && (
              <span className="text-xs text-muted-foreground">
                {Math.round(fix.confidence * 100)}%
              </span>
            )}
          </div>

          {expanded && (
            <div className="mt-2 space-y-2 text-sm">
              <div>
                <div className="text-xs text-muted-foreground mb-1">修改前：</div>
                <pre className="bg-red-50 dark:bg-red-950 p-2 rounded text-xs overflow-x-auto">
                  <code>{fix.beforeHtml}</code>
                </pre>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">修改后：</div>
                <pre className="bg-green-50 dark:bg-green-950 p-2 rounded text-xs overflow-x-auto">
                  <code>{fix.afterHtml}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-black/10 rounded"
            title={expanded ? '收起' : '展开'}
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {(fix.status === 'pending_confirm' || fix.status === 'suggestion') && (
            <>
              <button
                onClick={() => onConfirm(fix.id)}
                className="p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded text-green-600"
                title="确认"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRevert(fix.id)}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-600"
                title="撤销"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}

          {fix.status !== 'reverted' && (
            <button
              onClick={() => onEdit(fix.id)}
              className="p-1 hover:bg-black/10 rounded"
              title="编辑"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
