import { useState } from "react";
import { mockSubjects, mockTimetable as initial } from "../../data/mockData";
import type { DayOfWeek, TimetableEntry } from "../../types";
import { DAYS } from "../../types";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Input, Label } from "../../components/ui/Input";
import { formatTime } from "../../utils/format";

export function Timetable() {
  const [view, setView] = useState<"day" | "week">("week");
  const [day, setDay] = useState<DayOfWeek>(() => (new Date().toLocaleDateString("en-US", { weekday: "long" }) as DayOfWeek) || "Monday");
  const [entries, setEntries] = useState<TimetableEntry[]>(initial);
  const [editing, setEditing] = useState<TimetableEntry | null>(null);
  const [form, setForm] = useState<Partial<TimetableEntry>>({ day: "Monday", startTime: "09:00", endTime: "10:00", room: "", teacher: "", subjectId: mockSubjects[0].id, type: "lecture" });

  function filtered() {
    if (view === "day") return entries.filter((e) => e.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
    return entries;
  }

  function save() {
    if (!form.subjectId || !form.startTime || !form.endTime) return;
    if (editing) {
      setEntries((prev) => prev.map((e) => (e.id === editing.id ? ({ ...e, ...form } as TimetableEntry) : e)));
      setEditing(null);
    } else {
      setEntries((prev) => [...prev, { ...(form as TimetableEntry), id: `t${Date.now()}` }]);
    }
    setForm({ day: "Monday", startTime: "09:00", endTime: "10:00", room: "", teacher: "", subjectId: mockSubjects[0].id, type: "lecture" });
  }

  function remove(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const list = filtered();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Timetable</h1>
          <p className="text-sm text-muted-foreground">Day & week view — add, edit, delete classes.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-lg border p-1 flex gap-1">
            <Button variant={view === "day" ? "secondary" : "ghost"} size="sm" onClick={() => setView("day")}>
              Day
            </Button>
            <Button variant={view === "week" ? "secondary" : "ghost"} size="sm" onClick={() => setView("week")}>
              Week
            </Button>
          </div>
          <Button
            size="sm"
            onClick={() => {
              if (editing) setEditing(null);
              setForm({ day, startTime: "09:00", endTime: "10:00", room: "", teacher: "", subjectId: mockSubjects[0].id, type: "lecture" });
              document.getElementById("timetable-form")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Add class
          </Button>
        </div>
      </div>

      {view === "day" && (
        <div className="flex gap-1 overflow-auto pb-1">
          {DAYS.map((d) => (
            <Button key={d} variant={day === d ? "default" : "outline"} size="sm" onClick={() => setDay(d)}>
              {d.slice(0, 3)}
            </Button>
          ))}
        </div>
      )}

      {view === "week" ? (
        <div className="grid lg:grid-cols-3 gap-4">
          {DAYS.slice(0, 6).map((d) => (
            <Card key={d}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{d}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 min-h-[120px]">
                {entries
                  .filter((e) => e.day === d)
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((e) => {
                    const subj = mockSubjects.find((s) => s.id === e.subjectId);
                    return (
                      <div key={e.id} className="rounded-lg border p-2.5 text-sm flex justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-medium truncate" style={{ color: subj?.color }}>
                            {subj?.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatTime(e.startTime)}–{formatTime(e.endTime)} • {e.room} • {e.type}
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditing(e);
                              setForm(e);
                              document.getElementById("timetable-form")?.scrollIntoView({ behavior: "smooth" });
                            }}
                          >
                            Edit
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => remove(e.id)}>
                            ×
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                {entries.filter((e) => e.day === d).length === 0 && <p className="text-xs text-muted-foreground py-4 text-center">No classes</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {list.length ? (
                list.map((e) => {
                  const subj = mockSubjects.find((s) => s.id === e.subjectId);
                  return (
                    <div key={e.id} className="flex items-center gap-3 p-3">
                      <span className="font-mono text-sm w-28">{formatTime(e.startTime)} – {formatTime(e.endTime)}</span>
                      <span className="h-2 w-2 rounded-full" style={{ background: subj?.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{subj?.name} <span className="font-normal text-muted-foreground">({e.type})</span></div>
                        <div className="text-xs text-muted-foreground">{e.room} • {e.teacher}</div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => { setEditing(e); setForm(e); }}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => remove(e.id)}>
                        Delete
                      </Button>
                    </div>
                  );
                })
              ) : (
                <p className="p-8 text-center text-sm text-muted-foreground">No classes for {day}.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card id="timetable-form">
        <CardHeader>
          <CardTitle className="text-sm">{editing ? "Edit class" : "Add class"}</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-3">
          <div>
            <Label>Subject</Label>
            <select
              className="flex h-9 w-full rounded-lg border bg-background px-3 text-sm"
              value={form.subjectId}
              onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
            >
              {mockSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} — {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Day</Label>
            <select className="flex h-9 w-full rounded-lg border bg-background px-3 text-sm" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value as DayOfWeek })}>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Type</Label>
            <select
              className="flex h-9 w-full rounded-lg border bg-background px-3 text-sm"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as TimetableEntry["type"] })}
            >
              <option value="lecture">Lecture</option>
              <option value="lab">Lab</option>
              <option value="tutorial">Tutorial</option>
            </select>
          </div>
          <div>
            <Label>Start</Label>
            <Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
          </div>
          <div>
            <Label>End</Label>
            <Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
          </div>
          <div>
            <Label>Room</Label>
            <Input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="LT-101" />
          </div>
          <div className="md:col-span-2">
            <Label>Teacher</Label>
            <Input value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} placeholder="Dr. Sharma" />
          </div>
          <div className="flex gap-2 items-end">
            <Button onClick={save} className="flex-1">
              {editing ? "Update" : "Add"}
            </Button>
            {editing && (
              <Button variant="outline" onClick={() => { setEditing(null); setForm({ day: "Monday", startTime: "09:00", endTime: "10:00", room: "", teacher: "", subjectId: mockSubjects[0].id, type: "lecture" }); }}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
