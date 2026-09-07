# SETUP

**Date:** 2026-09-08  
**Manager:** pnpm 11.24 (npm also works)

## Prerequisites

- Node 20+ (tested on 24.18.1)
- pnpm (`npm i -g pnpm`) or npm 11+

## Install

```bash
git clone https://github.com/iamrohitv/Timebook.git
cd Timebook
pnpm install
# or npm install --legacy-peer-deps
```

If you hit `ERR_SSL_CIPHER_OPERATION_FAILED` / `UND_ERR_SOCKET` (Node 24 Windows), retry or run `pnpm install --reporter=silent`.

## Run (dev)

```bash
pnpm run dev
# → http://localhost:5173
```

Vite HMR enabled. Edit `src/` and see instant updates.

## Build (production)

```bash
pnpm run build   # tsc -b && vite build
pnpm run preview # preview dist/ at http://localhost:4173
```

Build output: `dist/` (static SPA). Deploy to Vercel/Netlify/Cloudflare Pages. SPA fallback required for `/app/*`.

## Routes to test

- Public: `/`, `/features`, `/about`, `/privacy`, `/terms`, `/login` (any valid email), `/signup`, `/forgot`
- After login: `/app`, `/app/timetable`, `/app/attendance`, `/app/notes`, `/app/ai-notes`, `/app/ai-chat`, `/app/community`, `/app/settings`
- Try mobile: resize to 375px, open hamburger menu, day/week toggles.

## Lint

```bash
pnpm run lint   # oxlint
```

## Environment

No `.env` required for Phase 1 (mock). When backend arrives, copy `.env.example` → `.env.local` (never commit `.env`).

## Troubleshooting

- `vite not found` → `pnpm install` again
- Port in use → `pnpm run dev -- --port 5174`
- Theme stuck → clear `localStorage` key `timebook:theme` or use Settings → Appearance
- BYOK not sticking → check `localStorage` `timebook:ai:configs`
