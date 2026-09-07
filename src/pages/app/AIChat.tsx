import { useState } from "react";
import { mockConversations } from "../../data/mockData";
import type { Conversation, Message } from "../../types";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAISettings } from "../../contexts/AIContext";
import { mockProviders } from "../../data/mockData";

function mockReply(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("deadlock")) return "Deadlock = circular wait. Four conditions: mutual exclusion, hold & wait, no preemption, circular wait. Fix: prevention (break one condition) or avoidance via Banker's algorithm.";
  if (lower.includes("normalization") || lower.includes("3nf")) return "3NF: table is in 2NF and no transitive dependency (non-key attribute depends only on key, not on another non-key).";
  if (lower.includes("attendance")) return "I can help with attendance maths — tell me present/total and target % and I'll compute can-miss / need-to-attend.";
  return `Mocked answer for: "${input.slice(0, 80)}". Connect a BYOK provider in Settings → AI to get real LLM responses. Future RAG will include your notes, timetable & attendance as context.`;
}

export function AIChat() {
  const [convs, setConvs] = useState<Conversation[]>(mockConversations);
  const [activeId, setActiveId] = useState<string>(convs[0]?.id ?? "");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const { activeProvider, configs } = useAISettings();
  const active = convs.find((c) => c.id === activeId) ?? null;
  const providerName = activeProvider ? mockProviders.find((p) => p.id === activeProvider)?.name : null;
  const hasKey = activeProvider ? !!configs.find((c) => c.providerId === activeProvider)?.apiKey : false;

  function newChat() {
    const c: Conversation = { id: `conv${Date.now()}`, title: "New conversation", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), messages: [] };
    setConvs((prev) => [c, ...prev]);
    setActiveId(c.id);
  }

  async function send() {
    if (!input.trim() || !active) return;
    const msg: Message = { id: `m${Date.now()}`, role: "user", content: input.trim(), createdAt: new Date().toISOString() };
    const updated: Conversation = { ...active, messages: [...active.messages, msg], title: active.messages.length === 0 ? input.slice(0, 40) : active.title, updatedAt: new Date().toISOString() };
    setConvs((prev) => prev.map((c) => (c.id === active.id ? updated : c)));
    setInput("");
    setSending(true);
    await new Promise((r) => setTimeout(r, 700));
    const reply: Message = { id: `m${Date.now() + 1}`, role: "assistant", content: mockReply(msg.content), createdAt: new Date().toISOString() };
    setConvs((prev) => prev.map((c) => (c.id === active.id ? { ...c, messages: [...updated.messages, reply] } : c)));
    setSending(false);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-7rem)]">
      {/* Sidebar */}
      <Card className="lg:w-[300px] flex flex-col shrink-0">
        <div className="p-3 border-b flex items-center justify-between">
          <span className="text-sm font-medium">Conversations</span>
          <Button size="sm" onClick={newChat}>+ New</Button>
        </div>
        <div className="flex-1 overflow-auto p-2 space-y-1">
          {convs.map((c) => (
            <button key={c.id} onClick={() => setActiveId(c.id)} className={`w-full text-left rounded-lg p-2.5 text-sm border ${activeId === c.id ? "bg-violet-600 text-white border-violet-600" : "hover:bg-zinc-50 dark:hover:bg-zinc-900"}`}>
              <div className="font-medium truncate">{c.title}</div>
              <div className={`text-xs truncate ${activeId === c.id ? "text-violet-100" : "text-muted-foreground"}`}>{c.messages[c.messages.length - 1]?.content.slice(0, 50) ?? "No messages yet"}</div>
            </button>
          ))}
        </div>
        <div className="p-3 border-t text-xs text-muted-foreground">
          {activeProvider ? (hasKey ? `Active: ${providerName} ✓` : `Active: ${providerName} — key missing`) : "BYOK: set provider in Settings → AI"}
        </div>
      </Card>

      {/* Chat */}
      <Card className="flex-1 flex flex-col min-h-[400px]">
        {!active ? (
          <CardContent className="flex-1 grid place-items-center text-sm text-muted-foreground">Select or create a conversation.</CardContent>
        ) : (
          <>
            <div className="p-3 border-b flex items-center gap-2">
              <span className="font-medium text-sm">{active.title}</span>
              <span className="text-xs text-muted-foreground">• Future context: notes, timetable, attendance</span>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {active.messages.length === 0 && (
                <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Start chatting</p>
                  <p className="mt-1">Try: “Explain deadlock with example” or “What is 3NF?”</p>
                  <div className="mt-3 flex flex-wrap gap-2 justify-center">
                    {["Explain deadlock", "What is 3NF?", "How much can I miss for 75%?"].map((s) => (
                      <Button key={s} variant="outline" size="sm" onClick={() => setInput(s)}>{s}</Button>
                    ))}
                  </div>
                </div>
              )}
              {active.messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${m.role === "user" ? "bg-violet-600 text-white rounded-br-sm" : "bg-zinc-100 dark:bg-zinc-800 rounded-bl-sm"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {sending && <div className="text-xs text-muted-foreground">Assistant is typing…</div>}
            </div>
            <div className="p-3 border-t flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything about your subjects…" onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
              <Button onClick={send} disabled={sending || !input.trim()}>Send</Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
