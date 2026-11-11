import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { CertificationPanel } from "@/components/product/CertificationPanel";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductHero } from "@/components/product/ProductHero";
import { categoryById, coverImage, productBySlug, products, productsIn, toSummary } from "@/lib/catalog";
import { getDict, hasLocale } from "@/lib/i18n";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/product/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = productBySlug(slug);
  if (!p || !hasLocale(lang)) return {};
  return {
    title: p.name[lang],
    description: p.summary[lang] || p.tagline[lang],
    openGraph: { images: [coverImage(p)] },
    alternates: { languages: { en: `/en/product/${p.slug}`, "zh-HK": `/zh/product/${p.slug}` } },
  };
}

export default async function ProductPage({ params }: PageProps<"/[lang]/product/[slug]">) {
  const { lang, slug } = await params;
  const p = productBySlug(slug);
  if (!hasLocale(lang) || !p) notFound();
  const d = getDict(lang);
  const category = categoryById(p.category)!;
  const related = productsIn(p.category)
    .filter((x) => x.id !== p.id)
    .slice(0, 4)
    .map(toSummary);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name[lang],
    description: p.summary[lang],
    image: p.images.map((i) => `${site.url}${i}`),
    sku: p.variants[0]?.sku ?? undefined,
    brand: { "@type": "Brand", name: site.shortName },
    category: category.name[lang],
  };

  return (
    <>
      <div className="mx-auto max-w-[1180px] px-5 pb-14 pt-24 md:px-8 md:pt-28">
        <nav className="mb-8 flex gap-2 text-[12px] text-mute" aria-label="Breadcrumb">
          <Link href={`/${lang}/products`} className="hover:text-ink">
            {d.nav.products}
          </Link>
          <span>/</span>
          <Link href={`/${lang}/products/${category.id}`} className="hover:text-ink">
            {category.name[lang]}
          </Link>
        </nav>
        <ProductHero p={p} lang={lang} d={d} categoryName={category.name[lang]} />
      </div>

      {(p.features.length > 0 || p.specs.length > 0) && (
        <section className="bg-mist">
          <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-10 md:grid-cols-2 md:px-8 md:py-14">
            {p.features.length > 0 && (
              <Reveal>
                <p className="eyebrow text-gold">{d.product.features}</p>
                <ul className="mt-8 space-y-6">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex gap-5">
                      <span className="mt-1 text-[12px] font-semibold tabular-nums text-gold">{String(i + 1).padStart(2, "0")}</span>
                      <p className="text-[17px] leading-relaxed text-ink">{f[lang]}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
            {p.specs.length > 0 && (
              <Reveal delay={0.1}>
                <div className="flex items-center justify-between">
                  <p className="eyebrow text-gold">{d.product.specs}</p>
                  <Link href={`/${lang}/product/${p.slug}/spec`} className="text-[13px] font-medium text-ink hover:text-gold">
                    {d.cta.specSheet} ↓
                  </Link>
                </div>
                <dl className="mt-8 divide-y divide-black/10 border-y border-black/10">
                  {p.specs.map((s, i) => (
                    <div key={i} className="grid grid-cols-[40%_60%] gap-4 py-4 text-[14px]">
                      <dt className="text-mute">{s.label[lang]}</dt>
                      <dd className="text-ink">{s.value[lang]}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1180px] px-5 py-10 md:px-8">
        <Reveal>
          <CertificationPanel certs={p.certs} lang={lang} d={d} slug={p.slug} />
        </Reveal>
        {p.specs.length === 0 && (
          <div className="mt-6 text-right">
            <Link href={`/${lang}/product/${p.slug}/spec`} className="text-[13px] font-medium text-ink hover:text-gold">
              {d.cta.specSheet} ↓
            </Link>
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section className="border-t hairline">
          <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-8">
            <h2 className="text-[28px] font-semibold tracking-tight">{d.product.related}</h2>
            <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
              {related.map((r) => (
                <li key={r.id}>
                  <ProductCard p={r} lang={lang} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
