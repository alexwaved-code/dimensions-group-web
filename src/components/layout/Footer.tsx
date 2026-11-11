import Link from "next/link";
import { Logo } from "@/components/Logo";
import { categories } from "@/lib/catalog";
import { occasionCollections } from "@/lib/occasions";
import type { Dict, Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

export function Footer({ lang, d }: { lang: Locale; d: Dict }) {
  return (
    <footer className="no-print border-t hairline bg-mist">
      <div className="mx-auto max-w-[1180px] px-5 py-12 md:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <Logo animated={false} />
            <p className="mt-6 max-w-xs text-[13px] leading-relaxed text-mute">{d.footer.tagline}</p>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-ink">{d.nav.gifting}</p>
            <ul className="mt-4 space-y-2.5 text-[12px] text-mute">
              {occasionCollections.map((o) => (
                <li key={o.id}>
                  <Link href={`/${lang}/gifting/${o.id}`} className="hover:text-ink">
                    {o.name[lang]}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link href={`/${lang}/customisation`} className="hover:text-ink">{d.nav.customisation}</Link>
              </li>
              <li>
                <Link href={`/${lang}/faq`} className="hover:text-ink">{d.nav.faq}</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-ink">{d.nav.products}</p>
            <ul className="mt-4 space-y-2.5 text-[12px] text-mute">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link href={`/${lang}/products/${c.id}`} className="hover:text-ink">
                    {c.name[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-ink">&nbsp;</p>
            <ul className="mt-4 space-y-2.5 text-[12px] text-mute">
              {categories.slice(6).map((c) => (
                <li key={c.id}>
                  <Link href={`/${lang}/products/${c.id}`} className="hover:text-ink">
                    {c.name[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-ink">{d.nav.contact}</p>
            <ul className="mt-4 space-y-2.5 text-[12px] text-mute">
              <li className="text-ink-soft">{site.contact.person}</li>
              <li>{site.contact.role[lang]}</li>
              <li>
                <a href={`mailto:${site.contact.email}`} className="hover:text-ink">
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${site.contact.whatsapp}`} className="hover:text-ink" target="_blank" rel="noreferrer">
                  WhatsApp {site.contact.whatsappDisplay}
                </a>
              </li>
              <li className="pt-2">
                <Link href={`/${lang}/gifting`} className="hover:text-ink">{d.nav.gifting}</Link>
              </li>
              <li>
                <Link href={`/${lang}/quality`} className="hover:text-ink">{d.nav.quality}</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-3 border-t hairline pt-6 text-[11px] text-mute md:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. {d.footer.rights}
          </p>
          <p>Hong Kong SAR</p>
        </div>
      </div>
    </footer>
  );
}
