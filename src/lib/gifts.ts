import type { CategoryId } from "./catalog";
import type { L } from "./i18n";

export type GiftSet = { id: string; name: L; mood: L; tag: L; productIds: string[] };

export type GiftAudience = { id: string; name: L; use: L; productIds: string[] };

export const giftAudiences: GiftAudience[] = [
  {
    id: "property",
    name: { en: "Property", zh: "地產物業" },
    use: { en: "Handover gifts and resident appreciation.", zh: "入伙禮、交樓禮及住戶答謝。" },
    productIds: ["npap001", "npad010", "npvc013"],
  },
  {
    id: "agency",
    name: { en: "Estate agencies", zh: "物業代理" },
    use: { en: "Closing gifts and client thank-yous.", zh: "成交禮及客戶答謝。" },
    productIds: ["npvc020", "nprf026", "npdc006"],
  },
  {
    id: "healthcare",
    name: { en: "Healthcare", zh: "醫療保健" },
    use: { en: "Staff welfare and client gifts.", zh: "員工福利及客戶禮品。" },
    productIds: ["npbfm003", "clsl001", "nphp007"],
  },
  {
    id: "travel",
    name: { en: "Travel & events", zh: "航空旅遊會展" },
    use: { en: "VIP gifts and conference souvenirs.", zh: "貴賓禮及會議紀念品。" },
    productIds: ["clps009", "nptk003", "nprf016"],
  },
  {
    id: "hr",
    name: { en: "Corporate HR", zh: "企業人力資源" },
    use: { en: "Onboarding, annual dinners and staff rewards.", zh: "入職禮、週年晚宴及員工獎勵。" },
    productIds: ["npvc002", "npbte001", "npps007"],
  },
  {
    id: "association",
    name: { en: "Associations", zh: "商會學會" },
    use: { en: "Member events and guest souvenirs.", zh: "會員活動及嘉賓紀念品。" },
    productIds: ["npvc008", "npbs0001", "clad001"],
  },
  {
    id: "automotive",
    name: { en: "Car dealers", zh: "汽車經銷" },
    use: { en: "Delivery gifts and after-sales appreciation.", zh: "交車禮及售後客戶禮。" },
    productIds: ["clvc003", "nprf024", "npdc004"],
  },
];

export const giftSets: GiftSet[] = [
  {
    id: "executive-desk",
    name: { en: "The Executive Desk", zh: "行政桌面禮盒" },
    mood: { en: "Power, airflow and hydration for the modern workspace.", zh: "為現代辦公桌而設的充電、送風與保溫組合。" },
    tag: { en: "Clients & partners", zh: "客戶及合作夥伴" },
    productIds: ["npps007", "npdc006", "nprf026", "npvc013"],
  },
  {
    id: "wellness-retreat",
    name: { en: "The Wellness Retreat", zh: "身心舒緩禮盒" },
    mood: { en: "Warm light, soft fragrance and a moment of calm.", zh: "暖光、淡香，與片刻寧靜。" },
    tag: { en: "Staff welfare", zh: "員工福利" },
    productIds: ["clsl002", "npad009", "npbfm003", "npad010"],
  },
  {
    id: "home-chef",
    name: { en: "The Home Chef", zh: "家居廚藝禮盒" },
    mood: { en: "Everyday kitchen essentials, elevated.", zh: "提升日常廚房體驗的精選電器。" },
    tag: { en: "Festive & family", zh: "節日及家庭" },
    productIds: ["cchp001", "npek001", "npmf001", "npcg004"],
  },
  {
    id: "travel-companion",
    name: { en: "The Travel Companion", zh: "旅行隨行禮盒" },
    mood: { en: "Compact, considered essentials for life on the move.", zh: "輕巧周到，伴隨每段旅程。" },
    tag: { en: "VIP & conferences", zh: "貴賓及會議" },
    productIds: ["nptk003", "clps009", "nprf016", "npvc020"],
  },
  {
    id: "event-kit",
    name: { en: "The Event Kit", zh: "活動贈品組合" },
    mood: { en: "Light, useful giveaways that travel home with your brand.", zh: "輕巧實用，把品牌帶回每位來賓家中。" },
    tag: { en: "Exhibitions & roadshows", zh: "展覽及路演" },
    productIds: ["npdc006", "npvc008", "nprf024", "npad010"],
  },
  {
    id: "festive-table",
    name: { en: "The Festive Table", zh: "節日團聚禮盒" },
    mood: { en: "Warm drinks and soft light for gatherings at home.", zh: "暖茶與暖光，陪伴每次家庭團聚。" },
    tag: { en: "Lunar New Year & Mid-Autumn", zh: "新年及中秋" },
    productIds: ["nptk004", "cctb003", "clsl002", "nptj001"],
  },
];

