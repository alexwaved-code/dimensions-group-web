import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { categories, categoryCover, productsIn, products } from "@/lib/catalog";
import { getDict, hasLocale } from "@/lib/i18n";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  return lang === "zh"
    ? { title: "關於我們", description: `${site.name}，香港電器及生活產品供應商。` }
    : { title: "About", description: `${site.name} — a Hong Kong supplier of electrical appliances and lifestyle products.` };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDict(lang);
  const zh = lang === "zh";
  const finishes = products.reduce((n, p) => n + p.variants.length, 0);

  const pillars = zh
    ? [
        ["一站式產品組合", "由空氣與溫控、家居清潔到廚房、個人護理及生活用品，一個供應商滿足多個品類。"],
        ["為 B2B 而設", "支援零售上架、分銷及企業採購，按數量及市場提供報價。"],
        ["企業禮品專長", "按場合、預算及數量規劃禮品，並可安排標誌印刷及訂製包裝。"],
        ["清晰合規資料", "列明已核實的認證，並按要求提供證書及測試報告。"],
      ]
    : [
        ["One portfolio, many categories", "From climate and home care to kitchen, personal care and lifestyle — one supplier across categories."],
        ["Built for B2B", "Supporting retail listings, distribution and corporate purchasing, with quotes by volume and market."],
        ["Corporate gifting expertise", "Gifts planned by occasion, budget and quantity, with logo printing and custom packaging available."],
        ["Clear compliance", "Verified certifications stated per product, with certificates and test reports on request."],
      ];

  return (
    <>
      <section className="bg-mist pb-12 pt-24 md:pb-16 md:pt-28">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <Reveal>
            <p className="eyebrow text-gold">{d.nav.about}</p>
            <h1 className="headline mt-5 max-w-4xl text-[30px] md:text-[44px]">
              {zh ? (
                <>
                  好產品，<br />
                  <span className="text-gradient-gold">值得好夥伴。</span>
                </>
              ) : (
                <>
                  Great products
                  <br />
                  <span className="text-gradient-gold">deserve a great partner.</span>
                </>
              )}
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-ink-soft md:text-[18px]">
              {zh
                ? `${site.name} 是一家香港電器及生活產品供應商，為零售商、分銷商及企業客戶提供設計精良、實用可靠的產品。`
                : `${site.name} is a Hong Kong supplier of electrical appliances and lifestyle products, serving retailers, distributors and corporate clients with well-designed, dependable products.`}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-y hairline bg-white">
        <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-10 px-5 py-12 md:grid-cols-3 md:px-8 md:py-14">
          {[
            [products.length, zh ? "產品型號" : "Product models"],
            [finishes, zh ? "顏色及款式選擇" : "Finishes & variants"],
            [categories.length, zh ? "產品類別" : "Categories"],
          ].map(([n, label]) => (
            <Reveal key={label as string}>
              <p className="headline text-[40px] md:text-[56px]">
                <CountUp to={n as number} />
              </p>
              <p className="mt-2 text-[14px] text-mute">{label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-10 md:px-8 md:py-14">
        <Reveal>
          <p className="eyebrow text-mute">{zh ? "我們的方式" : "How we work"}</p>
          <h2 className="headline mt-3 text-[24px] md:text-[32px]">{zh ? "專注，所以專業。" : "Focused, so you can be too."}</h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {pillars.map(([title, body], i) => (
            <Reveal key={title} delay={i * 0.06} className="rounded-[28px] bg-mist p-8 md:p-10">
              <p className="text-[12px] tabular-nums text-gold">0{i + 1}</p>
              <h3 className="mt-4 text-[22px] font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-mist">
        <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-8 md:py-14">
          <Reveal>
            <h2 className="headline text-[24px] md:text-[32px]">{zh ? "我們的產品系列。" : "Our portfolio."}</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => (
              <Link key={c.id} href={`/${lang}/products/${c.id}`} className="group rounded-[22px] bg-paper p-5">
                <div className="relative aspect-[4/3]">
                  <Image src={categoryCover(c.id)} alt={c.name[lang]} fill sizes="260px" className="object-contain transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="mt-3 text-[15px] font-semibold">{c.name[lang]}</p>
                <p className="text-[12px] text-mute">
                  {productsIn(c.id).length} {zh ? "款型號" : "models"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-10 text-center md:px-8 md:py-14">
        <Reveal>
          <h2 className="headline text-[24px] md:text-[32px]">{zh ? "一起開始。" : "Let's get started."}</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={`/${lang}/enquiry`} className="rounded-full bg-ink px-7 py-3 text-[15px] font-medium text-white">
              {d.cta.quote}
            </Link>
            <Link href={`/${lang}/contact`} className="rounded-full border border-line px-7 py-3 text-[15px] font-medium text-ink hover:border-ink">
              {d.nav.contact}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
