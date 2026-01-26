/**
 * Shared Reader HTML Template
 *
 * IMPORTANT: This template must stay in sync with iOS ReaderContentView.swift
 * Location: ios/Readmigo/Features/Reader/ReaderContentView.swift
 *
 * Any changes to styles or behavior should be reflected in both files.
 */

export interface ReaderTemplateOptions {
  html: string;
  chapterTitle?: string;
  theme: 'light' | 'sepia' | 'dark';
  fontSize?: number;
  lineHeight?: number;
  letterSpacing?: number;
  fontFamily?: string;
  startFromLastPage?: boolean;
  coverImageUrl?: string;
}

interface ThemeColors {
  background: string;
  text: string;
  textSecondary: string;
  highlight: string;
  link: string;
}

const THEME_COLORS: Record<string, ThemeColors> = {
  light: {
    background: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#666666',
    highlight: 'rgba(255, 212, 0, 0.4)',
    link: '#007AFF',
  },
  sepia: {
    background: '#F4ECD8',
    text: '#5B4636',
    textSecondary: '#8B7355',
    highlight: 'rgba(255, 212, 0, 0.4)',
    link: '#8B4513',
  },
  dark: {
    background: '#1A1A1A',
    text: '#E5E5E5',
    textSecondary: '#999999',
    highlight: 'rgba(255, 212, 0, 0.3)',
    link: '#6CB6FF',
  },
};

