import { Link } from "react-router-dom";
import { mockAttendance, mockNotes, mockSubjects, mockTimetable, upcomingExams } from "../../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { attendancePercentage } from "../../utils/attendance";
import { formatTime } from "../../utils/format";

function todayDay() {
  return new Date().toLocaleDateString("en-US", { weekday: "long" }) as string;
}

export function Dashboard() {
  const day = todayDay();
  const todays = mockTimetable.filter((t) => t.day === day);
  const fallback = mockTimetable.filter((t) => t.day === "Monday");
  const show = todays.length ? todays : fallback;

  const total = mockAttendance.length;
  const present = mockAttendance.filter((a) => a.status === "present").length;
  const overall = attendancePercentage(present, total);

  const upcoming = mockTimetable.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back — here’s your academic snapshot.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/app/timetable">
            <Button variant="outline" size="sm">
              View timetable
            </Button>
          </Link>
          <Link to="/app/ai-chat">
            <Button size="sm">Ask AI</Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Today’s classes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {show.length ? (
              show.map((t) => {
                const subj = mockSubjects.find((s) => s.id === t.subjectId);
                return (
                  <div key={t.id} className="flex items-center gap-3 rounded-lg border p-2.5">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: subj?.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{subj?.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(t.startTime)}–{formatTime(t.endTime)} • {t.room}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No classes today — enjoy!</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Attendance overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{overall}%</span>
              <span className={`text-xs px-2 py-1 rounded-full ${overall >= 75 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" : "bg-amber-100 text-amber-700"}`}>
                {overall >= 75 ? "On track" : "Needs attention"}
              </span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <div className="h-full bg-violet-600" style={{ width: `${Math.min(overall, 100)}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {present}/{total} classes • Target 75%
            </p>
            <Link to="/app/attendance" className="text-xs text-violet-600 font-medium mt-3 inline-block">
              Details →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Upcoming exams & assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingExams.map((e) => {
              const subj = mockSubjects.find((s) => s.id === e.subjectId);
              return (
                <div key={e.id} className="flex items-center justify-between rounded-lg border p-2.5">
                  <div>
                    <div className="text-sm font-medium">{e.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {subj?.code} • {e.type}
                    </div>
                  </div>
                  <div className="text-xs font-mono">{e.date}</div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Recent notes</CardTitle>
            <Link to="/app/notes" className="text-xs text-violet-600">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-3">
              {mockNotes.slice(0, 3).map((n) => {
                const subj = mockSubjects.find((s) => s.id === n.subjectId);
                return (
                  <div key={n.id} className="rounded-lg border p-3">
                    <div className="text-xs text-muted-foreground">{subj?.code}</div>
                    <div className="text-sm font-medium line-clamp-2">{n.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{n.fileName} • {n.fileSize}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">AI assistant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Ask about deadlocks, normalization, or generate revision notes from your material.</p>
            <div className="flex gap-2">
              <Link to="/app/ai-notes" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Generate notes
                </Button>
              </Link>
              <Link to="/app/ai-chat" className="flex-1">
                <Button size="sm" className="w-full">
                  Open chat
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {[
            ["Add class", "/app/timetable"],
            ["Upload note", "/app/notes"],
            ["Browse community", "/app/community"],
            ["Set target 75%", "/app/attendance"],
          ].map(([label, to]) => (
            <Link key={label} to={to}>
              <Button variant="outline" size="sm">
                {label}
              </Button>
            </Link>
          ))}
        </CardContent>
      </Card>

      <div className="rounded-xl border bg-white dark:bg-zinc-900 p-4">
        <h3 className="text-sm font-medium">Upcoming classes (preview)</h3>
        <div className="mt-3 grid sm:grid-cols-3 gap-2">
          {upcoming.map((t) => {
            const subj = mockSubjects.find((s) => s.id === t.subjectId);
            return (
              <div key={t.id} className="rounded-lg bg-zinc-50 dark:bg-zinc-800 p-3">
                <div className="text-xs text-muted-foreground">{t.day}</div>
                <div className="text-sm font-medium">{subj?.name}</div>
                <div className="text-xs text-muted-foreground">
                  {formatTime(t.startTime)} • {t.room}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
