"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import { ProductShot } from "@/components/product/ProductShot";
import type { Product } from "@/lib/catalog";
import type { Dict, Locale } from "@/lib/i18n";
import { whatsappLink } from "@/lib/site";

const QUICK_QTY = [50, 100, 300, 500, 1000];

export function ProductHero({ p, lang, d, categoryName }: { p: Product; lang: Locale; d: Dict; categoryName: string }) {
  const { add } = useEnquiry();
  const [variantIndex, setVariantIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(100);
  const [added, setAdded] = useState(false);
  const variant = p.variants[variantIndex];
  const gallery = p.images.length ? p.images : ["/brand/placeholder.svg"];
  const current = gallery[imageIndex] ?? gallery[0];

  const chooseVariant = (i: number) => {
    setVariantIndex(i);
    const img = p.variants[i].image;
    if (img) {
      const idx = gallery.indexOf(img);
      if (idx >= 0) setImageIndex(idx);
    }
  };

  const onAdd = () => {
    add({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      variant: variant.label,
      sku: variant.sku,
      image: variant.image ?? gallery[0],
      quantity: qty,
    });
    setAdded(true);
  };

  const waMessage =
    lang === "zh"
      ? `您好 Karson，我想查詢：${p.name.zh}（${variant.label.zh}${variant.sku ? `，型號 ${variant.sku}` : ""}），數量約 ${qty} 件。`
      : `Hello Karson, I'm interested in the ${p.name.en} (${variant.label.en}${variant.sku ? `, model ${variant.sku}` : ""}), approx. ${qty} units.`;

  return (
    <div className="grid gap-10 md:grid-cols-[1.15fr_1fr] md:gap-16">
      <div className="md:sticky md:top-[calc(var(--hdr)+24px)] md:transition-[top] md:duration-500 md:self-start">
        <div className="relative aspect-square overflow-hidden rounded-[28px]">
          <AnimatePresence initial={false}>
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.28, 0.11, 0.32, 1] }}
              className="absolute inset-0"
            >
              <ProductShot src={current} alt={p.name[lang]} category={p.category} priority sizes="(min-width: 768px) 620px, 100vw" pad="p-10" />
            </motion.div>
          </AnimatePresence>
        </div>
        {gallery.length > 1 && (
          <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto">
            {gallery.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setImageIndex(i)}
                className={clsx(
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-1 transition md:h-20 md:w-20",
                  i === imageIndex ? "ring-ink" : "ring-black/5 hover:ring-black/20",
                )}
                aria-label={`Image ${i + 1}`}
              >
                <ProductShot src={src} alt="" category={p.category} sizes="80px" pad="p-1.5" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <p className="eyebrow text-gold">{categoryName}</p>
        <h1 className="headline mt-3 text-[34px] md:text-[48px]">{p.name[lang]}</h1>
        {p.tagline[lang] && <p className="mt-3 text-[19px] text-ink-soft md:text-[21px]">{p.tagline[lang]}</p>}
        {p.summary[lang] && <p className="mt-6 text-[15px] leading-relaxed text-mute">{p.summary[lang]}</p>}

        <div className="mt-8 border-t hairline pt-6">
          <div className="flex items-baseline justify-between">
            <p className="text-[13px] font-semibold">{d.product.colours}</p>
            <p className="text-[13px] text-mute">
              {variant.label[lang]}
              {variant.sku && <span className="ml-2 tracking-wide">· {variant.sku}</span>}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {p.variants.map((v, i) =>
              v.hex ? (
                <button
                  key={`${v.sku}-${i}`}
                  type="button"
                  onClick={() => chooseVariant(i)}
                  aria-label={v.label[lang]}
                  title={v.label[lang]}
                  className={clsx(
                    "h-9 w-9 rounded-full p-[3px] ring-1 transition",
                    i === variantIndex ? "ring-2 ring-ink" : "ring-black/10 hover:ring-black/30",
                  )}
                >
                  <span className="block h-full w-full rounded-full ring-1 ring-inset ring-black/10" style={{ backgroundColor: v.hex }} />
                </button>
              ) : (
                <button
                  key={`${v.sku}-${i}`}
                  type="button"
                  onClick={() => chooseVariant(i)}
                  className={clsx(
                    "rounded-full px-4 py-2 text-[13px] ring-1 transition",
                    i === variantIndex ? "bg-ink text-white ring-ink" : "ring-black/15 hover:ring-black/40",
                  )}
                >
                  {v.label[lang]}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="mt-8 border-t hairline pt-6">
          <label htmlFor="qty" className="text-[13px] font-semibold">
            {d.product.quantity}
          </label>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {QUICK_QTY.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setQty(n)}
                className={clsx(
                  "rounded-full px-4 py-2 text-[13px] tabular-nums transition",
                  qty === n ? "bg-ink text-white" : "bg-black/[0.05] text-ink-soft hover:bg-black/10",
                )}
              >
                {n.toLocaleString()}
              </button>
            ))}
            <input
              id="qty"
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              className="w-28 rounded-full border hairline bg-white px-4 py-2 text-[13px] tabular-nums outline-none focus:border-gold"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.div key="added" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-3">
                <Link href={`/${lang}/enquiry`} className="flex-1 rounded-full bg-ink py-3.5 text-center text-[15px] font-medium text-white transition hover:bg-black">
                  {d.cta.viewEnquiry}
                </Link>
                <button
                  type="button"
                  onClick={() => setAdded(false)}
                  className="rounded-full border border-ink/15 px-5 py-3.5 text-[14px] text-ink transition hover:border-ink/40"
                >
                  ✓ {d.cta.added}
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="add"
                type="button"
                onClick={onAdd}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-full bg-ink py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-black"
              >
                {d.cta.addToEnquiry}
              </motion.button>
            )}
          </AnimatePresence>
          <a
            href={whatsappLink(waMessage)}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-ink/15 py-3.5 text-center text-[15px] font-medium text-ink transition hover:border-ink/40"
          >
            {d.cta.whatsapp}
          </a>
          <p className="mt-2 text-center text-[12px] text-mute">{d.product.customisation}</p>
        </div>
      </div>
    </div>
  );
}
