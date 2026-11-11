import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ProductShot } from "@/components/product/ProductShot";
import { coverImage, productById } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";
import { customMethods, faqs, occasionCollections, processSteps } from "@/lib/occasions";

export function OccasionGrid({ lang, exclude }: { lang: Locale; exclude?: string }) {
  const list = occasionCollections.filter((o) => o.id !== exclude);
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((o, i) => {
        const items = o.productIds.slice(0, 3).map(productById).filter(Boolean);
        return (
          <Reveal key={o.id} delay={(i % 3) * 0.08}>
            <Link
              href={`/${lang}/gifting/${o.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white p-7 transition-shadow duration-500 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.3)]"
            >
              <div
                className="relative isolate grid h-[200px] grid-cols-[1.3fr_1fr] grid-rows-2 gap-2 overflow-hidden rounded-[20px] p-2"
                style={{ background: `radial-gradient(ellipse at 50% 90%, ${o.tint} 0%, #ffffff 80%)` }}
              >
                {items.map((p, k) => (
                  <div key={p!.id} className={`relative overflow-hidden rounded-2xl ${k === 0 ? "row-span-2" : ""}`}>
                    <ProductShot
                      src={coverImage(p!)}
                      alt={p!.name[lang]}
                      sizes="200px"
                      pad={k === 0 ? "p-3" : "p-2"}
                      bg="bg-transparent"
                      className="mix-blend-darken transition-transform duration-700 ease-[cubic-bezier(0.28,0.11,0.32,1)] group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
              <h3 className="mt-6 text-[21px] font-semibold tracking-tight">{o.name[lang]}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{o.title[lang]}</p>
              <span className="mt-auto pt-5 text-[13px] font-medium text-gold">
                {lang === "zh" ? `查看 ${o.productIds.length} 款推介` : `See ${o.productIds.length} picks`}{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1">›</span>
              </span>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}

export function ProcessSteps({ lang, dark = false }: { lang: Locale; dark?: boolean }) {
  return (
    <ol className={`relative grid gap-8 md:grid-cols-5 md:gap-4`}>
      <span aria-hidden className={`absolute left-[19px] top-5 hidden h-px md:left-5 md:right-5 md:block ${dark ? "bg-white/15" : "bg-black/10"}`} />
      {processSteps.map((s, i) => (
        <Reveal as="li" key={s.name.en} delay={i * 0.08} className="relative flex gap-5 md:block">
          <span
            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold tabular-nums ${
              dark ? "bg-white text-ink" : "bg-ink text-white"
            }`}
          >
            {i + 1}
          </span>
          <div>
            <p className={`text-[17px] font-semibold md:mt-5 ${dark ? "text-white" : "text-ink"}`}>{s.name[lang]}</p>
            <p className={`mt-1.5 text-[14px] leading-relaxed ${dark ? "text-white/55" : "text-ink-soft"}`}>{s.body[lang]}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  screen: (
    <>
      <rect x="4" y="5" width="16" height="10" rx="1.5" />
      <path d="M2 15h20M8 19h8M9 9h6" />
    </>
  ),
  laser: (
    <>
      <path d="M12 2v8" />
      <path d="M12 10l-2 4h4z" />
      <path d="M5 20h14M8 17h8" />
    </>
  ),
  uv: (
    <>
      <circle cx="9" cy="10" r="4" />
      <circle cx="15" cy="10" r="4" />
      <circle cx="12" cy="15" r="4" />
    </>
  ),
  pad: (
    <>
      <path d="M8 4h8v5a4 4 0 0 1-8 0z" />
      <path d="M12 13v3M5 20c2-3 12-3 14 0" />
    </>
  ),
  box: (
    <>
      <path d="M3 8h18v4H3zM5 12v8h14v-8M12 8v12" />
      <path d="M12 8C10 4 7 4 7 6s3 2 5 2c2 0 5 0 5-2s-3-2-5 2" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="1.5" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
};

export function MethodGrid({ lang, dark = false }: { lang: Locale; dark?: boolean }) {
  return (
    <div className={`grid gap-px overflow-hidden rounded-[28px] sm:grid-cols-2 lg:grid-cols-3 ${dark ? "bg-white/10" : "bg-black/[0.07]"}`}>
      {customMethods.map((m, i) => (
        <Reveal key={m.id} delay={(i % 3) * 0.06} className={`${dark ? "bg-night" : "bg-white"} p-8`}>
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={dark ? "text-gold-soft" : "text-gold"}
            aria-hidden
          >
            {ICONS[m.id]}
          </svg>
          <p className={`mt-6 text-[19px] font-semibold ${dark ? "text-white" : "text-ink"}`}>{m.name[lang]}</p>
          <p className={`mt-2 text-[14px] leading-relaxed ${dark ? "text-white/60" : "text-ink-soft"}`}>{m.body[lang]}</p>
          <p className={`mt-4 text-[12px] ${dark ? "text-white/40" : "text-mute"}`}>
            {lang === "zh" ? "常用於：" : "Often used on: "}
            {m.suits[lang]}
          </p>
        </Reveal>
      ))}
    </div>
  );
}

export function FaqList({ lang, limit }: { lang: Locale; limit?: number }) {
  const list = limit ? faqs.slice(0, limit) : faqs;
  return (
    <div className="divide-y divide-black/10 border-y border-black/10">
      {list.map((f) => (
        <details key={f.q.en} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[17px] font-medium text-ink md:text-[19px] [&::-webkit-details-marker]:hidden">
            {f.q[lang]}
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-[18px] leading-none text-ink-soft transition-transform duration-300 group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="max-w-3xl pb-6 text-[15px] leading-relaxed text-ink-soft">{f.a[lang]}</p>
        </details>
      ))}
    </div>
  );
}

export function faqJsonLd(lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q[lang],
      acceptedAnswer: { "@type": "Answer", text: f.a[lang] },
    })),
  };
}
