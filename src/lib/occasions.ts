import type { L } from "./i18n";

export type Occasion = {
  id: string;
  name: L;
  title: L;
  intro: L;
  points: L[];
  tint: string;
  productIds: string[];
};

export const occasionCollections: Occasion[] = [
  {
    id: "annual-dinner",
    name: { en: "Annual dinner & lucky draw", zh: "週年晚宴及抽獎" },
    title: { en: "Prizes worth walking up for.", zh: "值得上台領的獎品。" },
    intro: {
      en: "From the grand prize to the consolation table, appliances people actually want — easy to display on stage and easy to take home.",
      zh: "由頭獎到安慰獎，挑選大家真心想要的電器，上台亮相體面，帶回家實用。",
    },
    points: [
      { en: "Tiered prizes from grand to consolation", zh: "頭獎、大獎至安慰獎，層次分明" },
      { en: "Recognisable, crowd-pleasing appliances", zh: "人人認得、人人想要的家電" },
      { en: "Gift-boxed and ready for the stage", zh: "附包裝，適合台上展示" },
    ],
    tint: "#f6eee4",
    productIds: ["clcf005", "npaf001", "npvc021", "cohd004", "nprvc002", "cccm001", "npdh004", "cbmg001"],
  },
  {
    id: "client",
    name: { en: "Client appreciation", zh: "客戶答謝" },
    title: { en: "Thank you, in a form they keep.", zh: "把謝意，送到客戶的案頭。" },
    intro: {
      en: "Considered gifts for clients and partners — refined enough to represent your brand, useful enough to stay on the desk for years.",
      zh: "為客戶及合作夥伴而選，質感足以代表品牌，實用得令人長期留在身邊。",
    },
    points: [
      { en: "Premium finishes that suit a logo", zh: "質感出眾，適合印上標誌" },
      { en: "Desk, home and wellness options", zh: "辦公桌、家居及健康之選" },
      { en: "Personalised cards and packaging on request", zh: "可按要求配心意卡及訂製包裝" },
    ],
    tint: "#e7edf4",
    productIds: ["npvc002", "npap001", "clad001", "npvc013", "npcg004", "npbfm003", "clsl001", "npek001"],
  },
  {
    id: "staff",
    name: { en: "Staff welfare & rewards", zh: "員工福利及獎勵" },
    title: { en: "Everyday thanks for the team.", zh: "照顧團隊的日常心意。" },
    intro: {
      en: "Onboarding kits, long-service awards and seasonal welfare — practical essentials your people use every working day.",
      zh: "入職禮、長期服務獎及節日福利，送上每個工作天都用得著的實用好物。",
    },
    points: [
      { en: "Practical items used daily", zh: "每日用得著的實用之選" },
      { en: "Easy to standardise across large teams", zh: "大量派發，款式統一" },
      { en: "Works for onboarding and long-service awards", zh: "入職禮、長期服務獎皆合適" },
    ],
    tint: "#e2f1f8",
    productIds: ["npvc020", "npps007", "npbte001", "nphp007", "nprf026", "npdc004", "npvc019", "nptk003"],
  },
  {
    id: "event",
    name: { en: "Exhibitions & giveaways", zh: "展覽及活動贈品" },
    title: { en: "Giveaways people don't throw away.", zh: "不會被丟掉的贈品。" },
    intro: {
      en: "Compact, useful items for trade shows, roadshows and seminars — light to carry in volume, with space for your logo.",
      zh: "適合展覽、路演及講座派發的輕巧實用小物，方便大量攜帶，亦預留標誌位置。",
    },
    points: [
      { en: "Compact and light to hand out", zh: "輕巧細小，方便派發" },
      { en: "Suited to high-volume orders", zh: "適合大量訂購" },
      { en: "Clear surface for brand printing", zh: "有位置印上品牌" },
    ],
    tint: "#e7f3e4",
    productIds: ["npdc006", "npdc003", "npvc008", "nprf024", "npad010", "npab001a", "m-c37733ea", "npwb002"],
  },
  {
    id: "festive",
    name: { en: "Festive gifts", zh: "節日禮品" },
    title: { en: "For Lunar New Year, Mid-Autumn and Christmas.", zh: "新年、中秋、聖誕，送得有心思。" },
    intro: {
      en: "Seasonal gifts with warmth — kitchen favourites for family gatherings, cosy textiles for winter and soothing light for the home.",
      zh: "帶著節日溫度的禮物：團聚用得上的廚房好物、冬日保暖織品，以及為家添暖光的擺設。",
    },
    points: [
      { en: "Family-friendly kitchen favourites", zh: "適合一家人享用的廚房好物" },
      { en: "Winter warmth and home comfort", zh: "冬日保暖與居家舒適" },
      { en: "Gift-box presentation on request", zh: "可按要求配節日禮盒" },
    ],
    tint: "#f8eaea",
    productIds: ["cccp0011", "nptk004", "npcookset001", "cctb003", "clsl002", "cbhp006", "nptj001", "npad009"],
  },
  {
    id: "eco",
    name: { en: "Reusable & ESG gifts", zh: "環保及可重用禮品" },
    title: { en: "Gifts that replace the disposable.", zh: "以可重用，取代即棄。" },
    intro: {
      en: "Reusable bottles, lunch boxes, foldable bags and trolleys that cut down on single-use items — a natural fit for ESG and green campaigns.",
      zh: "可重用水壺、飯盒、摺疊購物袋及購物車，減少即棄用品，配合 ESG 及綠色活動。",
    },
    points: [
      { en: "Reusable in place of single-use", zh: "以可重用取代即棄用品" },
      { en: "Suits ESG and green campaigns", zh: "配合 ESG 及綠色推廣" },
      { en: "Stainless steel, Tritan and foldable designs", zh: "不鏽鋼、Tritan 及可摺疊設計" },
    ],
    tint: "#e3f2e8",
    productIds: ["m-71103030", "nptb007", "npwb001", "nltfb001", "npkcb001", "nltfb006", "npvc010", "nptb001"],
  },
];

