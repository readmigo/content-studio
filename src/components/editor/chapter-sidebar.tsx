'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Chapter } from '@/lib/types';
import { Check, Loader2, AlertTriangle, Clock, BookImage } from 'lucide-react';
import * as ScrollArea from '@radix-ui/react-scroll-area';

export const COVER_CHAPTER_ID = '__cover__';

interface ChapterSidebarProps {
  chapters: Chapter[];
  currentChapterId: string;
  onChapterSelect: (chapterId: string) => void;
  coverUrl?: string;
}

export function ChapterSidebar({
  chapters,
  currentChapterId,
  onChapterSelect,
  coverUrl,
}: ChapterSidebarProps) {
  const currentChapterRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to current chapter when it changes
  useEffect(() => {
    if (currentChapterRef.current) {
      currentChapterRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentChapterId]);

  const getStatusIcon = (chapter: Chapter) => {
    if (chapter.correctionStatus === 'completed') {
      return <Check className="w-4 h-4 text-green-500" />;
    }
    if (chapter.correctionStatus === 'in_progress') {
      return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    }
    if (chapter.pendingConfirmCount && chapter.pendingConfirmCount > 0) {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
    return <Clock className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="w-48 border-r flex flex-col bg-muted/30">
      <div className="p-3 border-b font-medium text-sm">
        章节列表
      </div>

      <ScrollArea.Root className="flex-1 overflow-hidden">
        <ScrollArea.Viewport className="h-full w-full">
          <div className="p-2 space-y-1">
            {/* Cover item */}
            {coverUrl && (
              <button
                onClick={() => onChapterSelect(COVER_CHAPTER_ID)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm transition-colors',
                  currentChapterId === COVER_CHAPTER_ID
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
              >
                <BookImage className="w-4 h-4" />
                <span className="flex-1 truncate">封面</span>
              </button>
            )}
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                ref={currentChapterId === chapter.id ? currentChapterRef : null}
                onClick={() => onChapterSelect(chapter.id)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm transition-colors',
                  currentChapterId === chapter.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
              >
                {getStatusIcon(chapter)}
                <span className="flex-1 truncate">
                  {chapter.order}. {chapter.title || `第${chapter.order}章`}
                </span>
                {chapter.pendingConfirmCount ? (
                  <span className={cn(
                    'text-xs px-1.5 py-0.5 rounded',
                    currentChapterId === chapter.id
                      ? 'bg-white/20'
                      : 'bg-yellow-100 text-yellow-700'
                  )}>
                    {chapter.pendingConfirmCount}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex select-none touch-none p-0.5 bg-transparent transition-colors duration-150 ease-out data-[orientation=vertical]:w-2"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="flex-1 bg-border rounded-full relative" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}
