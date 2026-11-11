import data from "@/data/catalog.json";
import type { L, Locale } from "./i18n";
import { isCutout } from "./photo";

export type Variant = { sku: string | null; label: L; hex: string | null; image: string | null };
export type Spec = { label: L; value: L };
export type Product = {
  id: string;
  slug: string;
  category: CategoryId;
  name: L;
  tagline: L;
  summary: L;
  features: L[];
  specs: Spec[];
  variants: Variant[];
  images: string[];
  certs: string[];
  giftable: boolean;
  keywords: string[];
  band: "a" | "b" | "c" | "d" | null;
};

export type CategoryId =
  | "climate"
  | "home-care"
  | "kitchen"
  | "personal-care"
  | "wellness"
  | "power-audio"
  | "drinkware"
  | "cookware"
  | "aroma"
  | "lifestyle"
  | "accessories";

export type Category = { id: CategoryId; name: L; headline: L; blurb: L };

export const categories: Category[] = [
  {
    id: "climate",
    name: { en: "Climate & Air", zh: "空氣與溫控" },
    headline: { en: "Comfort, precisely tuned.", zh: "舒適，恰到好處。" },
    blurb: {
      en: "Fans, heaters, coolers, dehumidifiers and air care for every season.",
      zh: "風扇、暖風機、冷風機、除濕機及空氣護理，四季皆宜。",
    },
  },
  {
    id: "home-care",
    name: { en: "Home Care", zh: "家居清潔" },
    headline: { en: "Clean, without compromise.", zh: "潔淨，毫不妥協。" },
    blurb: {
      en: "Cordless vacuums, robotic cleaners, mops, steamers and garment care.",
      zh: "無線吸塵機、清潔機械人、拖把、蒸氣清潔及衣物護理。",
    },
  },
  {
    id: "kitchen",
    name: { en: "Kitchen Appliances", zh: "廚房電器" },
    headline: { en: "The art of the everyday kitchen.", zh: "日常廚房的藝術。" },
    blurb: {
      en: "Kettles, rice cookers, blenders, coffee makers and compact cooking.",
      zh: "電熱水壺、電飯煲、攪拌機、咖啡機及小型煮食電器。",
    },
  },
  {
    id: "personal-care",
    name: { en: "Personal Care", zh: "個人護理" },
    headline: { en: "Salon results. At home.", zh: "專業效果，在家呈現。" },
    blurb: {
      en: "High-speed hair dryers, stylers, shavers and grooming tools.",
      zh: "高速風筒、造型器、鬚刨及理容工具。",
    },
  },
  {
    id: "wellness",
    name: { en: "Wellness & Beauty", zh: "健康與美容" },
    headline: { en: "Restore. Recharge.", zh: "舒緩身心，重拾活力。" },
    blurb: {
      en: "Massagers, beauty devices, heated textiles and health monitoring.",
      zh: "按摩器、美容儀、電熱織品及健康監測產品。",
    },
  },
  {
    id: "power-audio",
    name: { en: "Power & Audio", zh: "充電與影音" },
    headline: { en: "Power that keeps pace.", zh: "電力，與您同步。" },
    blurb: {
      en: "PD fast chargers, 240W cables, power strips and wireless audio.",
      zh: "快充充電器、240W 數據線、拖板及無線音響。",
    },
  },
  {
    id: "drinkware",
    name: { en: "Drinkware", zh: "保溫杯壺" },
    headline: { en: "Temperature, held beautifully.", zh: "溫度，優雅保存。" },
    blurb: {
      en: "316 stainless steel flasks, tumblers, food jars and bottles.",
      zh: "316 不鏽鋼保溫壺、保溫杯、燜燒杯及水壺。",
    },
  },
  {
    id: "cookware",
    name: { en: "Cookware & Tableware", zh: "廚具與餐具" },
    headline: { en: "Crafted for the table.", zh: "為餐桌而生。" },
    blurb: {
      en: "Pans, pots, cutlery, chopping boards and food storage.",
      zh: "煎鍋、湯鍋、餐具、砧板及食物收納。",
    },
  },
  {
    id: "aroma",
    name: { en: "Aroma & Himalayan Salt", zh: "香薰與喜馬拉雅岩鹽" },
    headline: { en: "Atmosphere, curated.", zh: "營造，理想氛圍。" },
    blurb: {
      en: "Diffusers, reed fragrances, sachets and natural Himalayan salt.",
      zh: "香薰機、藤條香薰、香囊及天然喜馬拉雅岩鹽產品。",
    },
  },
  {
    id: "lifestyle",
    name: { en: "Home & Lifestyle", zh: "家居生活" },
    headline: { en: "Order, made effortless.", zh: "井然有序，輕鬆自在。" },
    blurb: {
      en: "Storage, trolleys, travel bags, seating and everyday essentials.",
      zh: "收納、購物車、旅行袋、摺疊凳及日常用品。",
    },
  },
  {
    id: "accessories",
    name: { en: "Parts & Refills", zh: "配件與替換裝" },
    headline: { en: "Made to last longer.", zh: "延續產品壽命。" },
    blurb: {
      en: "Genuine filters, brush heads, mop pads and replacement parts.",
      zh: "原裝濾芯、刷頭、拖布及替換配件。",
    },
  },
];

export const products = data as unknown as Product[];

export const categoryById = (id: string) => categories.find((c) => c.id === id);
export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const productById = (id: string) => products.find((p) => p.id === id);
export const productsIn = (id: CategoryId) => products.filter((p) => p.category === id);

export const coverImage = (p: Product) => p.images[0] ?? "/brand/placeholder.svg";

export const categoryCover = (id: CategoryId) => {
  const list = productsIn(id).filter((p) => p.images.length);
  const hit = list.find((p) => isCutout(coverImage(p))) ?? list[0];
  return hit ? coverImage(hit) : "/brand/placeholder.svg";
};

export type ProductSummary = {
  id: string;
  slug: string;
  category: CategoryId;
  name: L;
  tagline: L;
  image: string;
  swatches: string[];
  variantCount: number;
  giftable: boolean;
  keywords: string[];
  sku: string | null;
  skus: string[];
  variant: L;
  band: Product["band"];
};

export const toSummary = (p: Product): ProductSummary => ({
  id: p.id,
  slug: p.slug,
  category: p.category,
  name: p.name,
  tagline: p.tagline,
  image: coverImage(p),
  swatches: p.variants.map((v) => v.hex).filter((h): h is string => Boolean(h)),
  variantCount: p.variants.length,
  giftable: p.giftable,
  keywords: p.keywords,
  sku: p.variants[0]?.sku ?? null,
  skus: [...new Set([p.id, ...p.variants.map((v) => v.sku).filter((s): s is string => Boolean(s))])],
  variant: p.variants[0]?.label ?? { en: "Standard", zh: "標準" },
  band: p.band,
});

export const href = (lang: Locale, path = "") => `/${lang}${path}`;
