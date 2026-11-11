import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LogoMark } from "@/components/Logo";
import { OpenChatButton } from "@/components/chat/OpenChatButton";
import { Reveal } from "@/components/motion/Reveal";
import { getDict, hasLocale } from "@/lib/i18n";
import { site, whatsappLink } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  return lang === "zh"
    ? { title: "聯絡我們", description: "透過 WhatsApp、電郵或網上查詢表格聯絡 Dimensions Group。" }
    : { title: "Contact", description: "Reach Dimensions Group by WhatsApp, email or the online enquiry form." };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDict(lang);
  const zh = lang === "zh";
  const c = site.contact;

  const channels = [
    {
      label: "WhatsApp",
      value: c.whatsappDisplay,
      note: zh ? "最快回覆" : "Fastest reply",
      href: whatsappLink(zh ? "您好 Karson，我想查詢 Dimensions Group 的產品。" : "Hello Karson, I would like to enquire about Dimensions Group products."),
      external: true,
    },
    { label: zh ? "電郵" : "Email", value: c.email, note: zh ? "報價及文件" : "Quotes and documents", href: `mailto:${c.email}`, external: false },
    {
      label: zh ? "查詢表格" : "Enquiry form",
      value: zh ? "列出產品及數量" : "List products and quantities",
      note: zh ? "最完整的報價資料" : "Most complete quote brief",
      href: `/${lang}/enquiry`,
      external: false,
    },
  ];

  return (
    <section className="bg-mist pb-12 pt-24 md:pb-16 md:pt-28">
      <div className="mx-auto max-w-[1180px] px-5 md:px-8">
        <Reveal>
          <p className="eyebrow text-gold">{d.nav.contact}</p>
          <h1 className="headline mt-5 max-w-4xl text-[30px] md:text-[44px]">
            {zh ? (
              <>
                隨時，<span className="text-gradient-gold">樂意效勞。</span>
              </>
            ) : (
              <>
                Here when <span className="text-gradient-gold">you need us.</span>
              </>
            )}
          </h1>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Reveal className="rounded-[32px] bg-white p-8 ring-1 ring-black/5 md:p-12">
            <div className="logo flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-mist ring-1 ring-black/5">
                <LogoMark tone="dark" className="h-9 w-9" />
              </div>
              <div>
                <p className="text-[24px] font-semibold tracking-tight">{c.person}</p>
                <p className="text-[14px] text-mute">{c.role[lang]}</p>
              </div>
            </div>
            <p className="mt-8 max-w-md text-[16px] leading-relaxed text-ink-soft">
              {zh
                ? "產品選擇、報價、樣品、企業禮品及認證文件，都可直接與我聯絡。"
                : "For product selection, quotations, samples, corporate gifting or certification documents, contact me directly."}
            </p>
            <p className="mt-8 text-[13px] text-mute">{site.name} · Hong Kong SAR</p>
            <OpenChatButton className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-white transition hover:bg-black">
              {zh ? "先問 AI 產品顧問" : "Ask our AI concierge first"}
            </OpenChatButton>
          </Reveal>

          <div className="space-y-4">
            {channels.map((ch, i) => (
              <Reveal key={ch.label} delay={i * 0.06}>
                <Link
                  href={ch.href}
                  target={ch.external ? "_blank" : undefined}
                  rel={ch.external ? "noreferrer" : undefined}
                  className="group flex items-center justify-between rounded-[24px] bg-paper p-7 transition hover:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.35)]"
                >
                  <div>
                    <p className="text-[12px] font-medium tracking-wider text-gold">{ch.label}</p>
                    <p className="mt-2 text-[19px] font-semibold tracking-tight">{ch.value}</p>
                    <p className="mt-1 text-[13px] text-mute">{ch.note}</p>
                  </div>
                  <span className="text-[22px] text-mute transition group-hover:translate-x-1 group-hover:text-ink">›</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
