"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import clsx from "clsx";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import { ProductShot } from "@/components/product/ProductShot";
import type { L, Locale } from "@/lib/i18n";

export type BundleItem = { id: string; slug: string; name: L; image: string; sku: string | null; variant: L };
export type Bundle = { id: string; name: L; mood: L; tag: L; tint: string; items: BundleItem[] };

const EASE = [0.28, 0.11, 0.32, 1] as const;

export function HeroBundles({ lang, bundles }: { lang: Locale; bundles: Bundle[] }) {
  const { items: list, add, setDrawer } = useEnquiry();
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const [added, setAdded] = useState<string | null>(null);
  const bundle = bundles[index];
  const zh = lang === "zh";
  const allIn = bundle.items.every((i) => list.some((x) => x.productId === i.id));

  useEffect(() => {
    if (reduce || held || bundles.length < 2) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % bundles.length), 6500);
    return () => window.clearInterval(timer);
  }, [reduce, held, bundles.length]);

  const addAll = () => {
    for (const i of bundle.items) {
      if (!list.some((x) => x.productId === i.id)) add({ productId: i.id, slug: i.slug, name: i.name, variant: i.variant, sku: i.sku, image: i.image, quantity: 100 });
    }
    setAdded(bundle.id);
    setHeld(true);
  };

  return (
    <div className="flex flex-col" onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)}>
      <div className="flex items-baseline justify-between">
        <p className="text-[13px] font-semibold text-ink">{zh ? "精選禮品組合" : "Curated gift bundles"}</p>
        <Link href={`/${lang}/gifting#sets`} className="text-[12px] font-medium text-gold hover:underline">
          {zh ? "全部組合" : "All bundles"} ›
        </Link>
      </div>
      <div className="no-scrollbar -mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {bundles.map((b, i) => {
          const on = i === index;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => {
                setIndex(i);
                setHeld(true);
              }}
              aria-pressed={on}
              className={clsx("relative shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] transition-colors", on ? "text-white" : "text-ink-soft hover:text-ink")}
            >
              {on && <motion.span layoutId="bundle-pill" className="absolute inset-0 rounded-full bg-ink" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }} />}
              <span className="relative">{b.name[lang]}</span>
            </button>
          );
        })}
      </div>

      <div className="relative mt-3 overflow-hidden rounded-[28px] bg-white ring-1 ring-black/5 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.35)]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={bundle.id}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="grid gap-0 sm:grid-cols-[1.25fr_1fr]"
          >
            <div className="relative isolate grid grid-cols-2 gap-2 p-3" style={{ background: `radial-gradient(ellipse at 50% 85%, ${bundle.tint} 0%, #ffffff 78%)` }}>
              {bundle.items.map((item, k) => (
                <motion.div
                  key={item.id}
                  initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, delay: k * 0.05, ease: EASE }}
                >
                  <Link href={`/${lang}/product/${item.slug}`} className="group relative block aspect-square overflow-hidden rounded-2xl" title={item.name[lang]}>
                    <ProductShot src={item.image} alt={item.name[lang]} sizes="160px" pad="p-3" bg="bg-transparent" className="mix-blend-darken transition-transform duration-700 group-hover:scale-105" />
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-col p-5 sm:p-6">
              <span className="self-start rounded-full bg-mist px-2.5 py-1 text-[11px] font-medium text-ink-soft">{bundle.tag[lang]}</span>
              <p className="mt-3 text-[20px] font-semibold leading-tight tracking-tight">{bundle.name[lang]}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{bundle.mood[lang]}</p>
              <ul className="mt-3 space-y-1 text-[12px] text-mute">
                {bundle.items.map((item) => (
                  <li key={item.id} className="truncate">
                    · {item.name[lang]}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-4">
                {allIn ? (
                  <button type="button" onClick={() => setDrawer(true)} className="w-full rounded-full bg-ink py-2.5 text-[13px] font-medium text-white transition hover:bg-black">
                    {added === bundle.id ? (zh ? "✓ 已加入・查看清單" : "✓ Added · View list") : zh ? "已在清單・查看" : "In your list · View"}
                  </button>
                ) : (
                  <button type="button" onClick={addAll} className="w-full rounded-full bg-ink py-2.5 text-[13px] font-medium text-white transition hover:bg-black">
                    {zh ? "整套加入查詢" : "Add bundle to enquiry"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {bundles.map((b, i) => (
          <span key={b.id} className={clsx("h-1 rounded-full transition-all duration-500", i === index ? "w-5 bg-ink" : "w-1.5 bg-black/15")} />
        ))}
      </div>
    </div>
  );
}
