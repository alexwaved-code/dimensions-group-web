import Link from "next/link";
import { notFound } from "next/navigation";
import { QuickEnquiry } from "@/components/enquiry/QuickEnquiry";
import { FaqList, MethodGrid } from "@/components/gifting/Sections";
import { Carousel } from "@/components/home/Carousel";
import { HeroBanner, type BannerSlide } from "@/components/home/HeroBanner";
import { OccasionTabs, type OccasionTab } from "@/components/home/OccasionTabs";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductShot } from "@/components/product/ProductShot";
import { categories, categoryCover, coverImage, productById, productsIn, toSummary, type Product } from "@/lib/catalog";
import { giftSets } from "@/lib/gifts";
import { hasLocale } from "@/lib/i18n";
import { budgetTiles, featuredGiftIds, occasionCollections } from "@/lib/occasions";
import { cardTint } from "@/lib/photo";
import { site } from "@/lib/site";

const SLIDE_TINT: Record<string, string> = {
  "executive-desk": "#e9eef5",
  "wellness-retreat": "#f1eaf5",
  "home-chef": "#f6efe6",
  "travel-companion": "#e4f1f7",
  "event-kit": "#e8f3e6",
  "festive-table": "#f8ecea",
};

const summaries = (ids: string[]) => ids.map(productById).filter((p): p is Product => Boolean(p)).map(toSummary);

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const zh = lang === "zh";
  const slides: BannerSlide[] = giftSets.map((g) => ({
    id: g.id,
    name: g.name,
    mood: g.mood,
    tag: g.tag,
    tint: SLIDE_TINT[g.id] ?? "#f5f5f7",
    items: summaries(g.productIds),
  }));
  const tabs: OccasionTab[] = occasionCollections.map((o) => ({ id: o.id, name: o.name, title: o.title, items: summaries(o.productIds) }));
  const picks = summaries(featuredGiftIds);

  return (
    <div data-snap>
      {/* Hero */}
      <section className="bg-mist pb-8 pt-[72px] md:pb-10 md:pt-20">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-gold">{zh ? "專注電器企業禮品 · 紀念品 · 推廣贈品" : "Appliance-led corporate gifts · Souvenirs · Giveaways"}</p>
              <h1 className="headline mt-2 text-[28px] md:text-[36px]">
                {zh ? (
                  <>
                    <span className="inline-block">企業禮品，</span>
                    <span className="text-gradient-gold inline-block">送得體面。</span>
                  </>
                ) : (
                  <>
                    Corporate gifts, <span className="text-gradient-gold">given well.</span>
                  </>
                )}
              </h1>
            </div>
            <form action={`/${lang}/products`} className="relative w-full md:w-[360px]">
              <input type="hidden" name="gift" value="1" />
              <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mute" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                name="q"
                placeholder={zh ? "搜尋禮品，例如：保溫杯、風扇" : "Search gifts, e.g. tumbler, fan"}
                aria-label={zh ? "搜尋禮品" : "Search gifts"}
                className="w-full rounded-full border hairline bg-white py-3 pl-11 pr-24 text-[14px] outline-none transition focus:border-gold"
              />
              <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-ink px-4 py-2 text-[12px] font-medium text-white transition hover:bg-black">
                {zh ? "搜尋" : "Search"}
              </button>
            </form>
          </div>

          <HeroBanner slides={slides} lang={lang} />
        </div>
      </section>

      {/* Categories */}
      <section className="border-b hairline bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-4 md:px-8 md:py-8">
          <ul className="grid grid-cols-4 gap-1 sm:grid-cols-6 md:grid-cols-11 md:gap-1">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/${lang}/products/${c.id}`} className="group flex flex-col items-center gap-1.5 rounded-2xl p-1.5 text-center transition hover:bg-mist md:gap-2 md:p-2">
                  <span
                    className="relative isolate block h-14 w-14 overflow-hidden rounded-full md:h-16 md:w-16"
                    style={{ background: `radial-gradient(circle at 50% 70%, ${cardTint(c.id)} 0%, #ffffff 75%)` }}
                  >
                    <ProductShot src={categoryCover(c.id)} alt="" sizes="64px" pad="p-2" bg="bg-transparent" className="mix-blend-darken transition-transform duration-500 group-hover:scale-110" />
                  </span>
                  <span className="line-clamp-2 flex h-8 items-start justify-center text-[11px] leading-tight text-ink-soft group-hover:text-ink md:h-9 md:text-[12px]">{c.name[lang]}</span>
                  <span className="text-[10px] text-mute">{productsIn(c.id).length}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Occasions */}
      <section id="occasions" className="mx-auto max-w-[1180px] px-5 py-10 md:px-8 md:py-14">
        <Reveal className="mb-4 flex flex-col items-start gap-1 md:mb-6 md:flex-row md:items-end md:justify-between md:gap-4">
          <div>
            <p className="eyebrow text-mute">{zh ? "按場合" : "By occasion"}</p>
            <h2 className="headline mt-2 text-[24px] md:text-[32px]">{zh ? "按場合挑選。" : "Shop by occasion."}</h2>
          </div>
          <Link href={`/${lang}/gifting`} className="shrink-0 text-[14px] font-medium text-gold hover:underline">
            {zh ? "禮品規劃工具" : "Gift planner"} ›
          </Link>
        </Reveal>
        <OccasionTabs tabs={tabs} lang={lang} />
      </section>

      {/* Recommended */}
      <section id="picks" className="bg-mist py-10 md:py-14">
        <div className="mx-auto mb-5 flex max-w-[1180px] flex-col items-start gap-1 px-5 md:mb-8 md:flex-row md:items-end md:justify-between md:gap-4 md:px-8">
          <Reveal>
            <p className="eyebrow text-mute">{zh ? "推薦禮品" : "Recommended"}</p>
            <h2 className="headline mt-2 text-[24px] md:text-[32px]">{zh ? "實用，所以被記住。" : "Useful, so they're remembered."}</h2>
          </Reveal>
          <Link href={`/${lang}/products?gift=1`} className="shrink-0 text-[14px] font-medium text-gold hover:underline">
            {zh ? "全部送禮產品" : "All gift-ready"} ›
          </Link>
        </div>
        <Carousel label={zh ? "推薦禮品" : "Recommended gifts"}>
          {picks.map((p) => (
            <div key={p.id} className="w-[42vw] shrink-0 snap-start sm:w-[250px]">
              <ProductCard p={p} lang={lang} />
            </div>
          ))}
        </Carousel>
      </section>

      {/* Budget */}
      <section id="budget" className="mx-auto max-w-[1180px] px-5 py-10 md:px-8 md:py-14">
        <Reveal className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-mute">{zh ? "按預算" : "By budget"}</p>
            <h2 className="headline mt-2 text-[24px] md:text-[32px]">{zh ? "先定預算，再揀禮物。" : "Start with your budget."}</h2>
          </div>
          <p className="hidden max-w-xs text-right text-[12px] text-mute md:block">
            {zh ? "預算範圍僅供參考，實際報價按數量及訂製要求而定。" : "Ranges are indicative; quotations depend on quantity and customisation."}
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {budgetTiles.map((b) => {
            const p = productById(b.productId);
            return (
              <Link
                key={b.id}
                href={`/${lang}/products?budget=${b.id}`}
                className="group flex items-center gap-3 rounded-[20px] bg-white p-3 ring-1 ring-black/5 transition hover:ring-gold/60 md:gap-4"
              >
                <span className="relative block h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-mist md:h-20 md:w-20">
                  {p && <ProductShot src={coverImage(p)} alt="" sizes="80px" pad="p-2" bg="bg-transparent" className="mix-blend-darken transition-transform duration-700 group-hover:scale-110" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold tracking-tight md:text-[17px]">{b.label[lang]}</span>
                  <span className="mt-0.5 block text-[12px] text-mute">{b.note[lang]}</span>
                </span>
                <span className="hidden text-mute transition-transform group-hover:translate-x-1 md:block">›</span>
              </Link>
            );
          })}
        </div>
        <p className="mt-3 text-[12px] text-mute md:hidden">
          {zh ? "預算範圍僅供參考，實際報價按數量及訂製要求而定。" : "Ranges are indicative; quotations depend on quantity and customisation."}
        </p>
      </section>

      {/* Customisation */}
      <section id="custom" className="border-y hairline bg-mist">
        <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-8 md:py-14">
          <Reveal className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-gold">{zh ? "訂製服務" : "Customisation"}</p>
              <h2 className="headline mt-2 text-[24px] md:text-[32px]">{zh ? "印上您的品牌。" : "Make it yours."}</h2>
              <p className="mt-3 max-w-xl text-[15px] text-ink-soft">
                {zh ? "按產品物料建議合適方式，生產前提供效果圖確認。" : "We recommend a method for each material and send a mock-up before production."}
              </p>
            </div>
            <Link href={`/${lang}/customisation`} className="shrink-0 text-[14px] font-medium text-gold hover:underline">
              {zh ? "了解訂製服務" : "Explore customisation"} ›
            </Link>
          </Reveal>
          <MethodGrid lang={lang} />
        </div>
      </section>

      {/* FAQ + quick enquiry */}
      <section id="faq" className="bg-mist">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-10 md:px-8 md:py-14 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <Reveal className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-mute">FAQ</p>
                <h2 className="headline mt-2 text-[24px] md:text-[32px]">{zh ? "常見問題。" : "Questions, answered."}</h2>
              </div>
              <Link href={`/${lang}/faq`} className="shrink-0 text-[14px] font-medium text-gold hover:underline">
                {zh ? "全部問題" : "All questions"} ›
              </Link>
            </Reveal>
            <FaqList lang={lang} limit={6} />
          </div>
          <div id="quote" className="scroll-mt-20 lg:pt-[88px]">
            <QuickEnquiry lang={lang} />
            <p className="mt-4 text-center text-[12px] text-mute">
              {site.contact.person} · {site.contact.email}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
