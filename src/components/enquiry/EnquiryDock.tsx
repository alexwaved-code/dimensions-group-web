"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ProductShot } from "@/components/product/ProductShot";
import type { Locale } from "@/lib/i18n";
import { whatsappLink } from "@/lib/site";
import { useEnquiry } from "./EnquiryProvider";

const SPRING = { type: "spring" as const, stiffness: 380, damping: 36 };

export function EnquiryDock({ lang }: { lang: Locale }) {
  const { items, ready, update, remove, drawer, setDrawer, notice, dismiss } = useEnquiry();
  const pathname = usePathname() ?? "";
  const reduce = useReducedMotion();
  const zh = lang === "zh";
  const onEnquiry = pathname.endsWith("/enquiry");
  const count = ready ? items.length : 0;
  const units = items.reduce((n, i) => n + i.quantity, 0);
  const motionT = reduce ? { duration: 0 } : SPRING;

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawer, setDrawer]);

  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(dismiss, 2600);
    return () => window.clearTimeout(t);
  }, [notice, dismiss]);

  const waText = [
    zh ? "您好 Karson，我想查詢以下產品：" : "Hello Karson, I'd like a quote for:",
    ...items.map((i, n) => `${n + 1}. ${i.name[lang]}${i.sku ? ` (${i.sku})` : ""} × ${i.quantity}`),
  ].join("\n");

  return (
    <>
      <AnimatePresence>
        {notice && !drawer && (
          <motion.div
            key="notice"
            role="status"
            initial={reduce ? false : { y: 16, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={reduce ? undefined : { y: 8, opacity: 0 }}
            transition={motionT}
            className="no-print fixed bottom-20 left-3 right-16 z-40 md:bottom-[84px] md:left-1/2 md:right-auto md:w-[min(92vw,360px)] md:-translate-x-1/2"
          >
            <div className="flex items-center gap-3 rounded-2xl bg-white p-2 pr-3 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-mist">
                <ProductShot src={notice.image} alt="" sizes="40px" pad="p-1" bg="bg-transparent" className="mix-blend-darken" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 text-[12px] font-medium text-gold">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden>
                    <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {zh ? "已加入查詢清單" : "Added to enquiry list"}
                </span>
                <span className="block truncate text-[13px] text-ink">
                  {notice.name[lang]}
                  {notice.more > 0 && <span className="text-mute">{zh ? ` 及另外 ${notice.more} 件` : ` + ${notice.more} more`}</span>}
                </span>
              </span>
              <button type="button" onClick={() => { dismiss(); setDrawer(true); }} className="shrink-0 text-[12px] font-medium text-ink underline-offset-2 hover:underline">
                {zh ? "查看" : "View"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {count > 0 && !onEnquiry && !drawer && (
          <motion.div
            initial={reduce ? false : { y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? undefined : { y: 80, opacity: 0 }}
            transition={motionT}
            className="no-print fixed bottom-4 left-3 right-16 z-40 flex justify-center md:bottom-5 md:left-5 md:right-auto md:justify-start lg:left-1/2 lg:-translate-x-1/2"
          >
            <div className="flex w-full max-w-[460px] items-center gap-2 rounded-full bg-ink p-1.5 text-white shadow-[0_18px_40px_-16px_rgba(0,0,0,0.55)] lg:w-[460px]">
              <button type="button" onClick={() => setDrawer(true)} className="flex min-w-0 flex-1 items-center gap-2.5 rounded-full py-1 pl-1.5 pr-2 text-left transition hover:bg-white/10">
                <span className="hidden -space-x-2 sm:flex">
                  {items.slice(0, 3).map((i) => (
                    <span key={i.key} className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-ink">
                      <ProductShot src={i.image} alt="" sizes="32px" pad="p-0.5" />
                    </span>
                  ))}
                </span>
                <span className="min-w-0 truncate text-[13px]">
                  <motion.span key={count} initial={reduce ? false : { scale: 1.4 }} animate={{ scale: 1 }} className="inline-block font-semibold tabular-nums">
                    {count}
                  </motion.span>{" "}
                  {zh ? "件產品" : count === 1 ? "product" : "products"}
                  <span className="hidden text-white/50 sm:inline"> · {zh ? "查看清單" : "Review list"}</span>
                </span>
              </button>
              <Link href={`/${lang}/enquiry`} className="shrink-0 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-ink transition hover:bg-white/90">
                {zh ? "提交查詢" : "Get a quote"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.button
              type="button"
              aria-label={zh ? "關閉" : "Close"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)}
              className="no-print fixed inset-0 z-[60] cursor-default bg-ink/20 backdrop-blur-sm"
            />
            <motion.aside
              role="dialog"
              aria-label={zh ? "查詢清單" : "Enquiry list"}
              initial={reduce ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduce ? undefined : { x: "100%" }}
              transition={motionT}
              className="no-print fixed inset-y-0 right-0 z-[61] flex w-full max-w-[420px] flex-col bg-paper shadow-[-30px_0_80px_-30px_rgba(0,0,0,0.35)]"
            >
              <header className="flex items-center justify-between border-b hairline px-6 py-5">
                <div>
                  <p className="text-[17px] font-semibold tracking-tight">{zh ? "查詢清單" : "Enquiry list"}</p>
                  <p className="text-[12px] text-mute">
                    {zh ? `${count} 件產品，合共約 ${units.toLocaleString()} 件` : `${count} products, about ${units.toLocaleString()} units`}
                  </p>
                </div>
                <button type="button" onClick={() => setDrawer(false)} className="grid h-9 w-9 place-items-center rounded-full text-[20px] text-mute transition hover:bg-black/5 hover:text-ink" aria-label={zh ? "關閉" : "Close"}>
                  ×
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                {count === 0 ? (
                  <div className="px-2 py-16 text-center text-[14px] text-mute">
                    {zh ? "清單仍是空的。在產品卡按「＋」即可加入。" : "Your list is empty. Tap “+” on any product to add it."}
                    <Link href={`/${lang}/products?gift=1`} onClick={() => setDrawer(false)} className="mt-4 block font-medium text-gold hover:underline">
                      {zh ? "瀏覽適合送禮產品" : "Browse gift-ready products"} ›
                    </Link>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <motion.li
                          key={item.key}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 40 }}
                          className="flex items-center gap-3 rounded-2xl bg-white p-2.5 pr-3 ring-1 ring-black/5"
                        >
                          <Link href={`/${lang}/product/${item.slug}`} onClick={() => setDrawer(false)} className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                            <ProductShot src={item.image} alt="" sizes="56px" pad="p-1" />
                          </Link>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-medium">{item.name[lang]}</p>
                            <p className="truncate text-[11px] text-mute">{item.sku ?? item.variant[lang]}</p>
                            <div className="mt-1.5 flex items-center gap-1">
                              <Step label="−" onClick={() => update(item.key, item.quantity - 50)} />
                              <input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={(e) => update(item.key, Number(e.target.value) || 1)}
                                aria-label={zh ? "數量" : "Quantity"}
                                className="w-16 rounded-full border hairline bg-paper px-2 py-0.5 text-center text-[12px] tabular-nums outline-none focus:border-gold"
                              />
                              <Step label="+" onClick={() => update(item.key, item.quantity + 50)} />
                            </div>
                          </div>
                          <button type="button" onClick={() => remove(item.key)} className="self-start text-[16px] leading-none text-mute hover:text-ink" aria-label={zh ? "移除" : "Remove"}>
                            ×
                          </button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </div>

              {count > 0 && (
                <footer className="space-y-2 border-t hairline p-4">
                  <Link
                    href={`/${lang}/enquiry`}
                    onClick={() => setDrawer(false)}
                    className="block rounded-full bg-ink py-3 text-center text-[14px] font-medium text-white transition hover:bg-black"
                  >
                    {zh ? "填寫資料並提交查詢" : "Add details and submit"}
                  </Link>
                  <a
                    href={whatsappLink(waText)}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-full border border-ink/15 py-3 text-center text-[14px] font-medium transition hover:border-ink/40"
                  >
                    {zh ? "用 WhatsApp 發送清單" : "Send list on WhatsApp"}
                  </a>
                  <p className="pt-1 text-center text-[11px] text-mute">{zh ? "數量可於提交前或報價時再調整。" : "Quantities can be adjusted before or after quoting."}</p>
                </footer>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Step({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="grid h-6 w-6 place-items-center rounded-full bg-black/[0.05] text-[13px] text-ink-soft transition hover:bg-black/10">
      {label}
    </button>
  );
}
