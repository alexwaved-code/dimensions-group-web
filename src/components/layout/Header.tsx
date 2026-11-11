"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import clsx from "clsx";
import { Logo } from "@/components/Logo";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import { ProductShot } from "@/components/product/ProductShot";
import { SiteSearch, type SearchHit } from "@/components/layout/SiteSearch";
import type { Dict, L, Locale } from "@/lib/i18n";
import { industries } from "@/lib/industries";
import { site, whatsappLink } from "@/lib/site";

type NavCategory = { id: string; name: L; count: number; cover: string };
type NavOccasion = { id: string; name: L; tint: string; cover: string };
type NavBudget = { id: string; label: L };
type Menu = "products" | "gifting" | null;

const EASE = [0.28, 0.11, 0.32, 1] as const;

export function Header({
  lang,
  d,
  categories,
  occasions,
  budgets,
  total,
  searchIndex,
}: {
  lang: Locale;
  d: Dict;
  categories: NavCategory[];
  occasions: NavOccasion[];
  budgets: NavBudget[];
  total: number;
  searchIndex: SearchHit[];
}) {
  const zh = lang === "zh";
  const pathname = usePathname() ?? `/${lang}`;
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<Menu>(null);
  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const { items, ready, setDrawer } = useEnquiry();
  const count = ready ? items.length : 0;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < 24);
      if (y < 120) setHidden(false);
      else if (y > lastY.current + 6) setHidden(true);
      else if (y < lastY.current - 6) setHidden(false);
      lastY.current = y;
    };
    const first = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const tucked = hidden && !open && !menu;

  useEffect(() => {
    document.documentElement.style.setProperty("--hdr", tucked ? "0px" : "56px");
  }, [tucked]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const [path, setPath] = useState(pathname);
  if (path !== pathname) {
    setPath(pathname);
    setOpen(false);
    setMenu(null);
  }

  const section = pathname.replace(/^\/(en|zh)/, "");
  const current = /^\/products?(\/|$)/.test(section)
    ? "products"
    : section.startsWith("/gifting")
      ? "gifting"
      : section.startsWith("/customisation")
        ? "customisation"
        : section.startsWith("/quality")
          ? "quality"
          : section.startsWith("/about")
            ? "about"
            : section.startsWith("/contact")
              ? "contact"
              : null;

  const nav: { id: string; label: string; href: string; menu?: Menu }[] = [
    { id: "products", label: d.nav.products, href: `/${lang}/products`, menu: "products" },
    { id: "gifting", label: d.nav.gifting, href: `/${lang}/gifting`, menu: "gifting" },
    { id: "customisation", label: d.nav.customisation, href: `/${lang}/customisation` },
    { id: "quality", label: d.nav.quality, href: `/${lang}/quality` },
    { id: "about", label: d.nav.about, href: `/${lang}/about` },
    { id: "contact", label: d.nav.contact, href: `/${lang}/contact` },
  ];

  const waHello = zh ? "您好，我想查詢企業禮品。" : "Hello, I'd like to ask about corporate gifts.";
  const shown = menu ?? (open ? null : current);

  return (
    <>
      <AnimatePresence>
        {menu && (
          <motion.button
            type="button"
            aria-label={zh ? "關閉選單" : "Close menu"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 hidden bg-ink/15 backdrop-blur-sm lg:block"
            onClick={() => setMenu(null)}
          />
        )}
      </AnimatePresence>

      <header
        className={clsx(
          "no-print fixed inset-x-0 top-0 transition-transform duration-500 ease-[cubic-bezier(0.28,0.11,0.32,1)]",
          open ? "z-[55]" : "z-50",
          tucked && "-translate-y-full",
        )}
        onMouseLeave={() => setMenu(null)}
      >
        {/* Contact strip */}
        <div
          className={clsx(
            "hidden overflow-hidden bg-ink text-white/80 transition-[height] duration-300 sm:block",
            atTop && !open ? "sm:h-8" : "h-0",
          )}
        >
          <div className="mx-auto flex h-8 max-w-[1180px] items-center justify-between gap-4 px-5 text-[12px] md:px-8">
            <p className="hidden truncate sm:block">
              {zh ? "專注電器及小家電企業禮品 · 可印標誌及訂製包裝" : "Electrical appliance gifts specialist · Logo printing & packaging on request"}
            </p>
            <div className="flex flex-1 items-center justify-between gap-4 sm:flex-none sm:justify-end">
              <a href={whatsappLink(waHello)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 transition hover:text-white">
                <WaIcon />
                {site.contact.whatsappDisplay}
              </a>
              <a href={`mailto:${site.contact.email}`} className="hidden transition hover:text-white md:inline">
                {site.contact.email}
              </a>
              <Link href={`/${lang}/faq`} className="hidden transition hover:text-white md:inline">
                {d.nav.faq}
              </Link>
              <Suspense fallback={<span className="w-14" />}>
                <LanguageSwitch lang={lang} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Main bar */}
        <nav className={clsx("glass transition-colors duration-500", (!atTop || menu || open) && "border-b hairline")}>
          <div className="mx-auto flex h-14 max-w-[1180px] items-center gap-4 px-5 md:px-8">
            <Link href={`/${lang}`} aria-label="Dimensions Group home" className="shrink-0">
              <Logo />
            </Link>

            <ul className="hidden h-full flex-1 items-center justify-center gap-1 text-[13px] lg:flex">
              {nav.map((n) => (
                <li key={n.id} className="relative flex h-full items-center">
                  <Link
                    href={n.href}
                    onMouseEnter={() => setMenu(n.menu ?? null)}
                    onFocus={() => setMenu(n.menu ?? null)}
                    aria-current={current === n.id ? "page" : undefined}
                    aria-haspopup={n.menu ? "true" : undefined}
                    aria-expanded={n.menu ? menu === n.menu : undefined}
                    className={clsx(
                      "flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1.5 transition-colors",
                      current === n.id ? "font-medium text-ink" : "text-ink-soft hover:text-ink",
                    )}
                  >
                    {n.label}
                    {n.menu && (
                      <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden className={clsx("transition-transform duration-300", menu === n.menu && "rotate-180")}>
                        <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                    )}
                  </Link>
                  {shown === n.id && (
                    <motion.span
                      layoutId="nav-underline"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }}
                      className="absolute inset-x-2.5 bottom-0 h-[2px] rounded-full bg-gold"
                    />
                  )}
                </li>
              ))}
            </ul>

            <div className="ml-auto flex items-center gap-1.5 md:gap-2 lg:ml-0">
              <span className="sm:hidden">
                <Suspense fallback={<span className="w-8" />}>
                  <LanguageSwitch lang={lang} />
                </Suspense>
              </span>
              <SiteSearch lang={lang} index={searchIndex} />
              <button
                type="button"
                onClick={() => setDrawer(true)}
                className="relative flex h-9 items-center gap-1.5 rounded-full px-2.5 text-ink transition hover:bg-black/5"
                aria-label={`${d.nav.enquiry}${count ? ` (${count})` : ""}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M6 7h12l-1 13H7L6 7Z" strokeLinejoin="round" />
                  <path d="M9 7a3 3 0 1 1 6 0" />
                </svg>
                <span className="hidden whitespace-nowrap text-[12px] 2xl:inline">{d.nav.enquiry}</span>
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={reduce ? false : { scale: 0.4 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 600, damping: 18 }}
                      className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-white"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <Link
                href={`/${lang}/enquiry`}
                className="hidden rounded-full bg-ink px-4 py-1.5 text-[12px] whitespace-nowrap font-medium text-white transition hover:bg-black md:inline-block"
              >
                {d.cta.quote}
              </Link>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center lg:hidden"
                onClick={() => setOpen((v) => !v)}
                aria-label={zh ? "選單" : "Menu"}
                aria-expanded={open}
              >
                <span className="relative block h-3 w-5">
                  <span className={clsx("absolute left-0 h-px w-5 bg-ink transition-all duration-300", open ? "top-1.5 rotate-45" : "top-0")} />
                  <span className={clsx("absolute left-0 h-px w-5 bg-ink transition-all duration-300", open ? "top-1.5 -rotate-45" : "top-3")} />
                </span>
              </button>
            </div>
          </div>
        </nav>

        {/* Mega menus */}
        <AnimatePresence initial={false}>
          {menu && (
            <motion.div
              key="mega"
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="hidden lg:block"
            >
              <div className="border-b hairline bg-paper/95 shadow-[0_28px_50px_-28px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                <AnimatePresence mode="wait" initial={false}>
                  {menu === "products" ? (
                    <MegaPanel key="products">
                      <div className="space-y-5">
                        <Link href={`/${lang}/products`} className="group block rounded-2xl bg-ink p-4 text-white transition hover:bg-black">
                          <span className="block text-[12px] text-white/60">{zh ? `${total} 款型號` : `${total} models`}</span>
                          <span className="mt-1 flex items-center justify-between text-[17px] font-semibold tracking-tight">
                            {d.nav.allProducts}
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                          </span>
                        </Link>
                        <div>
                          <p className="eyebrow mb-2 text-mute">{zh ? "按每件預算" : "By budget"}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {budgets.map((b) => (
                              <Link
                                key={b.id}
                                href={`/${lang}/products?budget=${b.id}`}
                                className="rounded-full bg-white px-3 py-1.5 text-[12px] text-ink-soft ring-1 ring-black/10 transition hover:text-ink hover:ring-gold"
                              >
                                {b.label[lang]}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                      <ul className="grid grid-cols-4 gap-2">
                        {categories.map((c) => (
                          <li key={c.id}>
                            <Link href={`/${lang}/products/${c.id}`} className="group flex items-center gap-3 rounded-2xl p-2 transition hover:bg-white hover:shadow-[0_6px_20px_-12px_rgba(0,0,0,0.25)]">
                              <span className="relative block h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-mist">
                                <ProductShot src={c.cover} alt="" sizes="44px" pad="p-1" bg="bg-transparent" className="mix-blend-darken transition-transform duration-500 group-hover:scale-110" />
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-[13px] font-medium text-ink">{c.name[lang]}</span>
                                <span className="block text-[11px] text-mute">{zh ? `${c.count} 款` : `${c.count} items`}</span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </MegaPanel>
                  ) : (
                    <MegaPanel key="gifting">
                      <div className="space-y-1">
                        <Link href={`/${lang}/gifting#industry`} className="group block rounded-2xl bg-ink p-4 text-white transition hover:bg-black">
                          <span className="block text-[12px] text-white/60">{zh ? `${industries.length} 個行業 · 每個 6 款建議` : `${industries.length} industries · 6 ideas each`}</span>
                          <span className="mt-1 flex items-center justify-between text-[17px] font-semibold tracking-tight">
                            {zh ? "按行業挑選" : "Gifts by industry"}
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                          </span>
                        </Link>
                        {[
                          { href: `/${lang}/gifting#festival`, label: zh ? "按節日" : "By festival" },
                          { href: `/${lang}/gifting#recipient`, label: zh ? "按收禮對象" : "By recipient" },
                          { href: `/${lang}/gifting#budget`, label: zh ? "按預算" : "By budget" },
                          { href: `/${lang}/gifting#sets`, label: zh ? "現成禮盒" : "Ready-made sets" },
                        ].map((l) => (
                          <Link key={l.href} href={l.href} className="flex items-center justify-between rounded-xl px-3 py-2 text-[13px] text-ink-soft transition hover:bg-white hover:text-ink">
                            {l.label}
                            <span className="text-mute">›</span>
                          </Link>
                        ))}
                      </div>
                      <ul className="grid grid-cols-3 gap-2">
                        {occasions.map((o) => (
                          <li key={o.id}>
                            <Link href={`/${lang}/gifting/${o.id}`} className="group flex items-center gap-3 rounded-2xl p-2 transition hover:bg-white hover:shadow-[0_6px_20px_-12px_rgba(0,0,0,0.25)]">
                              <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-xl" style={{ background: o.tint }}>
                                <ProductShot src={o.cover} alt="" sizes="56px" pad="p-1.5" bg="bg-transparent" className="mix-blend-darken transition-transform duration-500 group-hover:scale-110" />
                              </span>
                              <span className="text-[13px] font-medium leading-snug text-ink">{o.name[lang]}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </MegaPanel>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-x-0 bottom-0 top-14 flex flex-col bg-paper lg:hidden"
            >
              <div className="flex-1 overflow-y-auto px-5 pb-6 pt-4">
                <ul className="grid grid-cols-2 gap-2">
                  {nav.map((n) => (
                    <li key={n.id}>
                      <Link
                        href={n.href}
                        aria-current={current === n.id ? "page" : undefined}
                        className={clsx(
                          "block rounded-2xl px-4 py-3 text-[15px] font-medium transition",
                          current === n.id ? "bg-ink text-white" : "bg-mist text-ink",
                        )}
                      >
                        {n.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <p className="eyebrow mb-2 mt-6 text-mute">{d.nav.products}</p>
                <ul className="grid grid-cols-3 gap-2">
                  {categories.map((c) => (
                    <li key={c.id}>
                      <Link href={`/${lang}/products/${c.id}`} className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-2 text-center ring-1 ring-black/5">
                        <span className="relative block h-12 w-12 overflow-hidden rounded-full bg-mist">
                          <ProductShot src={c.cover} alt="" sizes="48px" pad="p-1" bg="bg-transparent" className="mix-blend-darken" />
                        </span>
                        <span className="text-[11px] leading-tight text-ink-soft">{c.name[lang]}</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <p className="eyebrow mb-2 mt-6 text-mute">{zh ? "按場合" : "By occasion"}</p>
                <ul className="space-y-1">
                  {occasions.map((o) => (
                    <li key={o.id}>
                      <Link href={`/${lang}/gifting/${o.id}`} className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[14px] text-ink-soft" style={{ background: o.tint }}>
                        {o.name[lang]}
                        <span className="text-mute">›</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-between border-t hairline px-5 py-2 text-[12px] text-mute">
                <a href={`mailto:${site.contact.email}`} className="truncate">{site.contact.email}</a>
                <Link href={pathname.replace(/^\/(en|zh)(?=\/|$)/, `/${zh ? "en" : "zh"}`)} className="rounded-full px-2.5 py-1 font-medium text-ink ring-1 ring-black/10">
                  {zh ? "English" : "繁體中文"}
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2 bg-paper px-5 pb-3">

                <a href={whatsappLink(waHello)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-[14px] font-medium text-white">
                  <WaIcon />
                  WhatsApp
                </a>
                <Link href={`/${lang}/enquiry`} className="flex items-center justify-center rounded-full bg-ink py-3 text-[14px] font-medium text-white">
                  {d.cta.quote}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

function MegaPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="mx-auto grid max-w-[1180px] grid-cols-[240px_1fr] gap-8 px-8 py-6"
    >
      {children}
    </motion.div>
  );
}

function WaIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}

function LanguageSwitch({ lang }: { lang: Locale }) {
  const pathname = usePathname() ?? `/${lang}`;
  const other: Locale = lang === "en" ? "zh" : "en";
  const target = pathname.replace(/^\/(en|zh)(?=\/|$)/, `/${other}`);
  return (
    <Link
      href={target}
      className="rounded-full px-2 py-0.5 text-[12px] font-medium ring-1 ring-current/30 transition hover:bg-ink hover:text-white sm:hover:bg-white sm:hover:text-ink"
      aria-label={other === "zh" ? "切換至繁體中文" : "Switch to English"}
    >
      {other === "zh" ? "繁中" : "EN"}
    </Link>
  );
}
