"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";
import { occasionCollections } from "@/lib/occasions";
import { site, whatsappLink } from "@/lib/site";
import { useEnquiry } from "./EnquiryProvider";
import { sendEnquiry } from "./send";

type Status = "idle" | "sending" | "sent" | "error";

export function QuickEnquiry({ lang }: { lang: Locale }) {
  const { items } = useEnquiry();
  const zh = lang === "zh";
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [occasion, setOccasion] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", company: "", contact: "", qty: "", message: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const occasionLabel = occasionCollections.find((o) => o.id === occasion)?.name[lang] ?? "";
  const selection = items.map((i, n) => `${n + 1}. ${i.name[lang]}${i.sku ? ` (${i.sku})` : ""} × ${i.quantity}`).join("\n");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) {
      setError(zh ? "請填寫姓名及電話或電郵。" : "Please add your name and a phone number or email.");
      return;
    }
    setError("");
    setStatus("sending");
    const isEmail = form.contact.includes("@");
    const ok = await sendEnquiry({
      subject: `Quick enquiry — ${form.company || form.name}`,
      name: form.name,
      company: form.company,
      email: isEmail ? form.contact : undefined,
      phone: isEmail ? undefined : form.contact,
      occasion: occasionLabel,
      quantity: form.qty,
      requirements: form.message,
      selection: selection || undefined,
      language: lang,
    });
    setStatus(ok ? "sent" : "error");
  };

  const waText = [
    zh ? "您好 Karson，我想查詢企業禮品：" : "Hello Karson, I'd like to ask about corporate gifts:",
    occasionLabel && `${zh ? "場合" : "Occasion"}：${occasionLabel}`,
    form.qty && `${zh ? "數量" : "Quantity"}：${form.qty}`,
    form.message,
    form.name && `${form.name}${form.company ? ` · ${form.company}` : ""}`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="rounded-[28px] bg-white p-6 ring-1 ring-black/5 md:p-8">
      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div key="sent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-10 text-center">
            <p className="text-[34px]">✓</p>
            <p className="mt-2 text-[20px] font-semibold">{zh ? "已收到您的查詢。" : "We have your enquiry."}</p>
            <p className="mt-2 text-[14px] text-ink-soft">{zh ? `${site.contact.person} 會盡快與您聯絡。` : `${site.contact.person} will be in touch shortly.`}</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0 }}>
            <p className="text-[19px] font-semibold tracking-tight">{zh ? "快速查詢" : "Quick enquiry"}</p>
            <p className="mt-1 text-[13px] text-mute">{zh ? "未決定產品也可以，告訴我們需要，我們為您建議。" : "No product chosen yet? Tell us what you need and we will suggest options."}</p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {occasionCollections.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setOccasion((cur) => (cur === o.id ? null : o.id))}
                  className={clsx(
                    "rounded-full px-3 py-1.5 text-[12px] transition",
                    occasion === o.id ? "bg-ink text-white" : "bg-black/[0.05] text-ink-soft hover:bg-black/10",
                  )}
                >
                  {o.name[lang]}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input value={form.name} onChange={set("name")} placeholder={zh ? "姓名 *" : "Name *"} autoComplete="name" className={inputCls} />
              <input value={form.company} onChange={set("company")} placeholder={zh ? "公司名稱" : "Company"} autoComplete="organization" className={inputCls} />
              <input value={form.contact} onChange={set("contact")} placeholder={zh ? "電話或電郵 *" : "Phone or email *"} autoComplete="tel" className={inputCls} />
              <input value={form.qty} onChange={set("qty")} placeholder={zh ? "預計數量，例如 300" : "Estimated quantity, e.g. 300"} inputMode="numeric" className={inputCls} />
            </div>
            <textarea
              value={form.message}
              onChange={set("message")}
              rows={3}
              placeholder={zh ? "需要甚麼？例如：每件預算、日期、是否印標誌" : "What do you need? Budget per gift, date, logo printing…"}
              className={clsx(inputCls, "mt-3 resize-none rounded-2xl")}
            />
            {items.length > 0 && (
              <p className="mt-2 text-[12px] text-mute">{zh ? `會連同查詢清單內 ${items.length} 件產品一併發送。` : `Your ${items.length} listed products will be included.`}</p>
            )}
            {error && <p className="mt-3 text-[13px] text-red-600">{error}</p>}
            {status === "error" && <p className="mt-3 text-[13px] text-red-600">{zh ? "未能發送，請改用 WhatsApp。" : "Could not send. Please use WhatsApp instead."}</p>}

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                disabled={status === "sending"}
                className="flex-1 rounded-full bg-ink py-3 text-[14px] font-medium text-white transition hover:bg-black disabled:opacity-50"
              >
                {status === "sending" ? (zh ? "發送中…" : "Sending…") : zh ? "發送查詢" : "Send enquiry"}
              </button>
              <a
                href={whatsappLink(waText)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-full border border-ink/15 py-3 text-center text-[14px] font-medium transition hover:border-ink/40"
              >
                WhatsApp {site.contact.whatsappDisplay}
              </a>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls =
  "w-full rounded-full border hairline bg-paper px-4 py-2.5 text-[14px] text-ink outline-none transition placeholder:text-mute/80 focus:border-gold focus:bg-white";
