"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { ProductShot } from "@/components/product/ProductShot";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/Logo";
import { OPEN_CHAT_EVENT } from "@/components/chat/OpenChatButton";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import type { Card, UiEvent } from "@/lib/agent/tools";
import type { Locale } from "@/lib/i18n";
import { whatsappLink } from "@/lib/site";

type Tool = { id: string; label: string; done: boolean; ok?: boolean };
type Msg = {
  id: string;
  role: "user" | "assistant";
  text: string;
  tools?: Tool[];
  cards?: Card[];
  added?: string;
  contact?: Extract<UiEvent, { kind: "contact" }>;
  error?: boolean;
};

const STORE = "dg-chat-v1";
const uid = () => Math.random().toString(36).slice(2, 10);

const COPY = {
  en: {
    title: "Dimensions Concierge",
    status: "AI assistant · replies instantly",
    hello: "Welcome to Dimensions Group. I can help you find products, plan corporate gifts, or prepare a quotation request.",
    placeholder: "Ask about products or gifting…",
    note: "AI replies may be imperfect. Quotations are confirmed by our sales team.",
    launch: "Ask our concierge",
    starters: [
      { label: "Find a product", prompt: "I'm looking for a product for my business." },
      { label: "Plan corporate gifts", prompt: "Help me plan corporate gifts for my team." },
      { label: "Certifications", prompt: "Which products have food-contact certifications?" },
      { label: "Talk to sales", prompt: "I'd like to speak with your sales team." },
    ],
    view: "View",
    add: "Add",
    added: "Added to your enquiry",
    openList: "Review list",
    reset: "New chat",
    close: "Close",
    send: "Send",
    email: "Email",
  },
  zh: {
    title: "Dimensions 產品顧問",
    status: "AI 助理 · 即時回覆",
    hello: "歡迎來到 Dimensions Group。我可以協助您搜尋產品、規劃企業禮品，或準備報價查詢。",
    placeholder: "查詢產品或禮品方案…",
    note: "AI 回覆或有不足之處，報價以銷售團隊確認為準。",
    launch: "AI 產品顧問",
    starters: [
      { label: "搜尋產品", prompt: "我想為公司採購一些產品。" },
      { label: "規劃企業禮品", prompt: "請協助我規劃企業禮品。" },
      { label: "產品認證", prompt: "哪些產品具備食品接觸認證？" },
      { label: "聯絡銷售", prompt: "我想聯絡你們的銷售團隊。" },
    ],
    view: "查看",
    add: "加入",
    added: "已加入查詢清單",
    openList: "查看清單",
    reset: "新對話",
    close: "關閉",
    send: "傳送",
    email: "電郵",
  },
} as const;

