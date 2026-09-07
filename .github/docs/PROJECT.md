# PROJECT — Timebook

**Created:** 2026-09-08  
**Phase:** 1 — Website  
**Status:** MVP complete, mock data

## What is Timebook?

Timebook is a student academic platform combining:

- Timetable (day/week, CRUD)
- Attendance (overall + subject-wise, target maths)
- Notes (upload, search, filter, subject/unit/topic)
- AI Notes generation (summary, flashcards, MCQs, etc.)
- AI Chat (personalized, future context-aware)
- Community sharing (University → College → Branch → Semester → Subject → Notes)
- Bring Your Own Key (BYOK) for OpenAI / Gemini / Claude
- Future: backend, RAG, mobile app

## Phase 1 Scope (This Build)

Website only. No mobile app. No real backend.

### Public routes

- `/` Landing, `/features`, `/about`, `/privacy`, `/terms`
- `/login`, `/signup`, `/forgot`

### Authenticated (`/app/*` via `AppLayout`)

- Dashboard — today’s classes, attendance overview, upcoming exams, recent notes, AI, quick actions
- Timetable — day/week, add/edit/delete
- Attendance — overall %, subject %, history, target, can-miss / need-to-attend
- Notes — upload, search, filter, sort, grid/list
- AI Notes — source material + generation type → mocked output
- AI Chat — conversations, mocked replies, BYOK status
- Community — browse, search, filter, upvote, download, report, contributor
- Settings — profile, academic, appearance (light/dark/system), notifications, AI/BYOK, privacy, account

## Goals

- Feel like a real product (Linear/Notion-inspired, clean spacing, typography)
- Responsive: desktop, laptop, tablet, mobile browser
- Service abstraction so future backend replaces mocks without UI rewrite
- Honest mock boundaries — never pretend mock is real backend

## Non-goals (Phase 1)

- Real authentication, DB, file storage
- Real LLM calls (only BYOK UI + mocked replies)
- Mobile native app
- RAG / embeddings

## Success Criteria

- `pnpm run build` passes, no TS errors
- Every major route has loading/error/empty/success states (where applicable)
- Attendance maths verified
- Responsive tested (mobile drawer, grid collapse)
