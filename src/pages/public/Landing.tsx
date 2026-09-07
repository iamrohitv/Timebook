import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

export function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-[1120px] px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Phase 1 — Website live • Mock data
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]">
              Timetable, attendance
              <br />
              <span className="text-violet-600">notes & AI</span> — in one place.
            </h1>
            <p className="mt-4 text-[17px] leading-7 text-muted-foreground max-w-[52ch]">
              Timebook is the student academic platform. Keep your schedule tidy, never miss attendance, organize notes, and chat with AI that understands your subjects. Bring your own API key.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/signup">
                <Button size="lg">Create free account</Button>
              </Link>
              <Link to="/features">
                <Button variant="outline" size="lg">
                  See features
                </Button>
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
              <span>✓ No credit card</span>
              <span>✓ BYOK</span>
              <span>✓ Works on mobile</span>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="bg-zinc-950 text-zinc-100 p-4 flex items-center gap-2 text-xs">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="h-3 w-3 rounded-full bg-green-500" />
              <span className="ml-2 opacity-60">Dashboard — Today</span>
            </div>
            <CardContent className="p-0">
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    ["Attendance", "82.4%", "On track"],
                    ["Today", "4 classes", "Next: DBMS 11am"],
                    ["Notes", "12 files", "3 new this week"],
                  ].map(([k, v, s]) => (
                    <div key={k} className="rounded-lg border p-3">
                      <div className="text-xs text-muted-foreground">{k}</div>
                      <div className="font-semibold">{v}</div>
                      <div className="text-xs text-muted-foreground">{s}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border">
                  <div className="px-3 py-2 text-sm font-medium border-b">Timetable — Monday</div>
                  <div className="divide-y text-sm">
                    {[
                      ["09:00", "DSA — LT-101", "Dr. Sharma"],
                      ["10:00", "OS — LT-101", "Prof. Gupta"],
                      ["11:00", "DBMS Lab — Lab-3", "Dr. Iyer"],
                    ].map(([t, s, teacher]) => (
                      <div key={t} className="flex items-center justify-between px-3 py-2">
                        <span className="font-mono text-xs">{t}</span>
                        <span>{s}</span>
                        <span className="text-muted-foreground text-xs">{teacher}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features grid */}
      <section className="border-t bg-zinc-50 dark:bg-zinc-900/30">
        <div className="mx-auto max-w-[1120px] px-4 py-14">
          <h2 className="text-2xl font-semibold tracking-tight">Everything you need to stay ahead</h2>
          <p className="text-muted-foreground mt-2 max-w-[60ch]">Phase 1 focuses on the website. Backend, real AI and mobile come next.</p>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              ["Timetable", "Day & week view, add/edit/delete classes."],
              ["Attendance", "Subject-wise %, can-miss / need-to-attend maths."],
              ["Notes", "Upload, search, filter by subject/unit/file type."],
              ["AI Notes", "Summary, flashcards, MCQs, important questions."],
              ["AI Chat", "Context-aware assistant for your subjects."],
              ["Community", "Browse notes by Univ → College → Branch → Sem → Subject."],
            ].map(([title, desc]) => (
              <Card key={title}>
                <CardContent className="p-5">
                  <div className="h-8 w-8 rounded-lg bg-violet-600 text-white grid place-items-center text-sm mb-3">✦</div>
                  <div className="font-medium">{title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1120px] px-4 py-16 text-center">
        <h3 className="text-2xl font-semibold">Get your semester organized today</h3>
        <p className="text-muted-foreground mt-2">Mock data included — replace with your real backend later without rewriting UI.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/signup">
            <Button size="lg">Start free</Button>
          </Link>
          <Link to="/about" className="inline-flex items-center text-sm font-medium text-violet-600">
            How it works →
          </Link>
        </div>
      </section>
    </div>
  );
}
