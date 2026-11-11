import type { Metadata } from "next";
import Link from "next/link";
import { ProductShot } from "@/components/product/ProductShot";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { coverImage, products } from "@/lib/catalog";
import { certLibrary, marketStandards } from "@/lib/certifications";
import { getDict, hasLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/quality">): Promise<Metadata> {
  const { lang } = await params;
  return lang === "zh"
    ? { title: "品質與認證", description: "產品認證、合規標準及證書文件索取。" }
    : { title: "Quality & Compliance", description: "Product certifications, compliance standards and certificate documentation on request." };
}

export default async function QualityPage({ params }: PageProps<"/[lang]/quality">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDict(lang);
  const zh = lang === "zh";

  const verified = certLibrary
    .map((c) => {
      const seen = new Set<string>();
      const items = products.filter(
        (p) => p.certs.some((k) => k.toLowerCase() === c.key.toLowerCase()) && !seen.has(p.name.en) && (seen.add(p.name.en), true),
      );
      return { cert: c, items };
    })
    .filter((x) => x.items.length > 0);

  const process = zh
    ? [
        ["清晰列明", "每款產品只列出已核實的認證資料。"],
        ["文件索取", "按要求提供證書、測試報告及合規聲明。"],
        ["市場配合", "按您的目標市場，確認所需標準。"],
        ["專人跟進", "由銷售團隊直接處理您的合規查詢。"],
      ]
    : [
        ["Stated clearly", "Only verified certifications are listed against each product."],
        ["Documents on request", "Certificates, test reports and declarations supplied on request."],
        ["Market fit", "We confirm the standards your target market requires."],
        ["Direct follow-up", "Compliance questions handled directly by our sales team."],
      ];

  return (
    <>
      <section className="bg-mist pb-12 pt-24 md:pb-16 md:pt-28">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <Reveal>
            <p className="eyebrow text-gold">{d.nav.quality}</p>
            <h1 className="headline mt-5 max-w-4xl text-[30px] md:text-[44px]">
              {zh ? (
                <>
                  品質，<br />
                  <span className="text-gradient-gold">有據可查。</span>
                </>
              ) : (
                <>
                  Quality,
                  <br />
                  <span className="text-gradient-gold">on the record.</span>
                </>
              )}
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-ink-soft md:text-[18px]">
              {zh
                ? "我們只列出已核實的認證，並按要求提供證書、測試報告及合規文件，讓您的採購及上架流程更順暢。"
                : "We list only certifications we have verified, and supply certificates, test reports and compliance documents on request — so your sourcing and listing go smoothly."}
            </p>
          </Reveal>
          <div className="mt-8 grid gap-px overflow-hidden rounded-[24px] bg-black/[0.07] sm:grid-cols-2 lg:grid-cols-4">
            {process.map(([title, body], i) => (
              <Reveal key={title} delay={i * 0.08} className="bg-white p-8">
                <p className="text-[12px] tabular-nums text-gold">0{i + 1}</p>
                <p className="mt-4 text-[20px] font-semibold">{title}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-10 md:px-8 md:py-14">
        <Reveal>
          <p className="eyebrow text-gold">{zh ? "已核實認證" : "Verified certifications"}</p>
          <h2 className="headline mt-3 text-[24px] md:text-[32px]">{zh ? "列明於產品，經得起查證。" : "Stated per product. Ready to verify."}</h2>
        </Reveal>
        <div className="mt-10 space-y-6">
          {verified.map(({ cert, items }) => (
            <Reveal key={cert.key}>
              <div className="grid gap-8 rounded-[32px] bg-mist p-8 md:grid-cols-[1fr_1.4fr] md:p-12">
                <div>
                  <span className="inline-grid h-14 min-w-14 place-items-center rounded-full border border-gold/50 px-3 text-[13px] font-semibold tracking-wider text-gold">
                    {cert.short}
                  </span>
                  <h3 className="mt-5 text-[26px] font-semibold tracking-tight">{cert.name[lang]}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{cert.description[lang]}</p>
                  <p className="mt-4 text-[13px] text-mute">
                    {zh ? "適用範圍：" : "Scope: "}
                    {cert.scope[lang]}
                  </p>
                  <Link
                    href={`/${lang}/enquiry?cert=${items[0].slug}`}
                    className="mt-6 inline-block text-[14px] font-medium text-gold hover:underline"
                  >
                    {zh ? "索取證書文件 ›" : "Request certificate ›"}
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {items.slice(0, 6).map((p) => (
                    <Link key={p.id} href={`/${lang}/product/${p.slug}`} className="group rounded-2xl bg-white p-3">
                      <div className="relative aspect-square overflow-hidden rounded-xl">
                        <ProductShot src={coverImage(p)} alt={p.name[lang]} category={p.category} sizes="180px" pad="p-2" className="transition-transform duration-700 group-hover:scale-105" />
                      </div>
                      <p className="mt-2 line-clamp-2 text-[12px] leading-snug text-ink-soft">{p.name[lang]}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-mist">
        <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-8 md:py-14">
          <Reveal>
            <p className="eyebrow text-mute">{zh ? "市場合規" : "Market compliance"}</p>
            <h2 className="headline mt-3 text-[24px] md:text-[32px]">{zh ? "按目標市場，配合所需標準。" : "Aligned to the market you sell in."}</h2>
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-ink-soft">
              {zh
                ? "不同市場有不同的法規要求。以下為常見標準的簡介；個別型號的適用情況，請向我們索取相關文件確認。"
                : "Each market has its own regulations. Below is an overview of common standards; please request documentation to confirm what applies to a specific model."}
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {marketStandards.map((s, i) => (
              <Reveal key={s.key} delay={i * 0.06} className="rounded-[24px] bg-paper p-8">
                <p className="text-[12px] font-semibold tracking-wider text-gold">{s.short}</p>
                <h3 className="mt-3 text-[20px] font-semibold tracking-tight">{s.name[lang]}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{s.description[lang]}</p>
                <p className="mt-3 text-[12px] text-mute">{s.scope[lang]}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-10 text-center md:px-8 md:py-14">
        <Reveal>
          <h2 className="headline text-[24px] md:text-[32px]">{zh ? "需要證書或測試報告？" : "Need a certificate or test report?"}</h2>
          <p className="mx-auto mt-5 max-w-xl text-[16px] text-ink-soft">
            {zh ? "告訴我們型號及目標市場，我們會盡快提供相關文件。" : "Tell us the model and target market, and we will send the relevant documents promptly."}
          </p>
          <Link href={`/${lang}/enquiry`} className="mt-8 inline-block rounded-full bg-ink px-7 py-3 text-[15px] font-medium text-white">
            {d.cta.quote}
          </Link>
        </Reveal>
      </section>
    </>
  );
}
