import { useState } from "react";
import { mockNotes, mockSubjects } from "../../data/mockData";
import type { AIGenerationType } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

const TYPES: { id: AIGenerationType; label: string; desc: string }[] = [
  { id: "summary", label: "Summary", desc: "Concise overview" },
  { id: "detailed", label: "Detailed notes", desc: "Structured notes" },
  { id: "revision", label: "Revision", desc: "Exam revision" },
  { id: "keypoints", label: "Key points", desc: "Bullets" },
  { id: "flashcards", label: "Flashcards", desc: "Q/A cards" },
  { id: "mcqs", label: "MCQs", desc: "Practice" },
  { id: "questions", label: "Important Qs", desc: "Likely questions" },
];

function mockGenerate(type: AIGenerationType, title: string) {
  const map: Record<AIGenerationType, string> = {
    summary: `**Summary — ${title}**\n\n- Covers core concepts in ~300 words.\n- Key idea: Deadlocks need 4 conditions.\n- Use Banker's algorithm to avoid.\n\n(Mocked — connect BYOK to get real generation.)`,
    detailed: `# Detailed Notes — ${title}\n\n## 1. Introduction\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\n\n## 2. Core\n- Point A\n- Point B\n\n> Tip: Revise diagrams.\n\n(Mocked)`,
    revision: `**Revision — ${title}**\n\n1. Definition\n2. Conditions\n3. Prevention vs Avoidance\n4. Practice Qs\n\n(Mocked)`,
    keypoints: `- Deadlock = circular wait\n- 4 conditions\n- Prevention is strict, avoidance is dynamic\n\n(Mocked)`,
    flashcards: `Q: What is deadlock?\nA: Two processes wait forever for each other.\n\nQ: 4 conditions?\nA: ME, H&W, No preemption, Circular wait.\n\n(Mocked)`,
    mcqs: `1. Which is not a deadlock condition? a) ME b) Paging c) Circular wait d) H&W — Ans b\n2. Banker's algorithm is for? — Ans Avoidance\n\n(Mocked)`,
    questions: `1. Explain deadlock with example (10m)\n2. Compare prevention vs avoidance\n3. Solve RAG for given sequence\n\n(Mocked)`,
  };
  return map[type];
}

export function AINotes() {
  const [selected, setSelected] = useState<string>(mockNotes[0].id);
  const [type, setType] = useState<AIGenerationType>("summary");
  const [uploadText, setUploadText] = useState("");
  const [out, setOut] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const note = mockNotes.find((n) => n.id === selected);
  const subj = note ? mockSubjects.find((s) => s.id === note.subjectId) : undefined;

  async function generate() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const title = uploadText.trim() ? uploadText.slice(0, 40) : (note?.title ?? "Material");
    setOut(mockGenerate(type, title));
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">AI Notes</h1>
        <p className="text-sm text-muted-foreground">Select material + choose output. BYOK powers real generation; now mocked.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Source material</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 max-h-[320px] overflow-auto pr-1">
              {mockNotes.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelected(n.id)}
                  className={`w-full text-left rounded-lg border p-2.5 text-sm ${selected === n.id ? "border-violet-600 bg-violet-50 dark:bg-violet-950/30" : "hover:bg-zinc-50 dark:hover:bg-zinc-900"}`}
                >
                  <div className="font-medium line-clamp-1">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{mockSubjects.find((s) => s.id === n.subjectId)?.code} • {n.fileName}</div>
                </button>
              ))}
            </div>
            <div className="pt-3 border-t">
              <p className="text-xs font-medium mb-1">Or paste text / upload (mock)</p>
              <Input placeholder="Paste content or filename…" value={uploadText} onChange={(e) => setUploadText(e.target.value)} />
              <p className="text-xs text-muted-foreground mt-1">No file persists; mocked for UI.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Choose output</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`rounded-xl border p-3 text-left ${type === t.id ? "border-violet-600 bg-violet-50 dark:bg-violet-950/30" : "hover:bg-zinc-50 dark:hover:bg-zinc-900"}`}
                >
                  <div className="text-sm font-medium">{t.label}</div>
                  <div className="text-xs text-muted-foreground">{t.desc}</div>
                </button>
              ))}
            </div>

            <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 p-3 text-sm flex justify-between gap-2">
              <span>
                Source: <strong>{uploadText ? "Pasted material" : note?.title}</strong> {subj && `• ${subj.code}`}
              </span>
              <Button size="sm" onClick={generate} disabled={loading}>
                {loading ? "Generating…" : "Generate"}
              </Button>
            </div>

            <div className="rounded-xl border min-h-[280px] p-4 bg-white dark:bg-zinc-900">
              {!out ? (
                <div className="h-full grid place-items-center text-sm text-muted-foreground py-12 text-center">
                  <div>
                    <p className="font-medium text-foreground">No output yet</p>
                    <p className="mt-1">Select material and a type, then Generate.</p>
                  </div>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap font-sans text-sm leading-6">{out}</pre>
              )}
            </div>

            {out && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(out)}
                >
                  Copy
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setOut(null)}>
                  Clear
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