export type Option = { id: string; label: L; hint?: L };

export const occasions: Option[] = [
  { id: "client", label: { en: "Client appreciation", zh: "客戶答謝" } },
  { id: "annual-dinner", label: { en: "Annual dinner & lucky draw", zh: "週年晚宴及抽獎" } },
  { id: "staff", label: { en: "Staff recognition", zh: "員工嘉許" } },
  { id: "festive", label: { en: "Festive season", zh: "節日禮品" }, hint: { en: "Lunar New Year, Mid-Autumn, Christmas", zh: "農曆新年、中秋、聖誕" } },
  { id: "event", label: { en: "Events & roadshows", zh: "活動及路演" } },
  { id: "souvenir", label: { en: "Conference souvenirs", zh: "會議紀念品" } },
];

export const budgets: Option[] = [
  { id: "a", label: { en: "Under HK$150", zh: "HK$150 以下" }, hint: { en: "per unit", zh: "每件" } },
  { id: "b", label: { en: "HK$150 – 300", zh: "HK$150 – 300" }, hint: { en: "per unit", zh: "每件" } },
  { id: "c", label: { en: "HK$300 – 600", zh: "HK$300 – 600" }, hint: { en: "per unit", zh: "每件" } },
  { id: "d", label: { en: "HK$600 and above", zh: "HK$600 以上" }, hint: { en: "per unit", zh: "每件" } },
];

export const quantities: Option[] = [
  { id: "50", label: { en: "Up to 100", zh: "100 件以下" } },
  { id: "300", label: { en: "100 – 300", zh: "100 – 300 件" } },
  { id: "1000", label: { en: "300 – 1,000", zh: "300 – 1,000 件" } },
  { id: "1000+", label: { en: "Over 1,000", zh: "1,000 件以上" } },
];

export const personalisation: Option[] = [
  { id: "logo", label: { en: "Logo printing", zh: "印刷企業標誌" } },
  { id: "box", label: { en: "Custom gift box", zh: "訂製禮盒" } },
  { id: "card", label: { en: "Greeting card", zh: "心意卡" } },
  { id: "delivery", label: { en: "Delivery to multiple addresses", zh: "多地址派送" } },
];

export const interests: (Option & { categories: CategoryId[] })[] = [
  { id: "tech", label: { en: "Tech & travel", zh: "科技及旅行" }, categories: ["power-audio", "climate"] },
  { id: "wellness", label: { en: "Wellness & relaxation", zh: "健康及舒緩" }, categories: ["wellness", "aroma"] },
  { id: "kitchen", label: { en: "Kitchen & dining", zh: "廚房及餐飲" }, categories: ["kitchen", "cookware"] },
  { id: "drink", label: { en: "Drinkware", zh: "保溫杯壺" }, categories: ["drinkware"] },
  { id: "care", label: { en: "Personal care", zh: "個人護理" }, categories: ["personal-care"] },
  { id: "home", label: { en: "Home living", zh: "家居生活" }, categories: ["home-care", "lifestyle"] },
];
