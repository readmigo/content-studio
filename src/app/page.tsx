'use client';

import { useState, useEffect, useCallback } from 'react';
import { BookCard } from '@/components/book-list/book-card';
import { FilterBar } from '@/components/book-list/filter-bar';
import { StatusTabs } from '@/components/book-list/status-tabs';
import { Book } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function BooksPage() {
  const t = useTranslations('books');
  const tCommon = useTranslations('common');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getBooks({
        page,
        limit: 20,
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setBooks(response.data || []);
      setTotal(response.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load books');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const counts = {
    PENDING: books.filter((b) => b.contentStatus === 'PENDING' || b.contentStatus === 'PARSED' || b.contentStatus === 'AUTO_FIXED').length,
    IN_REVIEW: books.filter((b) => b.contentStatus === 'IN_REVIEW').length,
    APPROVED: books.filter((b) => b.contentStatus === 'APPROVED').length,
    PUBLISHED: books.filter((b) => b.contentStatus === 'PUBLISHED').length,
  };

  const filteredBooks = books.filter((book) => {
    // Tab filter
    if (activeTab === 'PENDING' && !['PENDING', 'PARSED', 'AUTO_FIXED'].includes(book.contentStatus)) {
      return false;
    }
    if (activeTab !== 'PENDING' && book.contentStatus !== activeTab) {
      return false;
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      if (!book.title.toLowerCase().includes(searchLower) &&
          !book.author.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // Status filter
    if (statusFilter !== 'all' && book.contentStatus !== statusFilter) {
      return false;
    }

    // Source filter
    if (sourceFilter !== 'all') {
      const sourceMap: Record<string, string> = {
        standard_ebooks: 'Standard Ebooks',
        gutenberg: 'Gutenberg',
        internet_archive: 'Internet Archive',
        upload: '手动上传',
      };
      if (book.source !== sourceMap[sourceFilter]) {
        return false;
      }
    }

    return true;
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchBooks}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          <RefreshCw className="w-4 h-4" />
          {tCommon('retry') || 'Retry'}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <button
          onClick={fetchBooks}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <StatusTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={counts}
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sourceFilter={sourceFilter}
        onSourceFilterChange={setSourceFilter}
      />

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {tCommon('noData')}
          </div>
        ) : (
          filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))
        )}
      </div>

      {total > 20 && (
        <div className="flex justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            {tCommon('previous')}
          </button>
          <span className="px-3 py-1">
            {page} / {Math.ceil(total / 20)}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(total / 20) || loading}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            {tCommon('next')}
          </button>
        </div>
      )}
    </div>
  );
}