export const occasionById = (id: string) => occasionCollections.find((o) => o.id === id);

export const featuredGiftIds = ["npvc020", "clps009", "npdc004", "npbfm003", "nprf026", "npvc013", "npbs0001", "clad001", "npvc002", "nptk003"];

export const budgetTiles: { id: "a" | "b" | "c" | "d"; label: L; note: L; productId: string }[] = [
  { id: "a", label: { en: "Under HK$150", zh: "HK$150 以下" }, note: { en: "Giveaways & event gifts", zh: "活動及推廣贈品" }, productId: "npdc004" },
  { id: "b", label: { en: "HK$150 – 300", zh: "HK$150 – 300" }, note: { en: "Staff & seminar gifts", zh: "員工及研討會禮品" }, productId: "npvc020" },
  { id: "c", label: { en: "HK$300 – 600", zh: "HK$300 – 600" }, note: { en: "Client & VIP gifts", zh: "客戶及貴賓禮品" }, productId: "npbfm003" },
  { id: "d", label: { en: "HK$600 and above", zh: "HK$600 以上" }, note: { en: "Lucky-draw headliners", zh: "抽獎大獎" }, productId: "clcf005" },
];

export const customMethods: { id: string; name: L; body: L; suits: L }[] = [
  {
    id: "screen",
    name: { en: "Screen printing", zh: "絲印" },
    body: { en: "Crisp, solid-colour logos with excellent durability.", zh: "顏色實淨、線條清晰，耐用度高。" },
    suits: { en: "Bags, flat plastic surfaces", zh: "袋類、平面膠料" },
  },
  {
    id: "laser",
    name: { en: "Laser engraving", zh: "鐳射雕刻" },
    body: { en: "A permanent, understated mark etched into the surface.", zh: "直接雕刻於表面，低調而永久。" },
    suits: { en: "Stainless steel drinkware, metal", zh: "不鏽鋼杯壺、金屬" },
  },
  {
    id: "uv",
    name: { en: "UV colour printing", zh: "UV 彩印" },
    body: { en: "Full-colour artwork, gradients and photographs.", zh: "全彩圖案、漸變色及相片均可呈現。" },
    suits: { en: "Chargers, gadgets, boxes", zh: "充電器、電子產品、盒" },
  },
  {
    id: "pad",
    name: { en: "Pad printing", zh: "移印" },
    body: { en: "Small logos on curved or uneven surfaces.", zh: "適合曲面或不規則表面的小型標誌。" },
    suits: { en: "Fans, small appliances", zh: "風扇、小型電器" },
  },
  {
    id: "box",
    name: { en: "Custom gift box", zh: "訂製禮盒" },
    body: { en: "Branded outer boxes, sleeves and inserts.", zh: "印有品牌的外盒、封套及內托。" },
    suits: { en: "Sets and premium gifts", zh: "禮品套裝及高級禮品" },
  },
  {
    id: "card",
    name: { en: "Cards & labels", zh: "心意卡及貼紙" },
    body: { en: "Greeting cards, thank-you notes and branded stickers.", zh: "賀卡、感謝卡及品牌貼紙。" },
    suits: { en: "Any gift", zh: "任何禮品" },
  },
];

