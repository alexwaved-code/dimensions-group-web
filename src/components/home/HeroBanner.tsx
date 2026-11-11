"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";
import clsx from "clsx";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import { ProductShot } from "@/components/product/ProductShot";
import type { ProductSummary } from "@/lib/catalog";
import type { L, Locale } from "@/lib/i18n";

export type BannerSlide = { id: string; name: L; mood: L; tag: L; tint: string; items: ProductSummary[] };

const EASE = [0.28, 0.11, 0.32, 1] as const;
const DURATION = 6500;

export function HeroBanner({ slides, lang }: { slides: BannerSlide[]; lang: Locale }) {
  const reduce = useReducedMotion();
  const { items: inList, add, setDrawer } = useEnquiry();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const [added, setAdded] = useState<string | null>(null);
  const zh = lang === "zh";
  const slide = slides[index];

  const go = useCallback(
    (next: number) => {
      setDir(next > index || (index === slides.length - 1 && next === 0) ? 1 : -1);
      setIndex((next + slides.length) % slides.length);
    },
    [index, slides.length],
  );

  useEffect(() => {
    if (reduce || paused || slides.length < 2) return;
    const t = window.setTimeout(() => go(index + 1), DURATION);
    return () => window.clearTimeout(t);
  }, [index, paused, reduce, go, slides.length]);

  if (!slide) return null;

  const addAll = () => {
    for (const p of slide.items) {
      if (!inList.some((i) => i.productId === p.id)) {
        add({ productId: p.id, slug: p.slug, name: p.name, variant: p.variant, sku: p.sku, image: p.image, quantity: 100 });
      }
    }
    setAdded(slide.id);
    setDrawer(true);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(index + 1);
    else if (info.offset.x > 60) go(index - 1);
  };

  const [hero, ...rest] = slide.items;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <motion.div
        className="relative overflow-hidden rounded-[32px]"
        animate={{ backgroundColor: slide.tint }}
        transition={{ duration: reduce ? 0 : 0.8, ease: EASE }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_60%,rgba(255,255,255,0.9),transparent_60%)]" />
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={slide.id}
            custom={dir}
            drag={reduce ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={onDragEnd}
            className="relative flex cursor-grab flex-col gap-4 p-5 active:cursor-grabbing md:grid md:min-h-[360px] md:grid-cols-[1fr_1.15fr] md:items-center md:gap-8 md:p-10"
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 40 * dir }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: -30 * dir }}
              transition={{ duration: 0.55, ease: EASE }}
              className="relative z-10"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[12px] font-medium text-ink-soft ring-1 ring-black/5">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                {zh ? "適合" : "For"} {slide.tag[lang]}
              </span>
              <h2 className="headline mt-3 text-[26px] md:mt-4 md:text-[48px]">{slide.name[lang]}</h2>
              <p className="mt-2 max-w-md text-[14px] leading-relaxed text-ink-soft md:mt-3 md:text-[17px]">{slide.mood[lang]}</p>
              <ul className="mt-5 hidden max-w-md grid-cols-2 gap-x-4 gap-y-1.5 text-[13px] text-ink-soft sm:grid">
                {slide.items.map((p) => (
                  <li key={p.id} className="flex items-center gap-2 truncate">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-ink/40" />
                    <Link href={`/${lang}/product/${p.slug}`} className="truncate hover:text-ink">
                      {p.name[lang]}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-center gap-2 md:mt-7 md:gap-3">
                <button
                  type="button"
                  onClick={addAll}
                  className="rounded-full bg-ink px-6 py-3 text-[14px] font-medium text-white transition hover:bg-black"
                >
                  {added === slide.id ? (zh ? "✓ 已加入查詢清單" : "✓ Added to enquiry") : zh ? "整套加入查詢" : "Add set to enquiry"}
                </button>
                <Link href={`/${lang}/gifting#${slide.id}`} className="rounded-full bg-white/80 px-5 py-3 text-[14px] font-medium text-ink ring-1 ring-black/5 transition hover:bg-white">
                  {zh ? "查看組合" : "View set"}
                </Link>
              </div>
            </motion.div>

            <div className="relative grid grid-cols-4 gap-2 md:h-[340px] md:grid-cols-[1.25fr_1fr] md:grid-rows-3 md:gap-3">
              {hero && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 30, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
                  className="md:row-span-3"
                >
                  <Link href={`/${lang}/product/${hero.slug}`} className="group relative block aspect-square overflow-hidden rounded-2xl bg-white shadow-[0_20px_40px_-30px_rgba(0,0,0,0.4)] md:aspect-auto md:h-full md:rounded-[26px] md:shadow-[0_30px_60px_-36px_rgba(0,0,0,0.45)]">
                    <ProductShot src={hero.image} alt={hero.name[lang]} sizes="(min-width: 768px) 320px, 50vw" pad="p-6" priority={index === 0} className="transition-transform duration-700 group-hover:scale-105" />
                  </Link>
                </motion.div>
              )}
              {rest.slice(0, 3).map((p, k) => (
                <motion.div
                  key={p.id}
                  initial={reduce ? false : { opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.55, ease: EASE, delay: 0.12 + k * 0.08 }}
                >
                  <Link href={`/${lang}/product/${p.slug}`} className="group relative block aspect-square overflow-hidden rounded-2xl bg-white shadow-[0_20px_40px_-30px_rgba(0,0,0,0.4)] md:aspect-auto md:h-full md:rounded-[20px]">
                    <ProductShot src={p.image} alt={p.name[lang]} sizes="200px" pad="p-2.5" className="transition-transform duration-700 group-hover:scale-105" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label={zh ? "上一個" : "Previous"}
          className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-ink shadow-sm ring-1 ring-black/5 backdrop-blur transition hover:bg-white md:grid"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label={zh ? "下一個" : "Next"}
          className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-ink shadow-sm ring-1 ring-black/5 backdrop-blur transition hover:bg-white md:grid"
        >
          ›
        </button>
      </motion.div>

      <div className="mt-3 grid grid-cols-3 gap-1.5 md:grid-cols-6 md:gap-2">
        {slides.map((s, i) => {
          const on = i === index;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => go(i)}
              aria-current={on ? "true" : undefined}
              className={clsx(
                "relative overflow-hidden rounded-2xl px-2.5 pb-2.5 pt-2 text-left transition md:px-4 md:pb-3 md:pt-2.5",
                on ? "bg-white shadow-[0_10px_30px_-20px_rgba(0,0,0,0.4)] ring-1 ring-black/5" : "hover:bg-white/60",
              )}
            >
              <span className={clsx("block truncate text-[12px] font-medium md:text-[13px]", on ? "text-ink" : "text-mute")}>{s.name[lang]}</span>
              <span className="hidden truncate text-[11px] text-mute md:block">{s.tag[lang]}</span>
              <span className="absolute inset-x-4 bottom-1.5 h-[2px] overflow-hidden rounded-full bg-black/[0.06]">
                {on && (
                  <motion.span
                    key={`${s.id}-${paused}`}
                    className="block h-full bg-gold"
                    initial={{ width: reduce || paused ? "100%" : "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: reduce || paused ? 0 : DURATION / 1000, ease: "linear" }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
