import "server-only";
import { categories, categoryById, coverImage, productBySlug, products, type Product } from "@/lib/catalog";
import { certInfo } from "@/lib/certifications";
import { interests } from "@/lib/gifts";
import type { L, Locale } from "@/lib/i18n";
import { site, whatsappLink } from "@/lib/site";

export const NEXT_TOOL = "next_steps";
const MAX_RESULTS = 6;
const MAX_CARDS = 4;
const PAGES = ["products", "gifting", "customisation", "faq", "quality", "about", "contact", "enquiry"] as const;

export type Card = { slug: string; name: L; tagline: L; image: string; sku: string | null; category: string };
export type Action = { label: string; prompt: string };
export type UiEvent =
  | { kind: "products"; items: Card[] }
  | { kind: "add"; item: { productId: string; slug: string; name: L; variant: L; sku: string | null; image: string; quantity: number } }
  | { kind: "navigate"; href: string }
  | { kind: "contact"; email: string; whatsapp: string; whatsappDisplay: string; person: string }
  | { kind: "next"; actions: Action[] };

export type ToolResult = { ok: boolean; model: unknown; ui?: UiEvent; summary: string };

const fn = (name: string, description: string, properties: Record<string, unknown>, required: string[] = []) => ({
  type: "function" as const,
  function: { name, description, parameters: { type: "object", properties, required } },
});

export const TOOL_SCHEMAS = [
  fn(
    "search_products",
    "Search the Dimensions Group catalogue (the only product source). Returns up to 6 matches with a ref (slug). The chat shows the top matches as cards.",
    {
      query: { type: "string", description: "Keywords in English or Chinese, e.g. 'cordless vacuum', '保溫壺 500ml', 'hair dryer'." },
      category: { type: "string", enum: categories.map((c) => c.id), description: "Optional category filter." },
      gift_only: { type: "boolean", description: "Only products suitable as corporate gifts." },
    },
    ["query"],
  ),
  fn("get_product", "Full details for one product: specs, highlights, finishes with model numbers, and stated certifications.", {
    ref: { type: "string", description: "The product ref (slug) from search results." },
  }, ["ref"]),
  fn(
    "recommend_gifts",
    "Suggest corporate gifts from the catalogue by budget band and recipient interests. Shows cards.",
    {
      budget: { type: "string", enum: ["a", "b", "c", "d"], description: "Per-gift budget: a = under HK$150, b = HK$150–300, c = HK$300–600, d = HK$600+." },
      interests: { type: "array", items: { type: "string", enum: interests.map((i) => i.id) }, description: "Recipient interests." },
    },
  ),
  fn(
    "add_to_enquiry",
    "Add a product to the visitor's enquiry list (a quotation request, not a purchase). Only when the visitor asks.",
    {
      ref: { type: "string" },
      quantity: { type: "integer", minimum: 1, description: "Estimated units. Default 100 if the visitor did not say." },
      finish: { type: "string", description: "Colour or variant name or model number, if the visitor chose one." },
    },
    ["ref"],
  ),
  fn(
    "open_page",
    "Navigate the visitor's browser to a page on this website.",
    {
      page: { type: "string", enum: [...PAGES, "category", "product"] },
      ref: { type: "string", description: "Category id when page=category, product ref when page=product." },
    },
    ["page"],
  ),
  fn("contact_sales", "Show the sales contact card (Karson Li, email and WhatsApp) for pricing, MOQ, lead time, samples, certificates or anything you cannot answer.", {}),
  fn(
    NEXT_TOOL,
    "Show 3 to 4 short follow-up chips under the input. Call in the same round as your final reply. Base them on this chat.",
    {
      actions: {
        type: "array",
        minItems: 2,
        maxItems: 4,
        items: {
          type: "object",
          properties: {
            label: { type: "string", description: "2 to 6 words on the chip." },
            prompt: { type: "string", description: "The message sent when tapped." },
          },
          required: ["label", "prompt"],
        },
      },
    },
    ["actions"],
  ),
];