export function generateReaderHTML(options: ReaderTemplateOptions): string {
  const {
    html,
    chapterTitle = '',
    theme = 'light',
    fontSize = 18,
    lineHeight = 1.6,
    letterSpacing = 0,
    fontFamily = 'Georgia, "Times New Roman", serif',
    startFromLastPage = false,
    coverImageUrl,
  } = options;

  // Prepend cover image if provided
  const coverHtml = coverImageUrl
    ? `<img class="cover" src="${coverImageUrl}" alt="Book Cover" />`
    : '';

  // Remove duplicate H2 titles that match the chapter title
  // This prevents showing "Preface" twice when H1 chapter title and H2 in content are the same
  let processedHtml = html;
  if (chapterTitle) {
    const normalizedChapterTitle = chapterTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
    // Match H2 tags and check if their content matches the chapter title
    // Use [\s\S]*? instead of .*? to match across newlines
    processedHtml = html.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (match, content) => {
      const normalizedContent = content.replace(/<[^>]*>/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (normalizedContent === normalizedChapterTitle) {
        return ''; // Remove duplicate H2
      }
      return match; // Keep non-duplicate H2
    });
  }

  const contentHtml = coverHtml + processedHtml;

  const colors = THEME_COLORS[theme];

  // Hide title for title pages, cover pages, or empty titles
  const titleLower = chapterTitle.toLowerCase();
  const shouldHideTitle = !chapterTitle ||
    titleLower.includes('title page') ||
    titleLower.includes('titlepage') ||
    titleLower.includes('cover') ||
    titleLower === 'title';

  const titleHtml = shouldHideTitle ? '' : `<h1 class="chapter-title">${chapterTitle}</h1>`;
  const chapterIndicatorHtml = chapterTitle ? `<div class="chapter-indicator">${chapterTitle}</div>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <style>
        /* ========================================
           Professional Typography System
           Synced with iOS ReaderContentView.swift
           ======================================== */

        :root {
            --text-color: ${colors.text};
            --text-secondary: ${colors.textSecondary};
            --background: ${colors.background};
            --highlight: ${colors.highlight};
            --link-color: ${colors.link};
            --font-size: ${fontSize}px;
            --line-height: ${lineHeight};
            --letter-spacing: ${letterSpacing}px;
            --word-spacing: 0px;
            --paragraph-spacing: 12px;
            --font-weight: 400;
        }

        * {
            -webkit-user-select: text;
            user-select: text;
            box-sizing: border-box;
        }

        /* ========================================
           Base Typography
           ======================================== */

        html {
            font-size: var(--font-size);
            -webkit-text-size-adjust: 100%;
            text-size-adjust: 100%;
        }

        body {
            margin: 0;
            padding: 0;
            background-color: var(--background);
            color: var(--text-color);
            font-family: ${fontFamily};
            font-size: 1rem;
            font-weight: var(--font-weight);
            line-height: var(--line-height);
            letter-spacing: var(--letter-spacing);
            word-spacing: var(--word-spacing);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
            font-kerning: normal;
            font-variant-ligatures: common-ligatures contextual;
            -webkit-hyphens: auto;
            hyphens: auto;
            orphans: 2;
            widows: 2;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }

        /* ========================================
           Paged Reading Mode
           ======================================== */

        body.paged-mode {
            overflow: hidden;
            height: 100vh;
            padding: 0;
        }

        .pages-container {
            display: flex;
            height: 100vh;
            transition: transform 0.3s ease-out;
            opacity: 0;
        }

        .pages-container.ready {
            opacity: 1;
            transition: opacity 0.15s ease-in, transform 0.3s ease-out;
        }

        .page {
            flex: 0 0 100vw;
            min-width: 100vw;
            height: 100vh;
            padding: 20px 20px 28px 20px;
            box-sizing: border-box;
            overflow: hidden;
            background-color: var(--background);
        }

        .page-content {
            height: 100%;
            overflow: hidden;
        }

        .chapter-indicator {
            position: fixed;
            top: 6px;
            left: 16px;
            font-size: 11px;
            color: var(--text-secondary);
            max-width: 60%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            z-index: 100;
            pointer-events: none;
        }

        .page-indicator {
            position: fixed;
            bottom: 2px;
            right: 16px;
            font-size: 12px;
            color: var(--text-secondary);
            background: var(--background);
            padding: 4px 12px;
            border-radius: 12px;
            z-index: 100;
        }

        /* ========================================
           Paragraph Styles
           ======================================== */

        p {
            margin: 0 0 var(--paragraph-spacing) 0;
            text-align: justify;
            text-justify: inter-character;
            text-indent: 2em;
            hanging-punctuation: first last allow-end;
        }

        h1 + p, h2 + p, h3 + p, h4 + p, h5 + p, h6 + p,
        blockquote + p, .chapter-title + p {
            text-indent: 0;
        }

        .chapter-content > p:first-of-type {
            text-indent: 0;
        }

        /* ========================================
           Heading Styles
           ======================================== */

        h1, h2, h3, h4, h5, h6 {
            font-family: -apple-system, "SF Pro Display", "Helvetica Neue", sans-serif;
            color: var(--text-color);
            font-weight: 600;
            line-height: 1.25;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            letter-spacing: -0.02em;
            page-break-after: avoid;
            break-after: avoid;
            -webkit-hyphens: none;
            hyphens: none;
        }

        h1 { font-size: 1.6em; margin-top: 0; }
        h2 { font-size: 1.35em; }
        h3 { font-size: 1.15em; }
        h4 { font-size: 1.05em; }

        .chapter-title {
            text-align: center;
            margin-bottom: 2em;
            font-size: 1.4em;
            letter-spacing: 0;
        }

        /* ========================================
           Blockquote Styles
           ======================================== */

        blockquote {
            margin: 1.5em 0;
            padding: 0.5em 1.5em;
            border-left: 3px solid var(--text-secondary);
            color: var(--text-secondary);
            font-style: italic;
            page-break-inside: avoid;
            break-inside: avoid;
        }

        blockquote p {
            text-indent: 0;
            margin-bottom: 0.5em;
        }

        blockquote p:last-child {
            margin-bottom: 0;
        }

        /* ========================================
           Inline Styles
           ======================================== */

        a {
            color: var(--link-color);
            text-decoration: none;
        }

        em, i { font-style: italic; }
        strong, b { font-weight: 600; }

        abbr {
            font-variant: small-caps;
            letter-spacing: 0.05em;
        }

        /* ========================================
           Lists
           ======================================== */

        ul, ol {
            margin: 0.5em 0;
            padding-left: 2em;
        }

        li {
            margin-bottom: 0.15em;
            text-indent: 0;
            line-height: 1.4;
        }

        li p {
            text-indent: 0;
            margin-bottom: 0.15em;
        }

        /* ========================================
           Images & Figures
           ======================================== */

        figure {
            margin: 1.5em 0;
            text-align: center;
            break-inside: avoid;
            page-break-inside: avoid;
        }

        /* EPUB figcenter class - used for centered figures */
        /* Override inline width styles from EPUB content */
        .figcenter {
            margin: 1.5em 0;
            text-align: center;
            break-inside: avoid;
            page-break-inside: avoid;
            max-width: 100% !important;
            width: auto !important;
        }

        img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
        }

        /* Dropcap images - decorative capital letters */
        img.dropcap {
            display: inline;
            float: left;
            max-width: 2em;
            max-height: 2em;
            width: auto;
            height: auto;
            margin: 0 0.2em 0.05em 0;
            vertical-align: top;
        }

        /* Dropcap container */
        p.dropcap {
            text-indent: 0;
        }

        /* Hide first character when dropcap image is present to prevent duplication */
        p.dropcap::first-letter {
            opacity: 0;
            font-size: 0;
            width: 0;
            margin: 0;
            padding: 0;
        }

        /* Illustration images */
        img[src*="illus"] {
            max-width: 80%;
            margin: 1em auto;
        }

        figcaption {
            margin-top: 0.5em;
            font-size: 0.875em;
            color: var(--text-secondary);
            font-style: italic;
            text-indent: 0;
        }

        /* Figure caption text - EPUB often uses <p> inside figure instead of <figcaption> */
        figure > p,
        .figcenter > p {
            margin-top: 0.5em;
            font-size: 0.875em;
            color: var(--text-secondary);
            font-style: italic;
            font-weight: normal;
            text-indent: 0;
            line-height: 1.4;
        }

        /* EPUB caption class - Gutenberg uses <p class="caption"> for image titles */
        p.caption,
        .caption {
            margin-top: 0.5em;
            font-size: 0.875em;
            color: var(--text-secondary);
            font-style: italic;
            font-weight: normal;
            text-indent: 0;
            text-align: center;
            line-height: 1.4;
        }

        /* Cover image - fullscreen */
        img.cover, img.x-ebookmaker-cover {
            width: 100%;
            height: 100%;
            object-fit: contain;
            margin: 0;
        }

        /* Cover page - no padding for fullscreen display */
        .page.cover-page {
            padding: 0;
        }

        .page.cover-page .page-content,
        .page.cover-page .chapter-content {
            width: 100%;
            height: 100%;
        }

        /* Fit tall images to page */
        img.fit-to-page {
            max-height: calc(100vh - 56px);
            width: auto;
            object-fit: contain;
        }

        /* ========================================
           Code Styles
           ======================================== */

        code, pre {
            font-family: "SF Mono", "Menlo", "Monaco", monospace;
            font-size: 0.9em;
            -webkit-hyphens: none;
            hyphens: none;
        }

        code {
            background-color: rgba(128, 128, 128, 0.1);
            padding: 0.15em 0.3em;
            border-radius: 3px;
        }

        pre {
            margin: 1.5em 0;
            padding: 1em;
            background-color: rgba(128, 128, 128, 0.1);
            overflow-x: auto;
            line-height: 1.4;
            border-radius: 6px;
            white-space: pre-wrap;
            word-break: break-all;
        }

        pre code {
            background: none;
            padding: 0;
        }

        /* ========================================
           Tables
           ======================================== */

        table {
            width: 100%;
            margin: 1.5em 0;
            border-collapse: collapse;
            font-size: 0.5em;
        }

        th, td {
            padding: 0.5em 0.75em;
            text-align: left;
            border-bottom: 1px solid rgba(128, 128, 128, 0.3);
            text-indent: 0;
        }

        th { font-weight: 600; }

        /* ========================================
           Horizontal Rules
           ======================================== */

        hr {
            border: none;
            border-top: 1px solid var(--text-secondary);
            margin: 2em 0;
            opacity: 0.3;
        }

        /* ========================================
           Selection
           ======================================== */

        ::selection {
            background-color: var(--highlight);
        }

        /* ========================================
           Touch Zones (visual feedback)
           ======================================== */

        .touch-zone-indicator {
            position: fixed;
            top: 50%;
            transform: translateY(-50%);
            font-size: 32px;
            color: var(--text-secondary);
            opacity: 0;
            transition: opacity 0.15s ease;
            pointer-events: none;
            z-index: 200;
        }

        .touch-zone-indicator.left { left: 30px; }
        .touch-zone-indicator.right { right: 30px; }
        .touch-zone-indicator.visible { opacity: 0.5; }
    </style>
</head>
<body class="paged-mode">
    <div class="pages-container" id="pagesContainer">
        <div class="page" data-page="0">
            <div class="page-content">
                ${titleHtml}
                <div class="chapter-content">
                ${contentHtml}
                </div>
            </div>
        </div>
    </div>
    <div class="page-indicator" id="pageIndicator">1 / 1</div>
    ${chapterIndicatorHtml}
    <div class="touch-zone-indicator left" id="leftZone">‹</div>
    <div class="touch-zone-indicator right" id="rightZone">›</div>

    <script>
        // ========================================
        // Configuration
        // ========================================
        const SIDE_ZONE_RATIO = 0.25;
        const START_FROM_LAST_PAGE = ${startFromLastPage};
        let currentPageIndex = 0;
        let totalPages = 1;
        let isAnimating = false;
        let dragStartX = 0;
        let dragOffset = 0;

        // ========================================
        // Initialization
        // ========================================
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(paginateContent, 50);
        });

        // ========================================
        // Pagination
        // ========================================
        function paginateContent() {
            const container = document.getElementById('pagesContainer');
            if (!container) return;

            const firstPage = container.querySelector('.page');
            if (!firstPage) return;

            const content = firstPage.querySelector('.page-content');
            if (!content) return;

            const pageHeight = window.innerHeight - 48;
            const pageWidth = window.innerWidth - 40;
            const safetyMargin = 20;

            // Clone for measurement
            const measureDiv = document.createElement('div');
            measureDiv.style.cssText = 'position: absolute; left: -9999px; top: 0; width: ' + pageWidth + 'px; visibility: visible;';
            measureDiv.innerHTML = content.innerHTML;
            document.body.appendChild(measureDiv);
            measureDiv.offsetHeight;

            const totalHeight = measureDiv.scrollHeight;
            const numPages = Math.max(1, Math.ceil(totalHeight / pageHeight));

            if (numPages <= 1) {
                document.body.removeChild(measureDiv);
                totalPages = 1;
                // Check if single page is a cover page
                const firstPage = container.querySelector('.page');
                if (firstPage && firstPage.innerHTML.includes('class="cover"')) {
                    firstPage.classList.add('cover-page');
                }
                showContent(container);
                return;
            }

            // Get elements for pagination
            const chapterContent = measureDiv.querySelector('.chapter-content');
            const chapterTitle = measureDiv.querySelector('.chapter-title');
            let elements = [];

            if (chapterTitle) elements.push(chapterTitle);

            if (chapterContent) {
                const childNodes = Array.from(chapterContent.childNodes);
                childNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        elements.push(node);
                    } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                        const wrapper = document.createElement('p');
                        wrapper.textContent = node.textContent.trim();
                        wrapper.style.margin = '0';
                        elements.push(wrapper);
                    }
                });
            }

            // Paginate elements
            let currentPageContent = '';
            let currentHeight = 0;
            const pages = [];

            // DEBUG: Log pagination info
            console.log('%c[Pagination Debug]', 'color: #ff6b6b; font-weight: bold;');
            console.log('pageHeight:', pageHeight, 'pageWidth:', pageWidth);
            console.log('totalElements:', elements.length);

            // Track which elements to skip (already processed as part of dropcap group)
            const skipIndices = new Set();

            elements.forEach((el, idx) => {
                // Skip if already processed as part of dropcap group
                if (skipIndices.has(idx)) {
                    return;
                }

                const tagName = el.tagName;
                const className = el.className || '';
                const textPreview = (el.textContent || '').substring(0, 50).replace(/\\n/g, ' ');

                // Skip standalone dropcap images
                const isDropcapImg = el.tagName === 'IMG' && el.className.includes('dropcap');
                if (isDropcapImg) {
                    console.log('%c  [DROPCAP IMG SKIP]', 'color: #4ecdc4;', idx, tagName, className);
                    currentPageContent += el.outerHTML;
                    return;
                }

                // Handle dropcap div + p.dropcap as a group
                // Since dropcap image floats left, we don't measure height accurately
                // Instead, we add them to current page if there's reasonable space
                const isDropcapDiv = el.tagName === 'DIV' && el.querySelector && el.querySelector('img.dropcap');
                if (isDropcapDiv) {
                    // Find the next p.dropcap element
                    let nextDropcapP = null;
                    let nextDropcapPIdx = -1;
                    for (let i = idx + 1; i < elements.length; i++) {
                        const nextEl = elements[i];
                        if (nextEl.tagName === 'P' && nextEl.className.includes('dropcap')) {
                            nextDropcapP = nextEl;
                            nextDropcapPIdx = i;
                            break;
                        }
                        // Stop if we hit a non-empty block element that's not empty text
                        if (nextEl.tagName !== 'P' || (nextEl.textContent && nextEl.textContent.trim())) {
                            break;
                        }
                    }

                    if (nextDropcapP) {
                        // Mark the p.dropcap as processed
                        skipIndices.add(nextDropcapPIdx);

                        // For dropcap group, only measure p.dropcap height since img is float:left
                        const pStyle = window.getComputedStyle(nextDropcapP);
                        const pMarginTop = parseFloat(pStyle.marginTop) || 0;
                        const pMarginBottom = parseFloat(pStyle.marginBottom) || 0;
                        const dropcapPHeight = nextDropcapP.offsetHeight + pMarginTop + pMarginBottom;

                        console.log('%c  [DROPCAP GROUP]', 'color: #4ecdc4;', idx, '+ p.dropcap at', nextDropcapPIdx, '| p.dropcap h:', dropcapPHeight);

                        // Check if current page only contains a heading
                        const onlyContainsHeading = currentPageContent &&
                            /^<h[1-6][^>]*>[\\s\\S]*<\\/h[1-6]>$/i.test(currentPageContent.trim());

                        // Calculate available height for dropcap group
                        const availableForDropcap = pageHeight - currentHeight - safetyMargin;

                        if (onlyContainsHeading && dropcapPHeight > availableForDropcap) {
                            // Heading + dropcap exceeds page - need to split dropcap text
                            console.log('%c    → SPLITTING DROPCAP with heading', 'color: #e67e22;', 'available:', availableForDropcap);

                            // Split dropcap paragraph text to fit available space
                            // Note: innerHTML is from existing DOM content, not user input
                            const dropcapHTML = nextDropcapP.innerHTML;
                            const tokens = dropcapHTML.split(/(\\s+|<[^>]+>)/g).filter(t => t);

                            // Create temp element to measure text fitting
                            const tempP = document.createElement('p');
                            tempP.className = nextDropcapP.className;
                            tempP.style.cssText = 'position: absolute; left: -9999px; width: ' + pageWidth + 'px; visibility: hidden;';
                            document.body.appendChild(tempP);

                            let currentText = '';
                            let splitIndex = tokens.length;

                            // FIX: Track word boundary backtrack offset
                            let wordBoundaryOffset = 0;

                            for (let i = 0; i < tokens.length; i++) {
                                const token = tokens[i];
                                const testText = currentText + token;
                                tempP.innerHTML = testText;
                                if (tempP.offsetHeight > availableForDropcap && currentText.trim()) {
                                    // FIX: Preserve word boundaries - don't split mid-word
                                    if (!/^\\s+$/.test(token) && !/^<[^>]+>$/.test(token)) {
                                        // Find last whitespace in currentText to break at word boundary
                                        const lastSpaceMatch = currentText.match(/^([\\s\\S]*\\s)(\\S+)$/);
                                        if (lastSpaceMatch && lastSpaceMatch[1].trim()) {
                                            currentText = lastSpaceMatch[1];
                                            wordBoundaryOffset = lastSpaceMatch[2].length;
                                            console.log('%c      → DROPCAP WORD BOUNDARY BACKTRACK', 'color: #f39c12;', 'moved:', lastSpaceMatch[2]);
                                        }
                                    }
                                    splitIndex = i;
                                    break;
                                }
                                currentText = testText;
                            }

                            document.body.removeChild(tempP);

                            if (splitIndex < tokens.length && currentText.trim()) {
                                // =================================================================
                                // ORPHAN PREVENTION: Adjust split point BEFORE creating pages
                                // Instead of post-hoc backfilling, prevent orphans at split time
                                // =================================================================

                                // Create reusable measurement element
                                const measureP = document.createElement('p');
                                measureP.style.cssText = 'position: absolute; left: -9999px; width: ' + pageWidth + 'px; visibility: hidden;';
                                document.body.appendChild(measureP);

                                // Measure second part (remaining text after split)
                                let remainingTokens = tokens.slice(splitIndex);
                                if (wordBoundaryOffset > 0) {
                                    const movedFragment = tokens.slice(0, splitIndex).join('').slice(-wordBoundaryOffset);
                                    remainingTokens = [movedFragment, ...remainingTokens];
                                }
                                let remainingText = remainingTokens.join('').trim();
                                measureP.innerHTML = remainingText;
                                let secondPartHeight = measureP.offsetHeight;

                                // ORPHAN PREVENTION: If second part is too small, move split point back
                                // Goal: Make second part large enough to not look like orphan text
                                const orphanThreshold = 100; // Minimum height for second part (px)
                                const maxBacktrack = 30;     // Maximum tokens to move back
                                let backtrackCount = 0;
                                let adjustedSplitIndex = splitIndex;
                                let adjustedCurrentText = currentText;

                                while (secondPartHeight < orphanThreshold && backtrackCount < maxBacktrack && adjustedSplitIndex > 10) {
                                    // Move split point back by finding previous word boundary
                                    adjustedSplitIndex--;

                                    // Skip whitespace and HTML tags when backtracking
                                    while (adjustedSplitIndex > 0 &&
                                           (/^\\s+$/.test(tokens[adjustedSplitIndex]) || /^<[^>]+>$/.test(tokens[adjustedSplitIndex]))) {
                                        adjustedSplitIndex--;
                                    }

                                    // Rebuild first and second parts
                                    adjustedCurrentText = tokens.slice(0, adjustedSplitIndex).join('');
                                    remainingTokens = tokens.slice(adjustedSplitIndex);
                                    remainingText = remainingTokens.join('').trim();

                                    // Re-measure second part
                                    measureP.innerHTML = remainingText;
                                    secondPartHeight = measureP.offsetHeight;
                                    backtrackCount++;
                                }

                                if (backtrackCount > 0) {
                                    console.log('%c      → ORPHAN PREVENTION: split point moved back', 'color: #9b59b6;',
                                                'tokens:', backtrackCount, 'newSecondH:', secondPartHeight);
                                    splitIndex = adjustedSplitIndex;
                                    currentText = adjustedCurrentText;
                                }

                                // First part: heading + dropcap img + partial text
                                const firstPartP = document.createElement('p');
                                firstPartP.className = nextDropcapP.className;
                                firstPartP.innerHTML = currentText.trim();

                                // Measure first part height
                                measureP.className = nextDropcapP.className;
                                measureP.innerHTML = currentText.trim();
                                const firstPartHeight = measureP.offsetHeight;

                                currentPageContent += el.outerHTML + firstPartP.outerHTML;
                                const page1UsedHeight = currentHeight + firstPartHeight;
                                pages.push(currentPageContent);
                                console.log('%c      → Dropcap split at token', 'color: #e67e22;', splitIndex, '| page1 used:', page1UsedHeight);

                                // Second part: remaining text (measured above)
                                document.body.removeChild(measureP);

                                if (remainingText) {
                                    const secondPartP = document.createElement('p');
                                    secondPartP.innerHTML = remainingText;

                                    // Simple logic: second part goes to next page
                                    // No backfill attempts - orphan prevention already handled above
                                    console.log('%c      → Second part to page 2', 'color: #27ae60;',
                                                'height:', secondPartHeight, '(orphan prevention applied)');
                                    currentPageContent = secondPartP.outerHTML;
                                    currentHeight = secondPartHeight;
                                } else {
                                    currentPageContent = '';
                                    currentHeight = 0;
                                }
                            } else {
                                // Can't split effectively, just add as is
                                currentPageContent += el.outerHTML + nextDropcapP.outerHTML;
                                currentHeight += dropcapPHeight;
                            }
                            return;
                        } else if (onlyContainsHeading) {
                            console.log('%c    → KEEPING HEADING WITH DROPCAP GROUP', 'color: #f39c12;');
                            // Fits within page - don't page break
                        } else if (currentPageContent && currentHeight + dropcapPHeight > pageHeight - safetyMargin) {
                            console.log('%c    → PAGE BREAK before dropcap group', 'color: #e74c3c;', 'pages:', pages.length + 1);
                            pages.push(currentPageContent);
                            currentPageContent = '';
                            currentHeight = 0;
                        }

                        // Add both elements as a group
                        currentPageContent += el.outerHTML + nextDropcapP.outerHTML;
                        currentHeight += dropcapPHeight;
                        return;
                    } else {
                        // No p.dropcap found, just add the div without height
                        console.log('%c  [DROPCAP DIV SKIP]', 'color: #4ecdc4;', idx, tagName, '(no p.dropcap found)');
                        currentPageContent += el.outerHTML;
                        return;
                    }
                }

                // Skip empty elements (whitespace-only paragraphs that would create blank pages)
                const textContent = (el.textContent || '').trim();
                const isEmptyElement = el.tagName === 'P' && !textContent && el.offsetHeight < 20;
                if (isEmptyElement) {
                    console.log('%c  [EMPTY P SKIP]', 'color: #9b59b6;', idx, '| h:', el.offsetHeight, '| skipping empty paragraph completely');
                    // Completely skip - don't add to any page content
                    return;
                }

                const style = window.getComputedStyle(el);
                const marginTop = parseFloat(style.marginTop) || 0;
                const marginBottom = parseFloat(style.marginBottom) || 0;
                const elHeight = el.offsetHeight + marginTop + marginBottom;

                // Cover images get their own page
                const isCoverImage = el.tagName === 'IMG' &&
                    (el.className.includes('cover') || el.className.includes('x-ebookmaker-cover'));
                const isTallElement = elHeight > pageHeight * 0.8;

                console.log(
                    '%c  [' + idx + ']', 'color: #95a5a6;',
                    tagName,
                    className ? '.' + className : '',
                    '| h:', elHeight.toFixed(0),
                    '| accum:', currentHeight.toFixed(0),
                    '| text:', textPreview
                );

                // Cover images get their own page (no splitting needed)
                if (isCoverImage) {
                    console.log('%c    → FORCE NEW PAGE (cover)', 'color: #e74c3c;');
                    if (currentPageContent) {
                        pages.push(currentPageContent);
                        currentPageContent = '';
                        currentHeight = 0;
                    }
                    pages.push(el.outerHTML);
                    return;
                }

                // Handle tall elements by splitting to avoid content loss
                if (isTallElement) {
                    console.log('%c    → TALL ELEMENT detected', 'color: #e74c3c;', 'h:', elHeight, 'pageH:', pageHeight);

                    // Check if currentPageContent only contains a heading
                    const onlyContainsHeading = currentPageContent &&
                        /^<h[1-6][^>]*>[\\s\\S]*<\\/h[1-6]>$/i.test(currentPageContent.trim());

                    // Also check if currentPageContent is small enough to keep with tall element
                    let contentToKeep = '';
                    let measuredContentHeight = currentHeight;

                    if (currentPageContent && !onlyContainsHeading && currentHeight === 0) {
                        // currentHeight is 0 but we have content - measure it
                        const tempMeasure = document.createElement('div');
                        tempMeasure.style.cssText = 'position: absolute; left: -9999px; width: ' + pageWidth + 'px; visibility: hidden;';
                        tempMeasure.innerHTML = currentPageContent;
                        document.body.appendChild(tempMeasure);
                        measuredContentHeight = tempMeasure.offsetHeight;
                        document.body.removeChild(tempMeasure);
                        console.log('%c    → Measured existing content height:', 'color: #3498db;', measuredContentHeight);
                    }

                    // Keep content if it's a heading OR if it's small enough (< 25% of page)
                    const isSmallContent = measuredContentHeight < pageHeight * 0.25;
                    if (onlyContainsHeading || (currentPageContent && isSmallContent)) {
                        contentToKeep = currentPageContent;
                        console.log('%c    → KEEPING SMALL CONTENT WITH TALL ELEMENT', 'color: #f39c12;', 'h:', measuredContentHeight);
                        currentPageContent = '';
                        currentHeight = 0;
                    }
                    const headingToKeep = contentToKeep;

                    // Save any existing content before processing tall element
                    if (currentPageContent) {
                        pages.push(currentPageContent);
                        currentPageContent = '';
                        currentHeight = 0;
                    }

                    // Handle by element type
                    if (el.tagName === 'TABLE') {
                        // Split table by rows
                        console.log('%c    → SPLITTING TABLE by rows', 'color: #9b59b6;');
                        const tbody = el.querySelector('tbody');
                        const thead = el.querySelector('thead');
                        const rows = tbody ? tbody.querySelectorAll('tr') : el.querySelectorAll('tr');
                        const theadHTML = thead ? thead.outerHTML : '';
                        const theadHeight = thead ? thead.offsetHeight : 0;

                        let tablePageContent = headingToKeep + '<table>' + theadHTML + '<tbody>';
                        let tablePageHeight = theadHeight;
                        const availableHeight = pageHeight - (headingToKeep ? 82 : 0); // Estimate heading height

                        rows.forEach((row, rowIdx) => {
                            const rowHeight = row.offsetHeight;
                            if (tablePageHeight + rowHeight > availableHeight && tablePageContent !== headingToKeep + '<table>' + theadHTML + '<tbody>') {
                                // Close current table page and start new one
                                tablePageContent += '</tbody></table>';
                                pages.push(tablePageContent);
                                console.log('%c      → Table page break at row', 'color: #9b59b6;', rowIdx);
                                tablePageContent = '<table>' + theadHTML + '<tbody>';
                                tablePageHeight = theadHeight;
                            }
                            tablePageContent += row.outerHTML;
                            tablePageHeight += rowHeight;
                        });

                        // Push remaining table content
                        if (tablePageContent !== '<table>' + theadHTML + '<tbody>') {
                            tablePageContent += '</tbody></table>';
                            pages.push(tablePageContent);
                        }
                    } else if (el.tagName === 'IMG') {
                        // Scale image to fit page
                        console.log('%c    → SCALING IMAGE to fit page', 'color: #9b59b6;');
                        el.classList.add('fit-to-page');
                        pages.push(headingToKeep + el.outerHTML);
                    } else {
                        // Split other elements by children or text
                        console.log('%c    → SPLITTING ELEMENT by children', 'color: #9b59b6;');
                        const children = el.children;
                        if (children.length > 1) {
                            let splitPageContent = headingToKeep;
                            let splitPageHeight = headingToKeep ? 82 : 0;
                            const fullPageHeight = pageHeight - safetyMargin;

                            // Helper: split text content of an element across pages
                            // Note: content comes from existing DOM (EPUB content), not user input
                            function splitChildByText(textEl, availHeight) {
                                const textHTML = textEl.innerHTML;

                                // Step 1: Extract all HTML tags and replace with placeholders
                                // This prevents tags from being split incorrectly
                                const tagMap = [];
                                const PLACEHOLDER = '\\x00T';
                                const protectedHTML = textHTML.replace(/<[^>]*>/gs, (match) => {
                                    tagMap.push(match);
                                    return PLACEHOLDER + (tagMap.length - 1) + PLACEHOLDER;
                                });

                                // Step 2: Split by whitespace only (tags are now protected)
                                const textTokens = protectedHTML.split(/(\\s+)/g).filter(t => t);

                                // Helper to restore tags in a string
                                function restoreTags(str) {
                                    return str.replace(/\\x00T(\\d+)\\x00T/g, (_, idx) => tagMap[parseInt(idx)] || '');
                                }

                                const parts = [];
                                let textAccum = '';
                                let currentAvail = availHeight;

                                const measureEl = document.createElement(textEl.tagName);
                                measureEl.className = textEl.className || '';
                                measureEl.style.cssText = 'position: absolute; left: -9999px; width: ' + pageWidth + 'px; visibility: hidden;';
                                document.body.appendChild(measureEl);

                                for (let ti = 0; ti < textTokens.length; ti++) {
                                    const tok = textTokens[ti];
                                    const testAccum = textAccum + tok;
                                    // Restore tags for measurement
                                    measureEl.innerHTML = restoreTags(testAccum);

                                    if (measureEl.offsetHeight > currentAvail && textAccum.trim()) {
                                        // Find a safe split point at word boundary
                                        let safePart = textAccum;
                                        let remainder = tok;
                                        if (!/^\\s+$/.test(tok)) {
                                            const spaceMatch = textAccum.match(/^([\\s\\S]*\\s)(\\S+)$/);
                                            if (spaceMatch && spaceMatch[1].trim()) {
                                                safePart = spaceMatch[1];
                                                remainder = spaceMatch[2] + tok;
                                            }
                                        }
                                        const partEl = document.createElement(textEl.tagName);
                                        partEl.className = textEl.className || '';
                                        partEl.innerHTML = restoreTags(safePart.trim());
                                        parts.push(partEl.outerHTML);
                                        console.log('%c        → Text split at token', 'color: #e67e22;', ti, '| parts:', parts.length);
                                        textAccum = remainder;
                                        currentAvail = fullPageHeight;
                                    } else {
                                        textAccum = testAccum;
                                    }
                                }
                                if (textAccum.trim()) {
                                    const finalEl = document.createElement(textEl.tagName);
                                    finalEl.className = textEl.className || '';
                                    finalEl.innerHTML = restoreTags(textAccum.trim());
                                    parts.push(finalEl.outerHTML);
                                }
                                document.body.removeChild(measureEl);
                                return parts;
                            }

                            Array.from(children).forEach((child, childIdx) => {
                                const childStyle = window.getComputedStyle(child);
                                const childMarginTop = parseFloat(childStyle.marginTop) || 0;
                                const childMarginBottom = parseFloat(childStyle.marginBottom) || 0;
                                const childHeight = child.offsetHeight + childMarginTop + childMarginBottom;
                                const availableForChild = fullPageHeight - splitPageHeight;

                                if (childHeight > availableForChild) {
                                    const childIsTooTallForPage = childHeight > fullPageHeight;
                                    const canSplitByText = ['P', 'DIV', 'SPAN', 'BLOCKQUOTE'].includes(child.tagName);

                                    if (canSplitByText && (childIsTooTallForPage || availableForChild > 100)) {
                                        console.log('%c      → Child too tall, splitting by text', 'color: #e67e22;', childIdx, '| h:', childHeight, '| avail:', availableForChild);
                                        const textParts = splitChildByText(child, availableForChild);

                                        if (textParts.length > 0) {
                                            splitPageContent += textParts[0];
                                            pages.push(splitPageContent);
                                            console.log('%c      → Pushed page with partial child', 'color: #9b59b6;', childIdx);

                                            for (let pi = 1; pi < textParts.length - 1; pi++) {
                                                pages.push(textParts[pi]);
                                            }

                                            if (textParts.length > 1) {
                                                splitPageContent = textParts[textParts.length - 1];
                                                const measureLast = document.createElement('div');
                                                measureLast.style.cssText = 'position: absolute; left: -9999px; width: ' + pageWidth + 'px;';
                                                measureLast.innerHTML = splitPageContent;
                                                document.body.appendChild(measureLast);
                                                splitPageHeight = measureLast.offsetHeight;
                                                document.body.removeChild(measureLast);
                                            } else {
                                                splitPageContent = '';
                                                splitPageHeight = 0;
                                            }
                                        } else {
                                            if (splitPageContent && splitPageContent !== headingToKeep) {
                                                pages.push(splitPageContent);
                                            }
                                            splitPageContent = child.outerHTML;
                                            splitPageHeight = childHeight;
                                        }
                                    } else {
                                        if (splitPageContent && splitPageContent !== headingToKeep) {
                                            pages.push(splitPageContent);
                                            console.log('%c      → Element split at child', 'color: #9b59b6;', childIdx);
                                        }
                                        splitPageContent = child.outerHTML;
                                        splitPageHeight = childHeight;
                                    }
                                } else {
                                    splitPageContent += child.outerHTML;
                                    splitPageHeight += childHeight;
                                }
                            });

                            if (splitPageContent) {
                                pages.push(splitPageContent);
                            }
                        } else if (el.tagName === 'P' || el.tagName === 'DIV') {
                            // Split paragraph/div by text content
                            console.log('%c    → SPLITTING TEXT CONTENT', 'color: #e67e22;');
                            const innerHTML = el.innerHTML;
                            // Split by words while preserving HTML tags
                            const tokens = innerHTML.split(/(\s+|<[^>]+>)/g).filter(t => t);

                            let currentText = '';
                            let splitPages = [];
                            const availableHeight = pageHeight - safetyMargin - (headingToKeep ? 82 : 0);

                            // Create a temporary measure element
                            const tempP = document.createElement(el.tagName);
                            tempP.className = el.className;
                            tempP.style.cssText = 'position: absolute; left: -9999px; width: ' + pageWidth + 'px; visibility: hidden;';
                            document.body.appendChild(tempP);

                            for (let i = 0; i < tokens.length; i++) {
                                const token = tokens[i];
                                const testText = currentText + token;
                                tempP.innerHTML = testText;

                                if (tempP.offsetHeight > availableHeight && currentText.trim()) {
                                    // Current text exceeds page - need to save it
                                    // FIX: Preserve word boundaries - don't split mid-word
                                    let safeText = currentText;
                                    let nextPageStart = token;

                                    // If current token is not whitespace, we might be splitting mid-word
                                    if (!/^\\s+$/.test(token) && !/^<[^>]+>$/.test(token)) {
                                        // Find last whitespace in currentText to break at word boundary
                                        const lastSpaceMatch = currentText.match(/^([\\s\\S]*\\s)(\\S+)$/);
                                        if (lastSpaceMatch && lastSpaceMatch[1].trim()) {
                                            safeText = lastSpaceMatch[1];
                                            nextPageStart = lastSpaceMatch[2] + token;
                                            console.log('%c      → WORD BOUNDARY BACKTRACK', 'color: #f39c12;', 'moved:', lastSpaceMatch[2]);
                                        }
                                    }

                                    const pageP = document.createElement(el.tagName);
                                    pageP.className = el.className;
                                    pageP.innerHTML = safeText.trim();
                                    splitPages.push(pageP.outerHTML);
                                    console.log('%c      → Text split at token', 'color: #e67e22;', i, '| page:', splitPages.length);
                                    currentText = nextPageStart;
                                } else {
                                    currentText = testText;
                                }
                            }

                            // Add remaining content
                            if (currentText.trim()) {
                                const pageP = document.createElement(el.tagName);
                                pageP.className = el.className;
                                pageP.innerHTML = currentText.trim();
                                splitPages.push(pageP.outerHTML);
                            }

                            document.body.removeChild(tempP);

                            // Add split pages
                            if (splitPages.length > 0) {
                                // First page gets heading if any
                                pages.push(headingToKeep + splitPages[0]);
                                for (let i = 1; i < splitPages.length; i++) {
                                    pages.push(splitPages[i]);
                                }
                                console.log('%c      → Text split into', 'color: #e67e22;', splitPages.length, 'pages');
                            } else {
                                pages.push(headingToKeep + el.outerHTML);
                            }
                        } else {
                            // No children to split, just add as is
                            pages.push(headingToKeep + el.outerHTML);
                        }
                    }
                    return;
                }

                // Keep headings with next element
                const isHeading = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName);
                const nextEl = elements[idx + 1];
                let combinedHeight = elHeight;

                if (isHeading && nextEl) {
                    const nextStyle = window.getComputedStyle(nextEl);
                    const nextMarginTop = parseFloat(nextStyle.marginTop) || 0;
                    const nextMarginBottom = parseFloat(nextStyle.marginBottom) || 0;
                    combinedHeight = elHeight + nextEl.offsetHeight + nextMarginTop + nextMarginBottom;
                    console.log('%c    → HEADING + next combined:', 'color: #f39c12;', combinedHeight.toFixed(0));
                }

                if (currentPageContent) {
                    if ((isHeading && nextEl && currentHeight + combinedHeight > pageHeight - safetyMargin) ||
                        (!isHeading && currentHeight + elHeight > pageHeight - safetyMargin)) {
                        console.log('%c    → PAGE BREAK (overflow)', 'color: #e74c3c;', 'pages:', pages.length + 1);
                        pages.push(currentPageContent);
                        currentPageContent = '';
                        currentHeight = 0;
                    }
                }

                currentPageContent += el.outerHTML;
                currentHeight += elHeight;
            });

            // If remaining content is only HR, merge with last page instead of creating new page
            if (currentPageContent) {
                const isOnlyHR = /^<hr[^>]*\\/?>\s*$/i.test(currentPageContent.trim());
                if (isOnlyHR && pages.length > 0) {
                    console.log('%c[Pagination] Merging trailing HR with last page', 'color: #9b59b6;');
                    pages[pages.length - 1] += currentPageContent;
                    currentPageContent = '';
                } else {
                    pages.push(currentPageContent);
                }
            }

            console.log('%c[Pagination Result]', 'color: #2ecc71; font-weight: bold;', 'totalPages:', pages.length);
            document.body.removeChild(measureDiv);

            // Build pages
            container.innerHTML = '';
            pages.forEach((pageContent, index) => {
                const pageDiv = document.createElement('div');
                const isCoverPage = pageContent.includes('class="cover"') ||
                                    pageContent.includes('class="x-ebookmaker-cover"');
                pageDiv.className = 'page' + (isCoverPage ? ' cover-page' : '');
                pageDiv.dataset.page = index;
                pageDiv.innerHTML = '<div class="page-content">' + pageContent + '</div>';
                container.appendChild(pageDiv);
            });

            totalPages = pages.length;

            // Jump to last page if requested (for seamless previous chapter navigation)
            if (START_FROM_LAST_PAGE && totalPages > 1) {
                currentPageIndex = totalPages - 1;
                const offset = currentPageIndex * window.innerWidth;
                container.style.transform = 'translateX(-' + offset + 'px)';
            }

            updatePageIndicator();
            showContent(container);
        }

        function showContent(container) {
            requestAnimationFrame(() => {
                container.offsetHeight;
                container.style.transition = 'opacity 0.15s ease-in';
                container.style.opacity = '1';
            });
        }

        // ========================================
        // Navigation
        // ========================================
        function goToNextPage() {
            if (isAnimating) return false;
            if (currentPageIndex >= totalPages - 1) {
                // At last page, request next chapter
                if (window.parent !== window) {
                    window.parent.postMessage({ type: 'requestNextChapter' }, '*');
                }
                return false;
            }
            currentPageIndex++;
            slideTo(currentPageIndex);
            return true;
        }

        function goToPreviousPage() {
            if (isAnimating) return false;
            if (currentPageIndex <= 0) {
                // At first page, request previous chapter
                if (window.parent !== window) {
                    window.parent.postMessage({ type: 'requestPreviousChapter' }, '*');
                }
                return false;
            }
            currentPageIndex--;
            slideTo(currentPageIndex);
            return true;
        }

        function slideTo(pageIndex) {
            isAnimating = true;
            const container = document.querySelector('.pages-container');
            const offset = pageIndex * window.innerWidth;
            container.style.transition = 'transform 0.3s ease-out';
            container.style.transform = 'translateX(-' + offset + 'px)';

            setTimeout(() => {
                isAnimating = false;
                updatePageIndicator();
            }, 300);
        }

        function updatePageIndicator() {
            const indicator = document.getElementById('pageIndicator');
            if (indicator) {
                indicator.textContent = (currentPageIndex + 1) + ' / ' + totalPages;
            }
            // Notify parent window
            if (window.parent !== window) {
                window.parent.postMessage({
                    type: 'pageChange',
                    current: currentPageIndex + 1,
                    total: totalPages
                }, '*');
            }
        }

        // ========================================
        // Event Handlers
        // ========================================
        document.addEventListener('click', function(e) {
            if (isAnimating) return;
            if (window.getSelection().toString().trim()) return;

            const x = e.clientX;
            const width = window.innerWidth;
            const leftBoundary = width * SIDE_ZONE_RATIO;
            const rightBoundary = width * (1 - SIDE_ZONE_RATIO);

            if (x < leftBoundary) {
                showZoneIndicator('left');
                goToPreviousPage();
            } else if (x > rightBoundary) {
                showZoneIndicator('right');
                goToNextPage();
            }
        });

        // Touch/swipe support
        document.addEventListener('touchstart', function(e) {
            if (isAnimating) return;
            dragStartX = e.touches[0].clientX;
            dragOffset = 0;
        }, { passive: true });

        document.addEventListener('touchmove', function(e) {
            if (isAnimating) return;
            const currentX = e.touches[0].clientX;
            dragOffset = currentX - dragStartX;

            let visualOffset = dragOffset;
            // Add damping effect at boundaries to indicate chapter switch is possible
            if (currentPageIndex <= 0 && dragOffset > 0) {
                visualOffset = dragOffset * 0.3; // Damping for previous chapter hint
            }
            if (currentPageIndex >= totalPages - 1 && dragOffset < 0) {
                visualOffset = dragOffset * 0.3; // Damping for next chapter hint
            }

            const container = document.querySelector('.pages-container');
            const baseOffset = -currentPageIndex * window.innerWidth;
            container.style.transition = 'none';
            container.style.transform = 'translateX(' + (baseOffset + visualOffset) + 'px)';
        }, { passive: true });

        document.addEventListener('touchend', function() {
            const threshold = window.innerWidth * 0.25;
            const chapterThreshold = window.innerWidth * 0.15; // Lower threshold for chapter switch

            if (dragOffset < -threshold) {
                goToNextPage();
            } else if (dragOffset > threshold) {
                goToPreviousPage();
            } else if (currentPageIndex >= totalPages - 1 && dragOffset < -chapterThreshold) {
                // At last page, swipe left to next chapter
                if (window.parent !== window) {
                    window.parent.postMessage({ type: 'requestNextChapter' }, '*');
                }
                slideTo(currentPageIndex);
            } else if (currentPageIndex <= 0 && dragOffset > chapterThreshold) {
                // At first page, swipe right to previous chapter
                if (window.parent !== window) {
                    window.parent.postMessage({ type: 'requestPreviousChapter' }, '*');
                }
                slideTo(currentPageIndex);
            } else if (Math.abs(dragOffset) > 5) {
                slideTo(currentPageIndex);
            }
            dragOffset = 0;
        });

        // Zone indicator
        function showZoneIndicator(side) {
            const indicator = document.getElementById(side + 'Zone');
            if (indicator) {
                indicator.classList.add('visible');
                setTimeout(() => indicator.classList.remove('visible'), 150);
            }
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                goToPreviousPage();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
                goToNextPage();
            }
        });
    </script>
</body>
</html>`;
}
