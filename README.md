# ✦ Fluxi — AI Media Generation Studio

A premium, feature-rich **AI image & video generation UI** built with **Next.js 16**, **React 19**, and **GSAP**. This project showcases a production-grade creative studio interface with a modern design system, seamless dark/light theming, and polished micro-animations — all rendered as a single-page application.

> **Note:** This is a front-end prototype. No actual AI inference runs — generation is simulated with curated media from Unsplash and open-source video sources to demonstrate the full user experience.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [Component Breakdown](#component-breakdown)
- [Theming System](#theming-system)
- [Animation Strategy](#animation-strategy)
- [Performance Optimizations](#performance-optimizations)
- [Getting Started](#getting-started)
- [Scripts](#scripts)

---

## Features

| Category | Details |
|---|---|
| **Dual Generation Mode** | Toggle between Text-to-Image and Text-to-Video with animated mode switcher |
| **Custom Video Player** | Built-in player with play/pause, mute, progress scrubbing, time display, and duration limiting |
| **Prompter Sidebar** | Full creative controls: model selection, aspect ratio, count, CFG scale, steps, negative prompt, motion strength, camera motion, and style badges |
| **History Track** | Horizontal scrolling carousel of previously generated media with skeleton loading and animated entry |
| **Dark / Light Theme** | Seamless clip-path wipe transition between themes with zero flash or FOUC |
| **Responsive Layout** | Adapts from large desktop → tablet → mobile with a slide-out drawer menu |
| **Micro-Animations** | GSAP-powered entrance animations, indicator slides, icon pops, accordion reveals, and glow pulses |

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16.2.9 | React framework with App Router, `next/font`, and `next/image` |
| [React](https://react.dev/) | 19.2.4 | UI rendering with hooks, memoization, and refs |
| [GSAP](https://gsap.com/) | ^3.15.0 | High-performance animations (timelines, tweens, clip-path) |
| [@gsap/react](https://gsap.com/docs/v3/GSAP/gsap.utils/) | ^2.1.2 | React hook (`useGSAP`) for lifecycle-safe GSAP integration |
| Vanilla CSS | — | Custom design system with CSS variables, no utility framework |
| [Material Icons](https://fonts.google.com/icons) | Outlined | Icon set loaded via Google Fonts CDN |
| [Inter + Playfair Display](https://fonts.google.com/) | — | Typography loaded via `next/font/google` for zero layout shift |

---

## Project Structure

```
task frontend/
├── app/
│   ├── layout.js          # Root layout — fonts, meta tags, theme overlay container
│   ├── page.js            # Main page — all components, state, and logic (single-file SPA)
│   ├── globals.css         # Full design system — variables, components, responsive breakpoints
│   └── favicon.ico
├── backup-vanilla/         # Original vanilla HTML/CSS/JS version (reference implementation)
│   ├── index.html
│   ├── style.css
│   └── app.js
├── public/                 # Static assets (SVGs)
├── next.config.mjs         # Image remote patterns (Unsplash, Picsum, Pravatar)
├── package.json
└── README.md
```

### Why a single `page.js`?

The entire UI lives in one file by design. This project is a **self-contained prototype** — not a multi-page app. Splitting into dozens of files would add import boilerplate and directory navigation overhead without architectural benefit for a single-route application. Components are still cleanly separated within the file using `React.memo`, named `displayName` properties, and clear section comments.

---

## Architecture & Design Decisions

### 1. Client-Side Only (`"use client"`)

The entire page is marked `"use client"`. This is intentional:
- GSAP requires direct DOM access and cannot run on the server.
- All state (theme, active tab, generations, history) is ephemeral and browser-local.
- There are no server-side data requirements — video URLs are fetched client-side from a GitHub Gist API.

### 2. CSS Variables over Utility Classes

The design system is built entirely on **CSS custom properties** (`--accent`, `--bg-page`, `--color-text`, etc.) rather than Tailwind or similar utility frameworks. This decision enables:
- **Instant theme switching** — toggling `data-theme` on `<html>` cascades new values to every element without class manipulation.
- **Clip-path theme transition** — the overlay clone inherits the new theme's variables automatically by setting `data-theme` on the overlay.
- **Full design control** — complex neo-brutalist borders, shadows, and glassmorphism effects are easier to express with custom CSS than constrained utility classes.

### 3. Memoized Component Architecture

Every sub-component is wrapped in `React.memo()` to prevent unnecessary re-renders:
- `CenterNav`, `RightNav`, `Logo` — static unless `activeTab` changes
- `Sidebar` — only re-renders when prompter state changes
- `VideoWorkspaceCard`, `ImageWorkspaceCard` — isolated per card, each manages its own loading/play state
- `GenerationRow` — re-renders only when its specific row data changes
- `HistoryCard` — individually memoized with per-card loaded state

### 4. Simulated Generation Pipeline

When the user clicks "Generate":
1. A new `generation row` object is created with matched media URLs based on prompt keywords.
2. The row is prepended to the `generations` state array with `status: "loading"`.
3. For **images**: a 2-second timeout simulates server processing, then status flips to `"loaded"`.
4. For **videos**: each `VideoWorkspaceCard` runs its own internal loading simulation (progress bar 0→100%), then auto-plays the video muted.
5. History cards are added with a staggered delay to simulate completion callbacks.

### 5. Video Player Design

Each video card is a **fully custom player** — not relying on browser default controls. Key decisions:
- **Auto-play muted after loading** — ensures all cards show real video frames as "thumbnails."
- **Duration limiting** — if the user sets "5s" duration, the player loops back to 0:00 at the 5-second mark regardless of the source video's actual length.
- **Lazy overlay** — play/pause controls appear on hover or when paused, keeping the default view clean.
- **Poster fallback** — when a thumbnail URL exists, it's used as the HTML `poster` attribute. When absent, the browser's decoded first frame serves as the visual.

---

## Component Breakdown

```
Home (main page)
├── Logo                          Static logo "F" in Playfair Display
├── CenterNav                     5 nav icons with sliding active indicator
├── RightNav                      Gallery/Support links, theme toggle, avatar, hamburger
├── HistorySection
│   └── HistoryCard[]             Scrollable image/video thumbnail track
├── Sidebar
│   ├── Toggle (Image/Video)      Animated slider switch
│   ├── Prompt textarea           With placeholder slide animation on mode change
│   ├── CustomDropdown[]          Count, Aspect, Model selectors
│   ├── Accordion (Advance)       CFG, Steps, Negative Prompt, Duration, Motion, Camera
│   ├── Accordion (Styles)        Style badge grid (Photorealistic, Anime, Cyberpunk, etc.)
│   └── Generate button
├── Workspace
│   └── GenerationRow[]
│       ├── Info panel             Type badge, prompt text, model/duration/motion badges
│       └── Images grid
│           ├── ImageWorkspaceCard[]
│           └── VideoWorkspaceCard[]   Custom video player with controls
├── MobileMenu                    Slide-out drawer for responsive navigation
└── ThemeOverlay                  Hidden div used for clip-path theme wipe
```

---

## Theming System

The app supports **light** and **dark** modes with a seamless animated transition:

### How It Works

1. **CSS variables** define all colors in `:root` (light) and `[data-theme="dark"]` blocks.
2. On toggle, the **visible DOM is cloned** into a fixed overlay `<div>`.
3. The overlay is set to the **new theme** via `data-theme`, making all cloned elements render in target colors.
4. A **GSAP `clip-path: inset()` animation** reveals the overlay from bottom → top, creating a wipe effect.
5. Once the wipe completes:
   - All CSS transitions are **temporarily disabled** (`no-transition` class) to prevent flicker.
   - The real DOM's `data-theme` is swapped instantly.
   - The overlay is removed.
   - Transitions are re-enabled on the next animation frame.

### Video Optimization During Theme Swap

- All playing videos are **paused** before the clone to prevent GPU contention.
- All `<video>` elements are **stripped from clones** so no duplicate decoders spin up.
- After the transition, previously-playing videos are **resumed**.

---

## Animation Strategy

All animations use **GSAP** via the `useGSAP` React hook for automatic cleanup:

| Animation | Trigger | Technique |
|---|---|---|
| Page entrance | Mount | Staggered `gsap.from()` on navbar, icons, sidebar, workspace, history |
| Active indicator slide | Tab click | `gsap.to()` with position calculation + glow pulse |
| Icon pop | Tab click | `gsap.fromTo()` scale 0.7→1 with `back.out` ease |
| Mode toggle slider | Mode change | `gsap.to()` left position |
| Accordion open/close | Click | `gsap.to()` height auto/0 + arrow rotation |
| Generation row entry | New generation | `gsap.fromTo()` opacity + y offset |
| History card entry | New item | `gsap.from()` width 0 + scale with `back.out` ease |
| Theme wipe | Toggle click | `gsap.fromTo()` clip-path inset |
| Mobile drawer | Hamburger click | Timeline: slide + staggered links + close button spin |
| Video loading | Auto | CSS keyframe spinner + JS-driven progress bar |

---

## Performance Optimizations

| Optimization | Description |
|---|---|
| **`React.memo()`** | Every sub-component is memoized to skip unnecessary re-renders |
| **`useCallback` / `useMemo`** | Event handlers and computed values are stable references |
| **CSS `contain: layout style paint`** | Applied to workspace and history cards — allows browser to skip painting off-screen cards |
| **Video pause during theme swap** | Eliminates GPU contention from simultaneous video decoding + clip-path compositing |
| **Clone video stripping** | `<video>` tags removed from theme overlay clones to prevent duplicate decoders |
| **`next/image`** | Automatic lazy loading, responsive `srcset`, and format optimization for all images |
| **`next/font`** | Inter and Playfair Display loaded with `display: swap` — zero layout shift, no FOUT |
| **`preload="auto"` on videos** | Videos buffer data during the loading animation so playback is instant when it finishes |
| **`no-transition` kill switch** | All CSS transitions disabled during theme swap to prevent expensive style recalculations |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or yarn / pnpm / bun)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd "task frontend"

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack HMR |
| `npm run build` | Create optimized production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint checks |

---

## Browser Support

Tested and optimized for:
- Chrome / Edge (Chromium) 100+
- Firefox 100+
- Safari 15+

---

## License

This project is a front-end prototype for demonstration purposes.
