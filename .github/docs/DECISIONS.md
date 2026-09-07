# DECISIONS

Record of important technical/product decisions. Trivial choices omitted.

---

### D1 — React + TypeScript + Vite + Tailwind

**Date:** 2026-09-08  
**Context:** Need modern, fast, maintainable website; owner requested React/TS/Vite/Tailwind.  
**Options:** Next.js, CRA, Parcel, UnoCSS.  
**Chosen:** Vite 8 + React 19 + TS 6 + Tailwind 4 (`@tailwindcss/vite`).  
**Why:** Fast HMR, minimal config, SPA routing sufficient for Phase 1, Tailwind 4 vite plugin removes PostCSS setup.  
**Trade-offs:** No SSR (ok for mock phase), Vite 8 very new (but pnpm resolved).  
**Future:** Easy to migrate to Next.js if SSR needed.

### D2 — React Router 7 (BrowserRouter)

**Context:** Public + authenticated routes, protected guard.  
**Options:** TanStack Router, wouter, Next routing.  
**Chosen:** `react-router-dom` 7 with `Protected` wrapper.  
**Why:** Familiar, imperative `NavLink` active styles, outlet-based layouts.  
**Future:** Add `loader`/`action` when backend exists.

### D3 — Service abstraction over mock data

**Context:** Owner requires future backend without UI rewrite; mock must not pretend to be real API.  
**Chosen:** `data/mockData.ts` pure data, `services/storage.ts` localStorage wrapper, `utils/attendance.ts` pure maths. UI imports directly from `data/` for now; future `services/api.ts` will mirror shapes.  
**Why:** Minimal indirection now, clear seam later.  
**Trade-off:** No `fetch` abstraction yet — acceptable for Phase 1.

### D4 — BYOK frontend-only for Phase 1

**Context:** Need UI for OpenAI/Google/Anthropic keys, but no backend vault yet.  
**Options:** (a) Mock only, (b) Store in localStorage with warning, (c) Build vault now.  
**Chosen:** (b) `AIContext` persists `AIProviderConfig[]` to `localStorage` (`timebook:ai:configs`), provider abstraction shape (`AIProvider → provider abstraction → AI service → Chat/Notes/RAG`) documented but not implemented.  
**Why:** Lets user try flow, makes security gap explicit. Never commit keys, never send to server.  
**Future:** Backend vault (env + KMS + encrypted column) replaces `localStorage` with httpOnly cookie + server-validated key.

### D5 — Attendance maths

**Context:** Owner requires mathematically correct target calculations.  
**Chosen:** Exact formulas:
- `percentage = round(present/total*100, 2)`
- `need = ceil((target*total - 100*present)/(100-target))`
- `canMiss = floor((100*present - target*total)/target)`
**Why:** Avoids iterative loops, handles edge cases (target 0/100, 0 total). Tested via `utils/attendance.ts`.

### D6 — Layout: Fixed sidebar + mobile drawer

**Context:** 8 authenticated routes share navigation; must be usable on mobile.  
**Options:** Top nav, collapsible sidebar, bottom tabs.  
**Chosen:** Fixed 260px sidebar `lg:flex`, mobile drawer with overlay + `h-14` header hamburger.  
**Why:** Linear/Notion feel, persistent navigation, no layout shift. Desktop hover, mobile tap.

### D7 — Mock data determinism

**Context:** Realistic demo vs reproducible.  
**Chosen:** Subjects/timetable deterministic; attendance randomly generated once at module load; community notes static.  
**Trade-off:** Attendance varies per reload slightly — acceptable for mock.

### D8 — No extra dependencies

**Context:** Keep bundle small, fast.  
**Chosen:** Only `react-router-dom` added; no `lucide-react`, `date-fns`, `zod`. Icons are text/emoji + inline; dates via `Intl`.  
**Why:** gzip 91kB keeps app fast on mobile.
