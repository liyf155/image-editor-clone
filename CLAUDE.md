# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start dev server**: `npm run dev` or `pnpm dev` (Next.js dev server)
- **Build**: `npm run build` or `pnpm build`
- **Production start**: `npm run start` or `pnpm start`
- **Lint**: `npm run lint` or `pnpm lint`

## Architecture Overview

This is a **Next.js 16** application using **React 19** with the **App Router** architecture. The project is built as a single-page marketing/demo site for "Nano Banana" - an AI image editing tool.

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **React**: 19.2.0 with client-side rendering (main page uses `"use client"`)
- **UI Components**: Radix UI primitives via shadcn/ui (New York style)
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **Theme**: next-themes for dark mode support
- **TypeScript**: Strict mode enabled

### Project Structure
```
app/
├── layout.tsx          # Root layout with fonts and Analytics
├── page.tsx            # Main landing page (client component)
└── globals.css         # Global styles with CSS custom properties

components/
├── ui/                 # shadcn/ui components (70+ components)
└── theme-provider.tsx  # Theme context provider

lib/
└── utils.ts            # cn() utility for className merging

hooks/
├── use-mobile.ts       # Mobile detection hook
└── use-toast.ts        # Toast notification hook
```

### Key Patterns

**Client Components**: The main page (`app/page.tsx`) is a client component that manages local state for image uploads and text prompts. No server-side API routes are currently implemented.

**Theming System**: Uses CSS custom properties defined in `app/globals.css` with `oklch()` color space. Light/dark themes are handled via CSS classes on a wrapper element. The theme provider is in `components/theme-provider.tsx`.

**Component Architecture**: All UI components are from shadcn/ui (Radix UI primitives with Tailwind styling). Components use the `@/components/ui/*` import path and follow the compound component pattern.

**Utility Pattern**: `cn()` from `lib/utils.ts` is used throughout for conditional className merging using `clsx` and `tailwind-merge`.

### Path Aliases (tsconfig.json)
- `@/*` → project root
- `@/components` → `components/`
- `@/lib` → `lib/`
- `@/hooks` → `hooks/`

### Configuration Notes
- TypeScript build errors are ignored in `next.config.mjs`
- Images are unoptimized (configured in Next.js)
- The project uses the "New York" style variant from shadcn/ui
- Icons are from `lucide-react`

### Current Functionality
The application is a **marketing landing page** with:
- Hero section promoting "Nano Banana" AI image editor
- Image upload UI (client-side only, no backend integration)
- Prompt input for AI image editing (UI only, not functional)
- Feature cards, showcase gallery, reviews, and FAQ sections
- Floating banana decorations with custom CSS animations

No actual AI image processing is implemented - this is a frontend demo/landing page.
