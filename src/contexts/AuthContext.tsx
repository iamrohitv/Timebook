import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { mockUser } from "../data/mockData";
import type { User } from "../types";
import { getJSON, setJSON, remove } from "../services/storage";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getJSON<User | null>("auth:user", null));

  useEffect(() => {
    if (user) setJSON("auth:user", user);
    else remove("auth:user");
  }, [user]);

  async function login(email: string, _password: string) {
    // mock — accept any credentials, return mockUser with email override
    await new Promise((r) => setTimeout(r, 600));
    if (!email.includes("@")) throw new Error("Enter a valid email");
    setUser({ ...mockUser, email });
  }
  async function signup(name: string, email: string, _password: string) {
    await new Promise((r) => setTimeout(r, 700));
    if (!name.trim()) throw new Error("Name is required");
    setUser({ ...mockUser, name: name.trim(), email });
  }
  function logout() {
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
