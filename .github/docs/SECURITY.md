# SECURITY

**Date:** 2026-09-09  
**Phase 1 status:** Mock + Clerk frontend auth (no backend user DB yet). BYOK still localStorage.

## Current

### Clerk Authentication (new 2026-09-09)

- **Provider:** Clerk app `app_3J56gEznHRW6jvg340IZkX7NOrY`, SDK `@clerk/clerk-react` 5.61.3 via `ClerkProvider` in `main.tsx`.
- **Publishable key:** `VITE_CLERK_PUBLISHABLE_KEY` (pk_test_… / pk_live_…) — **public**, safe for client, read from `import.meta.env`. Never commit real key; use `.env.local` and Vercel env. `.env.example` documents placeholder.
- **Secret key:** `CLERK_SECRET_KEY` — **never** exposed client-side, never in repo, only server (when backend exists).
- **Session:** Clerk handles JWT, refresh, verification, Google OAuth, email magic link. `Protected` uses `isLoaded`/`isSignedIn` to avoid blank screen; missing key shows `MissingKeyBanner` and falls back to mock (no secret leaked).
- **User identity:** Clerk `user.id` → app `User.id` mapping in `AuthContext` (`clerkUserToAppUser`). Future DB will key `User.id → Timetable/Attendance/Notes/AI/Community` via `getToken()` Authorization header.
- **Logout:** `SignOutButton` / `UserButton afterSignOutUrl="/"`; mock fallback `logout()` clears localStorage.
- **No password handling:** No local password DB, no manual storage.

### Legacy Mock (fallback when Clerk key missing)

- **Auth:** Mocked in `AuthContext`. Any valid email accepted; `user` persisted to `localStorage` `timebook:auth:user` (no httpOnly cookie). Only used when `VITE_CLERK_PUBLISHABLE_KEY` absent; warning logged.
- **BYOK keys:** `AIContext` stores `apiKey` in `localStorage` `timebook:ai:configs` as plain text. Never committed, never logged, but readable by any JS on origin (XSS risk).
- **Notes/files:** No upload to server; mocked in memory (no storage).
- **No CSP, no rate limiting, no validation beyond required attributes.**

## Requirements for Phase 2+

### Auth (Clerk hardening)
- Enforce Clerk `CLERK_SECRET_KEY` on server, verify `getToken()` in API routes, add CSRF for non-Clerk mutating routes if needed, enable Clerk Dashboard Google provider, configure allowed origins (`localhost:5173`, Vercel domain).
- Remove `localStorage` mock auth entirely once Clerk is sole source (keep fallback only for dev without key).

### BYOK vault
- Keys never stored in frontend. Flow: `POST /api/ai/byok { providerId, key }` → server encrypts with KMS / `libsodium` + per-user key, stores ciphertext in DB, returns `{ ok: true, masked: "sk-...xyz" }`.
- Frontend keeps only `providerId` + `model` + `enabled`; chat calls send `providerId`, server injects key.
- Rotation: `DELETE /api/ai/byok/:providerId` + re-add.
- Never log keys, never return them in GET.

### Files
- Private notes: presigned S3/R2 URLs, content-type validation, virus scan, size limits.
- Community: moderation queue, report threshold, signed downloads.

### Frontend hardening
- CSP `script-src 'self'`, no `eval`, `X-Frame-Options`, `HSTS`.
- Input validation with `zod` on all forms (timetable time ordering, file types).
- Escape AI output (already `pre` wrap, but future markdown must be sanitized).

## What never to do

- Never commit `.env`, `.env.local` or `VITE_CLERK_PUBLISHABLE_KEY` real value.
- Never put `CLERK_SECRET_KEY` in client code or Vite env.
- Never put real secrets in `src/data/mockData.ts`.
- Never `console.log` keys.
- Never store keys in query params or history.

## Checklist before going live

- [ ] Set `VITE_CLERK_PUBLISHABLE_KEY` in Vercel (see SETUP.md) and redeploy
- [ ] Enable Google OAuth in Clerk Dashboard (app_3J56gEznHRW6jvg340IZkX7NOrY) + add Vercel domain to allowed origins
- [ ] Remove `localStorage` mock auth fallback (or keep dev-only)
- [ ] Remove `localStorage` BYOK, add vault
- [ ] Add CSP + Helmet headers
- [ ] Validate all inputs server-side
- [ ] Audit deps (`pnpm audit`)