export function toolLabel(name: string, args: Record<string, unknown>, lang: Locale) {
  const zh = lang === "zh";
  const q = String(args.query ?? "").slice(0, 30);
  switch (name) {
    case "search_products":
      return zh ? `搜尋產品「${q}」` : `Searching products for “${q}”`;
    case "get_product":
      return zh ? "查看產品資料" : "Reading product details";
    case "recommend_gifts":
      return zh ? "挑選禮品" : "Curating gift ideas";
    case "add_to_enquiry":
      return zh ? "加入查詢清單" : "Adding to your enquiry";
    case "open_page":
      return zh ? "開啟頁面" : "Opening the page";
    case "contact_sales":
      return zh ? "聯絡銷售團隊" : "Connecting you with sales";
    default:
      return name;
  }
}

const card = (p: Product): Card => ({ slug: p.slug, name: p.name, tagline: p.tagline, image: coverImage(p), sku: p.variants[0]?.sku ?? null, category: p.category });

const brief = (p: Product, lang: Locale) => ({
  ref: p.slug,
  name: p.name[lang],
  tagline: p.tagline[lang],
  category: categoryById(p.category)?.name[lang],
  model: p.variants[0]?.sku ?? undefined,
  finishes: p.variants.length > 1 ? p.variants.map((v) => v.label[lang]) : undefined,
  gift_ready: p.giftable,
});

function score(p: Product, terms: string[], bigrams: string[]) {
  const hay = [p.name.en, p.name.zh, p.tagline.en, p.tagline.zh, p.summary.en, p.keywords.join(" "), p.variants.map((v) => v.sku ?? "").join(" "), categoryById(p.category)?.name.en ?? "", categoryById(p.category)?.name.zh ?? ""]
    .join(" ")
    .toLowerCase();
  const name = `${p.name.en} ${p.name.zh}`.toLowerCase();
  let s = 0;
  for (const t of terms) {
    if (name.includes(t)) s += 3;
    else if (hay.includes(t)) s += 1;
  }
  for (const b of bigrams) {
    if (name.includes(b)) s += 2;
    else if (hay.includes(b)) s += 0.5;
  }
  return s;
}

