import { SignIn, SignUp } from "@clerk/clerk-react";
import { isClerkConfigured } from "../../utils/clerk";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/Card";

function ClerkMissing() {
  return (
    <div className="mx-auto max-w-[480px] px-4 py-16 text-center">
      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold">Clerk not configured</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Set <code>VITE_CLERK_PUBLISHABLE_KEY</code> in your .env.local and Vercel env (from Clerk Dashboard — app_3J56gEznHRW6jvg340IZkX7NOrY). Using mock auth fallback.
          </p>
          <div className="mt-4 flex gap-2 justify-center">
            <Link to="/login" className="text-sm text-violet-600 underline">
              Go to mock login
            </Link>
            <Link to="/" className="text-sm text-muted-foreground underline">
              Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ClerkSignIn() {
  if (!isClerkConfigured) return <ClerkMissing />;
  return (
    <div className="min-h-[70vh] grid place-items-center px-4 py-10">
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" afterSignInUrl="/app" />
    </div>
  );
}

export function ClerkSignUp() {
  if (!isClerkConfigured) return <ClerkMissing />;
  return (
    <div className="min-h-[70vh] grid place-items-center px-4 py-10">
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" afterSignUpUrl="/app" />
    </div>
  );
}
