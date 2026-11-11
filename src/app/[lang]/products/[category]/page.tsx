import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductShot } from "@/components/product/ProductShot";
import { isCutout } from "@/lib/photo";
import { categories, categoryById, categoryCover, productsIn, toSummary } from "@/lib/catalog";
import { getDict, hasLocale } from "@/lib/i18n";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/products/[category]">): Promise<Metadata> {
  const { lang, category } = await params;
  const c = categoryById(category);
  if (!c || !hasLocale(lang)) return {};
  return { title: c.name[lang], description: c.blurb[lang] };
}

export default async function CategoryPage({ params }: PageProps<"/[lang]/products/[category]">) {
  const { lang, category } = await params;
  const c = categoryById(category);
  if (!hasLocale(lang) || !c) notFound();
  const d = getDict(lang);
  const items = productsIn(c.id).map(toSummary);
  const others = categories.filter((x) => x.id !== c.id);

  return (
    <>
      <section className="overflow-hidden bg-mist pt-20 md:pt-24">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-5 md:grid-cols-[1.1fr_1fr] md:items-center md:px-8">
          <Reveal className="pb-6 md:pb-14">
            <Link href={`/${lang}/products`} className="text-[13px] text-mute hover:text-ink">
              ‹ {d.nav.allProducts}
            </Link>
            <p className="eyebrow mt-8 text-gold">{c.name[lang]}</p>
            <h1 className="headline mt-4 text-[34px] md:text-[52px]">{c.headline[lang]}</h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink-soft md:text-[19px]">{c.blurb[lang]}</p>
            <p className="mt-6 text-[13px] text-mute">
              {items.length} {d.product.models}
            </p>
          </Reveal>
          <Reveal delay={0.15} className="relative aspect-square w-full overflow-hidden rounded-[28px] md:aspect-[4/5]">
            {isCutout(categoryCover(c.id)) ? (
              <ProductShot src={categoryCover(c.id)} alt={c.name[lang]} category={c.id} priority sizes="(min-width: 768px) 540px, 100vw" />
            ) : (
              <Image src={categoryCover(c.id)} alt={c.name[lang]} fill priority sizes="(min-width: 768px) 540px, 100vw" className="object-contain mix-blend-multiply" />
            )}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {items.map((p, i) => (
            <li key={p.id}>
              <ProductCard p={p} lang={lang} priority={i < 4} />
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t hairline">
        <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-8">
          <p className="eyebrow text-mute">{lang === "zh" ? "其他類別" : "More categories"}</p>
          <div className="no-scrollbar mt-5 flex gap-3 overflow-x-auto pb-2">
            {others.map((o) => (
              <Link
                key={o.id}
                href={`/${lang}/products/${o.id}`}
                className="shrink-0 rounded-full bg-black/[0.05] px-5 py-2.5 text-[13px] text-ink-soft transition hover:bg-black/10"
              >
                {o.name[lang]}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
