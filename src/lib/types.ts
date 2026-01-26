// Book types
export type ContentStatus = 'PENDING' | 'PARSED' | 'AUTO_FIXED' | 'IN_REVIEW' | 'APPROVED' | 'PUBLISHED';
export type ContentReviewStatus = 'PENDING_REVIEW' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';

export interface Book {
  id: string;
  title: string;
  author: string;
  language: string;
  coverUrl?: string;
  chapterCount: number;
  wordCount: number;
  source: string;
  contentStatus: ContentStatus;
  contentReviewStatus?: ContentReviewStatus;
  autoFixStats?: {
    rulesApplied: number;
    fixCount: number;
    pendingConfirmation: number;
    suggestions: number;
  };
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  bookId: string;
  order: number;
  title: string;
  href: string;
  wordCount: number;
  isCorrected: boolean;
  correctionStatus?: 'pending' | 'in_progress' | 'completed';
  autoFixCount?: number;
  pendingConfirmCount?: number;
  suggestionCount?: number;
}

export interface ChapterContent {
  id: string;
  chapterId: string;
  originalHtml: string;
  correctedHtml?: string;
  fixes: Fix[];
}

// Fix types
export type FixStatus = 'auto_applied' | 'pending_confirm' | 'suggestion' | 'manual' | 'confirmed' | 'reverted';

export interface Fix {
  id: string;
  type: FixActionType;
  selector: string;
  beforeHtml: string;
  afterHtml: string;
  status: FixStatus;
  ruleId?: string;
  ruleName?: string;
  confidence?: number;
  lineNumber?: number;
}

// Rule types
export type RuleSource = 'builtin' | 'learned' | 'custom';
export type RuleCategory = 'formatting' | 'cleanup' | 'structure' | 'style';
export type FixActionType = 'remove' | 'replace' | 'wrap' | 'unwrap' | 'merge' | 'split' | 'attr_set' | 'attr_remove' | 'style_normalize';

export interface CorrectionRule {
  id: string;
  name: string;
  description: string;
  category: RuleCategory;
  actionType: FixActionType;
  selector: string;
  pattern?: string;
  replacement?: string;
  priority: number;
  source: RuleSource;
  confidence: number;
  occurrences: number;
  successRate: number;
  learnedFromBooks?: string[];
  isActive: boolean;
  createdBy?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Learning types
export type PatternStatus = 'pending' | 'approved' | 'rejected' | 'converted';

export interface LearnedPattern {
  id: string;
  patternHash: string;
  actionType: FixActionType;
  selectorPattern: string;
  samples: Array<{
    logId: string;
    bookId: string;
    bookTitle: string;
    context: string;
  }>;
  occurrences: number;
  distinctBooks: number;
  confidence: number;
  status: PatternStatus;
  convertedRuleId?: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Correction log
export interface CorrectionLog {
  id: string;
  bookId: string;
  chapterId: string;
  operatorId: string;
  actionType: FixActionType;
  selector: string;
  beforeHtml: string;
  afterHtml: string;
  context: {
    parentTag: string;
    siblings: string[];
    position: number;
  };
  wasReverted: boolean;
  matchedRuleId?: string;
  createdAt: string;
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AutoFixPreview {
  bookId: string;
  chapters: Array<{
    chapterId: string;
    chapterTitle: string;
    fixes: Fix[];
  }>;
  summary: {
    totalFixes: number;
    autoApplied: number;
    pendingConfirm: number;
    suggestions: number;
    rulesUsed: string[];
  };
}
