import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";

const features = [
  { title: "Timetable", desc: "Day/week view, add/edit/delete, room & teacher. Mobile-optimized." },
  { title: "Attendance", desc: "Overall + subject-wise %, history, target, can-miss maths." },
  { title: "Notes", desc: "Upload, search, filter, sort, grid/list. Subject-unit-topic taxonomy." },
  { title: "AI Notes", desc: "Turn any material into summary, revision, flashcards, MCQs." },
  { title: "AI Chat", desc: "Chat that will understand notes, timetable, attendance & syllabus." },
  { title: "Community", desc: "University hierarchy + upvote, download, report, contributor profiles." },
  { title: "BYOK", desc: "Use your own OpenAI / Gemini / Claude key. Provider abstraction ready." },
  { title: "Settings", desc: "Profile, academic, appearance, notifications, AI providers, privacy." },
];

export function Features() {
  return (
    <div className="mx-auto max-w-[1120px] px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Features</h1>
      <p className="text-muted-foreground mt-2 max-w-[60ch]">Phase 1 — website. Backend, real AI/RAG, community infra and mobile are planned next.</p>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <Card key={f.title}>
            <CardHeader>
              <CardTitle className="text-base">{f.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
