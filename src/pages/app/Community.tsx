import { useMemo, useState } from "react";
import { mockCommunityNotes, mockSubjects } from "../../data/mockData";
import type { CommunityNote } from "../../types";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { EmptyState } from "../../components/ui/EmptyState";

export function Community() {
  const [q, setQ] = useState("");
  const [branch, setBranch] = useState("all");
  const [sem, setSem] = useState("all");
  const [subject, setSubject] = useState("all");
  const [notes, setNotes] = useState<CommunityNote[]>(mockCommunityNotes);
  const [sort, setSort] = useState<"top" | "recent" | "downloads">("top");

  const filtered = useMemo(() => {
    let list = notes.filter((n) => {
      if (q && !`${n.title} ${n.contributor.name}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (branch !== "all" && n.branch !== branch) return false;
      if (sem !== "all" && String(n.semester) !== sem) return false;
      if (subject !== "all" && n.subjectId !== subject) return false;
      return true;
    });
    if (sort === "top") list = [...list].sort((a, b) => b.upvotes - a.upvotes);
    else if (sort === "downloads") list = [...list].sort((a, b) => b.downloads - a.downloads);
    else list = [...list].sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt));
    return list;
  }, [notes, q, branch, sem, subject, sort]);

  function upvote(id: string) {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, upvotes: n.hasUpvoted ? n.upvotes - 1 : n.upvotes + 1, hasUpvoted: !n.hasUpvoted } : n)));
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Community</h1>
        <p className="text-sm text-muted-foreground">Browse notes by University → College → Branch → Semester → Subject. Upvote, download, report.</p>
      </div>

      <Card>
        <CardContent className="p-3 flex flex-wrap gap-2">
          <Input placeholder="Search notes or contributor…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-[260px]" />
          <select className="rounded-lg border px-2 py-1 text-sm bg-background" value={branch} onChange={(e) => setBranch(e.target.value)}>
            <option value="all">All branches</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
          </select>
          <select className="rounded-lg border px-2 py-1 text-sm bg-background" value={sem} onChange={(e) => setSem(e.target.value)}>
            <option value="all">All sems</option>
            <option value="5">Sem 5</option>
            <option value="4">Sem 4</option>
          </select>
          <select className="rounded-lg border px-2 py-1 text-sm bg-background" value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="all">All subjects</option>
            {mockSubjects.map((s) => (
              <option key={s.id} value={s.id}>{s.code}</option>
            ))}
          </select>
          <select className="rounded-lg border px-2 py-1 text-sm bg-background" value={sort} onChange={(e) => setSort(e.target.value as never)}>
            <option value="top">Top</option>
            <option value="recent">Recent</option>
            <option value="downloads">Downloads</option>
          </select>
        </CardContent>
      </Card>

      <div className="rounded-xl border p-2 bg-zinc-50 dark:bg-zinc-900 text-xs flex gap-2 overflow-auto">
        {["University: DTU", "College: DTU Main", `Branch: ${branch === "all" ? "All" : branch}`, `Sem: ${sem === "all" ? "All" : sem}`, `Subject: ${subject === "all" ? "All" : subject}`].map((s) => (
          <span key={s} className="px-2 py-1 rounded-full bg-white dark:bg-zinc-800 border shrink-0">{s}</span>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No notes match" description="Try loosening filters." />
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {filtered.map((n) => (
            <Card key={n.id}>
              <CardContent className="p-4">
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full border">{mockSubjects.find((s) => s.id === n.subjectId)?.code}</span>
                  <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800">{n.branch} • Sem {n.semester}</span>
                  <span className="ml-auto">{n.fileType.toUpperCase()} • {n.fileSize}</span>
                </div>
                <div className="font-medium mt-2">{n.title}</div>
                <div className="text-xs text-muted-foreground mt-1">by {n.contributor.name} • {new Date(n.uploadedAt).toLocaleDateString()} • {n.university}</div>
                <div className="flex items-center gap-2 mt-3">
                  <Button size="sm" variant={n.hasUpvoted ? "default" : "outline"} onClick={() => upvote(n.id)}>▲ {n.upvotes}</Button>
                  <Button size="sm" variant="ghost">⬇ {n.downloads}</Button>
                  <Button size="sm" variant="ghost">Report</Button>
                  <Button size="sm" className="ml-auto">Download</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="p-4 flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium">Contribute</span>
          <span className="text-sm text-muted-foreground">Upload respects the same hierarchy.</span>
          <Button size="sm" className="ml-auto" onClick={() => alert("Upload is mocked for Phase 1 — will connect to backend in Phase 4.")}>Upload note</Button>
        </CardContent>
      </Card>
    </div>
  );
}