export function searchCatalogue(query: string, category?: string, giftOnly?: boolean) {
  const q = query.toLowerCase().trim();
  const terms = q.split(/[\s,，、/]+/).filter((t) => t.length > 1 || /[\u4e00-\u9fff]/.test(t));
  const han = q.replace(/[^\u4e00-\u9fff]/g, "");
  const bigrams = Array.from({ length: Math.max(0, han.length - 1) }, (_, i) => han.slice(i, i + 2));
  return products
    .filter((p) => (!category || p.category === category) && (!giftOnly || p.giftable))
    .map((p) => ({ p, s: score(p, terms, bigrams) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.p);
}

export function runTool(name: string, args: Record<string, unknown>, lang: Locale): ToolResult {
  const zh = lang === "zh";
  try {
    switch (name) {
      case "search_products": {
        const found = searchCatalogue(String(args.query ?? ""), args.category as string | undefined, Boolean(args.gift_only));
        const top = found.slice(0, MAX_RESULTS);
        return {
          ok: true,
          summary: zh ? `找到 ${found.length} 款` : `${found.length} found`,
          model: top.length
            ? { total: found.length, shown_as_cards: Math.min(MAX_CARDS, top.length), products: top.map((p) => brief(p, lang)) }
            : { total: 0, note: "Nothing matched. Try other words, a broader term, or suggest a category." },
          ui: top.length ? { kind: "products", items: top.slice(0, MAX_CARDS).map(card) } : undefined,
        };
      }
      case "get_product": {
        const p = productBySlug(String(args.ref ?? ""));
        if (!p) return fail("Unknown ref. Search first and use a ref from the results.", lang);
        return {
          ok: true,
          summary: p.name[lang],
          model: {
            ...brief(p, lang),
            summary: p.summary[lang],
            highlights: p.features.map((f) => f[lang]),
            specs: p.specs.map((s) => `${s.label[lang]}: ${s.value[lang]}`),
            finishes: p.variants.map((v) => ({ name: v.label[lang], model: v.sku })),
            certifications_stated: p.certs.map((c) => certInfo(c).name[lang]),
            certificate_documents: "Available on request from sales.",
            customisation: "Logo printing and custom packaging on request.",
          },
          ui: { kind: "products", items: [card(p)] },
        };
      }
      case "recommend_gifts": {
        const wanted = Array.isArray(args.interests) ? (args.interests as string[]) : [];
        const cats = new Set(interests.filter((i) => wanted.includes(i.id)).flatMap((i) => i.categories));
        const pool = products.filter((p) => p.giftable && (cats.size === 0 || cats.has(p.category)));
        const band = args.budget as string | undefined;
        const ranked = [...pool.filter((p) => !band || p.band === band), ...pool.filter((p) => band && p.band !== band)];
        const seen = new Set<string>();
        const picks = ranked.filter((p) => (seen.has(p.category) && seen.size < 3 ? false : (seen.add(p.category), true))).slice(0, MAX_RESULTS);
        return {
          ok: true,
          summary: zh ? `${picks.length} 個建議` : `${picks.length} ideas`,
          model: { products: picks.map((p) => brief(p, lang)), note: "Budget bands are indicative; exact quotes come from sales." },
          ui: picks.length ? { kind: "products", items: picks.slice(0, MAX_CARDS).map(card) } : undefined,
        };
      }
      case "add_to_enquiry": {
        const p = productBySlug(String(args.ref ?? ""));
        if (!p) return fail("Unknown ref. Search first and use a ref from the results.", lang);
        const quantity = Math.max(1, Math.min(1_000_000, Math.round(Number(args.quantity) || 100)));
        const want = String(args.finish ?? "").toLowerCase();
        const v =
          p.variants.find((x) => want && [x.label.en, x.label.zh, x.sku ?? ""].some((s) => s.toLowerCase() === want)) ??
          p.variants.find((x) => want && [x.label.en, x.label.zh, x.sku ?? ""].some((s) => s.toLowerCase().includes(want))) ??
          p.variants[0];
        return {
          ok: true,
          summary: zh ? "已加入" : "Added",
          model: { added: p.name[lang], finish: v.label[lang], quantity, next: "The visitor can review and submit the list on the enquiry page." },
          ui: {
            kind: "add",
            item: { productId: p.id, slug: p.slug, name: p.name, variant: v.label, sku: v.sku, image: v.image ?? coverImage(p), quantity },
          },
        };
      }
      case "open_page": {
        const page = String(args.page ?? "");
        const ref = String(args.ref ?? "");
        let path: string | null = null;
        if ((PAGES as readonly string[]).includes(page)) path = page;
        if (page === "category" && categoryById(ref)) path = `products/${ref}`;
        if (page === "product" && productBySlug(ref)) path = `product/${ref}`;
        if (!path) return fail("Unknown page or ref.", lang);
        return { ok: true, summary: zh ? "已開啟" : "Opened", model: { opened: path }, ui: { kind: "navigate", href: `/${lang}/${path}` } };
      }
      case "contact_sales":
        return {
          ok: true,
          summary: site.contact.person,
          model: { person: site.contact.person, role: site.contact.role[lang], email: site.contact.email, whatsapp: site.contact.whatsappDisplay, shown: "Contact card is shown." },
          ui: {
            kind: "contact",
            email: site.contact.email,
            whatsapp: whatsappLink(zh ? "您好 Karson，我從網站的 AI 助理過來，想查詢產品。" : "Hello Karson, I came from your website assistant and would like to enquire."),
            whatsappDisplay: site.contact.whatsappDisplay,
            person: site.contact.person,
          },
        };
    }
  } catch (error) {
    return fail(`The tool failed: ${(error as Error).name}`, lang);
  }
  return fail(`Unknown tool: ${name}`, lang);
}

export function cleanActions(args: Record<string, unknown>): Action[] {
  const raw = Array.isArray(args.actions) ? args.actions : [];
  const out: Action[] = [];
  for (const item of raw.slice(0, 4)) {
    if (!item || typeof item !== "object") continue;
    const label = short((item as Action).label, 28);
    const prompt = short((item as Action).prompt || label, 120);
    if (label && prompt && !out.some((a) => a.prompt === prompt)) out.push({ label, prompt });
  }
  return out;
}

const short = (v: unknown, n: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, n) : "");

function fail(message: string, lang: Locale): ToolResult {
  return { ok: false, summary: lang === "zh" ? "失敗" : "Failed", model: { error: message } };
}
