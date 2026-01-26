# Readmigo Content Studio Project Guidelines

## Project Overview

Internal tool for book content editing, proofreading, and preview.

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── book/[id]/   # Book editing page
│   │   ├── rules/       # Content rules management
│   │   └── learning/    # Learning content editor
│   ├── components/
│   │   ├── editor/      # Editor components
│   │   │   ├── chapter-sidebar.tsx   # 章节列表侧边栏
│   │   │   ├── fix-item.tsx          # 修复项组件
│   │   │   └── fix-filter-bar.tsx    # 修复过滤条
│   │   └── preview/     # Phone preview components
│   │       ├── phone-preview.tsx     # 手机预览容器
│   │       ├── iphone-frame.tsx      # iPhone 外框
│   │       ├── theme-switcher.tsx    # 主题切换
│   │       └── settings-panel.tsx    # 排版设置面板
│   ├── lib/
│   │   ├── reader-template.ts    # 核心阅读器模板（翻页逻辑）
│   │   ├── types.ts              # 数据类型定义
│   │   ├── api.ts                # 后端 API 客户端
│   │   └── utils.ts              # 工具函数
│   └── stores/
│       └── env-store.ts          # 环境配置状态
└── messages/            # i18n translations
```

## Development Rules

### Core Files

| File | Purpose |
|------|---------|
| `reader-template.ts` | 生成阅读器 HTML，包含分页算法、翻页动画、触摸/键盘事件 |
| `phone-preview.tsx` | 预览容器，处理 iframe 通信、主题切换、章节导航回调 |
| `[id]/page.tsx` | 主页面，管理章节状态、修复列表、Monaco 编辑器 |

### Pagination Mechanism

- **分页算法**: 测量内容高度，按页高分割元素
- **封面图片**: 带 `.cover` class 的图片独占一页
- **标题保护**: 标题与下一元素保持在同一页
- **章节切换**: 边界翻页时通过 postMessage 通知父窗口

### Reader Sync Requirements

`reader-template.ts` 需与 iOS 原生阅读器保持同步:
- iOS 同步位置: `ios/Readmigo/Features/Reader/ReaderContentView.swift`
- 任何样式或行为变化必须同时更新两处

### Tech Stack

- Framework: Next.js 14
- Language: TypeScript
- Editor: Monaco Editor
- Styling: Tailwind CSS

## Investigation & Problem Analysis

When investigating problems, output using this template:
```
问题的原因：xxx
解决的思路：xxx
修复的方案：xxx
```
