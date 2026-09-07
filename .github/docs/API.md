# API

**Date:** 2026-09-08  
**Status:** No real backend (Phase 1 mock). This document defines the service abstraction and future contract so UI can be swapped without rewrite.

## Current (mock)

UI imports directly from `src/data/mockData.ts`. No fetch.

- `mockSubjects`, `mockTimetable`, `mockAttendance`, `mockNotes`, `mockCommunityNotes`, `mockConversations`, `mockProviders`
- `services/storage.ts` wraps `localStorage` (namespaced `timebook:`)
- `utils/attendance.ts` pure functions

## Service layer (intended)

```
UI (pages/components)
  ↓
services/
  api.ts        # subjects, timetable, attendance, notes, community, auth
  ai.ts         # chat, generateNotes, embeddings (provider abstraction)
  storage.ts    # localStorage (Phase 1) → httpOnly cookies later
```

Example future interface (not yet implemented):

```ts
// services/api.ts
export interface Api {
  auth: { login(email, pw): Promise<User>; signup(...): Promise<User>; logout(): void }
  subjects: { list(): Promise<Subject[]> }
  timetable: { list(): Promise<TimetableEntry[]>; create(e): Promise<TimetableEntry>; update(id, patch): Promise<TimetableEntry>; remove(id): Promise<void> }
  attendance: { list(subjectId?): Promise<AttendanceRecord[]>; summary(target): Promise<AttendanceSummary[]> }
  notes: { list(filters): Promise<Note[]>; upload(file): Promise<Note> }
  community: { list(filters): Promise<CommunityNote[]>; upvote(id): Promise<void> }
}
```

Mock implementation would implement `Api` with `setTimeout` + `mockData`; real implementation would `fetch('/api/...')`.

## Future REST shape (Phase 2)

```
POST   /api/auth/login
POST   /api/auth/signup
GET    /api/subjects
GET    /api/timetable?day=Monday
POST   /api/timetable
PATCH  /api/timetable/:id
DELETE /api/timetable/:id
GET    /api/attendance?subjectId=s1
GET    /api/attendance/summary?target=75
GET    /api/notes?subjectId=&type=&q=
POST   /api/notes (multipart)
GET    /api/community?branch=CSE&semester=5&subjectId=s1&q=
POST   /api/community/:id/upvote
POST   /api/ai/chat (SSE)
POST   /api/ai/notes { sourceId, type }
POST   /api/ai/byok { providerId, key }  # stored vault, never returned
```

## BYOK contract

- Frontend never holds key after vault (Phase 2+): `POST /api/ai/byok` stores encrypted; subsequent calls use provider id only.
- Phase 1: key in localStorage; flag `enabled` local.

## Error / loading / empty

All list endpoints should return `{ data, total }` and support pagination; UI already handles empty via `EmptyState` and shows `Loading` on artificial delays.

## What to do next

1. Create `src/services/api.ts` with `Api` interface + `mockApi` impl (wrapping `mockData`).
2. Refactor pages to call `api.timetable.list()` instead of direct `mockTimetable`.
3. When backend lands, swap `mockApi` with `httpApi` (fetch) — no page changes.
