"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import clsx from "clsx";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import { ProductShot } from "@/components/product/ProductShot";
import { QuickAdd } from "@/components/product/QuickAdd";
import type { ProductSummary } from "@/lib/catalog";
import type { L, Locale } from "@/lib/i18n";
import { whatsappLink } from "@/lib/site";

export type FinderChoice = {
  id: string;
  group?: string;
  name: L;
  why: L;
  uses: L[];
  items: (ProductSummary & { budget: L | null })[];
};

export type FinderMode = {
  id: string;
  label: L;
  groups?: { id: string; name: L }[];
  choices: FinderChoice[];
};

export function GiftFinder({ modes, lang }: { modes: FinderMode[]; lang: Locale }) {
  const zh = lang === "zh";
  const reduce = useReducedMotion();
  const { add } = useEnquiry();
  const [modeId, setModeId] = useState(modes[0].id);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [addedSet, setAddedSet] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.slice(1);
      const mode = modes.find((m) => m.id === hash || m.choices.some((c) => c.id === hash));
      if (!mode) return;
      setModeId(mode.id);
      if (mode.id !== hash) setPicked((p) => ({ ...p, [mode.id]: hash }));
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [modes]);

  const mode = modes.find((m) => m.id === modeId) ?? modes[0];
  const active = mode.choices.find((c) => c.id === picked[mode.id]) ?? mode.choices[0];
  const index = mode.choices.indexOf(active);
  const prev = mode.choices[(index - 1 + mode.choices.length) % mode.choices.length];
  const next = mode.choices[(index + 1) % mode.choices.length];
  const groupName = (id?: string) => mode.groups?.find((g) => g.id === id)?.name[lang];

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mode.choices;
    return mode.choices.filter((c) => [c.name.zh, c.name.en, ...c.uses.flatMap((x) => [x.zh, x.en])].join(" ").toLowerCase().includes(q));
  }, [mode, query]);

  const switchMode = (id: string) => {
    setModeId(id);
    setQuery("");
    setAddedSet(null);
    window.history.replaceState(null, "", `#${id}`);
  };

  const choose = (id: string, scroll = false) => {
    setPicked((p) => ({ ...p, [mode.id]: id }));
    setAddedSet(null);
    window.history.replaceState(null, "", `#${id}`);
    if (scroll && panel.current && window.innerWidth < 1024) {
      panel.current.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  };

  const addAll = () => {
    for (const p of active.items) {
      add({ productId: p.id, slug: p.slug, name: p.name, variant: p.variant, sku: p.sku, image: p.image, quantity: 100 });
    }
    setAddedSet(active.id);
  };

  const count = active.items.length;
  const waText = zh
    ? `您好，我想查詢「${active.name.zh}」的企業禮品建議：\n${active.items.map((p, n) => `${n + 1}. ${p.name.zh}${p.sku ? `（${p.sku}）` : ""}`).join("\n")}`
    : `Hello, I'd like a gift proposal for "${active.name.en}":\n${active.items.map((p, n) => `${n + 1}. ${p.name.en}${p.sku ? ` (${p.sku})` : ""}`).join("\n")}`;

  const row = (c: FinderChoice) => (
    <li key={c.id}>
      <button
        type="button"
        onClick={() => choose(c.id)}
        aria-pressed={c.id === active.id}
        className={clsx(
          "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-1.5 text-left text-[13.5px] transition",
          c.id === active.id ? "bg-ink font-medium text-white" : "text-ink-soft hover:bg-black/[0.05] hover:text-ink",
        )}
      >
        <span className="truncate">{c.name[lang]}</span>
        {c.id === active.id && <span aria-hidden>›</span>}
      </button>
    </li>
  );

  return (
    <div>
      {/* Mode tabs */}
      <div role="tablist" aria-label={zh ? "挑選方式" : "Ways to choose"} className="mb-4 grid grid-cols-3 gap-1.5 md:flex md:flex-wrap">
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={m.id === mode.id}
            onClick={() => switchMode(m.id)}
            className={clsx(
              "relative w-full rounded-full px-2 py-2 text-[12.5px] transition-colors md:w-auto md:px-4 md:text-[13.5px]",
              m.id === mode.id ? "text-white" : "bg-white text-ink-soft ring-1 ring-black/5 hover:text-ink",
            )}
          >
            {m.id === mode.id && (
              <motion.span
                layoutId="finder-mode"
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }}
                className="absolute inset-0 rounded-full bg-ink"
              />
            )}
            <span className="relative">
              {m.label[lang]}
              <span className={clsx("ml-1.5 text-[11px]", m.id === mode.id ? "text-white/60" : "text-mute")}>{m.choices.length}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="lg:grid lg:grid-cols-[272px_1fr] lg:gap-8">
        {/* Choice list */}
        <aside className="hidden lg:block">
          <div className="sticky top-[calc(var(--hdr)+16px)] transition-[top] duration-500">
            {mode.choices.length > 8 && (
              <label className="relative mb-3 block">
                <span className="sr-only">{zh ? "搜尋" : "Search"}</span>
                <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mute" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={zh ? `在「${mode.label.zh}」中搜尋` : `Search ${mode.label.en.toLowerCase()}`}
                  className="w-full rounded-full border hairline bg-white py-2.5 pl-11 pr-4 text-[14px] outline-none transition focus:border-gold"
                />
              </label>
            )}
            <div className="no-scrollbar max-h-[calc(100vh-var(--hdr)-7rem)] overflow-y-auto pb-4 pr-1">
              {mode.groups ? (
                mode.groups.map((g) => {
                  const list = visible.filter((c) => c.group === g.id);
                  if (!list.length) return null;
                  return (
                    <div key={g.id} className="mt-3 first:mt-0">
                      <p className="px-3 pb-1 text-[11px] font-medium tracking-wide text-mute">{g.name[lang]}</p>
                      <ul>{list.map(row)}</ul>
                    </div>
                  );
                })
              ) : (
                <ul>{visible.map(row)}</ul>
              )}
              {visible.length === 0 && (
                <p className="px-3 py-6 text-[13px] text-mute">
                  {zh ? "找不到相符項目，直接告訴我們您的需要，我們會為您建議。" : "Nothing matched — tell us what you need and we'll suggest gifts."}
                </p>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile picker */}
        <div className="lg:hidden">
          <label className="relative block">
            <span className="sr-only">{mode.label[lang]}</span>
            <select
              value={active.id}
              onChange={(e) => choose(e.target.value, true)}
              className="w-full appearance-none rounded-2xl bg-white py-3.5 pl-4 pr-10 text-[15px] font-medium text-ink ring-1 ring-black/10 outline-none focus:ring-gold"
            >
              {mode.groups
                ? mode.groups.map((g) => (
                    <optgroup key={g.id} label={g.name[lang]}>
                      {mode.choices
                        .filter((c) => c.group === g.id)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name[lang]}
                          </option>
                        ))}
                    </optgroup>
                  ))
                : mode.choices.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name[lang]}
                    </option>
                  ))}
            </select>
            <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mute" width="12" height="12" viewBox="0 0 10 10" aria-hidden>
              <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </label>
        </div>

        {/* Recommendation panel */}
        <div ref={panel} className="mt-4 scroll-mt-20 lg:mt-0">
          <motion.div
            key={`${mode.id}:${active.id}`}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.28, 0.11, 0.32, 1] }}
            className="rounded-[24px] bg-white p-5 ring-1 ring-black/5 md:p-7"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-gold">{groupName(active.group) ?? mode.label[lang]}</p>
                <h2 className="mt-1 text-[24px] font-semibold tracking-tight md:text-[28px]">{active.name[lang]}</h2>
                <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-ink-soft">{active.why[lang]}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {active.uses.map((x) => (
                    <span key={x.en} className="rounded-full bg-mist px-3 py-1 text-[12px] text-ink-soft">
                      {x[lang]}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 gap-2 md:flex-col">
                <button
                  type="button"
                  onClick={addAll}
                  className={clsx(
                    "flex-1 whitespace-nowrap rounded-full px-5 py-2.5 text-[13px] font-medium transition-colors",
                    addedSet === active.id ? "bg-gold text-white" : "bg-ink text-white hover:bg-black",
                  )}
                >
                  {addedSet === active.id ? (zh ? `✓ 已加入 ${count} 款` : `✓ ${count} added`) : zh ? `${count} 款全部加入查詢` : `Add all ${count} to enquiry`}
                </button>
                <a
                  href={whatsappLink(waText)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 whitespace-nowrap rounded-full px-5 py-2.5 text-center text-[13px] font-medium text-ink ring-1 ring-black/10 transition hover:ring-black/30"
                >
                  <span className="md:hidden">WhatsApp</span>
                  <span className="hidden md:inline">{zh ? "WhatsApp 詢問方案" : "Ask on WhatsApp"}</span>
                </a>
              </div>
            </div>

            <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
              {active.items.map((p) => (
                <li key={p.id} className="group relative">
                  <Link href={`/${lang}/product/${p.slug}`} className="block">
                    <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-mist">
                      <ProductShot src={p.image} alt={p.name[lang]} sizes="(min-width: 1024px) 260px, 45vw" pad="p-4" bg="bg-transparent" className="mix-blend-darken transition-transform duration-500 group-hover:scale-105" />
                    </span>
                    <span className="mt-2 line-clamp-2 block text-[13.5px] font-medium leading-snug text-ink">{p.name[lang]}</span>
                    <span className="mt-0.5 flex items-center justify-between gap-2 text-[11.5px] text-mute">
                      <span className="truncate">{p.budget ? `${zh ? "每件" : "Per unit"} ${p.budget[lang]}` : zh ? "按數量報價" : "Quoted by quantity"}</span>
                      <span className="hidden shrink-0 md:inline">{p.sku ?? ""}</span>
                    </span>
                  </Link>
                  <QuickAdd p={p} lang={lang} className="absolute right-2 top-2" />
                </li>
              ))}
            </ul>

            {mode.choices.length > 1 && (
              <div className="mt-6 flex items-center justify-between gap-3 border-t hairline pt-4 text-[13px]">
                <button type="button" onClick={() => choose(prev.id, true)} className="min-w-0 truncate text-mute transition hover:text-ink">
                  ‹ {prev.name[lang]}
                </button>
                <span className="shrink-0 text-[12px] tabular-nums text-mute">
                  {index + 1} / {mode.choices.length}
                </span>
                <button type="button" onClick={() => choose(next.id, true)} className="min-w-0 truncate text-right text-mute transition hover:text-ink">
                  {next.name[lang]} ›
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
