"use client";

// Launcher only. The chat panel (react-markdown, framer-motion, message logic) is a separate
// chunk that loads when the visitor reaches for the button, so pages don't pay for it up front.
// Nothing here calls /api/chat; the model is only contacted when a message is sent.

import { useCallback, useState, type ComponentType } from "react";

type PanelProps = { open: boolean; onClose: () => void; onKeyboardInset: (px: number) => void };

let panelPromise: Promise<ComponentType<PanelProps>> | null = null;
const loadPanel = () => {
  if (!panelPromise) {
    panelPromise = import("./ChatPanel").then((m) => m.default).catch((err) => {
      panelPromise = null; // allow a retry after a failed chunk load
      throw err;
    });
  }
  return panelPromise;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [Panel, setPanel] = useState<ComponentType<PanelProps> | null>(null);
  const [keyboardInset, setKeyboardInset] = useState(0);

  const prefetch = () => {
    loadPanel().catch(() => {});
  };

  const toggle = async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    try {
      const Loaded = await loadPanel();
      setPanel(() => Loaded);
      setIsOpen(true);
    } catch {
      window.location.href = "mailto:contact@alliet.company";
    }
  };

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <div
      className="fixed right-4 sm:right-6 z-[100] flex flex-col items-end [--chat-bottom:1rem] sm:[--chat-bottom:1.5rem]"
      // Same offsets as before (bottom-4 / sm:bottom-6), but never under the iOS home indicator,
      // and lifted above the on-screen keyboard while typing.
      style={{ bottom: `calc(max(var(--chat-bottom), env(safe-area-inset-bottom)) + ${keyboardInset}px)` }}
    >
      {Panel && <Panel open={isOpen} onClose={close} onKeyboardInset={setKeyboardInset} />}

      {/* Floating Tooltip (Visible when chat is closed) */}
      {!isOpen && (
        <div className="mb-3 mr-1 bg-surface border border-border shadow-md px-4 py-2.5 rounded-2xl rounded-br-sm text-sm font-medium text-text-primary whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-500">
          Ask our AI assistant
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggle}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        onTouchStart={prefetch}
        className={`group relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border border-transparent overflow-hidden ${isOpen ? 'bg-surface text-primary border-border' : 'bg-primary text-surface'}`}
        aria-label={isOpen ? "Close chat" : "Open chat with the ALLIET assistant"}
        aria-expanded={isOpen}
        aria-controls="alliet-chat-panel"
      >
        {/* Hover Shine Effect */}
        <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none" />
        {isOpen ? (
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10" aria-hidden="true">
            <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src="/favicon.ico" alt="" width={32} height={32} className="w-8 h-8 object-contain rounded-full relative z-10" />
        )}
      </button>
    </div>
  );
}
