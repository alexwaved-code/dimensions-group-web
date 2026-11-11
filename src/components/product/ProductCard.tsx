import Link from "next/link";
import { ProductShot } from "@/components/product/ProductShot";
import { QuickAdd } from "@/components/product/QuickAdd";
import type { ProductSummary } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";
import { cardTint } from "@/lib/photo";

export function ProductCard({ p, lang, priority = false }: { p: ProductSummary; lang: Locale; priority?: boolean }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[22px] bg-white transition-shadow duration-500 hover:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.25)]">
      <Link href={`/${lang}/product/${p.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-square overflow-hidden">
          <ProductShot
            src={p.image}
            alt={p.name[lang]}
            category={p.category}
            priority={priority}
            sizes="(min-width: 1180px) 280px, (min-width: 768px) 33vw, 50vw"
            className="transition-transform duration-700 ease-[cubic-bezier(0.28,0.11,0.32,1)] group-hover:scale-[1.04]"
          />
        </div>
        <div
          className="flex flex-1 flex-col px-3 pb-3 pt-3 md:px-5 md:pb-5 md:pt-4"
          style={{ background: `linear-gradient(to top, ${cardTint(p.category)}, #ffffff 78%)` }}
        >
          {p.swatches.length > 1 && (
            <div className="mb-2 hidden gap-1.5 md:mb-3 md:flex">
              {p.swatches.slice(0, 6).map((hex, i) => (
                <span
                  key={`${hex}-${i}`}
                  className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          )}
          <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug tracking-tight text-ink md:text-[15px]">{p.name[lang]}</h3>
          {p.tagline[lang] && <p className="mt-1 line-clamp-1 text-[12px] leading-relaxed text-mute md:mt-1.5 md:line-clamp-2 md:text-[13px]">{p.tagline[lang]}</p>}
          <div className="mt-auto flex items-center justify-between pt-2 text-[10px] text-mute md:pt-4 md:text-[11px]">
            <span className="tracking-wide">{p.sku ?? ""}</span>
            <span className="translate-x-[-4px] text-gold opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
              →
            </span>
          </div>
        </div>
      </Link>
      <QuickAdd p={p} lang={lang} className="absolute right-3 top-3" />
    </div>
  );
}
