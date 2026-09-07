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

## Unreleased

- `services/api.ts` interface (planned)
- Attendance unit tests
