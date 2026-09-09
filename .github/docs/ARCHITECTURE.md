# ARCHITECTURE

**Date:** 2026-09-09  
**Stack:** React 19 + TypeScript 6 + Vite 8 + Tailwind 4 + React Router 7 + Clerk 5.61 (`@clerk/clerk-react`)

## High-level

```
Public Routes (PublicLayout)
  Landing / Features / About / Privacy / Terms / Auth (mock) / SignIn-SignUp (Clerk)
  └─ Header: SignedOut→ SignIn/SignUp (modal) | SignedIn→ Dashboard + UserButton

Authenticated Routes (AppLayout + Protected)
  Dashboard / Timetable / Attendance / Notes / AI Notes / AI Chat / Community / Settings
  └─ Protected checks Clerk isSignedIn when VITE_CLERK_PUBLISHABLE_KEY set, else mock

UI
 ↓
Service layer (mock implementations)
 ↓
Future API (swap without UI rewrite)

Auth source of truth: Clerk (app_3J56gEznHRW6jvg340IZkX7NOrY) when configured; mock localStorage fallback when key missing
```

## Folder Structure

```
src/
  types/index.ts          # User, StudentProfile, Subject, TimetableEntry, AttendanceRecord, Note, CommunityNote, Conversation, Message, AIProvider, etc.
  data/mockData.ts        # subjects, timetable, attendance (generated), notes, community, conversations, providers
  utils/
    cn.ts                 # className helper
    attendance.ts         # percentage, canMiss, needToAttend
    format.ts             # time, date, initials
    clerk.ts              # isClerkConfigured (VITE_CLERK_PUBLISHABLE_KEY)
  services/storage.ts     # typed localStorage (namespaced timebook:)
  contexts/
    AuthContext.tsx       # mock auth + ClerkBackedProvider mapping clerkUser→User, persisted mock fallback
    ThemeContext.tsx      # light/dark/system via matchMedia + documentElement
    AIContext.tsx         # BYOK configs + active provider, persisted
  components/
    ui/Button, Card, Input, Badge, EmptyState
    layout/PublicLayout, AppLayout (Sidebar + Mobile drawer + Header with Clerk UserButton/SignOut)
  pages/
    public/Landing, Features, About, Privacy, Auth (Login/Signup/Forgot mock), ClerkAuthPages (SignIn/SignUp path routing)
    app/Dashboard, Timetable, Attendance, Notes, AINotes, AIChat, Community, Settings
  App.tsx                 # BrowserRouter + Routes + Protected (Clerk isLoaded/isSignedIn vs mock)
  main.tsx                # ClerkProvider wrapper (conditional), Theme/Auth/AI providers
  vite-env.d.ts           # VITE_CLERK_PUBLISHABLE_KEY typing
  index.css               # Tailwind + CSS variables (light/dark)
.env.example              # VITE_CLERK_PUBLISHABLE_KEY placeholder
pnpm-workspace.yaml       # allowBuilds @clerk/shared
```

## Key Patterns

- **Protected route:** `Protected` in `App.tsx:19` branches on `isClerkConfigured` — Clerk `useAuth().isLoaded/isSignedIn → /sign-in` vs mock `useAuth().isAuthenticated → /login`. Shows spinner while `isLoaded` false (no blank screen).
- **ClerkProvider:** `main.tsx:1` reads `import.meta.env.VITE_CLERK_PUBLISHABLE_KEY`; if missing renders `MissingKeyBanner` + fallback mock tree with `console.warn`; if present wraps with `ClerkProvider(publishableKey, afterSignOutUrl="/", signInUrl="/sign-in", signUpUrl="/sign-up")`.
- **AuthContext:** `AuthContext.tsx:1` maps Clerk `user.id/fullName/primaryEmailAddress/imageUrl` → `User`; when Clerk configured, `isAuthenticated` = `isSignedIn`, `user` = mapped clerk user; login/signup/logout remain for mock fallback pages.
- **Header:** `PublicLayout.tsx:1` uses `isClerkConfigured ? <SignedOut><SignInButton modal><SignedIn><UserButton>` : fallback `Link /login`. `AppLayout.tsx:1` `HeaderAuth` uses `useUser().isLoaded/user` + `UserButton` + `SignOutButton` when configured, else mock avatar/initials.
- **SignIn/SignUp pages:** `ClerkAuthPages.tsx:1` uses `SignIn routing="path" path="/sign-in"` / `SignUp` with `afterSignInUrl="/app"`; when not configured shows `ClerkMissing` card linking to mock login.
- **Theme:** CSS variables + `.dark` class, Tailwind `@theme`, `prefers-color-scheme` sync.
- **Mock data:** Separated in `data/mockData.ts`, never mixed with services.
- **BYOK:** `AIContext` stores `AIProviderConfig[]` in localStorage; UI only. Backend vault pending (see SECURITY.md).
- **Responsiveness:** Tailwind breakpoints, grid collapse, mobile drawer for sidebar (`lg:hidden`), header sticky, Clerk UserButton works on mobile (tested modal).
- **Accessibility:** semantic HTML, labels, keyboard nav, focus ring via `focus-visible:ring-ring`.

## Build

- `tsc -b && vite build` → `dist/` (verified 2026-09-09, 110 modules, 395.95kB JS gzip 115.66kB, CSS 31.47kB)
- SPA routing — needs static fallback for production (Vercel handles `/sign-in/*`, `/app/*`).

## Future Hooks

- Replace `mockData` with `services/api.ts` implementing same shapes, using Clerk `getToken()` for auth header.
- Add `services/ai.ts` with `AIProvider` abstraction (OpenAI/Gemini/Claude adapters) — UI already expects it.
- When backend user DB arrives, associate `clerkUser.id` → `User.id` → Timetable/Attendance/Notes in DB.
