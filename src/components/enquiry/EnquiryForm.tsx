"use client";

import Link from "next/link";
import { ProductShot } from "@/components/product/ProductShot";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import { useEnquiry, type EnquiryItem, type GiftBrief } from "./EnquiryProvider";
import type { Locale } from "@/lib/i18n";
import { whatsappLink } from "@/lib/site";
import { sendEnquiry } from "./send";

type Status = "idle" | "sending" | "sent" | "error";
type CertTarget = { slug: string; name: string } | null;

const COPY = {
  en: {
    title: "Request a quotation.",
    intro: "Share a few details and we will reply with pricing, lead times and customisation options — usually within one business day.",
    basket: "Your selection",
    empty: "No products selected yet. You can still send a general enquiry, or browse the collection first.",
    browse: "Browse products",
    qty: "Qty",
    remove: "Remove",
    name: "Your name",
    company: "Company",
    email: "Email",
    phone: "Phone / WhatsApp",
    region: "Market",
    regions: ["Hong Kong", "Macau", "Mainland China", "Taiwan", "Southeast Asia", "Other"],
    contactPref: "Preferred contact",
    prefs: ["WhatsApp", "Email", "Phone call"],
    message: "Requirements",
    messagePh: "Target price, delivery date, logo printing, packaging, or anything else we should know.",
    oneOf: "Please provide an email or a phone number.",
    submit: "Send enquiry",
    sending: "Sending…",
    viaWhatsapp: "Or send this enquiry via WhatsApp",
    sentTitle: "Thank you.",
    sentBody: "Your enquiry has been received. Karson will be in touch shortly.",
    errorBody: "We could not send your enquiry automatically. Please use WhatsApp or email instead.",
    gift: "Gift brief",
    certFor: "Certificate request",
    privacy: "Your details are used only to respond to this enquiry.",
  },
  zh: {
    title: "索取報價。",
    intro: "留下簡單資料，我們將提供價格、交貨期及訂製選項，一般於一個工作天內回覆。",
    basket: "已選產品",
    empty: "尚未選擇產品。您仍可直接提交一般查詢，或先瀏覽產品系列。",
    browse: "瀏覽產品",
    qty: "數量",
    remove: "移除",
    name: "姓名",
    company: "公司名稱",
    email: "電郵",
    phone: "電話／WhatsApp",
    region: "市場",
    regions: ["香港", "澳門", "中國內地", "台灣", "東南亞", "其他"],
    contactPref: "首選聯絡方式",
    prefs: ["WhatsApp", "電郵", "電話"],
    message: "需求詳情",
    messagePh: "目標價格、交貨日期、標誌印刷、包裝要求或其他需要我們了解的資料。",
    oneOf: "請提供電郵或電話號碼其中一項。",
    submit: "提交查詢",
    sending: "提交中…",
    viaWhatsapp: "或透過 WhatsApp 發送此查詢",
    sentTitle: "謝謝您。",
    sentBody: "我們已收到您的查詢，Karson 將盡快與您聯絡。",
    errorBody: "系統未能自動發送查詢，請改用 WhatsApp 或電郵聯絡我們。",
    gift: "禮品需求",
    certFor: "認證文件查詢",
    privacy: "您的資料只會用於回覆是次查詢。",
  },
};

export function EnquiryForm({ lang, certLookup }: { lang: Locale; certLookup: Record<string, string> }) {
  const params = useSearchParams();
  const certSlug = params.get("cert");
  const cert: CertTarget = certSlug && certLookup[certSlug] ? { slug: certSlug, name: certLookup[certSlug] } : null;
  return <EnquiryFormInner lang={lang} cert={cert} />;
}

