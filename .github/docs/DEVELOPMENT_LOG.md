# DEVELOPMENT_LOG

Chronological history. Future reader should understand reasoning, not just outcome.

---

### 2026-09-08 — Project reset & Phase 1 website build

**Date:** 2026-09-08  
**What was changed:** Deleted all existing project files except `.git` (verified `.git` exists, `git status` clean, remote `https://github.com/iamrohitv/Timebook.git` intact). Scaffolded Vite+React+TS from scratch, installed Tailwind 4 + React Router, built full website + docs.  
**Why:** Owner requested complete restart from zero per HIGHEST-PRIORITY instructions; `.git` must be preserved.  
**Files / components affected:**
- Removed: old `README.md`, `.gitignore` (later recreated)
- Created: `package.json`, `vite.config.ts`, `index.html`, `src/*` (types, data, utils, contexts, components, pages), `.github/README.md` + `docs/*.md`
- Affected routes: all public + 8 authenticated pages

**Implementation details:**
- Scaffold via `npm create vite@latest` → copied into repo root, fixed `Ecode-2026temp-scaffold` nesting bug, cleaned default `App.css`/`assets`.
- `vite.config.ts`: `@tailwindcss/vite` + `@vitejs/plugin-react`.
- `src/index.css`: Tailwind + CSS variables for light/dark, sidebar, radius.
- Types: `User`, `StudentProfile`, `Subject`, `TimetableEntry`, `AttendanceRecord`, `Note`, `CommunityNote`, `Conversation`, `Message`, `AIProvider`, `AIProviderConfig`, `AIGenerationType`.
- Mock data: 6 subjects, 12 timetable entries, generated attendance (20-26 per subject, 85%+ present), 5 notes, 5 community notes, 2 conversations, 3 providers, upcoming exams.
- Utils: `attendance.ts` exact maths (see below), `format.ts`, `cn.ts`.
- Contexts: `AuthContext` (mock login/signup, localStorage), `ThemeContext` (system sync), `AIContext` (BYOK configs).
- UI: `Button` (5 variants, 4 sizes), `Card`, `Input/Textarea/Label`, `Badge/Pill`, `EmptyState/Loading/ErrorState`.
- Layout: `PublicLayout` (header/footer) + `AppLayout` (desktop sidebar 260px, mobile drawer, header with user + logout).
- Public pages: Landing (hero + mock dashboard preview + 6-feature grid), Features, About, Privacy/Terms, Auth (Login/Signup/Forgot with mock behavior).
- App pages:
  - Dashboard: today’s classes (fallback Monday), attendance overview, upcoming, recent notes, AI card, quick actions.
  - Timetable: day/week toggle, DAYS tabs, add/edit/delete, form with subject/day/type/time/room/teacher.
  - Attendance: overall + 6 subject cards, target input, history table 20 rows, filter, can-miss/need maths, status colors.
  - Notes: search, subject/type filter, sort, grid/list, mock upload.
  - AI Notes: source selector + paste, 7 generation types, mocked output generator, copy/clear.
  - AI Chat: conversations sidebar, new chat, mocked replies per keyword, BYOK status.
  - Community: search/branch/sem/subject filters, sort, hierarchy breadcrumbs, upvote toggle, download/report.
  - Settings: 7 tabs (profile, academic, appearance, notifications, AI/BYOK with 3 providers, privacy, account).
- Routing: `BrowserRouter` in `App.tsx`, `Protected` guard, `/*` 404.
- Build verified: `pnpm run build` passes (52 modules, 915ms), gzip 91.79kB.

**Problems encountered:**
- `npm install` failed with `ERR_SSL_CIPHER_OPERATION_FAILED` (Node 24 OpenSSL) + pnpm `UND_ERR_SOCKET` / `BROKEN_METADATA`. Transient network.
  - Solved: cleared `node_modules`/`package-lock`, `npm cache verify`, retried `pnpm install --reporter=silent` → succeeded on second try.
- `vite create` created `E:\code-2026\timebook\Ecode-2026temp-scaffold` instead of `E:\code-2026\temp-scaffold` due to path handling.
  - Solved: moved files manually, removed nesting.
- `src/pages/app/Timetable.tsx:28` TS error `id specified more than once`.
  - Solved: changed `{ id, ...form }` to `{ ...form, id }`.

**Current status:** Website runs, build passes, all major routes work, responsive, mock data wired, docs pending final pass. No commit/push performed.

**Next step:** Create remaining docs (`DECISIONS.md`, `ROADMAP.md`, etc.), final checklist verification, then await owner permission to commit.

---

### Next session template

**Date:**  
**What was changed:**  
**Why:**  
**Files/components affected:**  
**Implementation details:**  
**Problems encountered:**  
**How solved:**  
**Current status:**  
**Next step:**
