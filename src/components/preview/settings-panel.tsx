'use client';

import { cn } from '@/lib/utils';

export interface ReaderSettings {
  fontSizeLevel: number; // 0-4 (5 levels)
  lineHeightLevel: number; // 0-2 (3 levels)
  letterSpacingLevel: number; // 0-2 (3 levels)
}

export const FONT_SIZES = [14, 16, 18, 20, 22];
export const LINE_HEIGHTS = [1.4, 1.6, 1.8];
export const LETTER_SPACINGS = [-0.5, 0, 0.5];

export const DEFAULT_SETTINGS: ReaderSettings = {
  fontSizeLevel: 2, // 18px (middle)
  lineHeightLevel: 1, // 1.6 (standard)
  letterSpacingLevel: 1, // 0px (standard)
};

interface SettingsPanelProps {
  settings: ReaderSettings;
  onSettingsChange: (settings: ReaderSettings) => void;
  className?: string;
}

export function SettingsPanel({ settings, onSettingsChange, className }: SettingsPanelProps) {
  const updateSetting = <K extends keyof ReaderSettings>(key: K, value: ReaderSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className={cn('glass-panel-light p-4 rounded-[var(--radius-lg)] space-y-4', className)}>
      {/* Font Size */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--gray-500)]">字体大小</label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--gray-400)] w-6">A-</span>
          <div className="flex-1 flex items-center justify-between gap-1">
            {FONT_SIZES.map((size, index) => (
              <button
                key={size}
                onClick={() => updateSetting('fontSizeLevel', index)}
                className={cn(
                  'w-8 h-8 rounded-full transition-all flex items-center justify-center',
                  settings.fontSizeLevel === index
                    ? 'bg-[var(--brand-purple)] text-white shadow-md'
                    : 'bg-[rgba(139,185,255,0.1)] text-[var(--gray-500)] hover:bg-[rgba(139,185,255,0.2)]'
                )}
                title={`${size}px`}
              >
                <span className="w-2 h-2 rounded-full bg-current" />
              </button>
            ))}
          </div>
          <span className="text-sm text-[var(--gray-400)] w-6">A+</span>
        </div>
      </div>

      {/* Line Height */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--gray-500)]">行高</label>
        <div className="flex gap-2">
          {['紧凑', '标准', '宽松'].map((label, index) => (
            <button
              key={label}
              onClick={() => updateSetting('lineHeightLevel', index)}
              className={cn(
                'flex-1 py-1.5 px-3 rounded-[var(--radius-md)] text-xs font-medium transition-all',
                settings.lineHeightLevel === index
                  ? 'bg-[var(--brand-purple)] text-white shadow-md'
                  : 'bg-[rgba(139,185,255,0.1)] text-[var(--gray-500)] hover:bg-[rgba(139,185,255,0.2)]'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Letter Spacing */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--gray-500)]">字间距</label>
        <div className="flex gap-2">
          {['紧凑', '标准', '宽松'].map((label, index) => (
            <button
              key={label}
              onClick={() => updateSetting('letterSpacingLevel', index)}
              className={cn(
                'flex-1 py-1.5 px-3 rounded-[var(--radius-md)] text-xs font-medium transition-all',
                settings.letterSpacingLevel === index
                  ? 'bg-[var(--brand-purple)] text-white shadow-md'
                  : 'bg-[rgba(139,185,255,0.1)] text-[var(--gray-500)] hover:bg-[rgba(139,185,255,0.2)]'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Current Values Display */}
      <div className="pt-2 border-t border-[var(--border)] text-xs text-[var(--gray-400)] flex justify-between">
        <span>字体: {FONT_SIZES[settings.fontSizeLevel]}px</span>
        <span>行高: {LINE_HEIGHTS[settings.lineHeightLevel]}</span>
        <span>字距: {LETTER_SPACINGS[settings.letterSpacingLevel]}px</span>
      </div>
    </div>
  );
}
