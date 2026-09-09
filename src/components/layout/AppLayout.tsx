import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useUser, UserButton, SignOutButton } from "@clerk/clerk-react";
import { isClerkConfigured } from "../../utils/clerk";
import { cn } from "../../utils/cn";
import { initials } from "../../utils/format";
import { Button } from "../ui/Button";

const NAV = [
  { to: "/app", label: "Dashboard", icon: "◧" },
  { to: "/app/timetable", label: "Timetable", icon: "◫" },
  { to: "/app/attendance", label: "Attendance", icon: "◎" },
  { to: "/app/notes", label: "Notes", icon: "≡" },
  { to: "/app/ai-notes", label: "AI Notes", icon: "✦" },
  { to: "/app/ai-chat", label: "AI Chat", icon: "✎" },
  { to: "/app/community", label: "Community", icon: "♡" },
  { to: "/app/settings", label: "Settings", icon: "⚙" },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="h-14 flex items-center gap-2 px-4 border-b shrink-0">
        <div className="h-8 w-8 rounded-lg bg-violet-600 grid place-items-center text-white font-bold text-sm">T</div>
        <span className="font-semibold tracking-tight">Timebook</span>
        <span className="ml-auto text-xs text-muted-foreground hidden md:inline">v0.1</span>
      </div>
      <nav className="flex-1 overflow-auto p-2 space-y-1">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === "/app"}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-violet-600 text-white" : "hover:bg-zinc-100 dark:hover:bg-zinc-800",
              )
            }
          >
            <span className="w-5 text-center">{n.icon}</span>
            {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t">
        <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 p-3">
          <p className="text-xs font-medium">Bring your own AI key</p>
          <p className="text-xs text-muted-foreground mt-1">Connect OpenAI / Gemini / Claude in Settings → AI.</p>
          <NavLink to="/app/settings" onClick={onClose} className="text-xs text-violet-600 font-medium mt-2 inline-block">
            Configure →
          </NavLink>
        </div>
      </div>
    </div>
  );
}

function HeaderAuth() {
  const { user: mockUser, logout } = useAuth();
  const nav = useNavigate();

  if (isClerkConfigured) {
    const { user, isLoaded } = useUser();
    if (!isLoaded) {
      return <span className="text-xs text-muted-foreground">Loading…</span>;
    }
    if (!user) {
      // Should not happen inside protected AppLayout, but handle
      return (
        <Button variant="ghost" size="sm" onClick={() => nav("/sign-in")}>
          Sign In
        </Button>
      );
    }
    const name = user.fullName || user.primaryEmailAddress?.emailAddress || "User";
    const email = user.primaryEmailAddress?.emailAddress || "";
    return (
      <>
        <div className="hidden sm:flex flex-col items-end leading-none mr-1">
          <span className="text-sm font-medium">{name}</span>
          <span className="text-xs text-muted-foreground truncate max-w-[160px]">{email}</span>
        </div>
        <UserButton afterSignOutUrl="/" />
        <SignOutButton>
          <Button variant="ghost" size="sm">
            Logout
          </Button>
        </SignOutButton>
      </>
    );
  }

  // Fallback to mock auth when Clerk not configured
  return (
    <>
      <div className="hidden sm:flex flex-col items-end leading-none mr-1">
        <span className="text-sm font-medium">{mockUser?.name}</span>
        <span className="text-xs text-muted-foreground">{mockUser?.email}</span>
      </div>
      <div className="h-8 w-8 rounded-full bg-violet-600 text-white grid place-items-center text-xs font-bold">
        {mockUser ? initials(mockUser.name) : "?"}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          logout();
          nav("/login");
        }}
      >
        Logout
      </Button>
    </>
  );
}

export function AppLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-[260px] lg:flex-col border-r bg-white dark:bg-zinc-900">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white dark:bg-zinc-900 shadow-xl">
            <Sidebar onClose={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur px-3 md:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            ☰
          </Button>
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="font-medium">Semester 5</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <HeaderAuth />
          </div>
        </header>

        <main className="p-4 md:p-6 max-w-[1280px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
