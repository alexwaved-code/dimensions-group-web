"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { ProductShot } from "@/components/product/ProductShot";
import { useEffect, useMemo, useRef, useState } from "react";
import type { L, Locale } from "@/lib/i18n";

export type SearchHit = { id: string; slug: string; name: L; image: string; skus: string[]; category: string };

export function SiteSearch({ lang, index }: { lang: Locale; index: SearchHit[] }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const zh = lang === "zh";

  const results = useMemo(() => rank(index, query).slice(0, 8), [index, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focus = window.setTimeout(() => input.current?.focus(), 40);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(focus);
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const go = (hit: SearchHit) => {
    close();
    router.push(`/${lang}/product/${hit.slug}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={zh ? "搜尋產品或型號" : "Search products or SKU"}
        className="flex h-9 w-9 items-center justify-center gap-2 rounded-full text-ink transition hover:bg-black/5 xl:w-[172px] xl:justify-start xl:bg-black/[0.04] xl:px-3.5 xl:text-mute xl:hover:bg-black/[0.07]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden className="shrink-0">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <span className="hidden flex-1 truncate text-left text-[12px] xl:inline">{zh ? "搜尋產品或型號" : "Search"}</span>
        <kbd className="hidden rounded border border-black/10 px-1 font-sans text-[10px] xl:inline">⌘K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] bg-ink/40 px-4 pt-[12vh] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              role="dialog"
              aria-label={zh ? "搜尋" : "Search"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: [0.28, 0.11, 0.32, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="mx-auto w-full max-w-[640px] overflow-hidden rounded-[24px] bg-paper shadow-[0_30px_80px_-24px_rgba(0,0,0,0.45)]"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const hit = results[active];
                  if (hit) go(hit);
                }}
              >
                <div className="flex items-center gap-3 border-b hairline px-5">
                  <svg className="shrink-0 text-mute" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                  </svg>
                  <input
                    ref={input}
                    aria-label={zh ? "搜尋產品名稱或 SKU 型號" : "Search by name or SKU"}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") close();
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
                      }
                      if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setActive((i) => Math.max(i - 1, 0));
                      }
                    }}
                    placeholder={zh ? "搜尋產品名稱或 SKU 型號" : "Search by name or SKU"}
                    className="h-14 w-full bg-transparent text-[16px] text-ink outline-none placeholder:text-mute"
                  />
                  <button type="button" onClick={close} className="text-[12px] text-mute">
                    {zh ? "關閉" : "Close"}
                  </button>
                </div>
              </form>

              <ul className="max-h-[min(420px,50vh)] overflow-y-auto p-2">
                {query.trim() && results.length === 0 && (
                  <li className="px-4 py-8 text-center text-[14px] text-mute">{zh ? "找不到相符的產品或型號。" : "No product or SKU matched."}</li>
                )}
                {!query.trim() && (
                  <li className="px-4 py-6 text-[13px] leading-relaxed text-mute">
                    {zh ? "可輸入產品名稱、產品編號或完整 SKU，例如 NPVC021GY。" : "Search a product name, model family or full SKU, for example NPVC021GY."}
                  </li>
                )}
                {results.map((hit, i) => {
                  const sku = matchedSku(hit, query);
                  return (
                    <li key={hit.id}>
                      <button
                        type="button"
                        onMouseEnter={() => setActive(i)}
                        onClick={() => go(hit)}
                        className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left ${i === active ? "bg-mist" : ""}`}
                      >
                        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                          <ProductShot src={hit.image} alt="" category={hit.category} sizes="56px" pad="p-1.5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] font-medium text-ink">{hit.name[lang]}</span>
                          <span className="mt-0.5 block text-[12px] tracking-wide text-gold">{sku}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function rank(index: SearchHit[], raw: string) {
  const q = raw.trim().toLowerCase();
  const compact = q.replace(/[\s-]/g, "");
  if (!compact) return [];
  return index
    .map((item) => ({ item, score: score(item, q, compact) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((row) => row.item);
}

function score(item: SearchHit, q: string, compact: string) {
  const skus = item.skus.map((s) => s.toLowerCase());
  const id = item.id.toLowerCase();
  if (skus.some((s) => s === compact) || id === compact) return 100;
  if (skus.some((s) => s.startsWith(compact)) || id.startsWith(compact)) return 80;
  if (skus.some((s) => s.includes(compact)) || id.includes(compact)) return 60;
  const name = `${item.name.en} ${item.name.zh}`.toLowerCase();
  if (name.includes(q)) return 40;
  const words = q.split(/\s+/).filter(Boolean);
  if (words.length > 1 && words.every((w) => name.includes(w))) return 30;
  return 0;
}

function matchedSku(item: SearchHit, raw: string) {
  const compact = raw.trim().toLowerCase().replace(/[\s-]/g, "");
  const found =
    item.skus.find((s) => s.toLowerCase() === compact) ??
    item.skus.find((s) => s.toLowerCase().startsWith(compact)) ??
    item.skus.find((s) => s.toLowerCase().includes(compact));
  return found ?? item.skus.find((s) => s.toLowerCase() !== item.id.toLowerCase()) ?? item.id.toUpperCase();
}
