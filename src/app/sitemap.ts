import type { MetadataRoute } from "next";
import { categories, products } from "@/lib/catalog";
import { locales } from "@/lib/i18n";
import { occasionCollections } from "@/lib/occasions";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/products",
    "/gifting",
    ...occasionCollections.map((o) => `/gifting/${o.id}`),
    "/customisation",
    "/faq",
    "/quality",
    "/about",
    "/contact",
    "/enquiry",
    ...categories.map((c) => `/products/${c.id}`),
    ...products.map((p) => `/product/${p.slug}`),
  ];
  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${site.url}/${lang}${path}`,
      alternates: { languages: { en: `${site.url}/en${path}`, "zh-HK": `${site.url}/zh${path}` } },
    })),
  );
}
