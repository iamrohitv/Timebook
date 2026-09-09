# SETUP

**Date:** 2026-09-09  
**Manager:** pnpm 11.24 (npm also works)

## Prerequisites

- Node 20+ (tested on 24.18.1)
- pnpm (`npm i -g pnpm`) or npm 11+
- Clerk account with app `app_3J56gEznHRW6jvg340IZkX7NOrY` (publishable key required)

## Install

```bash
git clone https://github.com/iamrohitv/Timebook.git
cd Timebook
pnpm install
# pnpm approve-builds --all was run to allow @clerk/shared postinstall
# or npm install
```

If you hit `ERR_SSL_CIPHER_OPERATION_FAILED` / `UND_ERR_SOCKET` (Node 24 Windows), retry or run `pnpm install --reporter=silent`. For Clerk CLI binary missing (`@clerk/cli-win32-x64`), retry `npm i -g clerk`.

## Environment (Clerk)

Frontend Vite requires publishable key:

```bash
cp .env.example .env.local
# edit .env.local:
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

- Get key: Clerk Dashboard → your app `app_3J56gEznHRW6jvg340IZkX7NOrY` → API Keys → **Publishable key** (starts `pk_test_` or `pk_live_`).
- Never commit `.env` / `.env.local`; `.env.example` is tracked as template.
- **Secret key** `CLERK_SECRET_KEY` is server-only — do not add to Vite, do not commit.
- If `VITE_CLERK_PUBLISHABLE_KEY` is missing, app shows amber banner and falls back to mock auth (`/login` with any email) — no blank screen.

## Run (dev)

```bash
pnpm run dev
# → http://localhost:5173
```

Vite HMR enabled. Edit `src/` and see instant updates.

## Build (production)

```bash
pnpm run build   # tsc -b && vite build  (verified 2026-09-09: 110 modules, 395kB JS)
pnpm run preview # preview dist/ at http://localhost:4173
```

Build output: `dist/` (static SPA). Deploy to Vercel — SPA fallback required for `/sign-in/*`, `/sign-up/*`, `/app/*`.

## Routes to test

- Public: `/`, `/features`, `/about`, `/privacy`, `/terms`, `/login` (mock fallback), `/signup`, `/forgot`, `/sign-in` (Clerk), `/sign-up` (Clerk)
- Authenticated: `/app`, `/app/timetable`, `/app/attendance`, `/app/notes`, `/app/ai-notes`, `/app/ai-chat`, `/app/community`, `/app/settings`
- Try logged-out: header shows `Sign In`/`Sign Up` (Clerk modal) or `Log in`/`Get started` (mock fallback)
- Try logged-in: header shows `Dashboard` + `UserButton` (Clerk) in `PublicLayout`; `AppLayout` header shows Clerk `UserButton` + `Logout` with name/email
- Try mobile: resize to 375px, open hamburger menu, test modal and UserButton
- Try protected: visit `/app` while signed-out → redirects to `/sign-in` (Clerk) or `/login` (mock)

## Vercel Deployment

1. Vercel Dashboard → your project → Settings → Environment Variables → **Add**:
   - Key: `VITE_CLERK_PUBLISHABLE_KEY`
   - Value: `pk_test_...` (from Clerk Dashboard, app_3J56gEznHRW6jvg340IZkX7NOrY)
   - Environment: Production, Preview, Development (all)
2. Save → **Redeploy** (Vercel → Deployments → Redeploy) — required for Vite env to bake in.
3. Clerk Dashboard → app_3J56gEznHRW6jvg340IZkX7NOrY → Configure → **Domains** — add Vercel domain (e.g. `timebook.vercel.app`) to allowed origins.
4. Clerk Dashboard → **SSO Connections** → Enable **Google** (and Email) if not already.

No secret key needed client-side.

## Clerk CLI (optional, for `clerk doctor`)

```bash
npm i -g clerk
clerk auth login
clerk init --app app_3J56gEznHRW6jvg340IZkX7NOrY   # inspect before overwriting; already manually integrated so this is optional
clerk doctor
```

If `clerk init` would overwrite, stop and inspect diff — project is already integrated manually (ClerkProvider in `main.tsx`).

## Lint

```bash
pnpm run lint   # oxlint
```

## Troubleshooting

- `vite not found` → `pnpm install` again
- Port in use → `pnpm run dev -- --port 5174`
- Theme stuck → clear `localStorage` key `timebook:theme` or use Settings → Appearance
- BYOK not sticking → check `localStorage` `timebook:ai:configs`
- Clerk blank screen → check banner: if `VITE_CLERK_PUBLISHABLE_KEY` missing, add it; if still blank, check browser console for Clerk errors
- `pnpm run build` fails with `IGNORED_BUILDS` → run `pnpm approve-builds --all`
- Clerk modal not opening → ensure `ClerkProvider` has `publishableKey` and `signInUrl="/sign-in"` matches route
