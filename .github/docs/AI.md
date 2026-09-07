# AI

**Date:** 2026-09-08  
**Scope Phase 1:** Frontend architecture + mocked behavior; no real LLM calls.

## BYOK (Bring Your Own Key)

User supplies their own API key per provider. Phase 1 stores it in `localStorage` (explicitly insecure, documented for replacement).

### Providers

- OpenAI (`gpt-4o`, `gpt-4o-mini`, `o1-mini`) — https://platform.openai.com/api-keys
- Google Gemini (`gemini-1.5-pro`, `gemini-1.5-flash`, `gemini-2.0-flash`) — https://aistudio.google.com/app/apikey
- Anthropic Claude (`claude-3-5-sonnet-20241022`, `claude-3-haiku-20240307`) — https://console.anthropic.com/settings/keys

Extensible: add entry to `mockProviders` + `AIProviderId` union.

### Architecture (intended)

```
AI Provider config (key, model, enabled)
    ↓
Provider abstraction (adapters: OpenAI, Gemini, Claude — unified interface)
    ↓
AI service (chat, generateNotes, embeddings)
    ↓
Features: Chat / Notes / RAG
    ↓
Context sources: notes, timetable, attendance, syllabus, profile
```

Phase 1: only the top box exists (`AIContext`). Middle layers are documented shape; Chat/Notes call mocked functions (`mockReply`, `mockGenerate`).

### Storage

- Key: `localStorage` `timebook:ai:configs` (array) + `timebook:ai:active`.
- UI: Settings → AI/BYOK shows 3 provider cards with password input, model select, Enable/Remove, link to docs.
- Chat sidebar shows `Active: {provider} ✓` or `key missing`.
- Secrets: never committed, never logged, never sent (no backend yet). See `SECURITY.md`.

### AI Notes

- User selects `StudyMaterial` (from `mockNotes` or pasted text) + `AIGenerationType` (summary/detailed/revision/keypoints/flashcards/mcqs/questions).
- `AINotes.tsx:mockGenerate` returns deterministic markdown per type (Phase 1).
- Future: `POST /api/ai/notes` `{ sourceId, type, model }` → streamed markdown.

### AI Chat

- `Conversation[]` in `mockConversations`; `AIChat.tsx` keeps local state, `mockReply` switches on keywords (deadlock, 3NF, attendance) else generic mocked answer.
- Future context: `messages[].contextSources` → RAG retrieves notes/timetable/attendance chunks; UI will show citations.
- Future service: `aiService.chat({ messages, contextSources, providerId })` with SSE streaming.

## What is NOT built

- No network calls, no streaming, no embeddings, no vector DB.
- No key validation beyond non-empty.
- No usage metering.

## Next step

Phase 3: implement `services/ai.ts` with adapter interface:

```ts
interface AIAdapter { chat(opts): AsyncIterable<string>; generateNotes(opts): Promise<string> }
```
Add backend vault and remove localStorage keys.
