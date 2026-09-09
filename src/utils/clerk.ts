export const isClerkConfigured = !!(
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || (import.meta.env as Record<string, string | undefined>).NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

export const clerkPublishableKey =
  (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined) ||
  (import.meta.env as Record<string, string | undefined>).NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
