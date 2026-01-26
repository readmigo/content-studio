'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { IPhoneFrame } from './iphone-frame';
import { ThemeSwitcher, ReaderTheme } from './theme-switcher';
import { SettingsPanel, ReaderSettings, DEFAULT_SETTINGS, FONT_SIZES, LINE_HEIGHTS, LETTER_SPACINGS } from './settings-panel';
import { generateReaderHTML } from '@/lib/reader-template';
import { cn } from '@/lib/utils';
import { Settings, Bug } from 'lucide-react';

interface PhonePreviewProps {
  html: string;
  chapterTitle?: string;
  className?: string;
  bookId?: string;
  apiUrl?: string;
  onNextChapter?: () => void;
  onPreviousChapter?: () => void;
  startFromLastPage?: boolean;
  coverImageUrl?: string;
}

export function PhonePreview({ html, chapterTitle, className, bookId, apiUrl, onNextChapter, onPreviousChapter, startFromLastPage, coverImageUrl }: PhonePreviewProps) {
  const [theme, setTheme] = useState<ReaderTheme>('light');
  const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [pageInfo, setPageInfo] = useState({ current: 1, total: 1 });
  const [debug, setDebug] = useState(false);

  // Convert settings levels to actual values
  const fontSize = FONT_SIZES[settings.fontSizeLevel];
  const lineHeight = LINE_HEIGHTS[settings.lineHeightLevel];
  const letterSpacing = LETTER_SPACINGS[settings.letterSpacingLevel];

  // Transform relative image URLs to absolute backend API URLs
  const transformedHtml = useMemo(() => {
    if (!html || !bookId || !apiUrl) return html;

    // Replace image src with absolute API URLs
    // Matches: src="filename.jpg", src="path/to/image.png", src="/images/file.gif", etc.
    return html.replace(
      /src="([^"]+\.(jpg|jpeg|png|gif|svg|webp))"/gi,
      (match, path) => `src="${apiUrl}/api/v1/content-studio/books/${bookId}/images/${path.replace(/^\/images\//, '')}"`
    );
  }, [html, bookId, apiUrl]);

  // Generate reader HTML with current settings
  const readerHTML = generateReaderHTML({
    html: transformedHtml,
    chapterTitle,
    theme,
    fontSize,
    lineHeight,
    letterSpacing,
    startFromLastPage,
    coverImageUrl,
  });

  // Handle messages from iframe
  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data?.type === 'pageChange') {
      setPageInfo({
        current: event.data.current,
        total: event.data.total,
      });
    } else if (event.data?.type === 'requestNextChapter') {
      onNextChapter?.();
    } else if (event.data?.type === 'requestPreviousChapter') {
      onPreviousChapter?.();
    }
  }, [onNextChapter, onPreviousChapter]);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <IPhoneFrame debug={debug}>
        <iframe
          srcDoc={readerHTML}
          className="w-full h-full border-0"
          title="Reader Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </IPhoneFrame>

      {/* Controls Row */}
      <div className="flex items-center gap-3">
        <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={cn(
            'p-2 rounded-[var(--radius-md)] transition-all',
            showSettings
              ? 'bg-[var(--brand-purple)] text-white'
              : 'bg-[rgba(139,185,255,0.1)] text-[var(--gray-500)] hover:bg-[rgba(139,185,255,0.2)]'
          )}
          title="排版设置"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          onClick={() => setDebug(!debug)}
          className={cn(
            'p-2 rounded-[var(--radius-md)] transition-all',
            debug
              ? 'bg-orange-500 text-white'
              : 'bg-[rgba(139,185,255,0.1)] text-[var(--gray-500)] hover:bg-[rgba(139,185,255,0.2)]'
          )}
          title="调试背景色"
        >
          <Bug className="w-4 h-4" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={setSettings}
          className="w-full max-w-[280px]"
        />
      )}

      <div className="text-xs text-[var(--gray-400)] text-center space-y-1">
        <p>页码: {pageInfo.current} / {pageInfo.total}</p>
        <p>点击左右区域或使用键盘翻页</p>
      </div>
    </div>
  );
}
