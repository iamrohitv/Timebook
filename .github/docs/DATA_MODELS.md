# DATA_MODELS

**Source:** `src/types/index.ts` (single source of truth). Documented here for rationale.

## Core types

### User

```ts
type User = { id, name, email, avatar?, createdAt }
```

Auth mock returns `User`; persisted to localStorage. Future: backend adds `emailVerified`, `role`.

### StudentProfile

```ts
type StudentProfile = { userId, university, college, branch, semester, rollNo, enrollmentYear, cgpa? }
```

Drives community hierarchy + attendance scope. `branch` + `semester` filter community notes.

### Subject

```ts
type Subject = { id, code, name, semester, branch, color, credits, teacher? }
```

`color` used for timetable dots. `credits` future GPA.

### TimetableEntry

```ts
type TimetableEntry = { id, subjectId, subject?, day: DayOfWeek, startTime:"09:00", endTime:"10:00", room, teacher, type:"lecture"|"lab"|"tutorial" }
```

`DAYS` constant enforces week order. `subject` optional denormalized for UI.

### AttendanceRecord

```ts
type AttendanceRecord = { id, subjectId, date:ISO, status:"present"|"absent"|"cancelled", timetableEntryId? }
```

`cancelled` excluded from totals. Future: add `markedBy`, `source`.

### AttendanceSummary (derived)

```ts
type AttendanceSummary = { subjectId, subject?, total, present, absent, percentage }
```

Computed via `utils/attendance.ts`, not stored.

### Note

```ts
type Note = { id, title, subjectId, subject?, unit?, topic?, fileName, fileType:"pdf"|"docx"|"pptx"|"image"|"other", fileSize, fileUrl?, uploadedAt, tags, ownerId, isPublic? }
```

Phase 1: `fileUrl` absent (mock). Future: signed S3 URL.

### CommunityNote = Note &

```ts
{ university, college, branch, semester, upvotes, downloads, reports, contributor:{id,name,avatar}, hasUpvoted? }
```

Hierarchy enforced by `university → college → branch → semester → subject` filters. `hasUpvoted` local toggle.

### AI

```ts
type AIProvider = { id:"openai"|"google"|"anthropic", name, description, models[], keyLabel, docsUrl, icon }
type AIProviderConfig = { providerId, apiKey, model, enabled }
type Conversation = { id, title, createdAt, updatedAt, messages: Message[] }
type Message = { id, role:"user"|"assistant"|"system", content, createdAt, contextSources? }
type StudyMaterial = { id, title, content?, fileName? }
type AIGenerationType = "summary"|"detailed"|"revision"|"keypoints"|"flashcards"|"mcqs"|"questions"
```

`contextSources` future RAG (note ids, subject ids).

## Relationships

```
User 1──1 StudentProfile
Subject 1──* TimetableEntry, AttendanceRecord, Note
Note 1──* CommunityNote (public copy)
Conversation 1──* Message
AIProvider 1──1 AIProviderConfig (per user)
```

## Mock data location

`src/data/mockData.ts` exports `mockUser`, `mockProfile`, `mockSubjects` (6), `mockTimetable` (12), `mockAttendance` (generated), `mockNotes` (5), `mockCommunityNotes` (5), `mockConversations` (2), `mockProviders` (3).

## Invariants

- `attendancePercentage` rounded to 2 decimals.
- `TimetableEntry` `startTime < endTime` (not enforced yet; future zod).
- `Note.fileType` determines icon; `fileSize` is display string, not bytes (future: store bytes + format).
