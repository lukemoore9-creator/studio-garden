# Studio Garden

A premium South African garden supply store — built as a design-forward mock e-commerce experience with a liquid-glass UI system.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + custom CSS (liquid-glass design system)
- **UI Components**: shadcn/ui, Radix UI, custom glass components
- **Fonts**: Geist, Inter, Playfair Display (via next/font)

## Features

- Liquid-glass card and button components
- Product grid with category filtering and search
- Cart drawer with quantity controls, clear cart, and checkout flow
- Hero section with parallax tilt and animated wave overlay
- Floating cart FAB with contextual visibility
- Scroll-reveal animations with stagger
- Fully responsive, reduced-motion safe

## Run Locally

```bash
git clone https://github.com/<USERNAME>/studio-garden.git
cd studio-garden
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the `studio-garden` repository
4. Framework preset: **Next.js** (auto-detected)
5. No environment variables required
6. Click **Deploy**

## Live Preview

_Coming soon_
