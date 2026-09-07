# Project Documentation

> Timebook — Student Academic Platform (Phase 1: Website)

This `.github` directory is the single source of truth for project knowledge. Read here before modifying architecture.

## Where to look

| File | Purpose |
|------|---------|
| `docs/PROJECT.md` | What Timebook is, goals, scope of Phase 1 |
| `docs/ARCHITECTURE.md` | System architecture & folder structure |
| `docs/DEVELOPMENT_LOG.md` | Chronological history of what/when/why |
| `docs/DECISIONS.md` | Important technical decisions & trade-offs |
| `docs/ROADMAP.md` | Completed / In Progress / Next / Future |
| `docs/SETUP.md` | How to run, build, and contribute |
| `docs/FRONTEND.md` | Frontend patterns, routing, components |
| `docs/AI.md` | BYOK, provider abstraction, future RAG |
| `docs/DATA_MODELS.md` | TypeScript types & relationships |
| `docs/API.md` | Service layer & future backend contract |
| `docs/SECURITY.md` | Secrets, BYOK, auth, privacy |
| `docs/CHANGELOG.md` | Versioned change history |

## Git Safety — Absolute Rule

**YOU DO NOT COMMIT OR PUSH WITHOUT EXPLICIT PERMISSION.**

- You may edit/create/delete files, inspect `git status` / `git log`, prepare changes.
- You MUST NOT `git commit`, `git push`, `git pull`, `git reset`, `git rebase`, force push, or modify remotes unless the repository owner explicitly says so.
- When work is complete, end with: *“Changes are ready. I have NOT committed or pushed anything.”*

## Development Workflow

1. Read `PROJECT.md` + `ARCHITECTURE.md` before coding.
2. Check `ROADMAP.md` for current phase (Phase 1 = website only).
3. Update relevant doc when you change architecture/decision/feature.
4. Keep `DEVELOPMENT_LOG.md` honest — date, what, why, files, problems, next step.
5. Run `pnpm run build` and verify routes/responsiveness before finishing.

## Quick Start

See `docs/SETUP.md` for exact commands.

```bash
pnpm install
pnpm run dev      # http://localhost:5173
pnpm run build    # production build to dist/
```
