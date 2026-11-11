import type { Metadata } from "next";
import Link from "next/link";
import { Phrase } from "@/components/Phrase";
import { notFound } from "next/navigation";
import { OccasionGrid, ProcessSteps } from "@/components/gifting/Sections";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductShot } from "@/components/product/ProductShot";
import { productById, toSummary } from "@/lib/catalog";
import { getDict, hasLocale } from "@/lib/i18n";
import { occasionById, occasionCollections } from "@/lib/occasions";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return occasionCollections.map((o) => ({ occasion: o.id }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/gifting/[occasion]">): Promise<Metadata> {
  const { lang, occasion } = await params;
  const o = occasionById(occasion);
  if (!o || !hasLocale(lang)) return {};
  return {
    title: lang === "zh" ? `${o.name.zh}｜企業禮品推介` : `${o.name.en} | Corporate Gift Ideas`,
    description: o.intro[lang],
  };
}

export default async function OccasionPage({ params }: PageProps<"/[lang]/gifting/[occasion]">) {
  const { lang, occasion } = await params;
  const o = occasionById(occasion);
  if (!hasLocale(lang) || !o) notFound();
  const d = getDict(lang);
  const zh = lang === "zh";
  const items = o.productIds.map(productById).filter(Boolean).map((p) => toSummary(p!));
  const stage = items.slice(0, 3);

  return (
    <>
      <section className="overflow-hidden pt-20 md:pt-24" style={{ background: `linear-gradient(to bottom, #ffffff, ${o.tint})` }}>
        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 md:grid-cols-[1.1fr_1fr] md:items-center md:px-8">
          <Reveal className="pb-4 md:pb-14">
            <Link href={`/${lang}/gifting`} className="text-[13px] text-mute hover:text-ink">
              ‹ {d.nav.gifting}
            </Link>
            <p className="eyebrow mt-8 text-gold">{o.name[lang]}</p>
            <h1 className="headline mt-4 text-[38px] md:text-[54px]">
              <Phrase>{o.title[lang]}</Phrase>
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink-soft md:text-[19px]">{o.intro[lang]}</p>
            <ul className="mt-8 space-y-2.5">
              {o.points.map((pt) => (
                <li key={pt.en} className="flex items-center gap-3 text-[15px] text-ink">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-gold" aria-hidden>
                    <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {pt[lang]}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href={`/${lang}/enquiry`} className="rounded-full bg-ink px-7 py-3 text-[15px] font-medium text-white transition hover:bg-black">
                {d.cta.quote}
              </Link>
              <a href="#picks" className="group text-[15px] font-medium text-ink">
                {zh ? "查看推介" : "See the picks"} <span className="inline-block transition-transform group-hover:translate-y-0.5">↓</span>
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="relative isolate grid aspect-square grid-cols-2 grid-rows-2 gap-3 pb-8 md:pb-12">
            {stage.map((p, k) => (
              <div key={p.id} className={`relative overflow-hidden rounded-[28px] bg-white shadow-[0_30px_60px_-40px_rgba(0,0,0,0.35)] ${k === 0 ? "row-span-2" : ""}`}>
                <ProductShot src={p.image} alt={p.name[lang]} priority={k === 0} sizes="(min-width: 768px) 280px, 50vw" pad={k === 0 ? "p-8" : "p-5"} />
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="picks" className="mx-auto max-w-[1180px] px-5 py-10 md:px-8 md:py-14">
        <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-mute">{zh ? "推介產品" : "Recommended"}</p>
            <h2 className="headline mt-3 text-[24px] md:text-[32px]">
              {zh ? `${items.length} 款${o.name.zh}之選。` : `${items.length} picks for ${o.name.en.toLowerCase()}.`}
            </h2>
          </div>
          <p className="max-w-sm text-[14px] text-ink-soft">
            {zh ? "按「＋」加入查詢清單，可混合不同產品一次索取報價。" : "Tap “+” to add to your enquiry — mix products and request one quotation."}
          </p>
        </Reveal>
        <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {items.map((p, i) => (
            <li key={p.id}>
              <ProductCard p={p} lang={lang} priority={i < 4} />
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-mist">
        <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-8 md:py-14">
          <Reveal>
            <p className="eyebrow text-mute">{zh ? "訂購流程" : "How it works"}</p>
            <h2 className="headline mt-3 text-[24px] md:text-[32px]">{zh ? "由構思到交付。" : "From idea to delivery."}</h2>
          </Reveal>
          <div className="mt-8">
            <ProcessSteps lang={lang} />
          </div>
          <Reveal className="mt-10 flex flex-wrap gap-4">
            <Link href={`/${lang}/customisation`} className="rounded-full border border-ink/15 bg-white px-6 py-2.5 text-[14px] font-medium transition hover:border-ink/40">
              {zh ? "訂製服務" : "Customisation"}
            </Link>
            <a
              href={`https://wa.me/${site.contact.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-ink/15 bg-white px-6 py-2.5 text-[14px] font-medium transition hover:border-ink/40"
            >
              {d.cta.whatsapp}
            </a>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-10 md:px-8 md:py-14">
        <Reveal>
          <p className="eyebrow text-mute">{zh ? "其他場合" : "More occasions"}</p>
          <h2 className="headline mt-3 text-[24px] md:text-[32px]">{zh ? "還在找其他靈感？" : "Looking for something else?"}</h2>
        </Reveal>
        <div className="mt-10">
          <OccasionGrid lang={lang} exclude={o.id} />
        </div>
      </section>
    </>
  );
}