function EnquiryFormInner({ lang, cert }: { lang: Locale; cert: CertTarget }) {
  const c = COPY[lang];
  const { items, gift, ready, update, remove, clear } = useEnquiry();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    region: c.regions[0],
    pref: c.prefs[0],
    message: cert ? (lang === "zh" ? `請提供「${cert.name}」的認證證書及測試報告。` : `Please send the certificates and test reports for the ${cert.name}.`) : "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const summary = useMemo(() => buildSummary(items, gift, cert, lang), [items, gift, cert, lang]);

  const waText = useMemo(
    () =>
      [
        lang === "zh" ? "您好 Karson，以下是我的查詢：" : "Hello Karson, here is my enquiry:",
        summary,
        form.message && `\n${form.message}`,
        form.name && `\n${form.name}${form.company ? ` · ${form.company}` : ""}`,
      ]
        .filter(Boolean)
        .join("\n"),
    [summary, form.message, form.name, form.company, lang],
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() && !form.phone.trim()) {
      setError(c.oneOf);
      return;
    }
    setError("");
    setStatus("sending");

    const ok = await sendEnquiry({
      subject: `New B2B enquiry — ${form.company || form.name}`,
      name: form.name,
      company: form.company,
      email: form.email,
      phone: form.phone,
      market: form.region,
      preferred_contact: form.pref,
      requirements: form.message,
      selection: summary,
      language: lang,
    });
    if (ok) {
      setStatus("sent");
      clear();
    } else {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl py-24 text-center">
        <motion.svg width="64" height="64" viewBox="0 0 64 64" className="mx-auto" initial="hidden" animate="show">
          <motion.circle cx="32" cy="32" r="30" fill="none" stroke="#b8975a" strokeWidth="1.5" variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 0.8 } } }} />
          <motion.path d="M20 33l8 8 16-17" fill="none" stroke="#1d1d1f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { delay: 0.6, duration: 0.5 } } }} />
        </motion.svg>
        <h2 className="headline mt-8 text-[40px]">{c.sentTitle}</h2>
        <p className="mt-4 text-[17px] text-ink-soft">{c.sentBody}</p>
        <Link href={`/${lang}/products`} className="mt-10 inline-block rounded-full bg-ink px-7 py-3 text-[15px] font-medium text-white">
          {c.browse}
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
      <div>
        <h2 className="text-[13px] font-semibold">{c.basket}</h2>
        {cert && (
          <div className="mt-4 rounded-2xl bg-white p-4 text-[13px] ring-1 ring-gold/40">
            <span className="eyebrow text-gold">{c.certFor}</span>
            <p className="mt-1">{cert.name}</p>
          </div>
        )}
        {gift && (
          <div className="mt-4 rounded-2xl bg-white p-4 text-[13px] ring-1 ring-gold/40">
            <span className="eyebrow text-gold">{c.gift}</span>
            <p className="mt-1 leading-relaxed text-ink-soft">{giftLine(gift)}</p>
          </div>
        )}
        <ul className="mt-4 space-y-3">
          <AnimatePresence initial={false}>
            {ready &&
              items.map((item) => (
                <motion.li
                  key={item.key}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-4 rounded-2xl bg-white p-3 pr-4"
                >
                  <Link href={`/${lang}/product/${item.slug}`} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/5">
                    <ProductShot src={item.image} alt="" sizes="64px" pad="p-1" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium">{item.name[lang]}</p>
                    <p className="text-[12px] text-mute">
                      {item.variant[lang]}
                      {item.sku && ` · ${item.sku}`}
                    </p>
                  </div>
                  <label className="flex items-center gap-2 text-[12px] text-mute">
                    {c.qty}
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => update(item.key, Number(e.target.value) || 1)}
                      className="w-20 rounded-full border hairline px-3 py-1.5 text-[13px] tabular-nums text-ink outline-none focus:border-gold"
                    />
                  </label>
                  <button type="button" onClick={() => remove(item.key)} className="text-[18px] leading-none text-mute hover:text-ink" aria-label={c.remove}>
                    ×
                  </button>
                </motion.li>
              ))}
          </AnimatePresence>
        </ul>
        {ready && items.length === 0 && !gift && !cert && (
          <div className="mt-4 rounded-2xl bg-white p-6 text-[14px] leading-relaxed text-mute">
            {c.empty}
            <Link href={`/${lang}/products`} className="mt-3 block font-medium text-gold hover:underline">
              {c.browse} ›
            </Link>
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="rounded-[28px] bg-white p-6 md:p-10" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={c.name} required>
            <input required value={form.name} onChange={set("name")} autoComplete="name" className={inputCls} />
          </Field>
          <Field label={c.company}>
            <input value={form.company} onChange={set("company")} autoComplete="organization" className={inputCls} />
          </Field>
          <Field label={c.email}>
            <input type="email" value={form.email} onChange={set("email")} autoComplete="email" className={inputCls} />
          </Field>
          <Field label={c.phone}>
            <input type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" className={inputCls} />
          </Field>
          <Field label={c.region}>
            <select value={form.region} onChange={set("region")} className={inputCls}>
              {c.regions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </Field>
          <Field label={c.contactPref}>
            <div className="flex gap-2">
              {c.prefs.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, pref: p }))}
                  className={clsx(
                    "flex-1 rounded-full px-3 py-2.5 text-[12px] transition",
                    form.pref === p ? "bg-ink text-white" : "bg-black/[0.05] text-ink-soft hover:bg-black/10",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </Field>
        </div>
        <div className="mt-5">
          <Field label={c.message}>
            <textarea value={form.message} onChange={set("message")} rows={5} placeholder={c.messagePh} className={clsx(inputCls, "resize-none rounded-2xl")} />
          </Field>
        </div>

        {error && <p className="mt-4 text-[13px] text-red-600">{error}</p>}
        {status === "error" && <p className="mt-4 text-[13px] text-red-600">{c.errorBody}</p>}

        <button
          type="submit"
          disabled={status === "sending" || !form.name.trim()}
          className="mt-8 w-full rounded-full bg-ink py-3.5 text-[15px] font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === "sending" ? c.sending : c.submit}
        </button>
        <a
          href={whatsappLink(waText)}
          target="_blank"
          rel="noreferrer"
          className="mt-4 block text-center text-[13px] font-medium text-ink-soft hover:text-ink"
        >
          {c.viaWhatsapp} ›
        </a>
        <p className="mt-6 text-center text-[11px] text-mute">{c.privacy}</p>
      </form>
    </div>
  );
}

const inputCls =
  "w-full rounded-full border hairline bg-paper px-4 py-2.5 text-[14px] text-ink outline-none transition placeholder:text-mute/70 focus:border-gold focus:bg-white";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-medium text-ink-soft">
        {label}
        {required && <span className="text-gold"> *</span>}
      </span>
      {children}
    </label>
  );
}

function giftLine(g: GiftBrief) {
  return [g.occasion, g.budget, g.quantity, g.interests?.join(", "), g.personalisation?.join(", "), g.deadline]
    .filter(Boolean)
    .join(" · ");
}

function buildSummary(items: EnquiryItem[], gift: GiftBrief | null, cert: CertTarget, lang: Locale) {
  const lines = items.map(
    (i, n) => `${n + 1}. ${i.name[lang]} — ${i.variant[lang]}${i.sku ? ` (${i.sku})` : ""} × ${i.quantity}`,
  );
  if (gift) lines.push(`${lang === "zh" ? "禮品需求" : "Gift brief"}: ${giftLine(gift)}`);
  if (cert) lines.push(`${lang === "zh" ? "認證文件" : "Certificates for"}: ${cert.name}`);
  return lines.join("\n") || (lang === "zh" ? "一般查詢" : "General enquiry");
}
