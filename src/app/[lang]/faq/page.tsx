import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqList, faqJsonLd } from "@/components/gifting/Sections";
import { Reveal } from "@/components/motion/Reveal";
import { getDict, hasLocale } from "@/lib/i18n";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/faq">): Promise<Metadata> {
  const { lang } = await params;
  return lang === "zh"
    ? { title: "企業禮品常見問題", description: "有關企業禮品訂購量、需時、標誌印刷、設計檔案、樣品、包裝及報價的常見問題。" }
    : { title: "Corporate Gifting FAQ", description: "Answers on order quantities, timing, logo printing, artwork, samples, packaging and quotations for corporate gifts." };
}

export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDict(lang);
  const zh = lang === "zh";

  return (
    <>
      <div className="mx-auto max-w-[1180px] px-5 pb-12 pt-24 md:px-8 md:pt-28">
        <div className="grid gap-8 md:grid-cols-[1fr_1.8fr]">
          <Reveal className="md:sticky md:top-[calc(var(--hdr)+24px)] md:transition-[top] md:duration-500 md:self-start">
            <p className="eyebrow text-gold">FAQ</p>
            <h1 className="headline mt-4 text-[34px] md:text-[48px]">{zh ? "常見問題。" : "Questions, answered."}</h1>
            <p className="mt-5 max-w-sm text-[16px] leading-relaxed text-ink-soft">
              {zh ? "找不到答案？直接問我們，或試試右下角的 AI 助理。" : "Can't find what you need? Ask us directly, or try the assistant in the corner."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${site.contact.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-ink px-6 py-2.5 text-[14px] font-medium text-white transition hover:bg-black"
              >
                {d.cta.whatsapp}
              </a>
              <Link href={`/${lang}/enquiry`} className="rounded-full border border-ink/15 px-6 py-2.5 text-[14px] font-medium transition hover:border-ink/40">
                {d.cta.quote}
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <FaqList lang={lang} />
          </Reveal>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(lang)) }} />
    </>
  );
}
