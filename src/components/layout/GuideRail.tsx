"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";

type Item = {
  id: string;
  section?: string;
  zh: string;
  en: string;
  href: (lang: Locale) => string;
  icon: ReactNode;
};

const mark = (children: ReactNode) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
);

const ITEMS: Item[] = [
  {
    id: "occasions",
    section: "occasions",
    zh: "按場合",
    en: "Occasion",
    href: (lang) => `/${lang}#occasions`,
    icon: mark(
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </>,
    ),
  },
  {
    id: "picks",
    section: "picks",
    zh: "推薦禮品",
    en: "Picks",
    href: (lang) => `/${lang}#picks`,
    icon: mark(
      <>
        <path d="M12 3l2.2 4.6L19 8.2l-3.5 3.4.8 4.9L12 14.2 7.7 16.5l.8-4.9L5 8.2l4.8-.6Z" />
      </>,
    ),
  },
  {
    id: "budget",
    section: "budget",
    zh: "按預算",
    en: "Budget",
    href: (lang) => `/${lang}#budget`,
    icon: mark(
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v8M9.5 10.2c.6-.8 1.5-1.2 2.5-1.2 1.4 0 2.4.8 2.4 1.9S13.4 13 12 13s-2.4.8-2.4 1.9 1 1.9 2.4 1.9c1 0 1.9-.4 2.5-1.1" />
      </>,
    ),
  },
  {
    id: "custom",
    section: "custom",
    zh: "訂製服務",
    en: "Custom",
    href: (lang) => `/${lang}/customisation`,
    icon: mark(
      <>
        <path d="M4 17.5 14.5 7l3 3L7 20.5H4Z" />
        <path d="m13 8.5 3-3 2 2-3 3" />
      </>,
    ),
  },
  {
    id: "products",
    zh: "全部產品",
    en: "All products",
    href: (lang) => `/${lang}/products`,
    icon: mark(
      <>
        <rect x="4" y="4" width="7" height="7" rx="1.5" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" />
      </>,
    ),
  },
  {
    id: "faq",
    section: "faq",
    zh: "常見問題",
    en: "FAQ",
    href: (lang) => `/${lang}/faq`,
    icon: mark(
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M9.5 9.5a2.5 2.5 0 1 1 3.2 2.4c-.7.3-1.2.9-1.2 1.6V14" />
        <path d="M12 17h.01" />
      </>,
    ),
  },
  {
    id: "quote",
    section: "quote",
    zh: "索取報價",
    en: "Quote",
    href: (lang) => `/${lang}/enquiry`,
    icon: mark(
      <>
        <path d="M6 7h12l-1 13H7L6 7Z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </>,
    ),
  },
];

const SECTIONS = ITEMS.flatMap((item) => (item.section ? [item.section] : []));

export function GuideRail({ lang }: { lang: Locale }) {
  const pathname = usePathname() ?? `/${lang}`;
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [pinPath, setPinPath] = useState(pathname);
  const [section, setSection] = useState<string | null>(null);
  const open = hover || pinned;
  const home = pathname === `/${lang}`;
  const zh = lang === "zh";

  if (pinPath !== pathname) {
    setPinPath(pathname);
    setPinned(false);
  }

  useEffect(() => {
    if (!home) return;
    const onScroll = () => {
      const line = window.scrollY + window.innerHeight * 0.36;
      let current: string | null = null;
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= line) current = id;
      }
      setSection(current);
    };
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [home]);

  const routeActive = pathname.includes("/customisation")
    ? "custom"
    : pathname.includes("/faq")
      ? "faq"
      : pathname.includes("/enquiry")
        ? "quote"
        : pathname.includes("/gifting")
          ? "occasions"
          : pathname.includes("/products")
            ? "products"
            : null;
  const active = home ? section : routeActive;

  const spring = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 420, damping: 36 };

  const follow = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const [path, hash] = href.split("#");
    if (!hash || pathname !== path) return;
    const el = document.getElementById(hash);
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", href);
    setPinned(false);
  };

  const links = (scope: string, labels: boolean) => (
    <ul className="flex flex-col gap-0.5 px-1.5 pb-1.5">
      {ITEMS.map((item) => {
        const on = active === item.id;
        const href = item.href(lang);
        return (
          <li key={item.id}>
            <Link
              href={href}
              onClick={(event) => follow(event, href)}
              aria-current={on ? "true" : undefined}
              className={clsx("relative flex h-9 items-center gap-3 rounded-full px-2.5", on ? "text-white" : "text-ink-soft hover:text-ink")}
            >
              {on && <motion.span layoutId={`guide-active-${scope}`} className="absolute inset-0 rounded-full bg-ink" transition={spring} />}
              <span className="relative z-10 grid w-4 shrink-0 place-items-center">{item.icon}</span>
              <span className={clsx("relative z-10 whitespace-nowrap text-[13px] font-medium transition-opacity duration-200", labels ? "opacity-100" : "opacity-0")}>
                {zh ? item.zh : item.en}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {pinned && (
        <button type="button" aria-label={zh ? "關閉導覽" : "Close guide"} className="fixed inset-0 z-20 cursor-default" onClick={() => setPinned(false)} />
      )}

      <motion.nav
        aria-label={zh ? "頁面導覽" : "Page guide"}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setHover(false);
        }}
        initial={false}
        animate={{ width: open ? 156 : 48 }}
        transition={spring}
        className="no-print fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 overflow-hidden rounded-[28px] border hairline bg-white/80 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.35)] backdrop-blur-xl md:block"
      >
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setPinned((value) => !value)}
          className="flex h-9 w-full items-center gap-3 px-4 text-mute"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M5 7h14M5 12h14M5 17h14" strokeLinecap="round" />
          </svg>
          <span className={clsx("whitespace-nowrap text-[12px] font-medium tracking-wide transition-opacity", open ? "opacity-100" : "opacity-0")}>
            {zh ? "導覽" : "Guide"}
          </span>
        </button>
        {links("desk", open)}
      </motion.nav>

      <div className="no-print fixed bottom-5 left-4 z-30 hidden">
        <AnimatePresence>
          {pinned && (
            <motion.nav
              aria-label={zh ? "頁面導覽" : "Page guide"}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: 10 }}
              transition={spring}
              className="mb-3 w-[168px] overflow-hidden rounded-[28px] border hairline bg-white/95 pt-2 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.35)] backdrop-blur-xl"
            >
              {links("hand", true)}
            </motion.nav>
          )}
        </AnimatePresence>
        <button
          type="button"
          aria-expanded={pinned}
          aria-label={zh ? "頁面導覽" : "Page guide"}
          onClick={() => setPinned((value) => !value)}
          className="grid h-12 w-12 place-items-center rounded-full border hairline bg-white/90 text-ink shadow-[0_14px_36px_-16px_rgba(0,0,0,0.4)] backdrop-blur-xl"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M5 7h14M5 12h14M5 17h14" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </>
  );
}
