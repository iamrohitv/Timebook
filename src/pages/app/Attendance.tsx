import { useMemo, useState } from "react";
import { mockAttendance, mockSubjects } from "../../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { attendancePercentage, attendanceStatus, classesCanMiss, classesToReachTarget } from "../../utils/attendance";
import { Button } from "../../components/ui/Button";
import { Input, Label } from "../../components/ui/Input";

export function Attendance() {
  const [target, setTarget] = useState(75);
  const [filter, setFilter] = useState<string>("all");

  const summaries = useMemo(() => {
    return mockSubjects.map((s) => {
      const recs = mockAttendance.filter((a) => a.subjectId === s.id && a.status !== "cancelled");
      const total = recs.length;
      const present = recs.filter((r) => r.status === "present").length;
      return { subject: s, total, present, absent: total - present, pct: attendancePercentage(present, total) };
    });
  }, []);

  const total = mockAttendance.filter((a) => a.status !== "cancelled").length;
  const present = mockAttendance.filter((a) => a.status === "present").length;
  const overall = attendancePercentage(present, total);

  const filtered =
    filter === "all" ? mockAttendance.slice(0, 20).sort((a, b) => +new Date(b.date) - +new Date(a.date)) : mockAttendance.filter((a) => a.subjectId === filter).slice(0, 20);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Attendance</h1>
          <p className="text-sm text-muted-foreground">Overall + subject-wise. Maths is exact.</p>
        </div>
        <Card className="px-3 py-2 flex items-center gap-3">
          <Label>Target %</Label>
          <Input type="number" min={0} max={100} value={target} onChange={(e) => setTarget(Math.max(0, Math.min(100, Number(e.target.value))))} className="w-20" />
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Overall</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overall}%</div>
            <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 mt-3 overflow-hidden">
              <div className="h-full bg-violet-600" style={{ width: `${Math.min(overall, 100)}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {present}/{total} • Need {classesToReachTarget(present, total, target)} more to reach {target}% • Can miss {classesCanMiss(present, total, target)}
            </p>
          </CardContent>
        </Card>
        <div className="md:col-span-2 grid sm:grid-cols-2 gap-3">
          {summaries.map((s) => {
            const st = attendanceStatus(s.pct, target);
            return (
              <Card key={s.subject.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium">{s.subject.name}</div>
                      <div className="text-xs text-muted-foreground">{s.subject.code} • {s.present}/{s.total} • {s.absent} absent</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${st === "good" ? "bg-emerald-100 text-emerald-700" : st === "warning" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                      {s.pct}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 mt-3 overflow-hidden">
                    <div className={`h-full ${st === "good" ? "bg-emerald-500" : st === "warning" ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${Math.min(s.pct, 100)}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {s.pct >= target ? `Can miss ${classesCanMiss(s.present, s.total, target)}` : `Need ${classesToReachTarget(s.present, s.total, target)} more`}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-sm">History (latest 20)</CardTitle>
          <select className="rounded-lg border px-2 py-1 text-sm bg-background" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All subjects</option>
            {mockSubjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code}
              </option>
            ))}
          </select>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b">
                <tr>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Subject</th>
                  <th className="text-left p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((r) => {
                  const subj = mockSubjects.find((s) => s.id === r.subjectId);
                  return (
                    <tr key={r.id}>
                      <td className="p-3">{new Date(r.date).toLocaleDateString("en-IN")}</td>
                      <td className="p-3">{subj?.code}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "present" ? "bg-emerald-100 text-emerald-700" : r.status === "absent" ? "bg-red-100 text-red-700" : "bg-zinc-100"}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl border p-4 bg-zinc-50 dark:bg-zinc-900 text-sm">
        <p className="font-medium">How maths works</p>
        <p className="text-muted-foreground mt-1">Need: ceil((target*total - 100*present)/(100-target)). Can miss: floor((100*present - target*total)/target). Rounded to 2 decimals.</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => setTarget(75)}>
          Reset to 75%
        </Button>
      </div>
    </div>
  );
}
