import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "./components/layout/PublicLayout";
import { AppLayout } from "./components/layout/AppLayout";
import { Landing } from "./pages/public/Landing";
import { Features } from "./pages/public/Features";
import { About } from "./pages/public/About";
import { Privacy, Terms } from "./pages/public/Privacy";
import { Login, Signup, Forgot } from "./pages/public/Auth";
import { ClerkSignIn, ClerkSignUp } from "./pages/public/ClerkAuthPages";
import { Dashboard } from "./pages/app/Dashboard";
import { Timetable } from "./pages/app/Timetable";
import { Attendance } from "./pages/app/Attendance";
import { Notes } from "./pages/app/Notes";
import { AINotes } from "./pages/app/AINotes";
import { AIChat } from "./pages/app/AIChat";
import { Community } from "./pages/app/Community";
import { Settings } from "./pages/app/Settings";
import { useAuth as useMockAuth } from "./contexts/AuthContext";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import { isClerkConfigured } from "./utils/clerk";

function Protected({ children }: { children: React.ReactNode }) {
  // When Clerk is configured, it is source of truth; else fallback to mock
  if (isClerkConfigured) {
    const { isLoaded, isSignedIn } = useClerkAuth();
    if (!isLoaded) {
      return (
        <div className="grid place-items-center py-20 text-sm text-muted-foreground">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-violet-600 mr-2 inline-block" />
          Checking authentication…
        </div>
      );
    }
    if (!isSignedIn) return <Navigate to="/sign-in" replace />;
    return <>{children}</>;
  }
  // Fallback to mock auth
  const { isAuthenticated } = useMockAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function NotFound() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">404 — Not found</h1>
      <p className="text-muted-foreground mt-2">The page you’re looking for doesn’t exist.</p>
      <a href="/" className="inline-flex mt-6 rounded-lg bg-violet-600 text-white px-4 py-2 text-sm">
        Go home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Landing />} />
          <Route path="features" element={<Features />} />
          <Route path="about" element={<About />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          {/* Mock auth routes (fallback) */}
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot" element={<Forgot />} />
          {/* Clerk routes */}
          <Route path="sign-in/*" element={<ClerkSignIn />} />
          <Route path="sign-up/*" element={<ClerkSignUp />} />
        </Route>

        <Route
          path="/app"
          element={
            <Protected>
              <AppLayout />
            </Protected>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="notes" element={<Notes />} />
          <Route path="ai-notes" element={<AINotes />} />
          <Route path="ai-chat" element={<AIChat />} />
          <Route path="community" element={<Community />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
