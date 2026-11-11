import Link from "next/link";
import { certInfo } from "@/lib/certifications";
import type { Dict, Locale } from "@/lib/i18n";

export function CertificationPanel({ certs, lang, d, slug }: { certs: string[]; lang: Locale; d: Dict; slug: string }) {
  return (
    <div className="rounded-[28px] bg-mist p-8 md:p-10">
      <p className="eyebrow text-gold">{d.product.certs}</p>
      {certs.length > 0 ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {certs.map((c) => {
            const info = certInfo(c);
            return (
              <li key={c} className="flex gap-4 rounded-2xl bg-white p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/40 text-[11px] font-semibold tracking-tight text-ink">
                  {info.short}
                </span>
                <div>
                  <p className="text-[15px] font-semibold">{info.name[lang]}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-mute">{info.description[lang]}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-gold">{d.product.certsVerified}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
      <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-soft">{d.product.certsOnRequest}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/${lang}/enquiry?cert=${slug}`}
          className="rounded-full bg-ink px-6 py-2.5 text-[13px] font-medium text-white transition hover:bg-black"
        >
          {d.cta.requestCert}
        </Link>
        <Link
          href={`/${lang}/quality`}
          className="rounded-full border border-ink/15 px-6 py-2.5 text-[13px] font-medium text-ink transition hover:border-ink/40"
        >
          {d.nav.quality}
        </Link>
      </div>
    </div>
  );
}
