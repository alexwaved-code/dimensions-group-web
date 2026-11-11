"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import clsx from "clsx";
import { ProductCard } from "./ProductCard";
import { ProductShot } from "./ProductShot";
import type { CategoryId, ProductSummary } from "@/lib/catalog";
import { budgets } from "@/lib/gifts";
import type { L, Locale } from "@/lib/i18n";

export type ExplorerCategory = { id: CategoryId; name: L; cover: string };
type Band = "a" | "b" | "c" | "d";
type Sort = "featured" | "name" | "low" | "high";

const BANDS = budgets as { id: Band; label: L }[];
const RANK: Record<Band, number> = { a: 0, b: 1, c: 2, d: 3 };
const PAGE = 24;
const PREVIEW = 4;

const SORTS: { id: Sort; label: L }[] = [
  { id: "featured", label: { zh: "推薦排序", en: "Featured" } },
  { id: "name", label: { zh: "按名稱", en: "Name" } },
  { id: "low", label: { zh: "預算由低至高", en: "Budget: low to high" } },
  { id: "high", label: { zh: "預算由高至低", en: "Budget: high to low" } },
];

export function ProductExplorer({ items, categories, lang }: { items: ProductSummary[]; categories: ExplorerCategory[]; lang: Locale }) {
  const zh = lang === "zh";
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const [giftOnly, setGiftOnly] = useState(false);
  const [budget, setBudget] = useState<Band | null>(null);
  const [sort, setSort] = useState<Sort>("featured");
  const [limit, setLimit] = useState(PAGE);
  const [ready, setReady] = useState(false);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const b = params.get("budget");
    if (b && b in RANK) {
      setBudget(b as Band);
      setGiftOnly(true);
    }
    const c = params.get("cat");
    if (c && categories.some((x) => x.id === c)) setCat(c as CategoryId);
    const s = params.get("sort");
    if (s && SORTS.some((x) => x.id === s)) setSort(s as Sort);
    if (params.get("gift") === "1") setGiftOnly(true);
    const q = params.get("q");
    if (q) setQuery(q);
    setReady(true);
  }, [categories]);

  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams();
    if (cat !== "all") params.set("cat", cat);
    if (query.trim()) params.set("q", query.trim());
    if (budget) params.set("budget", budget);
    if (giftOnly) params.set("gift", "1");
    if (sort !== "featured") params.set("sort", sort);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [ready, cat, query, budget, giftOnly, sort]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((p) => {
      if (giftOnly && !p.giftable) return false;
      if (budget && p.band !== budget) return false;
      if (!q) return true;
      const hay = [p.name.en, p.name.zh, p.tagline.en, p.tagline.zh, p.id, ...p.skus, ...p.keywords].join(" ").toLowerCase();
      return q.split(/\s+/).every((w) => hay.includes(w));
    });
  }, [items, query, giftOnly, budget]);

  const counts = useMemo(() => {
    const map = new Map<CategoryId, number>();
    for (const p of matches) map.set(p.category, (map.get(p.category) ?? 0) + 1);
    return map;
  }, [matches]);

  const results = useMemo(() => {
    const list = cat === "all" ? matches : matches.filter((p) => p.category === cat);
    if (sort === "featured") return list;
    const sorted = [...list];
    if (sort === "name") sorted.sort((a, b) => a.name[lang].localeCompare(b.name[lang], zh ? "zh-Hant" : "en"));
    else {
      const dir = sort === "low" ? 1 : -1;
      sorted.sort((a, b) => {
        if (!a.band) return 1;
        if (!b.band) return -1;
        return (RANK[a.band] - RANK[b.band]) * dir;
      });
    }
    return sorted;
  }, [matches, cat, sort, lang, zh]);

  const grouped = cat === "all" && !query.trim() && !budget && sort === "featured";
  const view = [cat, budget, giftOnly, sort].join("|");
  const filtersOn = cat !== "all" || Boolean(query.trim()) || Boolean(budget) || giftOnly || sort !== "featured";

  const jump = () => {
    const el = top.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const pick = (c: CategoryId | "all") => {
    setCat(c);
    setLimit(PAGE);
    jump();
  };

  const reset = () => {
    setCat("all");
    setQuery("");
    setBudget(null);
    setGiftOnly(false);
    setSort("featured");
    setLimit(PAGE);
  };

  const nameOf = (id: CategoryId) => categories.find((c) => c.id === id)?.name[lang] ?? "";

  return (
    <div ref={top} className="scroll-mt-20 lg:grid lg:grid-cols-[232px_1fr] lg:gap-10">
      {/* Sidebar */}
      <aside className="hidden lg:block">
        <div className="no-scrollbar sticky top-[calc(var(--hdr)+16px)] max-h-[calc(100vh-var(--hdr)-2rem)] transition-[top] duration-500 space-y-7 overflow-y-auto pb-6">
          <SearchBox value={query} onChange={(v) => { setQuery(v); setLimit(PAGE); }} zh={zh} />

          <div>
            <p className="eyebrow mb-2 text-mute">{zh ? "類別" : "Category"}</p>
            <ul className="space-y-0.5">
              <li>
                <SideRow active={cat === "all"} onClick={() => pick("all")} label={zh ? "全部產品" : "All products"} count={matches.length}>
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-[10px] font-semibold text-white">{zh ? "全" : "All"}</span>
                </SideRow>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <SideRow active={cat === c.id} onClick={() => pick(c.id)} label={c.name[lang]} count={counts.get(c.id) ?? 0}>
                    <span className="relative block h-7 w-7 overflow-hidden rounded-full bg-mist">
                      <ProductShot src={c.cover} alt="" sizes="28px" pad="p-0.5" bg="bg-transparent" className="mix-blend-darken" />
                    </span>
                  </SideRow>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-2 text-mute">{zh ? "每件預算" : "Budget per gift"}</p>
            <div className="flex flex-wrap gap-1.5">
              {BANDS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => { setBudget((cur) => (cur === b.id ? null : b.id)); setLimit(PAGE); }}
                  className={clsx(
                    "rounded-full px-3 py-1.5 text-[12px] transition",
                    budget === b.id ? "bg-gold text-white" : "bg-white text-ink-soft ring-1 ring-black/10 hover:ring-black/25",
                  )}
                >
                  {b.label[lang]}
                </button>
              ))}
            </div>
          </div>

          <Toggle checked={giftOnly} onChange={setGiftOnly} label={zh ? "只顯示適合送禮產品" : "Gift-ready only"} />

          {filtersOn && (
            <button type="button" onClick={reset} className="text-[13px] font-medium text-gold hover:underline">
              {zh ? "清除所有篩選" : "Clear all filters"}
            </button>
          )}
        </div>
      </aside>

      <div className="min-w-0">
        {/* Mobile filters */}
        <div className="sticky top-[var(--hdr)] z-30 -mx-5 border-b hairline glass px-4 py-3 transition-[top] duration-500 md:-mx-8 md:px-8 lg:hidden">
          <SearchBox value={query} onChange={(v) => { setQuery(v); setLimit(PAGE); }} zh={zh} />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Select
              label={zh ? "類別" : "Category"}
              value={cat}
              onChange={(v) => pick(v as CategoryId | "all")}
              options={[{ id: "all", label: zh ? "全部類別" : "All categories" }, ...categories.map((c) => ({ id: c.id, label: `${c.name[lang]} ${counts.get(c.id) ?? 0}` }))]}
            />
            <Select
              label={zh ? "預算" : "Budget"}
              value={budget ?? ""}
              onChange={(v) => { setBudget(v ? (v as Band) : null); setLimit(PAGE); }}
              options={[{ id: "", label: zh ? "全部預算" : "Any budget" }, ...BANDS.map((b) => ({ id: b.id, label: b.label[lang] }))]}
            />
          </div>
        </div>

        {/* Toolbar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 lg:mt-0">
          <label className="flex items-center gap-2 text-[13px] text-ink-soft lg:hidden">
            <input type="checkbox" checked={giftOnly} onChange={(e) => setGiftOnly(e.target.checked)} className="accent-[#b8975a]" />
            {zh ? "只看適合送禮" : "Gift-ready only"}
          </label>
          <div className="flex flex-wrap items-center gap-2 text-[13px]">
            <span className="font-medium text-ink">
              {results.length} {zh ? "款產品" : results.length === 1 ? "product" : "products"}
            </span>
            {cat !== "all" && <Pill onClear={() => pick("all")}>{nameOf(cat)}</Pill>}
            {budget && <Pill onClear={() => setBudget(null)}>{BANDS.find((b) => b.id === budget)?.label[lang]}</Pill>}
            {query.trim() && <Pill onClear={() => setQuery("")}>「{query.trim()}」</Pill>}
            {giftOnly && <Pill onClear={() => setGiftOnly(false)}>{zh ? "適合送禮" : "Gift-ready"}</Pill>}
          </div>
          <label className="relative flex items-center gap-2 text-[13px] text-mute">
            <span className="sr-only">{zh ? "排序" : "Sort"}</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="appearance-none rounded-full bg-white py-2 pl-4 pr-9 text-[13px] text-ink ring-1 ring-black/10 outline-none transition hover:ring-black/25 focus:ring-gold"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label[lang]}
                </option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3.5 text-mute" width="10" height="10" viewBox="0 0 10 10" aria-hidden>
              <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </label>
        </div>

        {/* Results */}
        {grouped ? (
          <motion.div key="grouped" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="mt-6 space-y-10">
            {categories.map((c) => {
              const list = results.filter((p) => p.category === c.id);
              if (!list.length) return null;
              return (
                <section key={c.id} aria-labelledby={`cat-${c.id}`}>
                  <div className="mb-4 flex items-center justify-between gap-4 border-b hairline pb-3">
                    <div className="flex items-center gap-3">
                      <span className="relative block h-10 w-10 overflow-hidden rounded-full bg-mist">
                        <ProductShot src={c.cover} alt="" sizes="40px" pad="p-1" bg="bg-transparent" className="mix-blend-darken" />
                      </span>
                      <h2 id={`cat-${c.id}`} className="text-[20px] font-semibold tracking-tight md:text-[22px]">
                        {c.name[lang]}
                        <span className="ml-2 text-[13px] font-normal text-mute">{list.length}</span>
                      </h2>
                    </div>
                    {list.length > PREVIEW && (
                      <button type="button" onClick={() => pick(c.id)} className="shrink-0 text-[13px] font-medium text-gold hover:underline">
                        {zh ? `查看全部 ${list.length} 款` : `View all ${list.length}`} ›
                      </button>
                    )}
                  </div>
                  <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                    {list.slice(0, PREVIEW).map((p) => (
                      <li key={p.id}>
                        <ProductCard p={p} lang={lang} />
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </motion.div>
        ) : (
          <>
            <ul key={view} className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
              {results.slice(0, limit).map((p, i) => (
                <motion.li
                  key={p.id}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i % PAGE, 11) * 0.025, ease: [0.28, 0.11, 0.32, 1] }}
                >
                  <ProductCard p={p} lang={lang} />
                </motion.li>
              ))}
            </ul>

            {results.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-[15px] text-mute">
                  {zh ? "找不到相符產品，請嘗試其他關鍵字，或直接聯絡我們。" : "No matching products. Try another keyword, or contact us directly."}
                </p>
                <button type="button" onClick={reset} className="mt-4 text-[14px] font-medium text-gold hover:underline">
                  {zh ? "清除所有篩選" : "Clear all filters"}
                </button>
              </div>
            )}

            {limit < results.length && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setLimit((l) => l + PAGE)}
                  className="rounded-full border border-ink/15 px-7 py-3 text-[14px] font-medium transition hover:border-ink/40"
                >
                  {zh ? `顯示更多（尚餘 ${results.length - limit} 款）` : `Show more (${results.length - limit} remaining)`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SearchBox({ value, onChange, zh }: { value: string; onChange: (v: string) => void; zh: boolean }) {
  return (
    <label className="relative block">
      <span className="sr-only">{zh ? "搜尋產品" : "Search products"}</span>
      <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mute" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={zh ? "產品名稱或型號" : "Name or model"}
        className="w-full rounded-full border hairline bg-white py-2.5 pl-11 pr-4 text-[14px] outline-none transition focus:border-gold"
      />
    </label>
  );
}

function SideRow({ active, onClick, label, count, children }: { active: boolean; onClick: () => void; label: string; count: number; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        "flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left text-[14px] transition",
        active ? "bg-white font-medium text-ink shadow-[0_4px_16px_-8px_rgba(0,0,0,0.2)] ring-1 ring-black/5" : "text-ink-soft hover:bg-black/[0.04]",
        count === 0 && !active && "opacity-40",
      )}
    >
      {children}
      <span className="flex-1 truncate">{label}</span>
      <span className="text-[12px] text-mute">{count}</span>
    </button>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex w-full items-center justify-between gap-3 text-[13px] text-ink-soft">
      {label}
      <span className={clsx("relative h-5 w-9 shrink-0 rounded-full transition-colors", checked ? "bg-gold" : "bg-black/15")}>
        <span className={clsx("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-[left]", checked ? "left-[18px]" : "left-0.5")} />
      </span>
    </button>
  );
}

function Pill({ children, onClear }: { children: React.ReactNode; onClear: () => void }) {
  return (
    <button type="button" onClick={onClear} className="flex items-center gap-1.5 rounded-full bg-ink/[0.06] px-3 py-1 text-[12px] text-ink-soft transition hover:bg-ink/10">
      {children}
      <span aria-hidden className="text-mute">×</span>
    </button>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { id: string; label: string }[] }) {
  return (
    <label className="relative block min-w-0">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none truncate rounded-full bg-white py-2.5 pl-3 pr-8 text-[13px] text-ink ring-1 ring-black/10 outline-none focus:ring-gold"
      >
        {options.map((o) => (
          <option key={o.id || "any"} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-mute" width="10" height="10" viewBox="0 0 10 10" aria-hidden>
        <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </label>
  );
}
