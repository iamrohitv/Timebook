import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { mockUser } from "../data/mockData";
import type { User } from "../types";
import { getJSON, setJSON, remove } from "../services/storage";
import { isClerkConfigured } from "../utils/clerk";
import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

function clerkUserToAppUser(clerkUser: ReturnType<typeof useUser>["user"]): User | null {
  if (!clerkUser) return null;
  return {
    id: clerkUser.id,
    name: clerkUser.fullName || clerkUser.username || clerkUser.primaryEmailAddress?.emailAddress || "User",
    email: clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress || "",
    avatar: clerkUser.imageUrl,
    createdAt: clerkUser.createdAt ? clerkUser.createdAt.toISOString() : new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [mockUserState, setMockUser] = useState<User | null>(() => getJSON<User | null>("auth:user", null));

  useEffect(() => {
    if (!isClerkConfigured) {
      if (mockUserState) setJSON("auth:user", mockUserState);
      else remove("auth:user");
    }
  }, [mockUserState]);

  async function login(email: string, _password: string) {
    await new Promise((r) => setTimeout(r, 600));
    if (!email.includes("@")) throw new Error("Enter a valid email");
    setMockUser({ ...mockUser, email });
  }
  async function signup(name: string, email: string, _password: string) {
    await new Promise((r) => setTimeout(r, 700));
    if (!name.trim()) throw new Error("Name is required");
    setMockUser({ ...mockUser, name: name.trim(), email });
  }
  function logout() {
    setMockUser(null);
  }

  // If Clerk is configured, derive user from Clerk; mock functions remain for fallback routes
  if (isClerkConfigured) {
    return <ClerkBackedProvider mockUserState={mockUserState} login={login} signup={signup} logout={logout}>{children}</ClerkBackedProvider>;
  }

  return <AuthContext.Provider value={{ user: mockUserState, isAuthenticated: !!mockUserState, login, signup, logout }}>{children}</AuthContext.Provider>;
}

function ClerkBackedProvider({
  children,
  mockUserState,
  login,
  signup,
  logout,
}: {
  children: ReactNode;
  mockUserState: User | null;
  login: AuthState["login"];
  signup: AuthState["signup"];
  logout: () => void;
}) {
  const { user: clerkUser, isLoaded } = useUser();
  const { isSignedIn } = useClerkAuth();

  // While loading, keep previous; after loaded, use Clerk identity as source of truth
  const clerkAppUser = clerkUserToAppUser(clerkUser);
  const user = isLoaded ? (isSignedIn ? clerkAppUser : null) : mockUserState;
  const isAuthenticated = isLoaded ? !!isSignedIn : !!mockUserState;

  return <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
