'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChapterSidebar, COVER_CHAPTER_ID } from '@/components/editor/chapter-sidebar';
import { FixItem } from '@/components/editor/fix-item';
import { FixFilterBar, FixFilter } from '@/components/editor/fix-filter-bar';
import { PhonePreview } from '@/components/preview/phone-preview';
import { useEnvStore } from '@/stores/env-store';
import { Book, Chapter, Fix } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  Loader2,
  Undo,
  Redo,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import dynamic from 'next/dynamic';
import { apiClient } from '@/lib/api';

// Dynamic import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div> }
);

export default function BookEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { isProduction, requiresConfirmation, config } = useEnvStore();

  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapterId, setCurrentChapterId] = useState<string>('');
  const [html, setHtml] = useState('');
  const [fixes, setFixes] = useState<Fix[]>([]);
  const [fixFilter, setFixFilter] = useState<FixFilter>('all');
  const [startFromLastPage, setStartFromLastPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchBookData = useCallback(async () => {
    const bookId = params.id as string;
    if (!bookId) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch book details from API
      const bookResponse = await apiClient.getBook(bookId);

      if (bookResponse) {
        // Map API response to Book type
        const bookData: Book = {
          id: bookResponse.id,
          title: bookResponse.title,
          author: bookResponse.author || 'Unknown',
          language: bookResponse.language || 'en',
          coverUrl: bookResponse.coverUrl,
          chapterCount: bookResponse.chapterCount || 0,
          wordCount: bookResponse.wordCount || 0,
          source: bookResponse.source || 'Unknown',
          contentStatus: bookResponse.contentStatus || 'pending',
          createdAt: bookResponse.createdAt,
          updatedAt: bookResponse.updatedAt,
        };
        setBook(bookData);

        // Fetch chapters from API
        const chaptersResponse = await apiClient.getBookChapters(bookId);
        if (chaptersResponse && Array.isArray(chaptersResponse)) {
          const chaptersData: Chapter[] = chaptersResponse.map((ch: Record<string, unknown>, index: number) => ({
            id: ch.id as string,
            bookId: bookId,
            order: (ch.order as number) || index + 1,
            title: (ch.title as string) || `Chapter ${index + 1}`,
            href: (ch.href as string) || '',
            wordCount: (ch.wordCount as number) || 0,
            isCorrected: false,
            correctionStatus: 'pending' as const,
            autoFixCount: 0,
            pendingConfirmCount: 0,
            suggestionCount: 0,
          }));
          setChapters(chaptersData);

          // Default to cover if available, otherwise first chapter
          if (bookResponse.coverUrl) {
            setCurrentChapterId(COVER_CHAPTER_ID);
          } else if (chaptersData.length > 0) {
            setCurrentChapterId(chaptersData[0].id);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch book data:', err);
      setError('无法加载书籍数据，请稍后重试。');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchBookData();
  }, [fetchBookData]);

  // Fetch chapter content when chapter selection changes
  const fetchChapterContent = useCallback(async () => {
    if (!currentChapterId) return;

    // Cover doesn't have chapter content
    if (currentChapterId === COVER_CHAPTER_ID) {
      setHtml('');
      setFixes([]);
      return;
    }

    try {
      const response = await apiClient.getChapterDetail(currentChapterId);
      if (response) {
        setHtml(response.htmlContent || '');
        setFixes(response.fixes || []);
      }
    } catch (err) {
      console.error('Failed to fetch chapter content:', err);
      setHtml('');
      setFixes([]);
    }
  }, [currentChapterId]);

  useEffect(() => {
    fetchChapterContent();
  }, [fetchChapterContent]);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  };

  const handleApprove = async () => {
    if (requiresConfirmation() && confirmText !== 'CONFIRM') {
      return;
    }

    setSaving(true);
    // Simulate approve
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    setShowApproveDialog(false);
    router.push('/');
  };

  const handleConfirmFix = (fixId: string) => {
    setFixes((prev) =>
      prev.map((f) =>
        f.id === fixId ? { ...f, status: 'confirmed' as const } : f
      )
    );
  };

  const handleRevertFix = (fixId: string) => {
    setFixes((prev) =>
      prev.map((f) =>
        f.id === fixId ? { ...f, status: 'reverted' as const } : f
      )
    );
  };

  const handleEditFix = (fixId: string) => {
    // TODO: Open edit dialog
    console.log('Edit fix:', fixId);
  };

  const filteredFixes = fixes.filter((fix) => {
    if (fixFilter === 'all') return true;
    return fix.status === fixFilter;
  });

  const fixCounts = {
    all: fixes.length,
    auto_applied: fixes.filter((f) => f.status === 'auto_applied' || f.status === 'confirmed').length,
    pending_confirm: fixes.filter((f) => f.status === 'pending_confirm').length,
    suggestion: fixes.filter((f) => f.status === 'suggestion').length,
    manual: fixes.filter((f) => f.status === 'manual').length,
  };

  const currentChapter = chapters.find((c) => c.id === currentChapterId);
  const currentChapterIndex = chapters.findIndex((c) => c.id === currentChapterId);
  const progress = chapters.filter((c) => c.correctionStatus === 'completed').length;

  // Chapter navigation handlers for seamless page turning
  const handleNextChapter = useCallback(() => {
    // From cover, go to first chapter
    if (currentChapterId === COVER_CHAPTER_ID && chapters.length > 0) {
      setStartFromLastPage(false);
      setCurrentChapterId(chapters[0].id);
      return;
    }
    if (currentChapterIndex < chapters.length - 1) {
      setStartFromLastPage(false);
      setCurrentChapterId(chapters[currentChapterIndex + 1].id);
    }
  }, [currentChapterId, currentChapterIndex, chapters]);

  const handlePreviousChapter = useCallback(() => {
    // From first chapter, go to cover if available
    if (currentChapterIndex === 0 && book?.coverUrl) {
      setStartFromLastPage(true);
      setCurrentChapterId(COVER_CHAPTER_ID);
      return;
    }
    if (currentChapterIndex > 0) {
      setStartFromLastPage(true);
      setCurrentChapterId(chapters[currentChapterIndex - 1].id);
    }
  }, [currentChapterIndex, chapters, book?.coverUrl]);

  // Sidebar chapter selection (always start from first page)
  const handleChapterSelect = useCallback((chapterId: string) => {
    setStartFromLastPage(false);
    setCurrentChapterId(chapterId);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <AlertTriangle className="w-12 h-12 text-yellow-500" />
        <h2 className="text-lg font-semibold">{error || '未找到书籍'}</h2>
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4" />
          返回书籍列表
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-muted rounded-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-semibold">{book?.title}</h1>
            <p className="text-sm text-muted-foreground">
              进度: {progress}/{chapters.length} 章
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-muted disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            保存
          </button>

          <button
            onClick={() => setShowApproveDialog(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <CheckCircle className="w-4 h-4" />
            批准发布
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chapter sidebar */}
        <ChapterSidebar
          chapters={chapters}
          currentChapterId={currentChapterId}
          onChapterSelect={handleChapterSelect}
          coverUrl={book?.coverUrl}
        />

        {/* Editor area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <FixFilterBar
            filter={fixFilter}
            onFilterChange={setFixFilter}
            counts={fixCounts}
          />

          <div className="flex-1 flex overflow-hidden">
            {/* Fixes list */}
            <div className="w-[400px] border-r overflow-auto p-3">
              {filteredFixes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  没有符合条件的修复项
                </div>
              ) : (
                filteredFixes.map((fix) => (
                  <FixItem
                    key={fix.id}
                    fix={fix}
                    onConfirm={handleConfirmFix}
                    onRevert={handleRevertFix}
                    onEdit={handleEditFix}
                  />
                ))
              )}
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 overflow-hidden">
              <MonacoEditor
                height="100%"
                defaultLanguage="html"
                value={html}
                onChange={(value) => setHtml(value || '')}
                theme="vs-light"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>
        </div>

        {/* Phone preview */}
        <div className="w-[460px] border-l p-4 overflow-auto bg-muted/30">
          <PhonePreview
            html={html}
            chapterTitle={currentChapter?.title}
            bookId={params.id as string}
            apiUrl={config.apiUrl}
            onNextChapter={handleNextChapter}
            onPreviousChapter={handlePreviousChapter}
            startFromLastPage={startFromLastPage}
            coverImageUrl={currentChapterId === COVER_CHAPTER_ID && book?.coverUrl ? `${config.apiUrl}/api/v1/content-studio/books/${book.id}/cover` : undefined}
          />
        </div>
      </div>

      {/* Footer stats */}
      <div className="h-10 border-t flex items-center px-4 text-sm text-muted-foreground flex-shrink-0">
        本章统计: 自动修复 {fixCounts.auto_applied}处 | 待确认 {fixCounts.pending_confirm}处 | 建议 {fixCounts.suggestion}处
        <div className="ml-auto flex items-center gap-2">
          <button className="p-1 hover:bg-muted rounded" title="撤销">
            <Undo className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-muted rounded" title="重做">
            <Redo className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-muted rounded" title="重新应用规则">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Approve dialog */}
      <AlertDialog.Root open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-6 z-50">
            <AlertDialog.Title className="text-lg font-semibold flex items-center gap-2">
              {isProduction() && <span className="text-red-500">⚠️</span>}
              确认发布{isProduction() && '到生产环境'}
            </AlertDialog.Title>

            <AlertDialog.Description className="mt-4 text-muted-foreground" asChild>
              <div>
                <p>你即将批准发布以下书籍:</p>
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{book?.title}</p>
                  <p className="text-sm">{chapters.length} 章节 · {fixCounts.auto_applied + fixCounts.pending_confirm} 处修复</p>
                </div>

                {isProduction() && (
                  <div className="mt-4">
                    <p className="text-sm text-red-600 mb-2">
                      此操作将影响真实用户数据，请输入 &quot;CONFIRM&quot; 确认操作:
                    </p>
                    <input
                      type="text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="输入 CONFIRM"
                    />
                  </div>
                )}
              </div>
            </AlertDialog.Description>

            <div className="mt-6 flex justify-end gap-3">
              <AlertDialog.Cancel asChild>
                <button className="px-4 py-2 rounded-md border hover:bg-muted">
                  取消
                </button>
              </AlertDialog.Cancel>
              <button
                onClick={handleApprove}
                disabled={saving || (isProduction() && confirmText !== 'CONFIRM')}
                className={cn(
                  'px-4 py-2 rounded-md text-white',
                  isProduction()
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-primary hover:bg-primary/90',
                  'disabled:opacity-50'
                )}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  '确认发布'
                )}
              </button>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
}
