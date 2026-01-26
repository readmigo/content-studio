# Readmigo Content Studio

Internal tool for book content editing, proofreading, and preview.

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Editor**: Monaco Editor
- **Styling**: Tailwind CSS

## Features

- Chapter content editing with syntax highlighting
- Real-time phone preview with multiple themes
- Content validation and auto-fix suggestions
- Side-by-side comparison view
- Multi-environment support (production, staging, debug)

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── book/[id]/   # Book editing page
│   │   ├── rules/       # Content rules management
│   │   └── learning/    # Learning content editor
│   ├── components/
│   │   ├── editor/      # Editor components
│   │   └── preview/     # Phone preview components
│   ├── lib/
│   │   ├── reader-template.ts  # Reader HTML template
│   │   └── api.ts       # Backend API client
│   └── stores/          # State management
└── messages/            # i18n translations
```

## Key Components

| Component | Description |
|-----------|-------------|
| `reader-template.ts` | Generates reader HTML with pagination |
| `phone-preview.tsx` | iPhone preview with theme switching |
| `chapter-sidebar.tsx` | Chapter navigation sidebar |

## Development

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local

# Start development server
pnpm dev
```

## Notes

The `reader-template.ts` must be kept in sync with iOS native reader at `ios/Readmigo/Features/Reader/ReaderContentView.swift`.
