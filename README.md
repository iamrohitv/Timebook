# Timebook — Student Academic Platform

Phase 1: Website (mock data, BYOK UI, no backend yet).

Timetable, attendance, notes, AI notes generation, AI chat, community sharing — built for students.

## Quick start

```bash
pnpm install
pnpm run dev      # http://localhost:5173
pnpm run build    # tsc -b && vite build → dist/
pnpm run preview
```

Public: `/` `/features` `/about` `/login` `/signup` → Auth → `/app` (dashboard, timetable, attendance, notes, ai-notes, ai-chat, community, settings).

See `.github/docs/SETUP.md` for details and `.github/README.md` for documentation index.

## Docs

- `.github/README.md` — index
- `.github/docs/PROJECT.md`, `ARCHITECTURE.md`, `DEVELOPMENT_LOG.md`, `DECISIONS.md`, `ROADMAP.md`, `FRONTEND.md`, `AI.md`, `DATA_MODELS.md`, `API.md`, `SECURITY.md`, `CHANGELOG.md`

## Stack

React 19, TypeScript 6, Vite 8, Tailwind 4, React Router 7, pnpm.

## Git

**Do not commit/push without permission.** Changes are local only until owner says to commit.

Remote: `https://github.com/iamrohitv/Timebook.git` (branch `master`).
