"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import type { ProductSummary } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";

export function QuickAdd({ p, lang, className }: { p: ProductSummary; lang: Locale; className?: string }) {
  const { items, add } = useEnquiry();
  const [flash, setFlash] = useState(false);
  const inList = items.some((i) => i.productId === p.id);
  const zh = lang === "zh";

  const onClick = () => {
    if (!inList) add({ productId: p.id, slug: p.slug, name: p.name, variant: p.variant, sku: p.sku, image: p.image, quantity: 100 });
    setFlash(true);
    setTimeout(() => setFlash(false), 1600);
  };

  const label = inList ? (zh ? "已在查詢清單" : "In your enquiry") : zh ? "加入查詢清單" : "Add to enquiry";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label}: ${p.name[lang]}`}
      className={clsx(
        "flex h-9 items-center gap-1.5 overflow-hidden rounded-full px-2.5 text-[12px] font-medium shadow-[0_4px_14px_-6px_rgba(0,0,0,0.3)] ring-1 backdrop-blur transition-colors",
        inList ? "bg-ink text-white ring-ink" : "bg-white/90 text-ink ring-black/5 hover:bg-ink hover:text-white",
        className,
      )}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        {inList ? <path d="m5 12.5 4.5 4.5L19 7.5" /> : <path d="M12 5v14M5 12h14" />}
      </svg>
      <AnimatePresence initial={false}>
        {flash && (
          <motion.span
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="whitespace-nowrap pr-1"
          >
            {zh ? "已加入" : "Added"}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
