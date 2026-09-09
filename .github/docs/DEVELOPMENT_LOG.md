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

### 2026-09-09 — Clerk authentication integration

**Date:** 2026-09-09  
**What was changed:** Integrated Clerk authentication into existing React+Vite site without rebuilding. Added `@clerk/clerk-react` 5.61.3, `pnpm-workspace.yaml` allowBuilds, `.env.example` for `VITE_CLERK_PUBLISHABLE_KEY` (app_3J56gEznHRW6jvg340IZkX7NOrY), `src/vite-env.d.ts`, `src/utils/clerk.ts` (isClerkConfigured), `src/pages/public/ClerkAuthPages.tsx` (SignIn/SignUp routing path), updated `src/main.tsx` to wrap with `ClerkProvider` conditionally, `src/components/layout/PublicLayout.tsx` to show `SignedIn/SignedOut` + `UserButton` + modal `SignInButton/SignUpButton`, `src/components/layout/AppLayout.tsx` to show Clerk `useUser` + `UserButton`/`SignOutButton` with mock fallback, `src/App.tsx` to protect `/app/*` via Clerk `useAuth` (`isLoaded`/`isSignedIn` → redirect `/sign-in`) with fallback to mock, and `src/contexts/AuthContext.tsx` to map Clerk user to app `User` as source of truth. Preserved existing mock routes `/login`/`/signup` as fallback when Clerk not configured; added new `/sign-in/*` and `/sign-up/*` Clerk routes inside `PublicLayout`.  
**Why:** Owner requested Clerk for app_3J56gEznHRW6jvg340IZkX7NOrY with Vercel deploy preserved, public landing remains open, app routes require sign-in, Google+email via Clerk.  
**Files/components affected:** `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `vite-env.d.ts`, `.env.example`, `src/main.tsx`, `src/App.tsx`, `src/utils/clerk.ts`, `src/contexts/AuthContext.tsx`, `src/components/layout/PublicLayout.tsx`, `src/components/layout/AppLayout.tsx`, `src/pages/public/ClerkAuthPages.tsx`  
**Implementation details:** `main.tsx` reads `import.meta.env.VITE_CLERK_PUBLISHABLE_KEY`; if missing renders `MissingKeyBanner` and falls back to mock `AuthProvider` (no blank screen); if present wraps with `ClerkProvider` (`afterSignOutUrl="/"`, `signInUrl="/sign-in"`). `AuthContext` now has `ClerkBackedProvider` that maps `clerkUser.id`/`fullName`/`primaryEmailAddress`/`imageUrl` to `User`. `App.tsx` Protected checks `isClerkConfigured` → Clerk `isLoaded`/`isSignedIn` else mock `isAuthenticated`. PublicLayout and AppLayout both branch on `isClerkConfigured` to avoid rendering Clerk components without provider. `pnpm approve-builds --all` run to allow `@clerk/shared` postinstall. Build verified: `npm run build` 110 modules, 395kB JS (was 52/307kB).  
**Problems encountered:** `@clerk/clerk-react` deprecated warning (still latest 5.61.3, new `@clerk/react` 6.15 exists but kept for Vite docs), `pnpm install` blocked by `[ERR_PNPM_IGNORED_BUILDS] @clerk/shared` — solved via `pnpm approve-builds --all` + `pnpm-workspace.yaml` `allowBuilds`. `clerk` CLI binary `@clerk/cli-win32-x64` failed to fetch with `UND_ERR_SOCKET`/`ERR_SSL_CIPHER_OPERATION_FAILED` (Node 24 Windows, transient) — `npm i -g clerk` installed but `clerk --version` reports missing platform; retried `npm i -g @clerk/cli-win32-x64` also SSL failed. Decision: skip `clerk auth login`/`clerk init` (would be destructive check needed) and document manual Vercel env instead.  
**Current status:** Clerk integrated, responsive, existing UI preserved, build passes, missing-key fallback works, protected `/app` requires Clerk sign-in when key set, public `/` open. CLI install incomplete due to network; `clerk doctor` not run.  
**Next step:** Owner must add `VITE_CLERK_PUBLISHABLE_KEY` (pk_test_…) from Clerk Dashboard (app_3J56gEznHRW6jvg340IZkX7NOrY) to `.env.local` and Vercel env, enable Google in Clerk Dashboard, then test sign-in/up and `clerk doctor`.

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
