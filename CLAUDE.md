# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

Node.js >=20.9.0 required. No test runner is configured.

## Stack

- **Next.js 16** with App Router (`/app` directory)
- **React 19** with Server Components by default
- **TypeScript 5** (strict mode, path alias `@/*` maps to root)
- **Tailwind CSS v4** — configured via PostCSS; no `tailwind.config` file (v4 uses `@theme` in `globals.css`)
- **gray-matter** — MDX frontmatter parsing
- **next-mdx-remote** — MDX rendering in RSC

## Architecture

Two completely separate sections with independent layouts:

### Landing page — `app/(landing)/`
- `app/(landing)/layout.tsx` — wraps with `<Header>` + `<Footer>`
- `app/(landing)/page.tsx` — serves `/`, all 9 sections
- `app/layout.tsx` — root layout (fonts + html/body only, no shared UI)

### Blog — `app/blog/`
- `app/blog/layout.tsx` — BlogNav + simple footer, no landing page components
- `app/blog/page.tsx` — post list with category filter (`?category=`) and pagination (`?page=`)
- `app/blog/[slug]/page.tsx` — single post (SSG via `generateStaticParams`)
- `components/blog/` — BlogNav, BlogHeader, PostCard, Sidebar, Pagination
- `content/blog/*.mdx` — post files (frontmatter: title, category, excerpt, date, thumbnail)
- `lib/blog.ts` — `getPosts()`, `getPost(slug)`, `getCategoryCounts()` (fs-based, Supabase-ready)

### Shared libraries
- `lib/site.ts` — single source of truth for all copy/data (SITE constant)
- `lib/ui.ts` — shared Tailwind class tokens (landing page only)
- `lib/scroll.ts` — `scrollToContact(type)` for CTA navigation
- `app/globals.css` — design tokens (`@theme`) + `.blog-content` MDX prose styles

## Design tokens

All colors defined in `globals.css` `@theme` block. Key values:
- `accent` / `accent-dark` — blue CTA (#3B82F6 / #2563EB)
- `brand-navy` — dark header/hero (#0F172A)
- `surface` — alternate section bg (#F1F5F9)
- `foreground`, `muted`, `steel`, `border`, `card`

## MDX frontmatter schema

```yaml
title: string
category: "매입 기준" | "현장 실무" | "업계 정보" | "시설·인프라" | "수거 사례"
excerpt: string
date: "YYYY-MM-DD"
thumbnail: "/images/filename.jpg"  # optional
```
