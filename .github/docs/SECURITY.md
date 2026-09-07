# SECURITY

**Date:** 2026-09-08  
**Phase 1 status:** Mock, no real backend. Secrets live in localStorage — explicitly insecure, documented for replacement.

## Current (insecure, Phase 1)

- **Auth:** Mocked in `AuthContext`. Any valid email accepted; password ignored. `user` persisted to `localStorage` `timebook:auth:user` (no httpOnly cookie, no JWT). No CSRF.
- **BYOK keys:** `AIContext` stores `apiKey` in `localStorage` `timebook:ai:configs` as plain text. Never committed, never logged, but readable by any JS on origin (XSS risk).
- **Notes/files:** No upload to server; mocked in memory (no storage).
- **No CSP, no rate limiting, no validation beyond required attributes.**

This is intentional for demo speed, but MUST be replaced before production.

## Requirements for Phase 2+

### Auth
- Real backend: hashed passwords (argon2/bcrypt), JWT access + httpOnly refresh cookies, CSRF token for mutations, email verification.
- Remove `localStorage` auth.

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

- Never commit `.env` or keys.
- Never put real secrets in `src/data/mockData.ts`.
- Never `console.log` keys.
- Never store keys in query params or history.

## Checklist before going live

- [ ] Remove `localStorage` key storage, add vault
- [ ] Add `auth` httpOnly cookies + CSRF
- [ ] Add CSP + Helmet headers
- [ ] Validate all inputs server-side
- [ ] Audit `npm` deps (`pnpm audit`)
