import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/Logo";
import { PrintButton } from "@/components/product/PrintButton";
import { certInfo } from "@/lib/certifications";
import { categoryById, coverImage, productBySlug, products } from "@/lib/catalog";
import { getDict, hasLocale } from "@/lib/i18n";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/product/[slug]/spec">): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = productBySlug(slug);
  if (!p || !hasLocale(lang)) return {};
  return { title: `${p.name[lang]} — ${lang === "zh" ? "規格表" : "Spec Sheet"}`, robots: { index: false } };
}

export default async function SpecSheet({ params }: PageProps<"/[lang]/product/[slug]/spec">) {
  const { lang, slug } = await params;
  const p = productBySlug(slug);
  if (!hasLocale(lang) || !p) notFound();
  const d = getDict(lang);
  const zh = lang === "zh";
  const category = categoryById(p.category)!;
  const thumbs = p.images.slice(1, 4);

  return (
    <div className="bg-mist pb-16 pt-24 print:bg-white print:p-0">
      <div className="no-print mx-auto mb-6 flex max-w-[210mm] items-center justify-between px-5">
        <Link href={`/${lang}/product/${p.slug}`} className="text-[13px] text-mute hover:text-ink">
          ‹ {p.name[lang]}
        </Link>
        <PrintButton label={zh ? "列印／儲存為 PDF" : "Print / Save as PDF"} />
      </div>

      <article className="mx-auto min-h-[297mm] max-w-[210mm] bg-white px-[14mm] py-[14mm] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.3)] print:min-h-0 print:shadow-none">
        <header className="flex items-start justify-between border-b border-black/10 pb-6">
          <Logo animated={false} />
          <div className="text-right text-[10px] leading-relaxed text-mute">
            <p className="font-semibold uppercase tracking-[0.2em] text-gold">{zh ? "產品規格表" : "Product Specification"}</p>
            <p>{category.name[lang]}</p>
          </div>
        </header>

        <section className="mt-8 grid grid-cols-[1fr_1.1fr] gap-8">
          <div>
            <div className="relative aspect-square rounded-2xl bg-white ring-1 ring-black/5">
              <Image src={coverImage(p)} alt={p.name[lang]} fill sizes="320px" className="object-contain p-4" />
            </div>
            {thumbs.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {thumbs.map((src) => (
                  <div key={src} className="relative aspect-square rounded-lg ring-1 ring-black/5">
                    <Image src={src} alt="" fill sizes="100px" className="object-contain p-1.5" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-[26px] font-semibold leading-tight tracking-tight">{p.name[lang]}</h1>
            {p.tagline[lang] && <p className="mt-2 text-[14px] text-ink-soft">{p.tagline[lang]}</p>}
            {p.summary[lang] && <p className="mt-4 text-[12px] leading-relaxed text-mute">{p.summary[lang]}</p>}

            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">{d.product.colours}</p>
            <ul className="mt-2 space-y-1 text-[12px]">
              {p.variants.map((v, i) => (
                <li key={i} className="flex items-center gap-2">
                  {v.hex && <span className="h-2.5 w-2.5 rounded-full ring-1 ring-black/15" style={{ backgroundColor: v.hex }} />}
                  <span>{v.label[lang]}</span>
                  {v.sku && <span className="text-mute">· {v.sku}</span>}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-2 gap-8">
          {p.specs.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">{d.product.specs}</p>
              <dl className="mt-3 divide-y divide-black/10 border-y border-black/10 text-[11.5px]">
                {p.specs.map((s, i) => (
                  <div key={i} className="grid grid-cols-[42%_58%] gap-3 py-2">
                    <dt className="text-mute">{s.label[lang]}</dt>
                    <dd>{s.value[lang]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          {p.features.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">{d.product.features}</p>
              <ul className="mt-3 space-y-2 text-[11.5px] leading-relaxed">
                {p.features.map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-gold">—</span>
                    <span>{f[lang]}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl bg-mist p-5 print:bg-[#f5f5f7]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">{d.product.certs}</p>
          {p.certs.length > 0 && (
            <p className="mt-2 text-[12px]">{p.certs.map((c) => certInfo(c).name[lang]).join(" · ")}</p>
          )}
          <p className="mt-2 text-[11px] text-mute">{d.product.certsOnRequest}</p>
          <p className="mt-1 text-[11px] text-mute">{d.product.customisation}</p>
        </section>

        <footer className="mt-10 flex items-end justify-between border-t border-black/10 pt-5 text-[10.5px] leading-relaxed">
          <div>
            <p className="font-semibold">{site.name}</p>
            <p className="text-mute">
              {site.contact.person} · {site.contact.role[lang]}
            </p>
          </div>
          <div className="text-right text-mute">
            <p>{site.contact.email}</p>
            <p>WhatsApp {site.contact.whatsappDisplay}</p>
          </div>
        </footer>
      </article>
    </div>
  );
}
