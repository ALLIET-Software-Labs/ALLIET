"use client";

// Loaded on demand by <Chatbot> (the launcher), so react-markdown and framer-motion never
// ship with the initial page. Stays mounted after the first open to keep the conversation.

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";

type Message = {
  role: "user" | "assistant";
  content: string;
  /** Server signature for assistant replies; unsigned turns are ignored by /api/chat. */
  sig?: string;
};

const STARTER_QUESTIONS = [
  "What does ALLIET do?",
  "What services do you offer?",
  "Show me some of your work.",
  "What AI capabilities do you have?",
];

const GREETING: Message = { role: "assistant", content: "Hi. I'm the ALLIET assistant. How can I help you today?" };

// Model output is untrusted: only same-site paths, alliet.company and the contact address become
// links. Anything else renders as plain text. (react-markdown already ignores raw HTML.)
function safeUrl(url: string) {
  const safe = defaultUrlTransform(url);
  if (!safe) return "";
  if (safe.startsWith("/") && !safe.startsWith("//")) return safe;
  if (safe.startsWith("#")) return safe;
  if (safe === "mailto:contact@alliet.company") return safe;
  try {
    const u = new URL(safe);
    if (u.protocol === "https:" && (u.hostname === "alliet.company" || u.hostname === "www.alliet.company")) return safe;
  } catch {}
  return "";
}

type Props = {
  open: boolean;
  onClose: () => void;
  /** Pixels the on-screen keyboard currently covers (mobile), so the launcher can lift the panel. */
  onKeyboardInset: (px: number) => void;
};

export default function ChatPanel({ open, onClose, onKeyboardInset }: Props) {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom only when the user sends a message (isLoading goes true)
  useEffect(() => {
    const el = scrollRef.current;
    if (el && isLoading) {
      setTimeout(() => { el.scrollTop = el.scrollHeight; }, 50);
    }
  }, [isLoading]);

  // Auto-scroll to bottom when the chat panel is opened
  useEffect(() => {
    const el = scrollRef.current;
    if (el && open) {
      setTimeout(() => { el.scrollTop = el.scrollHeight; }, 50);
    }
  }, [open]);

  // Focus the input when opened.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, [open]);

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Mobile browsers overlay the keyboard on the layout viewport; lift the panel above it.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!open || !vv) return;
    const update = () => onKeyboardInset(Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop)));
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      onKeyboardInset(0);
    };
  }, [open, onKeyboardInset]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text.trim() };
    const history = [...messages, userMessage];
    setMessages(history);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The greeting is static and unsigned, so it isn't sent.
        body: JSON.stringify({ messages: history.filter((m) => m !== GREETING).slice(-8) }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || typeof data.message !== "string") {
        throw new Error(typeof data.error === "string" ? data.error : "Sorry, I encountered an error. Please try again later.");
      }
      setMessages((prev) => [...prev, { role: "assistant", content: data.message, sig: data.sig }]);
    } catch (error) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: error instanceof Error ? error.message : "Sorry, I encountered an error. Please try again later.",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <motion.div
            id="alliet-chat-panel"
            role="dialog"
            aria-label="Ask ALLIET chat"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-surface border border-border shadow-2xl rounded-xl w-[calc(100vw-2rem)] sm:w-[380px] h-[500px] max-h-[calc(100dvh-8rem)] flex flex-col mb-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-surface p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse motion-reduce:animate-none" />
                <span className="font-semibold text-sm tracking-wide">Ask ALLIET</span>
              </div>
              <button
                onClick={onClose}
                className="text-surface/70 hover:text-surface transition-colors p-1"
                aria-label="Close chat"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              role="log"
              aria-live="polite"
              className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 bg-surface-alt/30"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed break-words ${msg.role === "user"
                      ? "bg-primary text-surface rounded-tr-sm"
                      : "bg-surface border border-border text-text-primary rounded-tl-sm shadow-sm"
                      }`}
                  >
                    {msg.role === "assistant" ? (
                      <ReactMarkdown
                        skipHtml
                        urlTransform={safeUrl}
                        disallowedElements={["img"]}
                        components={{
                          ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                          li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                          a: ({ node, href, ...props }) =>
                            href ? (
                              <a
                                className="text-primary underline hover:text-primary/70 transition-colors"
                                href={href}
                                {...(href.startsWith("/") || href.startsWith("#") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                                {...props}
                              />
                            ) : (
                              <span {...props} />
                            ),
                          strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start" aria-label="Assistant is typing">
                  <div className="bg-surface border border-border p-4 rounded-lg rounded-tl-sm shadow-sm flex gap-1">
                    <div className="w-1.5 h-1.5 bg-text-secondary/50 rounded-full animate-bounce motion-reduce:animate-none" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-text-secondary/50 rounded-full animate-bounce motion-reduce:animate-none" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-text-secondary/50 rounded-full animate-bounce motion-reduce:animate-none" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Starter Questions (only show if no user messages yet) */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2 bg-surface-alt/30">
                {STARTER_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="text-[11px] bg-surface border border-border hover:border-primary/30 hover:bg-primary/5 text-text-secondary px-2 py-1.5 rounded transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-surface border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="relative"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  aria-label="Ask a question about ALLIET"
                  enterKeyHint="send"
                  autoComplete="off"
                  // 16px on mobile prevents iOS Safari from zooming the page when the input is focused.
                  className="w-full bg-surface-alt border border-border rounded-lg pl-4 pr-10 py-3 text-base sm:text-sm focus:outline-none focus:border-primary transition-colors"
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary disabled:text-text-secondary/50 transition-colors"
                  aria-label="Send message"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
