"use client";

export const OPEN_CHAT_EVENT = "dg-open-chat";

export function OpenChatButton({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_CHAT_EVENT))}>
      {children}
    </button>
  );
}
