import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductExplorer } from "@/components/product/ProductExplorer";
import { categories, categoryCover, products, toSummary } from "@/lib/catalog";
import { hasLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/products">): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "zh" ? "全部產品" : "All Products" };
}

export default async function ProductsPage({ params }: PageProps<"/[lang]/products">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const zh = lang === "zh";
  const items = products.map(toSummary);
  const giftCount = products.filter((p) => p.giftable).length;

  return (
    <div className="bg-mist">
      <div className="mx-auto max-w-[1280px] px-5 pb-14 pt-[72px] md:px-8 md:pt-20">
        <header className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-gold">{zh ? "產品系列" : "The Collection"}</p>
            <h1 className="headline mt-2 text-[28px] md:text-[36px]">{zh ? "全部產品。" : "Every product."}</h1>
          </div>
          <p className="max-w-md text-[14px] leading-relaxed text-ink-soft md:text-right">
            {zh
              ? `${products.length} 款型號 · ${categories.length} 個類別 · ${giftCount} 款適合送禮。按「+」加入查詢清單，一次索取報價。`
              : `${products.length} models · ${categories.length} categories · ${giftCount} gift-ready. Tap “+” to add to your enquiry list.`}
          </p>
        </header>
        <ProductExplorer
          items={items}
          categories={categories.map((c) => ({ id: c.id, name: c.name, cover: categoryCover(c.id) }))}
          lang={lang}
        />
      </div>
    </div>
  );
}
