export const site = {
  name: "DIMENSIONS GROUP CO. LIMITED",
  shortName: "Dimensions Group",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dimensionsgroup.com.hk",
  contact: {
    person: "Karson Li",
    role: { en: "Product Marketing & Sales Executive", zh: "產品市場及銷售主任" },
    email: "karson.li@dimensionsgroup.com.hk",
    whatsapp: "85264671781",
    whatsappDisplay: "+852 6467 1781",
  },
  web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "",
} as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
