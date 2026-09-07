import { useMemo, useState } from "react";
import { mockNotes, mockSubjects } from "../../data/mockData";
import type { Note } from "../../types";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { EmptyState } from "../../components/ui/EmptyState";

export function Notes() {
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("all");
  const [type, setType] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<"recent" | "name">("recent");
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [uploadTitle, setUploadTitle] = useState("");

  const filtered = useMemo(() => {
    let list = notes.filter((n) => {
      if (subject !== "all" && n.subjectId !== subject) return false;
      if (type !== "all" && n.fileType !== type) return false;
      if (q && !`${n.title} ${n.topic} ${n.fileName}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    if (sort === "name") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    else list = [...list].sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt));
    return list;
  }, [notes, q, subject, type, sort]);

  function upload() {
    if (!uploadTitle.trim()) return;
    setNotes((prev) => [
      {
        id: `n${Date.now()}`,
        title: uploadTitle,
        subjectId: mockSubjects[0].id,
        fileName: uploadTitle.toLowerCase().replace(/\s+/g, "-") + ".pdf",
        fileType: "pdf",
        fileSize: "1.2 MB",
        uploadedAt: new Date().toISOString(),
        tags: [],
        ownerId: "u1",
      },
      ...prev,
    ]);
    setUploadTitle("");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Notes</h1>
          <p className="text-sm text-muted-foreground">Upload, search, filter, sort. Subject → Unit → Topic.</p>
        </div>
        <div className="flex gap-2">
          <Button variant={view === "grid" ? "secondary" : "outline"} size="sm" onClick={() => setView("grid")}>
            Grid
          </Button>
          <Button variant={view === "list" ? "secondary" : "outline"} size="sm" onClick={() => setView("list")}>
            List
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-3 flex flex-wrap gap-2">
          <Input placeholder="Search notes, topics…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-[260px]" />
          <select className="rounded-lg border px-2 py-1 text-sm bg-background" value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="all">All subjects</option>
            {mockSubjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code}
              </option>
            ))}
          </select>
          <select className="rounded-lg border px-2 py-1 text-sm bg-background" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">All types</option>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="pptx">PPTX</option>
            <option value="image">Image</option>
          </select>
          <select className="rounded-lg border px-2 py-1 text-sm bg-background" value={sort} onChange={(e) => setSort(e.target.value as never)}>
            <option value="recent">Recent</option>
            <option value="name">Name A-Z</option>
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 flex gap-2">
          <Input placeholder="New note title… (mock upload)" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} />
          <Button onClick={upload}>Upload</Button>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState title="No notes found" description="Try changing filters or upload a new note." />
      ) : view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((n) => {
            const subj = mockSubjects.find((s) => s.id === n.subjectId);
            return (
              <Card key={n.id} className="flex flex-col">
                <CardContent className="p-4 flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-full border">{subj?.code}</span>
                    <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800">Unit {n.unit ?? "-"}</span>
                    <span className="ml-auto uppercase text-[10px] tracking-wide">{n.fileType}</span>
                  </div>
                  <div className="font-medium mt-2 line-clamp-2">{n.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{n.topic ?? "General"} • {n.fileName} • {n.fileSize}</div>
                  <div className="text-xs text-muted-foreground mt-1">{new Date(n.uploadedAt).toLocaleDateString("en-IN")}</div>
                </CardContent>
                <div className="p-3 pt-0 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View
                  </Button>
                  <Button size="sm" variant="ghost">
                    Download
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0 divide-y">
            {filtered.map((n) => {
              const subj = mockSubjects.find((s) => s.id === n.subjectId);
              return (
                <div key={n.id} className="flex items-center gap-3 p-3">
                  <span className="h-8 w-8 rounded bg-zinc-100 dark:bg-zinc-800 grid place-items-center text-xs">{n.fileType.toUpperCase().slice(0, 3)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{n.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{subj?.code} • {n.fileName} • {n.fileSize}</div>
                  </div>
                  <span className="text-xs text-muted-foreground hidden sm:block">{new Date(n.uploadedAt).toLocaleDateString()}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
