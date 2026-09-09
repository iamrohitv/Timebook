import { Link, Outlet, NavLink } from "react-router-dom";
import { Button } from "../ui/Button";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { isClerkConfigured } from "../../utils/clerk";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
      <header className="sticky top-0 z-40 border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto max-w-[1120px] flex h-14 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-violet-600 grid place-items-center text-white font-bold text-sm">T</span>
            <span className="font-semibold">Timebook</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {[
              ["/features", "Features"],
              ["/about", "About"],
              ["/privacy", "Privacy"],
              ["/terms", "Terms"],
            ].map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `px-3 py-2 rounded-lg ${isActive ? "bg-zinc-100 dark:bg-zinc-900 font-medium" : "text-muted-foreground hover:text-foreground"}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {isClerkConfigured ? (
              <>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button size="sm">Sign Up</Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Link to="/app">
                    <Button variant="ghost" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Get started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-8">
        <div className="mx-auto max-w-[1120px] px-4 flex flex-col md:flex-row gap-4 justify-between text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} Timebook. Built for students.</span>
          <span className="flex gap-4">
            <Link to="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link to="/terms" className="hover:underline">
              Terms
            </Link>
            <a href="https://github.com/iamrohitv/Timebook" target="_blank" rel="noreferrer" className="hover:underline">
              GitHub
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
