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


提示词1：
create a 1/7 scale commercialized figure of thecharacter in the illustration, in a realistic styie and environment.Place the figure on a computer desk, using a circular transparent acrylic base without any text.0n the computer screen, display the ZBrush modeling process of the figure.Next to the computer screen, place a BANDAl-style toy packaging box printedwith the original artwork.


提示词2：
帮我实现核心功能：
1. 用户点击Click to upload image后可以上传图片
2. 用户上传图片，并且在Transfer Image下面输入提示词，点击Generate Now后，把图片和提示词都发给Gemini 2.5
3. 这是API的说明文档：https://openrouter.ai/google/gemini-2.5-flash-image/api
4. 这是API key：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，新建一个.env.local文件，存放API key
5. 这是API示例代码：
import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: "<OPENROUTER_API_KEY>"
});

const stream = await openrouter.chat.send({
  model: "google/gemini-2.5-flash-image",
  messages: [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "What is in this image?"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
          }
        }
      ]
    }
  ],
  stream: true
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    process.stdout.write(content);
  }
}




1.帮我实现Pricing页面，参考https://imgeditor.co/pricing
2.接入Creem支付，这是两个creem文档:https://docs.creem.io/introduction,https://docs.creem.io/api-reference/introduction
