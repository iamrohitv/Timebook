import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "./components/layout/PublicLayout";
import { AppLayout } from "./components/layout/AppLayout";
import { Landing } from "./pages/public/Landing";
import { Features } from "./pages/public/Features";
import { About } from "./pages/public/About";
import { Privacy, Terms } from "./pages/public/Privacy";
import { Login, Signup, Forgot } from "./pages/public/Auth";
import { Dashboard } from "./pages/app/Dashboard";
import { Timetable } from "./pages/app/Timetable";
import { Attendance } from "./pages/app/Attendance";
import { Notes } from "./pages/app/Notes";
import { AINotes } from "./pages/app/AINotes";
import { AIChat } from "./pages/app/AIChat";
import { Community } from "./pages/app/Community";
import { Settings } from "./pages/app/Settings";
import { useAuth } from "./contexts/AuthContext";

function Protected({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
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
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot" element={<Forgot />} />
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
