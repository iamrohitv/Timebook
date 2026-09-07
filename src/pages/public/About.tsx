export function About() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-10 prose prose-zinc dark:prose-invert">
      <h1 className="text-3xl font-bold tracking-tight">About Timebook</h1>
      <p className="text-muted-foreground">A student academic platform — timetable, attendance, notes, AI and community.</p>
      <h3>Why Timebook?</h3>
      <p>Students juggle timetables, attendance anxiety, scattered notes and AI tools. Timebook brings them together with a clean, fast website that works on desktop and mobile.</p>
      <h3>How it works (Phase 1)</h3>
      <ul>
        <li>Mock data lets you try every feature without a backend.</li>
        <li>Service layer abstracts mocks — swap in real API without rewriting UI.</li>
        <li>BYOK lets you use your own AI provider keys securely (frontend only for now; backend key vault is roadmap).</li>
      </ul>
      <h3>Roadmap</h3>
      <ol>
        <li>Phase 1: Website (this)</li>
        <li>Phase 2: Backend + auth + DB</li>
        <li>Phase 3: Real AI + RAG</li>
        <li>Phase 4: Community infra</li>
        <li>Phase 5: Mobile app</li>
      </ol>
    </div>
  );
}
