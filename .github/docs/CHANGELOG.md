# CHANGELOG

All notable changes. Format: `Keep a Changelog` + `SemVer` (0.x while pre-backend).

## [0.1.0] — 2026-09-08

### Added
- Project reset: preserved `.git` (remote `https://github.com/iamrohitv/Timebook.git`), removed old files, scaffolded Vite+React+TS+Tailwind+Router.
- `src/types/index.ts` — User, StudentProfile, Subject, TimetableEntry, AttendanceRecord, Note, CommunityNote, Conversation/Message, AIProvider, AIGenerationType.
- `src/data/mockData.ts` — 6 subjects, 12 timetable entries, generated attendance, 5 notes, 5 community notes, 2 conversations, 3 providers.
- `src/utils/attendance.ts` — exact percentage/need/canMiss maths; `format.ts`; `cn.ts`.
- `src/services/storage.ts` — typed localStorage.
- `src/contexts/AuthContext`, `ThemeContext`, `AIContext` (BYOK).
- `src/components/ui/*` — Button, Card, Input, Badge, EmptyState.
- Layouts: `PublicLayout`, `AppLayout` (260px sidebar + mobile drawer).
- Public pages: Landing, Features, About, Privacy/Terms, Login/Signup/Forgot.
- App pages: Dashboard, Timetable (day/week + CRUD), Attendance (target maths), Notes (grid/list + filters), AI Notes (7 types mocked), AI Chat (mocked replies), Community (hierarchy filters), Settings (7 tabs, BYOK).
- Routing: `App.tsx` `BrowserRouter` + `Protected` + 404.
- Styling: `index.css` Tailwind 4 + CSS variables light/dark.
- Build: `pnpm run build` passes (52 modules, gzip ~92kB JS).

### Docs
- `.github/README.md` + `docs/` PROJECT, ARCHITECTURE, DEVELOPMENT_LOG, DECISIONS, ROADMAP, SETUP, FRONTEND, AI, DATA_MODELS, API, SECURITY, CHANGELOG (this file).

### Fixed
- `npm install` SSL/socket transient — retried via pnpm.
- `vite create` nesting bug — manual move.
- Timetable TS `id` duplicate — spread order fix.

### Security
- Documented Phase 1 insecure localStorage for auth/BYOK (see SECURITY.md); vault planned Phase 2.

---

## [0.2.0] — 2026-09-09 — Clerk authentication

### Added
- `@clerk/clerk-react` 5.61.3, `pnpm-workspace.yaml` allowBuilds for `@clerk/shared`, `.env.example` with `VITE_CLERK_PUBLISHABLE_KEY` for app_3J56gEznHRW6jvg340IZkX7NOrY
- `src/vite-env.d.ts` typing for `VITE_CLERK_PUBLISHABLE_KEY`, `src/utils/clerk.ts` `isClerkConfigured`, `src/pages/public/ClerkAuthPages.tsx` with `SignIn`/`SignUp` path routing and missing-key fallback
- `src/main.tsx` conditional `ClerkProvider` wrapper with `MissingKeyBanner` and fallback to mock `AuthProvider` when key missing
- `src/App.tsx` protected `/app` now uses Clerk `isLoaded`/`isSignedIn` → `/sign-in` when configured, else mock `/login`; added `/sign-in/*` and `/sign-up/*` routes
- `src/contexts/AuthContext.tsx` `ClerkBackedProvider` mapping Clerk `id`/`fullName`/`primaryEmailAddress`/`imageUrl` → app `User` as source of truth
- `src/components/layout/PublicLayout.tsx` `SignedIn`/`SignedOut` + `SignInButton`/`SignUpButton` modal + `UserButton` (Clerk) with mock fallback
- `src/components/layout/AppLayout.tsx` `HeaderAuth` using Clerk `useUser` + `UserButton`/`SignOutButton` with mock fallback

### Changed
- Build now 110 modules, 395.95kB JS (was 52/307kB) — Clerk added

### Fixed
- `pnpm install` `IGNORED_BUILDS @clerk/shared` → `pnpm approve-builds --all`

### Security
- Documented `VITE_CLERK_PUBLISHABLE_KEY` public vs `CLERK_SECRET_KEY` server-only, Vercel env steps

---

## Unreleased

- `services/api.ts` interface (planned)
- Attendance unit tests
- Remove mock auth fallback once Clerk is sole source
