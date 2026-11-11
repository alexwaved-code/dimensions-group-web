export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];
export type L = { en: string; zh: string };

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const t = (text: L | undefined, lang: Locale) => (text ? text[lang] || text.en : "");

export const dict = {
  en: {
    nav: {
      products: "Products",
      gifting: "Corporate Gifting",
      customisation: "Customisation",
      faq: "FAQ",
      quality: "Quality & Compliance",
      about: "About",
      contact: "Contact",
      enquiry: "Enquiry",
      allProducts: "All products",
    },
    cta: {
      explore: "Explore the collection",
      quote: "Request a quote",
      addToEnquiry: "Add to enquiry",
      added: "Added to enquiry",
      viewEnquiry: "View enquiry",
      learnMore: "Learn more",
      planGift: "Start planning",
      whatsapp: "WhatsApp us",
      email: "Email us",
      specSheet: "Download spec sheet",
      requestCert: "Request certificates",
      viewAll: "View all",
    },
    product: {
      models: "models",
      colours: "Finishes",
      quantity: "Estimated quantity",
      features: "Highlights",
      specs: "Specifications",
      certs: "Certifications & Compliance",
      certsVerified: "Stated on product documentation",
      certsOnRequest:
        "Certificates, test reports and compliance documentation are available on request for every model.",
      customisation: "Logo printing and custom packaging available on request.",
      sku: "Model",
      related: "You may also consider",
      giftable: "Gift-ready",
    },
    footer: {
      tagline: "Electrical appliances and lifestyle products for retail, corporate and gifting programmes.",
      rights: "All rights reserved.",
    },
  },
  zh: {
    nav: {
      products: "產品系列",
      gifting: "企業禮品",
      customisation: "訂製服務",
      faq: "常見問題",
      quality: "品質與認證",
      about: "關於我們",
      contact: "聯絡我們",
      enquiry: "查詢清單",
      allProducts: "全部產品",
    },
    cta: {
      explore: "探索產品系列",
      quote: "索取報價",
      addToEnquiry: "加入查詢清單",
      added: "已加入查詢清單",
      viewEnquiry: "查看查詢清單",
      learnMore: "了解更多",
      planGift: "開始規劃",
      whatsapp: "WhatsApp 查詢",
      email: "電郵查詢",
      specSheet: "下載規格表",
      requestCert: "索取認證文件",
      viewAll: "查看全部",
    },
    product: {
      models: "款型號",
      colours: "顏色及款式",
      quantity: "預計數量",
      features: "產品亮點",
      specs: "規格",
      certs: "認證與合規",
      certsVerified: "產品資料列明",
      certsOnRequest: "所有型號均可按要求提供認證證書、測試報告及合規文件。",
      customisation: "可按要求提供印刷標誌及訂製包裝服務。",
      sku: "型號",
      related: "相關產品",
      giftable: "適合送禮",
    },
    footer: {
      tagline: "為零售、企業及禮品計劃，提供優質電器及生活產品。",
      rights: "版權所有。",
    },
  },
} as const;

export type Dict = (typeof dict)["en"];
export const getDict = (lang: Locale): Dict => dict[lang] as unknown as Dict;
