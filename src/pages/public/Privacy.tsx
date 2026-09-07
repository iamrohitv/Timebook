export function Privacy() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-10">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mt-2">Last updated: 8 Sep 2026</p>
      <div className="prose prose-zinc dark:prose-invert mt-6">
        <p>This is a placeholder privacy policy for the Phase 1 website. Mock data is stored locally in your browser.</p>
        <h3>Data we handle</h3>
        <ul>
          <li>Auth is mocked — no real passwords are sent to a server.</li>
          <li>BYOK keys are stored in localStorage for now. Production will use a backend vault.</li>
          <li>Notes/uploads are mocked and not persisted.</li>
        </ul>
        <h3>Future</h3>
        <p>When backend arrives, this page will be replaced with a real policy.</p>
      </div>
    </div>
  );
}
export function Terms() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-10">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mt-2">Last updated: 8 Sep 2026</p>
      <div className="prose prose-zinc dark:prose-invert mt-6">
        <p>Placeholder terms for Phase 1. Use at your own risk; not a legal document.</p>
        <ul>
          <li>No warranty — mock data only.</li>
          <li>Community uploads are moderated via report.</li>
          <li>AI outputs may be inaccurate.</li>
        </ul>
      </div>
    </div>
  );
}
