# ROADMAP

Living product roadmap. Phase 1 is the focus; do not build future phases prematurely.

## Completed (Phase 1)

- [x] Repo reset (preserve `.git`, remote `https://github.com/iamrohitv/Timebook.git`)
- [x] Vite + React + TS + Tailwind + Router scaffold + build passes
- [x] Types & mock data (subjects, timetable, attendance, notes, community, AI)
- [x] Utils (attendance maths, format, cn) + localStorage service
- [x] AuthContext (mock), ThemeContext, AIContext (BYOK)
- [x] UI kit (Button, Card, Input, Badge, Empty/Loading/Error)
- [x] Layouts (PublicLayout, AppLayout with mobile drawer)
- [x] Public: Landing, Features, About, Privacy, Terms, Login, Signup, Forgot
- [x] App: Dashboard, Timetable, Attendance, Notes, AI Notes, AI Chat, Community, Settings (7 tabs)
- [x] Routing + Protected guard + 404
- [x] Responsive (desktop/laptop/tablet/mobile browser)
- [x] Production build verified (52 modules, gzip ~92kB)
- [x] Docs structure + content (this file, etc.)

## In Progress

- [ ] Final docs polish + checklist verification (this session)
- [ ] Await owner permission to commit (ABSOLUTE GIT RULE)

## Next (Phase 1 hardening, no backend yet)

- Form validation (zod) + accessible error messages
- Unit tests for `utils/attendance.ts`
- Add `services/api.ts` interface file (empty, documents future contract)
- Improve empty/loading skeletons for each app page
- Add keyboard shortcuts for timetable/notes

## Future

### Phase 2 — Backend + Auth + DB
- Real auth (JWT + refresh, httpOnly cookies), Postgres/Supabase, Prisma
- File storage (S3/R2, signed URLs), timetable/attendance/notes CRUD APIs
- Secure BYOK vault (KMS, per-user encrypted keys)

### Phase 3 — Real AI + RAG
- Provider adapters (OpenAI/Gemini/Claude) via `AI service` abstraction
- RAG over notes/timetable/attendance/syllabus (pgvector), streaming chat
- AI Notes real generation with retries & caching

### Phase 4 — Community infra
- Moderation, reporting pipeline, upvote dedupe, contributor profiles, search indexing

### Phase 5 — Mobile application
- React Native / Expo, offline timetable, push notifications

---

**Note:** Mobile app is NOT part of Phase 1. Build only website now.
