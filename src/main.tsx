import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import { AIProviderCtx } from "./contexts/AIContext.tsx";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

function MissingKeyBanner() {
  if (PUBLISHABLE_KEY) return null;
  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs px-4 py-2 text-center">
      Clerk publishable key missing — set <code className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900">VITE_CLERK_PUBLISHABLE_KEY</code> in .env.local and Vercel. Falling back to mock auth.
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);

if (!PUBLISHABLE_KEY) {
  console.warn("Missing VITE_CLERK_PUBLISHABLE_KEY — Clerk disabled, using mock auth. Add pk_test_... from Clerk Dashboard (app_3J56gEznHRW6jvg340IZkX7NOrY).");
  root.render(
    <StrictMode>
      <MissingKeyBanner />
      <ThemeProvider>
        <AuthProvider>
          <AIProviderCtx>
            <App />
          </AIProviderCtx>
        </AuthProvider>
      </ThemeProvider>
    </StrictMode>,
  );
} else {
  root.render(
    <StrictMode>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/"
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
      >
        <ThemeProvider>
          <AuthProvider>
            <AIProviderCtx>
              <App />
            </AIProviderCtx>
          </AuthProvider>
        </ThemeProvider>
      </ClerkProvider>
    </StrictMode>,
  );
}
