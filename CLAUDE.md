# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test runner is configured.

## Stack

- **Next.js 16** with App Router (`/app` directory)
- **React 19** with Server Components by default
- **TypeScript 5** (strict mode, path alias `@/*` maps to root)
- **Tailwind CSS v4** — configured via PostCSS; no `tailwind.config` file (v4 uses `@theme` in `globals.css`)

## Architecture

This is currently a minimal `create-next-app` boilerplate. The only route is `/` (`app/page.tsx`).

- `app/layout.tsx` — Root layout; loads Geist fonts via `next/font/google`, sets HTML metadata
- `app/globals.css` — Global styles + Tailwind imports + CSS custom properties for light/dark theming
- `app/page.tsx` — Homepage

Styling uses Tailwind utility classes inline with `dark:` variants. Theme colors are defined as CSS variables in `globals.css`.