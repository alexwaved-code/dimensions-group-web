import type { Metadata } from "next";
import Link from "next/link";
import { Phrase } from "@/components/Phrase";
import { notFound } from "next/navigation";
import { MethodGrid, ProcessSteps } from "@/components/gifting/Sections";
import { Reveal } from "@/components/motion/Reveal";
import { ProductShot } from "@/components/product/ProductShot";
import { coverImage, productById } from "@/lib/catalog";
import { getDict, hasLocale } from "@/lib/i18n";
import { site } from "@/lib/site";

const SHOWCASE = ["npvc013", "clps009", "npbs0001", "npvc020"];

export async function generateMetadata({ params }: PageProps<"/[lang]/customisation">): Promise<Metadata> {
  const { lang } = await params;
  return lang === "zh"
    ? { title: "禮品訂製服務｜印刷企業標誌及訂製禮盒", description: "企業禮品標誌印刷、鐳射雕刻、UV 彩印、訂製禮盒及心意卡，按要求提供，生產前提供效果圖確認。" }
    : { title: "Gift Customisation | Logo Printing & Custom Boxes", description: "Logo printing, laser engraving, UV printing, custom gift boxes and cards for corporate gifts — with a mock-up before production." };
}

export default async function CustomisationPage({ params }: PageProps<"/[lang]/customisation">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDict(lang);
  const zh = lang === "zh";
  const showcase = SHOWCASE.map(productById).filter(Boolean);

  const artwork = zh
    ? [
        ["向量檔最理想", "AI、PDF 或 SVG 格式，放大縮小都清晰。"],
        ["列明品牌顏色", "如有 Pantone 色號，請一併提供。"],
        ["只有圖片也可以", "PNG 或 JPG 亦可先傳來，我們會提供建議。"],
      ]
    : [
        ["Vector is best", "AI, PDF or SVG stay sharp at any size."],
        ["Share brand colours", "Include Pantone references if you have them."],
        ["Only have an image?", "Send a PNG or JPG and we will advise."],
      ];

  return (
    <>
      <section className="overflow-hidden bg-mist pb-12 pt-24 md:pb-16 md:pt-28">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <Reveal>
            <p className="eyebrow text-gold">{zh ? "訂製服務" : "Customisation"}</p>
            <h1 className="headline mt-5 max-w-4xl text-[30px] md:text-[44px]">
              {zh ? (
                <>
                  一份禮物，<br />
                  <span className="text-gradient-gold">一個品牌印記。</span>
                </>
              ) : (
                <>
                  Every gift,
                  <br />
                  <span className="text-gradient-gold">carrying your brand.</span>
                </>
              )}
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-ink-soft md:text-[18px]">
              {zh
                ? "標誌印刷、訂製禮盒及心意卡，均可按要求提供。我們會按每款產品的物料建議合適方式，並於生產前提供效果圖確認。"
                : "Logo printing, custom gift boxes and cards are available on request. We recommend the right method for each product's material and send a mock-up for approval before production."}
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {showcase.map((p, i) => (
              <Reveal key={p!.id} delay={i * 0.08} className="relative aspect-square overflow-hidden rounded-[24px] bg-white">
                <ProductShot src={coverImage(p!)} alt={p!.name[lang]} sizes="(min-width: 768px) 280px, 50vw" pad="p-6" priority={i < 2} />
                <span className="absolute bottom-3 left-3 rounded-full border border-dashed border-gold/70 bg-white/85 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-gold backdrop-blur">
                  {zh ? "您的標誌" : "Your logo"}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-10 md:px-8 md:py-14">
        <Reveal>
          <p className="eyebrow text-mute">{zh ? "印刷及包裝方式" : "Methods"}</p>
          <h2 className="headline mt-3 text-[24px] md:text-[32px]"><Phrase>{zh ? "按物料，選對方式。" : "The right method for each material."}</Phrase></h2>
          <p className="mt-4 max-w-2xl text-[15px] text-ink-soft">
            {zh ? "實際可用的方式視乎產品物料及印刷位置而定，我們會在報價時一併建議。" : "Which methods apply depends on the product's material and print area; we will recommend options with your quotation."}
          </p>
        </Reveal>
        <div className="mt-8">
          <MethodGrid lang={lang} />
        </div>
      </section>

      <section className="bg-mist">
        <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-8 md:py-14">
          <Reveal>
            <p className="eyebrow text-mute">{zh ? "訂購流程" : "How it works"}</p>
            <h2 className="headline mt-3 text-[24px] md:text-[32px]"><Phrase>{zh ? "先看效果圖，才開始生產。" : "See the mock-up before production."}</Phrase></h2>
          </Reveal>
          <div className="mt-10">
            <ProcessSteps lang={lang} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-10 md:px-8 md:py-14">
        <Reveal>
          <p className="eyebrow text-mute">{zh ? "設計檔案" : "Artwork"}</p>
          <h2 className="headline mt-3 text-[24px] md:text-[32px]">{zh ? "準備標誌檔案。" : "Preparing your artwork."}</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {artwork.map(([title, body], i) => (
            <Reveal key={title} delay={i * 0.08} className="rounded-[24px] bg-white p-8 ring-1 ring-black/5">
              <p className="text-[12px] tabular-nums text-gold">0{i + 1}</p>
              <p className="mt-4 text-[19px] font-semibold">{title}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-5 pb-14 md:px-8">
        <Reveal className="mx-auto max-w-[1180px] overflow-hidden rounded-[32px] bg-mist px-8 py-12 text-center md:py-16">
          <h2 className="headline mx-auto max-w-3xl text-[24px] md:text-[32px]">{zh ? "把標誌傳給我們。" : "Send us your logo."}</h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] text-ink-soft">
            {zh ? "連同心儀產品及數量，我們會建議合適的訂製方式及報價。" : "Along with the products and quantities you have in mind — we will suggest methods and quote."}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link href={`/${lang}/enquiry`} className="rounded-full bg-ink px-7 py-3 text-[15px] font-medium text-white transition hover:bg-black">
              {d.cta.quote}
            </Link>
            <a
              href={`mailto:${site.contact.email}`}
              className="rounded-full border border-ink/15 px-7 py-3 text-[15px] font-medium text-ink transition hover:border-ink/40"
            >
              {d.cta.email}
            </a>
            <Link href={`/${lang}/faq`} className="text-[15px] font-medium text-gold hover:underline">
              {zh ? "常見問題" : "FAQ"} ›
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
