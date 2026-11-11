"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import clsx from "clsx";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductSummary } from "@/lib/catalog";
import type { L, Locale } from "@/lib/i18n";

export type OccasionTab = { id: string; name: L; title: L; items: ProductSummary[] };

export function OccasionTabs({ tabs, lang }: { tabs: OccasionTab[]; lang: Locale }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(tabs[0]?.id);
  const tab = tabs.find((t) => t.id === active) ?? tabs[0];
  const zh = lang === "zh";
  if (!tab) return null;

  return (
    <div>
      <div role="tablist" className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const on = t.id === tab.id;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={on}
              onClick={() => setActive(t.id)}
              className={clsx("relative shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-colors", on ? "text-white" : "text-ink-soft hover:text-ink")}
            >
              {on && (
                <motion.span
                  layoutId="occasion-tab"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              {!on && <span className="absolute inset-0 rounded-full bg-black/[0.05]" />}
              <span className="relative">{t.name[lang]}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <p className="text-[15px] text-ink-soft">{tab.title[lang]}</p>
        <Link href={`/${lang}/gifting/${tab.id}`} className="shrink-0 text-[13px] font-medium text-gold hover:underline">
          {zh ? "場合詳情" : "Occasion details"} ›
        </Link>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={tab.id}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.28, 0.11, 0.32, 1] }}
          className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
        >
          {tab.items.map((p) => (
            <li key={p.id}>
              <ProductCard p={p} lang={lang} />
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
}
