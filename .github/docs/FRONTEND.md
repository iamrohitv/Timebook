# FRONTEND

**Stack:** React 19 + TS 6 + Vite 8 + Tailwind 4 + React Router 7

## Routing

```
App.tsx: BrowserRouter → Routes
  /                 → PublicLayout → Landing
  /features         → Features
  /about            → About
  /privacy|/terms
  /login|/signup|/forgot
  /app              → Protected → AppLayout (Outlet)
    /app            → Dashboard
    /app/timetable  → Timetable
    /app/attendance → Attendance
    /app/notes      → Notes
    /app/ai-notes   → AINotes
    /app/ai-chat    → AIChat
    /app/community  → Community
    /app/settings   → Settings (tabs)
  *                 → 404
```

`Protected` checks `useAuth().isAuthenticated` → `Navigate /login`.

## Component conventions

- `src/components/ui/*` — dumb, reusable, no business logic (Button, Card, Input, Badge, EmptyState).
- `src/components/layout/*` — shells (PublicLayout, AppLayout). Sidebar uses `NavLink` active styles + mobile drawer state.
- `src/pages/*` — feature screens, own local state for mock; future will call `services/api`.

## State

- `AuthContext` — `user` persisted to `localStorage` (`timebook:auth:user`); `login`/`signup` are mocked async with validation.
- `ThemeContext` — `light|dark|system` → resolves via `matchMedia`, toggles `documentElement.classList.dark`.
- `AIContext` — `configs: AIProviderConfig[]` + `activeProvider`, persisted (`timebook:ai:*`).

## Styling

- Tailwind 4 via `@tailwindcss/vite`, no `postcss.config.js`.
- `src/index.css` defines CSS variables (`--background`, `--foreground`, etc.) and `.dark` overrides; components use `hsl(var(--...))`.
- Utilities: `cn()` joins class strings; `Button` variants via object maps.

## Responsiveness

- Header: sticky, `lg:hidden` hamburger, `hidden md:flex` meta.
- Sidebar: `hidden lg:fixed` 260px, drawer on mobile (`fixed inset-0` overlay).
- Grids: `grid md:grid-cols-3`, `sm:grid-cols-2` collapse; tables overflow-auto; inputs wrap.
- Tested conceptually at 375px, 768px, 1024px, 1280px (build passes; manual resize in dev recommended).

## Accessibility

- Semantic: `header`, `nav`, `main`, `button`, `label`+`htmlFor`.
- Focus: `focus-visible:ring-2 focus-visible:ring-ring` on Button/Input.
- Keyboard: all interactive via `Button`/`NavLink`/`select`; drawer close on overlay click.
- Contrast: zinc/violet palette, `text-muted-foreground` not below AA.

## Loading / Error / Empty

- `EmptyState` (dashed border, action), `Loading` (spinner), `ErrorState` (red border, retry) used in Notes/Community.
- Forms show inline `err` text. Timetable/Attendance/Notes show empty when filter yields 0.
- AI pages show “No output yet” placeholders and mocked loading delays (600–800ms).

## Performance

- No extra deps; only `react-router-dom`. Gzip ~92kB JS.
- No giant components; each page < 250 lines where possible.
- Avoid duplicated code: `formatTime`, `attendance` helpers shared.
