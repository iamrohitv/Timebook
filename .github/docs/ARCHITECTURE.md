# ARCHITECTURE

**Date:** 2026-09-08  
**Stack:** React 19 + TypeScript 6 + Vite 8 + Tailwind 4 + React Router 7

## High-level

```
Public Routes (PublicLayout)
  Landing / Features / About / Privacy / Terms / Auth

Authenticated Routes (AppLayout + Protected)
  Dashboard / Timetable / Attendance / Notes / AI Notes / AI Chat / Community / Settings

UI
 ↓
Service layer (mock implementations)
 ↓
Future API (swap without UI rewrite)
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
  services/storage.ts     # typed localStorage (namespaced timebook:)
  contexts/
    AuthContext.tsx       # mock auth, persisted to localStorage
    ThemeContext.tsx      # light/dark/system via matchMedia + documentElement
    AIContext.tsx         # BYOK configs + active provider, persisted
  components/
    ui/Button, Card, Input, Badge, EmptyState
    layout/PublicLayout, AppLayout (Sidebar + Mobile drawer + Header)
  pages/
    public/Landing, Features, About, Privacy, Auth (Login/Signup/Forgot)
    app/Dashboard, Timetable, Attendance, Notes, AINotes, AIChat, Community, Settings
  App.tsx                 # BrowserRouter + Routes + Protected
  main.tsx                # providers wrapper
  index.css               # Tailwind + CSS variables (light/dark)
```

## Key Patterns

- **Protected route:** `Protected` component checks `useAuth().isAuthenticated` → redirect `/login`.
- **Theme:** CSS variables + `.dark` class, Tailwind `@theme`, `prefers-color-scheme` sync.
- **Mock data:** Separated in `data/mockData.ts`, never mixed with services.
- **BYOK:** `AIContext` stores `AIProviderConfig[]` in localStorage; UI only. Backend vault pending (see SECURITY.md).
- **Responsiveness:** Tailwind breakpoints, grid collapse, mobile drawer for sidebar (`lg:hidden`), header sticky.
- **Accessibility:** semantic HTML, labels, keyboard nav, focus ring via `focus-visible:ring-ring`.

## Build

- `tsc -b && vite build` → `dist/` (verified 2026-09-08, 52 modules, gzip ~92kB JS + 6.5kB CSS)
- SPA routing — needs static fallback for production (Vercel/Netlify handles).

## Future Hooks

- Replace `mockData` with `services/api.ts` implementing same shapes.
- Add `services/ai.ts` with `AIProvider` abstraction (OpenAI/Gemini/Claude adapters) — UI already expects it.
