import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GiftFinder, type FinderChoice, type FinderMode } from "@/components/gifting/GiftFinder";
import { productById, products, toSummary, type Product } from "@/lib/catalog";
import { budgetNotes, festivals, recipients, type Choice } from "@/lib/choices";
import { budgets, giftSets } from "@/lib/gifts";
import { getDict, hasLocale } from "@/lib/i18n";
import { industries, sectors } from "@/lib/industries";
import { occasionCollections } from "@/lib/occasions";
import { site, whatsappLink } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/gifting">): Promise<Metadata> {
  const { lang } = await params;
  return lang === "zh"
    ? {
        title: "企業禮品挑選：按行業、場合、節日及預算",
        description: `按 ${industries.length} 個行業、場合、節日、收禮對象或預算挑選企業禮品，每個選項附實用禮品建議，可印標誌及訂製包裝。`,
      }
    : {
        title: "Corporate Gift Finder: by industry, occasion, festival & budget",
        description: `Find corporate gifts by ${industries.length} industries, occasion, festival, recipient or budget — with logo printing and custom packaging.`,
      };
}

const found = (ids: string[]) => ids.map(productById).filter((p): p is Product => Boolean(p));
const items = (ids: string[]) => found(ids).map((p) => ({ ...toSummary(p), budget: budgets.find((b) => b.id === p.band)?.label ?? null }));
const fromChoice = (c: Choice): FinderChoice => ({ id: c.id, name: c.name, why: c.why, uses: c.uses, items: items(c.productIds) });

function budgetPicks(band: string, take = 6) {
  const pool = products.filter((p) => p.giftable && p.band === band);
  const byCat = new Map<string, Product[]>();
  for (const p of pool) byCat.set(p.category, [...(byCat.get(p.category) ?? []), p]);
  const queues = [...byCat.values()];
  const picked: string[] = [];
  for (let round = 0; picked.length < take && queues.some((q) => q.length > round); round++) {
    for (const q of queues) if (q[round] && picked.length < take) picked.push(q[round].id);
  }
  return picked;
}

export default async function GiftingPage({ params }: PageProps<"/[lang]/gifting">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDict(lang);
  const zh = lang === "zh";

  const modes: FinderMode[] = [
    {
      id: "industry",
      label: { zh: "按行業", en: "By industry" },
      groups: sectors,
      choices: industries.map((i) => ({ id: i.id, group: i.sector, name: i.name, why: i.why, uses: i.uses, items: items(i.productIds) })),
    },
    {
      id: "occasion",
      label: { zh: "按場合", en: "By occasion" },
      choices: occasionCollections.map((o) => ({ id: o.id, name: o.name, why: o.intro, uses: o.points, items: items(o.productIds) })),
    },
    { id: "festival", label: { zh: "按節日", en: "By festival" }, choices: festivals.map(fromChoice) },
    { id: "recipient", label: { zh: "按收禮對象", en: "By recipient" }, choices: recipients.map(fromChoice) },
    {
      id: "budget",
      label: { zh: "按預算", en: "By budget" },
      choices: budgets.map((b) => ({
        id: `budget-${b.id}`,
        name: { zh: `每件 ${b.label.zh}`, en: `${b.label.en} per unit` },
        why: budgetNotes[b.id].why,
        uses: budgetNotes[b.id].uses,
        items: items(budgetPicks(b.id)),
      })),
    },
    {
      id: "sets",
      label: { zh: "現成禮盒", en: "Ready-made sets" },
      choices: giftSets.map((g) => ({ id: g.id, name: g.name, why: g.mood, uses: [g.tag], items: items(g.productIds) })),
    },
  ];
  const total = modes.reduce((n, m) => n + m.choices.length, 0);

  return (
    <div className="bg-mist">
      <div className="mx-auto max-w-[1180px] px-5 pb-12 pt-[72px] md:px-8 md:pt-20">
        <header className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-gold">{d.nav.gifting}</p>
            <h1 className="headline mt-2 text-[28px] md:text-[36px]">{zh ? "企業禮品挑選。" : "Corporate gift finder."}</h1>
          </div>
          <p className="max-w-md text-[14px] leading-relaxed text-ink-soft md:text-right">
            {zh
              ? `我們專注電器及小家電禮品。按行業、場合、節日、收禮對象、預算或現成禮盒，共 ${total} 組建議。揀好即可一鍵加入查詢，或直接 WhatsApp 我們。`
              : `We specialise in electrical appliance gifts. ${total} ready suggestions by industry, occasion, festival, recipient, budget or set. Add any of them to your enquiry in one tap.`}
          </p>
        </header>

        <GiftFinder modes={modes} lang={lang} />

        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl bg-ink px-6 py-5 text-white md:flex-row md:items-center">
          <div>
            <p className="text-[16px] font-semibold">{zh ? "找不到合適的選擇？" : "Can't find the right fit?"}</p>
            <p className="mt-0.5 text-[13px] text-white/60">
              {zh ? "告訴我們您的行業、場合、數量及預算，我們會為您配搭建議。" : "Tell us your industry, occasion, quantity and budget — we'll put together suggestions."}
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={whatsappLink(zh ? "您好，我想查詢企業禮品建議。" : "Hello, I'd like some corporate gift suggestions.")}
              target="_blank"
              rel="noreferrer"
              className="whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-[13px] font-medium text-ink transition hover:bg-white/90"
            >
              WhatsApp {site.contact.whatsappDisplay}
            </a>
            <Link href={`/${lang}/enquiry`} className="whitespace-nowrap rounded-full px-5 py-2.5 text-[13px] font-medium text-white ring-1 ring-white/30 transition hover:ring-white">
              {d.cta.quote}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
