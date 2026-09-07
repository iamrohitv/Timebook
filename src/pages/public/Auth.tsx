import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input, Label } from "../../components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";

function AuthShell({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1120px] px-4 py-10 grid md:grid-cols-2 gap-8 items-center">
      <div className="hidden md:block">
        <div className="rounded-2xl border bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-8">
          <h2 className="text-2xl font-bold">Timebook</h2>
          <p className="mt-2 opacity-90">Your semester, organized. Timetable • Attendance • Notes • AI</p>
          <ul className="mt-6 space-y-2 text-sm opacity-90">
            <li>✓ Timetable day/week view</li>
            <li>✓ Attendance maths that actually works</li>
            <li>✓ AI notes & chat with BYOK</li>
          </ul>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{desc}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}

export function Login() {
  const [email, setEmail] = useState("rohit@timebook.app");
  const [password, setPassword] = useState("demo1234");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(email, password);
      nav("/app");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Welcome back" desc="Log in to your Timebook workspace.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
        <div className="text-sm text-muted-foreground flex justify-between">
          <Link to="/forgot" className="hover:underline">
            Forgot password?
          </Link>
          <Link to="/signup" className="hover:underline">
            Create account
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">Mock auth — any valid email works. Password is not checked.</p>
      </form>
    </AuthShell>
  );
}

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await signup(name, email, password);
      nav("/app");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Create account" desc="Start organizing your semester in 30 seconds.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="email2">Email</Label>
          <Input id="email2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="pw2">Password</Label>
          <Input id="pw2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating…" : "Create account"}
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <AuthShell title="Reset password" desc="We’ll send you a reset link (mock).">
      {!sent ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="femail">Email</Label>
            <Input id="femail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
          <Link to="/login" className="text-sm hover:underline block text-center">
            Back to login
          </Link>
        </form>
      ) : (
        <div className="space-y-3">
          <p className="text-sm">If an account exists for {email}, a reset link has been sent (mock — check console).</p>
          <Link to="/login">
            <Button variant="outline" className="w-full">
              Back to login
            </Button>
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
