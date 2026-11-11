import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { Reveal } from "@/components/motion/Reveal";
import { products } from "@/lib/catalog";
import { hasLocale } from "@/lib/i18n";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/enquiry">): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "zh" ? "索取報價" : "Request a Quote" };
}

export default async function EnquiryPage({ params }: PageProps<"/[lang]/enquiry">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const zh = lang === "zh";
  const certLookup = Object.fromEntries(products.map((p) => [p.slug, p.name[lang]]));

  return (
    <div className="bg-mist">
      <div className="mx-auto max-w-[1180px] px-5 pb-14 pt-24 md:px-8 md:pt-28">
        <Reveal>
          <p className="eyebrow text-gold">{zh ? "查詢清單" : "Enquiry"}</p>
          <h1 className="headline mt-4 text-[44px] md:text-[68px]">{zh ? "索取報價。" : "Request a quotation."}</h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-soft">
            {zh
              ? "留下簡單資料，我們將提供價格、交貨期及訂製選項，一般於一個工作天內回覆。"
              : "Share a few details and we will reply with pricing, lead times and customisation options — usually within one business day."}
          </p>
          <p className="mt-3 text-[13px] text-mute">
            {site.contact.person} · {site.contact.role[lang]} · {site.contact.email} · WhatsApp {site.contact.whatsappDisplay}
          </p>
        </Reveal>
        <div className="mt-10">
          <Suspense fallback={<div className="h-96" />}>
            <EnquiryForm lang={lang} certLookup={certLookup} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