export const processSteps: { name: L; body: L }[] = [
  { name: { en: "Share your brief", zh: "提出需求" }, body: { en: "Occasion, quantity, budget and date — by form, email or WhatsApp.", zh: "場合、數量、預算及日期，可經表格、電郵或 WhatsApp 告訴我們。" } },
  { name: { en: "Get proposals", zh: "建議及報價" }, body: { en: "We shortlist suitable products and send a quotation.", zh: "我們挑選合適產品，並提供報價。" } },
  { name: { en: "Approve the artwork", zh: "確認設計" }, body: { en: "Send your logo; we prepare a digital mock-up for approval.", zh: "提供標誌，我們製作電子效果圖供確認。" } },
  { name: { en: "Production", zh: "安排生產" }, body: { en: "Printing, packing and quality checks.", zh: "印刷、包裝及品質檢查。" } },
  { name: { en: "Delivery", zh: "交付" }, body: { en: "Delivered to your office or event venue.", zh: "送到辦公室或活動場地。" } },
];

export const faqs: { q: L; a: L }[] = [
  {
    q: { en: "Is there a minimum order quantity?", zh: "有最低訂購量嗎？" },
    a: {
      en: "It depends on the product and the customisation you choose. Tell us your target quantity and we will confirm what works.",
      zh: "視乎產品及訂製方式而定。告訴我們預計數量，我們會為您確認可行方案。",
    },
  },
  {
    q: { en: "How long does an order take?", zh: "一般需時多久？" },
    a: {
      en: "Timing depends on stock, quantity and printing method. Share your event date early and we will plan the schedule around it.",
      zh: "需時視乎庫存、數量及印刷方式。請盡早告訴我們活動日期，我們會按日期安排時間表。",
    },
  },
  {
    q: { en: "Can you print our logo on the products?", zh: "可以在產品上印公司標誌嗎？" },
    a: {
      en: "Yes, logo printing is available on request. We suggest the right method for each product's material — such as screen printing, laser engraving or UV printing — and send a mock-up before production.",
      zh: "可以，標誌印刷按要求提供。我們會按產品物料建議合適方式，例如絲印、鐳射雕刻或 UV 彩印，並於生產前提供效果圖。",
    },
  },
  {
    q: { en: "What artwork format do you need?", zh: "設計檔案需要甚麼格式？" },
    a: {
      en: "Vector files (AI, PDF or SVG) give the sharpest result. If you only have a PNG or JPG, send it and we will advise.",
      zh: "向量檔（AI、PDF 或 SVG）效果最清晰。如只有 PNG 或 JPG，亦可先傳給我們，我們會提供建議。",
    },
  },
  {
    q: { en: "Can I see a sample first?", zh: "可以先看樣品嗎？" },
    a: {
      en: "Ask us about samples for the products you are considering, and we will let you know what is available.",
      zh: "歡迎就心儀產品查詢樣品安排，我們會告訴您可提供的方式。",
    },
  },
  {
    q: { en: "Can you help us choose?", zh: "不知道送甚麼好，可以幫忙挑選嗎？" },
    a: {
      en: "Of course. Use the gift planner, ask our AI assistant, or message us your occasion and budget — we will shortlist suitable products for you.",
      zh: "當然可以。您可使用禮品規劃工具、詢問 AI 助理，或直接告訴我們場合及預算，我們會為您挑選合適產品。",
    },
  },
  {
    q: { en: "Do you offer custom packaging?", zh: "可以訂製包裝嗎？" },
    a: {
      en: "Custom gift boxes, sleeves, greeting cards and labels are available on request.",
      zh: "可按要求提供訂製禮盒、封套、心意卡及貼紙。",
    },
  },
  {
    q: { en: "Can you provide certificates and test reports?", zh: "可以提供認證文件嗎？" },
    a: {
      en: "Certifications are stated on each product page, and certificates, test reports and compliance documents are available on request.",
      zh: "每款產品頁面均列明認證資料，認證證書、測試報告及合規文件亦可按要求提供。",
    },
  },
  {
    q: { en: "How do I request a quotation?", zh: "如何索取報價？" },
    a: {
      en: "Add products to your enquiry list and submit it, or contact us directly by email or WhatsApp. Quotations are prepared for each enquiry.",
      zh: "將產品加入查詢清單並提交，或直接以電郵或 WhatsApp 聯絡我們。我們會按每個查詢準備報價。",
    },
  },
];