export function ChatWidget({ lang }: { lang: Locale }) {
  const c = COPY[lang];
  const router = useRouter();
  const pathname = usePathname();
  const enquiry = useEnquiry();
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [chips, setChips] = useState<{ label: string; prompt: string }[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE) ?? "null");
      if (Array.isArray(saved?.msgs)) setMsgs(saved.msgs);
    } catch {}
    const show = setTimeout(() => setHint(true), 3500);
    const hide = setTimeout(() => setHint(false), 11000);
    const openChat = () => setOpen(true);
    window.addEventListener(OPEN_CHAT_EVENT, openChat);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
      window.removeEventListener(OPEN_CHAT_EVENT, openChat);
    };
  }, []);

  useEffect(() => {
    if (!busy) sessionStorage.setItem(STORE, JSON.stringify({ msgs: msgs.slice(-30) }));
  }, [msgs, busy]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [msgs, chips, open]);

  useEffect(() => {
    if (open) setTimeout(() => field.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const patch = useCallback((id: string, fn: (m: Msg) => Msg) => {
    setMsgs((prev) => prev.map((m) => (m.id === id ? fn(m) : m)));
  }, []);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || busy) return;
      setInput("");
      setChips([]);
      setBusy(true);
      const user: Msg = { id: uid(), role: "user", text: content };
      const reply: Msg = { id: uid(), role: "assistant", text: "", tools: [] };
      const history = [...msgs, user].filter((m) => m.text && !m.error).map((m) => ({ role: m.role, content: m.text }));
      setMsgs((prev) => [...prev, user, reply]);

      const controller = new AbortController();
      abort.current = controller;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            messages: history,
            lang,
            page: pathname,
            basket: enquiry.items.map((i) => ({ name: i.name[lang], finish: i.variant[lang], quantity: i.quantity })),
          }),
        });
        if (!res.ok || !res.body) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "error");
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";
          for (const part of parts) {
            if (!part.startsWith("data:")) continue;
            const ev = JSON.parse(part.slice(5));
            if (ev.type === "delta") patch(reply.id, (m) => ({ ...m, text: m.text + ev.text }));
            else if (ev.type === "retract") patch(reply.id, (m) => ({ ...m, text: "" }));
            else if (ev.type === "error") patch(reply.id, (m) => ({ ...m, text: ev.message, error: true }));
            else if (ev.type === "tool")
              patch(reply.id, (m) => {
                const tools = m.tools ?? [];
                const found = tools.some((t) => t.id === ev.id);
                const next = { id: ev.id, label: ev.label, done: ev.status === "done", ok: ev.ok };
                return { ...m, tools: found ? tools.map((t) => (t.id === ev.id ? next : t)) : [...tools, next] };
              });
            else if (ev.type === "ui") {
              const ui = ev.ui as UiEvent;
              if (ui.kind === "products") patch(reply.id, (m) => ({ ...m, cards: ui.items }));
              else if (ui.kind === "contact") patch(reply.id, (m) => ({ ...m, contact: ui }));
              else if (ui.kind === "next") setChips(ui.actions);
              else if (ui.kind === "add") {
                enquiry.add(ui.item);
                patch(reply.id, (m) => ({ ...m, added: ui.item.name[lang] }));
              } else if (ui.kind === "navigate") router.push(ui.href);
            }
          }
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          const message = (error as Error).message;
          patch(reply.id, (m) => ({
            ...m,
            error: true,
            text: message && message !== "error" ? message : lang === "zh" ? "暫時未能連線，請稍後再試。" : "Could not connect. Please try again.",
          }));
        }
      } finally {
        setBusy(false);
        abort.current = null;
      }
    },
    [busy, msgs, lang, pathname, enquiry, patch, router],
  );

  const reset = () => {
    abort.current?.abort();
    setMsgs([]);
    setChips([]);
    setBusy(false);
    sessionStorage.removeItem(STORE);
  };

  const addCard = (card: Card) => {
    send(lang === "zh" ? `請把「${card.name.zh}」加入查詢清單。` : `Please add ${card.name.en} to my enquiry.`);
  };

  const waMessage = lang === "zh" ? "您好 Karson，我想查詢 Dimensions Group 的產品及報價。" : "Hello Karson, I would like to enquire about Dimensions Group products and pricing.";
  const last = msgs.at(-1);
  const showStarters = msgs.length === 0;

  return (
    <div className="no-print">
      <AnimatePresence>
        {!open && (
          <motion.div
            key="launcher"
            initial={{ opacity: 0, scale: 0.6, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 28, delay: open ? 0 : 0.2 }}
            className="fixed bottom-4 right-3 z-50 flex items-center gap-3 md:bottom-5 md:right-5"
          >
            <AnimatePresence>
              {hint && (
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onClick={() => setOpen(true)}
                  className="glass hidden rounded-full px-4 py-2.5 text-[13px] font-medium text-ink shadow-[0_8px_30px_-12px_rgba(0,0,0,0.35)] sm:block"
                >
                  {c.launch}
                </motion.button>
              )}
            </AnimatePresence>
            <button
              onClick={() => setOpen(true)}
              aria-label={c.launch}
              className="logo group relative grid h-11 w-11 place-items-center rounded-full bg-ink shadow-[0_14px_36px_-12px_rgba(0,0,0,0.55)] transition-transform duration-300 hover:scale-[1.06] active:scale-95 md:h-14 md:w-14"
            >
              <span className="absolute inset-0 animate-[chat-ring_3.2s_ease-out_infinite] rounded-full ring-1 ring-gold-soft/60" />
              <LogoMark tone="light" animated={false} className="h-7 w-7" />
              <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-ink bg-gold-soft" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.section
            key="panel"
            role="dialog"
            aria-label={c.title}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-paper sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[min(680px,calc(100vh-40px))] sm:w-[400px] sm:rounded-[28px] sm:border sm:border-line sm:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]"
          >
            <header className="flex items-center gap-3 bg-ink px-5 py-4 text-white">
              <div className="logo grid h-10 w-10 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10">
                <LogoMark tone="light" className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold tracking-tight">{c.title}</p>
                <p className="flex items-center gap-1.5 text-[11.5px] text-white/55">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-soft" />
                  {c.status}
                </p>
              </div>
              <IconButton label="WhatsApp" href={whatsappLink(waMessage)}>
                <WhatsAppIcon />
              </IconButton>
              <IconButton label={c.reset} onClick={reset}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />
                </svg>
              </IconButton>
              <IconButton label={c.close} onClick={() => setOpen(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </IconButton>
            </header>

            <div ref={scroller} className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-4 py-5">
              <Bubble role="assistant">{c.hello}</Bubble>

              {showStarters && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {c.starters.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => send(s.prompt)}
                      className="rounded-2xl border border-line bg-white px-3.5 py-3 text-left text-[13px] font-medium text-ink transition hover:border-gold-soft hover:shadow-[0_6px_20px_-12px_rgba(184,151,90,0.6)]"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}

              {msgs.map((m) => (
                <div key={m.id} className="space-y-2.5">
                  {m.tools && m.tools.length > 0 && (
                    <div className="space-y-1 pl-1">
                      {m.tools.map((t) => (
                        <p key={t.id} className="flex items-center gap-2 text-[12px] text-mute">
                          {t.done ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={t.ok === false ? "#c2410c" : "#b8975a"} strokeWidth="2.4" strokeLinecap="round">
                              <path d="M5 12.5l4.5 4.5L19 7.5" />
                            </svg>
                          ) : (
                            <span className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-gold/30 border-t-gold" />
                          )}
                          {t.label}
                        </p>
                      ))}
                    </div>
                  )}

                  {m.cards && m.cards.length > 0 && (
                    <div className="no-scrollbar -mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1">
                      {m.cards.map((card) => (
                        <ProductChip key={card.slug} card={card} lang={lang} onAdd={() => addCard(card)} c={c} disabled={busy} />
                      ))}
                    </div>
                  )}

                  {(m.text || (m.role === "assistant" && busy && m === last)) && (
                    <Bubble role={m.role} error={m.error}>
                      {m.text || <Typing />}
                    </Bubble>
                  )}

                  {m.added && (
                    <div className="flex items-center justify-between rounded-2xl border border-gold-soft/40 bg-[#fbf7ef] px-3.5 py-2.5 text-[12.5px]">
                      <span className="text-ink">
                        <span className="text-gold">✓</span> {c.added}
                      </span>
                      <Link href={`/${lang}/enquiry`} className="font-medium text-gold hover:underline">
                        {c.openList} ({enquiry.items.length})
                      </Link>
                    </div>
                  )}

                  {m.contact && (
                    <div className="rounded-2xl bg-ink p-4 text-white">
                      <p className="text-[14px] font-semibold">{m.contact.person}</p>
                      <p className="text-[12px] text-white/55">{lang === "zh" ? "產品市場及銷售主任" : "Product Marketing & Sales Executive"}</p>
                      <div className="mt-3 flex gap-2">
                        <a href={m.contact.whatsapp} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white py-2 text-[12.5px] font-medium text-ink">
                          <WhatsAppIcon /> {m.contact.whatsappDisplay}
                        </a>
                        <a href={`mailto:${m.contact.email}`} className="rounded-full border border-white/20 px-4 py-2 text-[12.5px] font-medium hover:border-gold-soft">
                          {c.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {chips.length > 0 && !busy && (
              <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
                {chips.map((chip) => (
                  <button
                    key={chip.prompt}
                    onClick={() => send(chip.prompt)}
                    className="shrink-0 rounded-full border border-line bg-white px-3.5 py-1.5 text-[12.5px] text-ink transition hover:border-gold-soft"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-line bg-white px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3"
            >
              <div className="flex items-end gap-2 rounded-[22px] border border-line bg-mist px-3.5 py-2 focus-within:border-gold-soft">
                <textarea
                  ref={field}
                  rows={1}
                  value={input}
                  maxLength={1000}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 110)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder={c.placeholder}
                  className="max-h-[110px] flex-1 resize-none bg-transparent py-1.5 text-[14px] text-ink outline-none placeholder:text-mute"
                />
                <button
                  type="submit"
                  aria-label={c.send}
                  disabled={!input.trim() || busy}
                  className={clsx(
                    "mb-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full transition",
                    input.trim() && !busy ? "bg-ink text-gold-soft" : "bg-line text-white",
                  )}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                </button>
              </div>
              <p className="mt-2 text-center text-[10.5px] text-mute">{c.note}</p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

function Bubble({ role, error, children }: { role: "user" | "assistant"; error?: boolean; children: React.ReactNode }) {
  return (
    <div className={clsx("flex", role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "max-w-[85%] whitespace-pre-wrap rounded-[20px] px-4 py-2.5 text-[14px] leading-relaxed",
          role === "user" ? "rounded-br-md bg-ink text-white" : "rounded-bl-md bg-white text-ink shadow-[0_1px_0_rgba(0,0,0,0.04)] ring-1 ring-line",
          error && "text-[#9a3412]",
        )}
      >
        {children}
      </div>
    </div>
  );
}

function ProductChip({
  card,
  lang,
  onAdd,
  c,
  disabled,
}: {
  card: Card;
  lang: Locale;
  onAdd: () => void;
  c: (typeof COPY)[Locale];
  disabled: boolean;
}) {
  return (
    <div className="w-[168px] shrink-0 snap-start overflow-hidden rounded-2xl bg-white ring-1 ring-line">
      <Link href={`/${lang}/product/${card.slug}`} className="block p-3">
        <div className="relative aspect-square overflow-hidden rounded-xl">
          <ProductShot src={card.image} alt={card.name[lang]} category={card.category} sizes="168px" pad="p-2" />
        </div>
      </Link>
      <div className="border-t border-line px-3 pb-3 pt-2.5">
        <p className="line-clamp-2 min-h-[34px] text-[12.5px] font-medium leading-snug text-ink">{card.name[lang]}</p>
        {card.sku && <p className="mt-0.5 text-[10.5px] tracking-wide text-mute">{card.sku}</p>}
        <div className="mt-2 flex gap-1.5">
          <Link href={`/${lang}/product/${card.slug}`} className="flex-1 rounded-full border border-line py-1 text-center text-[11.5px] font-medium text-ink hover:border-ink">
            {c.view}
          </Link>
          <button onClick={onAdd} disabled={disabled} className="flex-1 rounded-full bg-ink py-1 text-[11.5px] font-medium text-white disabled:opacity-40">
            + {c.add}
          </button>
        </div>
      </div>
    </div>
  );
}

function IconButton({ label, href, onClick, children }: { label: string; href?: string; onClick?: () => void; children: React.ReactNode }) {
  const cls = "grid h-8 w-8 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white";
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} title={label} className={cls}>
      {children}
    </a>
  ) : (
    <button type="button" onClick={onClick} aria-label={label} title={label} className={cls}>
      {children}
    </button>
  );
}

function Typing() {
  return (
    <span className="flex h-5 items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold-soft" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </span>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.6-.3Z" />
    </svg>
  );
}
