'use client';

import Link from 'next/link';
import { Book } from '@/lib/types';
import { cn, formatRelativeTime } from '@/lib/utils';
import { BookOpen, Check, AlertTriangle, Lightbulb, Clock } from 'lucide-react';
import { useEnvStore } from '@/stores/env-store';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { config } = useEnvStore();

  // Construct cover URL from API endpoint instead of database coverUrl
  const coverUrl = book.coverUrl
    ? `${config.apiUrl}/api/v1/content-studio/books/${book.id}/cover`
    : null;

  const statusConfig: Record<string, { label: string; className: string }> = {
    PENDING: { label: '待处理', className: 'badge-glass bg-[rgba(113,113,122,0.15)] text-[var(--gray-500)] border border-[rgba(113,113,122,0.2)]' },
    PARSED: { label: '已解析', className: 'badge-glass badge-info' },
    AUTO_FIXED: { label: '自动修复', className: 'badge-glass badge-success' },
    IN_REVIEW: { label: '审核中', className: 'badge-glass badge-warning' },
    APPROVED: { label: '已批准', className: 'badge-glass badge-success' },
    PUBLISHED: { label: '已发布', className: 'badge-glass badge-brand' },
  };

  const status = statusConfig[book.contentStatus] || { label: book.contentStatus, className: 'badge-glass bg-[rgba(113,113,122,0.15)] text-[var(--gray-500)]' };

  return (
    <div data-testid="book-card" className="card-glass p-4 hover:shadow-lg transition-all">
      <div className="flex gap-4">
        {/* Cover */}
        <div className="w-20 h-28 bg-[var(--brand-gradient-button)] rounded-[var(--radius-md)] overflow-hidden flex-shrink-0">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={book.title}
              width={80}
              height={112}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white/70" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate text-[var(--gray-800)]">{book.title}</h3>
          <p className="text-sm text-[var(--gray-500)] truncate">{book.author}</p>

          <div className="flex items-center gap-2 mt-2 text-sm text-[var(--gray-400)]">
            <span>{book.chapterCount} 章</span>
            <span>·</span>
            <span>{book.source}</span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className={cn('px-3 py-1 rounded-full text-xs font-semibold', status.className)}>
              {status.label}
            </span>
          </div>

          {/* Auto-fix stats */}
          {book.autoFixStats && (
            <div className="flex items-center gap-3 mt-3 text-xs">
              <div className="flex items-center gap-1 text-[var(--success-foreground)]">
                <Check className="w-3.5 h-3.5" />
                <span>自动修复: {book.autoFixStats.fixCount}处</span>
              </div>
              {book.autoFixStats.pendingConfirmation > 0 && (
                <div className="flex items-center gap-1 text-[var(--warning-foreground)]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>待确认: {book.autoFixStats.pendingConfirmation}处</span>
                </div>
              )}
              {book.autoFixStats.suggestions > 0 && (
                <div className="flex items-center gap-1 text-[var(--info-foreground)]">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>建议: {book.autoFixStats.suggestions}处</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end justify-between">
          <div className="flex items-center gap-1 text-xs text-[var(--gray-400)]">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatRelativeTime(book.updatedAt)}</span>
          </div>

          <Link
            href={`/book/${book.id}`}
            className={cn(
              'btn-primary-gradient px-4 py-2 text-sm',
              book.contentStatus === 'IN_REVIEW' && 'bg-[linear-gradient(135deg,var(--warning),#FFD699)]'
            )}
          >
            {book.contentStatus === 'IN_REVIEW' ? '继续' : '开始审核'}
          </Link>
        </div>
      </div>
    </div>
  );
}
