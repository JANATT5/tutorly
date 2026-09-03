// components/chat/ChatWidget.tsx
//
// A floating chat button + panel, mounted once in app/layout.tsx so it's
// available everywhere — matches where the home page's "AI features" promo
// already points. Talks to POST /api/chat (src/app/api/chat/route.ts),
// which runs a tool-calling loop against real Tutorly data (tutors,
// subjects, practice questions) via src/lib/ai/tools.ts, so answers are
// grounded in real rows instead of invented.
//
// Two honest limitations, on purpose rather than by oversight:
//  1. No persistence — the conversation lives only in this component's
//     state. Refresh the page and it's gone. A ChatMessage/Conversation
//     Prisma model could add real history later.
//  2. Responses are SLOW — this runs on a small local model (qwen3:4b via
//     Ollama, not a hosted GPT), measured at roughly 1 token/second on this
//     machine, and a question needing a tool call means two full model
//     generations back to back. A single reply can take 30–90+ seconds.
//     That's called out plainly in the UI (see the loading state below)
//     rather than pretending this is instant.

"use client";

import { useEffect, useRef, useState } from "react";
import { axiosPost, ApiError } from "@/lib/axios";

type ChatRole = "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I can help you find tutors, subjects, or practice questions on Tutorly. What are you looking for?",
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  async function handleSend() {
    const text = draft.trim();
    if (!text || isSending) return;

    const nextMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(nextMessages);
    setDraft("");
    setError(null);
    setIsSending(true);

    try {
      // The route only needs role/content for actual conversation turns —
      // the welcome message is local-only UI, so it's dropped here rather
      // than sent as if the assistant really said it mid-conversation.
      const response = await axiosPost<{ messages: ChatMessage[] }, ChatMessage>("chat", {
        messages: nextMessages.filter((m) => m !== WELCOME_MESSAGE),
      });
      if (response.data) {
        setMessages((prev) => [...prev, response.data as ChatMessage]);
      }
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't reach the assistant. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <div className="mb-3 flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-border bg-forest px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">Tutorly Assistant</p>
              <p className="text-xs text-white/70">Local AI · answers use real Tutorly data</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-forest text-white"
                      : "bg-secondary text-fg"
                  }`}
                >
                  {message.role === "assistant" && (
                    <span className="mb-1 block font-mono text-[0.65rem] uppercase tracking-wide text-forest">
                      AI
                    </span>
                  )}
                  {message.content}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl bg-secondary px-3.5 py-2.5 text-sm text-subtle">
                  <span className="mb-1 block font-mono text-[0.65rem] uppercase tracking-wide text-forest">
                    AI
                  </span>
                  Thinking… this runs on a local model and can take up to a minute.
                </div>
              </div>
            )}

            {error && <p className="text-center text-xs text-[#B3261E]">{error}</p>}
          </div>

          <div className="flex items-center gap-2 border-t border-border p-3">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              disabled={isSending}
              placeholder="Ask about tutors, subjects…"
              className="min-w-0 flex-1 rounded-full border border-border bg-white px-4 py-2 text-sm text-fg placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-forest disabled:opacity-60"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isSending || !draft.trim()}
              className="shrink-0 rounded-full bg-forest px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-amber text-2xl text-fg shadow-lg transition-transform hover:scale-105"
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}
