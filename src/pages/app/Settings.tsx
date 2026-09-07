import { useState } from "react";
import { mockProfile } from "../../data/mockData";
import { mockProviders } from "../../data/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input, Label } from "../../components/ui/Input";
import { useAuth } from "../../contexts/AuthContext";
import { useAISettings } from "../../contexts/AIContext";
import { useTheme } from "../../contexts/ThemeContext";

export function Settings() {
  const { user, logout } = useAuth();
  const { configs, activeProvider, setActiveProvider, saveConfig, removeConfig } = useAISettings();
  const { theme, setTheme } = useTheme();
  const [tab, setTab] = useState<"profile" | "academic" | "appearance" | "notifications" | "ai" | "privacy" | "account">("profile");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Profile, academic, appearance, notifications, AI, privacy, account.</p>
      </div>

      <div className="flex gap-2 overflow-auto pb-1">
        {[
          ["profile", "Profile"],
          ["academic", "Academic"],
          ["appearance", "Appearance"],
          ["notifications", "Notifications"],
          ["ai", "AI / BYOK"],
          ["privacy", "Privacy"],
          ["account", "Account"],
        ].map(([id, label]) => (
          <Button key={id} variant={tab === id ? "default" : "outline"} size="sm" onClick={() => setTab(id as never)}>
            {label}
          </Button>
        ))}
      </div>

      {tab === "profile" && (
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Mock — edits stay local.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input defaultValue={user?.name} />
            </div>
            <div>
              <Label>Email</Label>
              <Input defaultValue={user?.email} />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button onClick={() => alert("Saved (mock)")}>Save</Button>
              <Button variant="outline" onClick={logout}>Log out</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "academic" && (
        <Card>
          <CardHeader>
            <CardTitle>Academic profile</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            {[
              ["University", mockProfile.university],
              ["College", mockProfile.college],
              ["Branch", mockProfile.branch],
              ["Semester", String(mockProfile.semester)],
              ["Roll No", mockProfile.rollNo],
              ["CGPA", String(mockProfile.cgpa ?? "")],
            ].map(([label, val]) => (
              <div key={label}>
                <Label>{label}</Label>
                <Input defaultValue={val} />
              </div>
            ))}
            <div className="md:col-span-2">
              <Button onClick={() => alert("Saved (mock)")}>Save academic profile</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "appearance" && (
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              {(["light", "dark", "system"] as const).map((t) => (
                <Button key={t} variant={theme === t ? "default" : "outline"} onClick={() => setTheme(t)}>
                  {t}
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">System follows OS preference.</p>
          </CardContent>
        </Card>
      )}

      {tab === "notifications" && (
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={notifEmail} onChange={(e) => setNotifEmail(e.target.checked)} /> Email updates
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={notifPush} onChange={(e) => setNotifPush(e.target.checked)} /> Push (mock)
            </label>
            <Button onClick={() => alert("Preferences saved (mock)")}>Save</Button>
          </CardContent>
        </Card>
      )}

      {tab === "ai" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>BYOK — Bring Your Own Key</CardTitle>
              <CardDescription>Architecture: Provider → abstraction → AI service → Chat/Notes/RAG. Keys stored in localStorage for now; backend vault is pending (see SECURITY.md).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 overflow-auto">
                {mockProviders.map((p) => (
                  <Button key={p.id} variant={activeProvider === p.id ? "default" : "outline"} size="sm" onClick={() => setActiveProvider(p.id)}>
                    {p.name}
                  </Button>
                ))}
                <Button variant="ghost" size="sm" onClick={() => setActiveProvider(null)}>
                  None
                </Button>
              </div>

              {mockProviders.map((p) => {
                const cfg = configs.find((c) => c.providerId === p.id)!;
                return (
                  <div key={p.id} className="rounded-xl border p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="h-8 w-8 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 grid place-items-center text-xs font-bold">{p.icon}</span>
                      <span className="font-medium">{p.name}</span>
                      <span className="text-xs text-muted-foreground">{p.description}</span>
                      <span className={`ml-auto text-xs px-2 py-1 rounded-full ${cfg.apiKey ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100"}`}>{cfg.apiKey ? "Key set" : "No key"}</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <Label>{p.keyLabel}</Label>
                        <Input
                          type="password"
                          placeholder="sk-… / AIza…"
                          value={cfg.apiKey}
                          onChange={(e) => saveConfig({ ...cfg, apiKey: e.target.value, enabled: !!e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Never commit keys. Stored locally only (pending backend vault).</p>
                      </div>
                      <div>
                        <Label>Model</Label>
                        <select className="flex h-9 w-full rounded-lg border bg-background px-3 text-sm" value={cfg.model} onChange={(e) => saveConfig({ ...cfg, model: e.target.value })}>
                          {p.models.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                        <a href={p.docsUrl} target="_blank" rel="noreferrer" className="text-xs text-violet-600 mt-1 inline-block">Get API key →</a>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => saveConfig({ ...cfg, enabled: !cfg.enabled })}>{cfg.enabled ? "Disable" : "Enable"}</Button>
                      <Button size="sm" variant="ghost" onClick={() => removeConfig(p.id)}>Remove key</Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "privacy" && (
        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>Mock data only. Future backend will add proper consent & data controls.</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>BYOK keys: localStorage (Phase 1) → backend vault (Phase 2/3)</li>
              <li>Notes: local mock → S3/R2 with signed URLs</li>
              <li>Auth: mock → JWT + refresh</li>
            </ul>
          </CardContent>
        </Card>
      )}

      {tab === "account" && (
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Danger zone</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="destructive" onClick={() => { if (confirm("Delete local data?")) { localStorage.clear(); location.href = "/"; } }}>
              Clear local data
            </Button>
            <Button variant="outline" onClick={logout}>
              Log out
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
