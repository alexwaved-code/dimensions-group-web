import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_TC } from "next/font/google";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import "../globals.css";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { EnquiryDock } from "@/components/enquiry/EnquiryDock";
import { EnquiryProvider } from "@/components/enquiry/EnquiryProvider";
import { Footer } from "@/components/layout/Footer";
import { GuideRail } from "@/components/layout/GuideRail";
import { Header } from "@/components/layout/Header";
import { categories, categoryCover, coverImage, productById, products, productsIn, toSummary } from "@/lib/catalog";
import { budgets } from "@/lib/gifts";
import { occasionCollections } from "@/lib/occasions";
import { getDict, hasLocale, locales } from "@/lib/i18n";
import { site } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const notoTC = Noto_Sans_TC({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-tc",
  display: "swap",
  preload: false,
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = { themeColor: "#fbfbfd" };

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const zh = lang === "zh";
  return {
    metadataBase: new URL(site.url),
    title: {
      default: zh ? "DIMENSIONS GROUP｜香港電器企業禮品、紀念品及推廣贈品" : "DIMENSIONS GROUP | Electrical Appliance Corporate Gifts in Hong Kong",
      template: "%s | DIMENSIONS GROUP",
    },
    description: zh
      ? "專注電器及小家電的香港企業禮品供應商，適合週年晚宴、客戶答謝、員工福利及展覽贈品，可按要求印刷標誌及訂製包裝。"
      : "Hong Kong corporate gift supplier focused on electrical and small home appliances, for annual dinners, client appreciation, staff welfare and events — with logo printing and custom packaging on request.",
    alternates: { languages: { en: "/en", "zh-HK": "/zh" } },
    openGraph: { siteName: site.name, type: "website", locale: zh ? "zh_HK" : "en_HK" },
    icons: { icon: "/brand/icon.svg" },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDict(lang);
  const navCategories = categories.map((c) => ({ id: c.id, name: c.name, count: productsIn(c.id).length, cover: categoryCover(c.id) }));
  const navOccasions = occasionCollections.map((o) => {
    const p = productById(o.productIds[0]);
    return { id: o.id, name: o.name, tint: o.tint, cover: p ? coverImage(p) : "/brand/placeholder.svg" };
  });
  const navBudgets = budgets.map((b) => ({ id: b.id, label: b.label }));
  const searchIndex = products.map((p) => {
    const s = toSummary(p);
    return { id: s.id, slug: s.slug, name: s.name, image: s.image, skus: s.skus, category: s.category };
  });

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    email: site.contact.email,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: site.contact.email,
      telephone: site.contact.whatsappDisplay,
      areaServed: "HK",
      availableLanguage: ["English", "Chinese"],
    },
  };

  return (
    <html lang={lang === "zh" ? "zh-HK" : "en"} className={`${inter.variable} ${notoTC.variable}`}>
      <body className="min-h-screen">
        <EnquiryProvider>
          <Header lang={lang} d={d} categories={navCategories} occasions={navOccasions} budgets={navBudgets} total={products.length} searchIndex={searchIndex} />
          <main className="pb-24 sm:pt-8 md:pb-0">{children}</main>
          <Footer lang={lang} d={d} />
          <GuideRail lang={lang} />
          <EnquiryDock lang={lang} />
          <Suspense>
            <ChatWidget lang={lang} />
          </Suspense>
        </EnquiryProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
