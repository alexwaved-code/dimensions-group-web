import type { L } from "./i18n";

export type Sector = { id: string; name: L };

export type Industry = {
  id: string;
  sector: string;
  name: L;
  why: L;
  uses: L[];
  productIds: string[];
};

export const sectors: Sector[] = [
  { id: "finance", name: { zh: "金融及專業服務", en: "Finance & professional services" } },
  { id: "property", name: { zh: "地產及物業", en: "Property & real estate" } },
  { id: "health", name: { zh: "醫療、美容及健康", en: "Health, beauty & fitness" } },
  { id: "hospitality", name: { zh: "酒店、餐飲及旅遊", en: "Hospitality, F&B & travel" } },
  { id: "education", name: { zh: "教育及非牟利", en: "Education & non-profit" } },
  { id: "tech", name: { zh: "科技、媒體及創意", en: "Tech, media & creative" } },
  { id: "retail", name: { zh: "零售及消費品牌", en: "Retail & consumer brands" } },
  { id: "industry", name: { zh: "工程、物流及製造", en: "Engineering, logistics & manufacturing" } },
  { id: "public", name: { zh: "政府、商會及社團", en: "Public sector & associations" } },
];

const u = (zh: string, en: string): L => ({ zh, en });

export const industries: Industry[] = [
  // Finance & professional services
  {
    id: "bank",
    sector: "finance",
    name: u("銀行", "Banks"),
    why: u("開戶禮及貴賓答謝講求質感，耐用、每日用得着的產品最能代表品牌。", "Account-opening and VIP gifts should feel premium and be used every day."),
    uses: [u("開戶及升級禮", "Account opening"), u("貴賓客戶答謝", "VIP appreciation"), u("長期服務獎", "Long-service awards")],
    productIds: ["npvc002", "clps009", "npdc004", "npap001", "nptj004", "cccm001"],
  },
  {
    id: "insurance",
    sector: "finance",
    name: u("保險公司及理財顧問", "Insurance & financial advisers"),
    why: u("數量多、預算適中，送一份貼身關懷的小禮，方便顧問日常約見客戶。", "High volume, moderate budget — caring everyday gifts advisers can hand out at meetings."),
    uses: [u("客戶生日及續保", "Birthdays & renewals"), u("講座及推廣活動", "Seminars & promotions"), u("顧問業績獎勵", "Adviser incentives")],
    productIds: ["npvc017", "nprf026", "npdc006", "cbhp003", "npem001", "npad010"],
  },
  {
    id: "wealth",
    sector: "finance",
    name: u("證券、私人銀行及資產管理", "Securities, private banking & wealth"),
    why: u("高淨值客戶重視細節與品味，宜選設計感強、一看就知用心的產品。", "High-net-worth clients notice detail; choose design-led pieces that show care."),
    uses: [u("高端客戶節日禮", "Festive gifts for key clients"), u("投資講座嘉賓禮", "Investment seminar guests")],
    productIds: ["npvc002", "cccm001", "npcg005", "clps009", "npsm001", "nptj004"],
  },
  {
    id: "law-accounting",
    sector: "finance",
    name: u("律師行及會計師事務所", "Law & accounting firms"),
    why: u("低調、專業、放在辦公桌上也得體，適合客戶及新入職同事。", "Understated and professional — at home on a desk, for clients and new joiners."),
    uses: [u("客戶節日禮", "Client festive gifts"), u("新入職迎新禮", "New-joiner welcome"), u("報稅季慰勞", "Busy-season thank-you")],
    productIds: ["npvc010", "npcg004", "clad001", "npps011", "npvc009", "clsl001"],
  },
  {
    id: "consulting",
    sector: "finance",
    name: u("顧問公司及人力資源", "Consulting & HR firms"),
    why: u("研討會及招聘活動需要輕巧易帶、印上標誌好看的贈品。", "Seminars and recruitment events need light, portable items that carry a logo well."),
    uses: [u("研討會贈品", "Seminar giveaways"), u("招聘及校園活動", "Recruitment events"), u("員工獎勵", "Staff rewards")],
    productIds: ["nprf024", "npdc006", "npvc008", "npbs0001", "npps007", "npwb002"],
  },

  // Property & real estate
  {
    id: "agency",
    sector: "property",
    name: u("地產代理", "Estate agencies"),
    why: u("成交及新盤活動送上新居用得着的家電，客人搬入即用，印象最深。", "Home appliances for new owners are used from day one — the most memorable closing gift."),
    uses: [u("成交答謝", "Closing gifts"), u("新盤開售", "Launch events"), u("睇樓抽獎", "Viewing lucky draws")],
    productIds: ["npek001", "nprc003", "npaf001", "npvc021", "npad010", "clrf003"],
  },
  {
    id: "developer",
    sector: "property",
    name: u("發展商及住宅會所", "Developers & clubhouses"),
    why: u("入伙禮代表樓盤檔次，宜選整套廚具或大件家居產品。", "Move-in gifts reflect the development; full cookware sets or larger home pieces work best."),
    uses: [u("入伙禮", "Move-in gifts"), u("業主活動", "Resident events"), u("示範單位擺設", "Show-flat styling")],
    productIds: ["cccp0011", "npcookset001", "clsl002", "npap001", "nprvc002", "nptk004"],
  },
  {
    id: "property-management",
    sector: "property",
    name: u("物業管理及業主立案法團", "Property management & owners' corporations"),
    why: u("住戶活動數量大，實用又環保的小禮最受歡迎；前線員工慰勞亦適用。", "Large resident events favour useful, reusable items — also good for frontline staff."),
    uses: [u("屋苑節日活動", "Estate festive events"), u("住戶大會", "Owners' meetings"), u("保安及清潔員工慰勞", "Frontline staff thanks")],
    productIds: ["m-71103030", "npik004", "nptb001", "npwb002", "nprf016", "nltfb002"],
  },
  {
    id: "interior",
    sector: "property",
    name: u("室內設計及傢俬", "Interior design & furniture"),
    why: u("交樓時送一件有設計感的家居擺設，延續作品的風格。", "A design-led home piece at handover extends the look of the project."),
    uses: [u("完工交樓禮", "Handover gifts"), u("展廳開幕", "Showroom openings")],
    productIds: ["clad001", "npad009", "clsl006", "nptj001", "npmf001", "npcg003"],
  },

  // Health, beauty & fitness
  {
    id: "clinic",
    sector: "health",
    name: u("診所及醫療集團", "Clinics & medical groups"),
    why: u("與健康管理相關的產品最貼題，病人及醫護都用得着。", "Health-related products feel on-message for both patients and medical staff."),
    uses: [u("病人關懷", "Patient care"), u("醫護答謝", "Staff appreciation"), u("健康講座", "Health talks")],
    productIds: ["cbbmp001", "npvc012", "cbhp003", "nphu001", "nptk004", "npkm001"],
  },
  {
    id: "dental",
    sector: "health",
    name: u("牙科診所", "Dental clinics"),
    why: u("口腔護理產品直接配合品牌，再配輕巧水壺及小禮。", "Oral-care products tie straight to the brand, paired with light drinkware."),
    uses: [u("新症登記禮", "New-patient welcome"), u("兒童覆診獎勵", "Kids' check-up rewards")],
    productIds: ["cooi001", "npvc007", "npwb001", "nprf026", "npms006", "npad010"],
  },
  {
    id: "pharmacy",
    sector: "health",
    name: u("藥房及保健品牌", "Pharmacies & health brands"),
    why: u("會員禮及滿額贈品宜選保健相關的熱敷、按摩及量度產品。", "Member and purchase-with-purchase gifts suit heat therapy, massage and monitoring products."),
    uses: [u("會員迎新禮", "Member welcome"), u("滿額贈品", "Purchase-with-purchase"), u("推廣抽獎", "Promotional draws")],
    productIds: ["cbbmp001", "cbmg001", "npvc017", "nphp007", "cbwb001", "npmr001"],
  },
  {
    id: "beauty",
    sector: "health",
    name: u("美容院及醫學美容", "Beauty salons & aesthetics"),
    why: u("家用美容儀延續療程效果，客人每次使用都會想起您。", "At-home beauty devices extend treatments — clients think of you every time."),
    uses: [u("VIP 會員禮", "VIP member gifts"), u("療程套票贈品", "Package bonuses"), u("開業週年", "Anniversaries")],
    productIds: ["npbfm002", "cbem001", "cbfs001", "cbsm001", "cohb002", "cbbr01"],
  },
  {
    id: "fitness",
    sector: "health",
    name: u("健身中心及瑜伽室", "Gyms & yoga studios"),
    why: u("運動前後用得着的水壺、筋膜槍及降溫產品，最切合會員需要。", "Bottles, massage guns and cooling gear fit members' routines before and after training."),
    uses: [u("會員續會禮", "Renewal gifts"), u("挑戰賽獎品", "Challenge prizes"), u("私人教練套票贈品", "PT package bonuses")],
    productIds: ["cbmg001", "npwb002", "nprf016", "npbte001", "nplm001", "npkm001"],
  },
  {
    id: "eldercare",
    sector: "health",
    name: u("安老院舍及社福機構", "Elderly care & social services"),
    why: u("保暖、易用、操作簡單是重點，適合探訪及節日派發。", "Warm, easy-to-use and simple to operate — ideal for visits and festive distribution."),
    uses: [u("長者探訪", "Elderly visits"), u("節日派發", "Festive distribution"), u("護理員工答謝", "Carer appreciation")],
    productIds: ["nphp004", "cbhp006", "nppr001", "cbbmp001", "npkm001", "nptj003"],
  },

  // Hospitality, F&B & travel
  {
    id: "hotel",
    sector: "hospitality",
    name: u("酒店及服務式住宅", "Hotels & serviced apartments"),
    why: u("住客及合作夥伴重視旅途舒適，旅行用品及房間級數的電器最合適。", "Guests and partners value comfort on the road — travel gear and room-grade appliances fit."),
    uses: [u("貴賓住客禮", "VIP guest amenities"), u("旅行社及企業夥伴答謝", "Partner appreciation"), u("員工服務獎", "Service awards")],
    productIds: ["clps005", "nptk003", "cohd004", "npvc020", "nptb007", "clad002"],
  },
  {
    id: "restaurant",
    sector: "hospitality",
    name: u("餐廳及食品品牌", "Restaurants & food brands"),
    why: u("廚具及餐具直接連繫飲食體驗，會員換領及節日禮都合適。", "Cookware and kitchen tools link straight to the dining experience."),
    uses: [u("會員積分換領", "Loyalty redemption"), u("節日禮券套裝", "Festive bundles"), u("新店開幕", "Store openings")],
    productIds: ["npos001", "npcu001-a", "npkcb001", "nltfb001", "npap24-002", "npmf001"],
  },
  {
    id: "travel",
    sector: "hospitality",
    name: u("旅行社及航空公司", "Travel agencies & airlines"),
    why: u("轉換插頭、旅行水煲及收納袋，出發前送最實用。", "Adapters, travel kettles and packable bags are most useful right before departure."),
    uses: [u("參團禮", "Tour sign-up gifts"), u("常客及貴賓禮", "Frequent-flyer gifts"), u("旅展推廣", "Travel fair giveaways")],
    productIds: ["clps009", "nptk002", "nptb007", "npdc005", "nprf026", "npvc006"],
  },
  {
    id: "wedding",
    sector: "hospitality",
    name: u("婚宴、宴會及活動場地", "Weddings, banquets & venues"),
    why: u("回禮講求精緻小巧、單價低，香氛及鹽製小品最受歡迎。", "Favours should be small, refined and low per-unit — scent and salt pieces are favourites."),
    uses: [u("婚宴回禮", "Wedding favours"), u("宴會桌上禮", "Banquet table gifts"), u("場地推廣", "Venue promotions")],
    productIds: ["cbss002", "clsc004", "npab001a", "npvc017", "m-790ce1b9", "npad010"],
  },

  // Education & non-profit
  {
    id: "school",
    sector: "education",
    name: u("中小學及幼稚園", "Schools & kindergartens"),
    why: u("學生及家長活動數量大，水壺、環保袋等日常用品最實際。", "Large student and parent events — bottles and reusable bags are the practical choice."),
    uses: [u("畢業禮及頒獎", "Graduation & prize-giving"), u("校慶紀念品", "School anniversaries"), u("教師節", "Teachers' day")],
    productIds: ["npwb001", "npvc008", "m-c37733ea", "npdc003", "nprf026", "npik006"],
  },
  {
    id: "university",
    sector: "education",
    name: u("大專院校及校友會", "Universities & alumni associations"),
    why: u("校友及講者禮宜大方得體，可配合校徽印刷。", "Alumni and speaker gifts should feel substantial and carry the crest well."),
    uses: [u("校友回饋", "Alumni gifts"), u("研討會講者禮", "Speaker gifts"), u("開放日紀念品", "Open-day souvenirs")],
    productIds: ["npvc010", "npbs0001", "clps008", "npvc013", "npbte001", "nptb007"],
  },
  {
    id: "tutoring",
    sector: "education",
    name: u("補習社及培訓機構", "Tutoring & training centres"),
    why: u("招生推廣需要單價低、學生喜歡的小禮。", "Enrolment drives need low-cost items students actually like."),
    uses: [u("報名禮", "Enrolment gifts"), u("考試獎勵", "Exam rewards"), u("課程推廣", "Course promotions")],
    productIds: ["npwb002", "npvc006", "nprf024", "npdc006", "m-6bce85d9", "npps007"],
  },
  {
    id: "ngo",
    sector: "education",
    name: u("NGO 及慈善團體", "NGOs & charities"),
    why: u("預算有限，宜選環保、可重用、受惠者真正需要的產品。", "Tight budgets — choose reusable products beneficiaries genuinely need."),
    uses: [u("義工答謝", "Volunteer thanks"), u("籌款活動", "Fundraising events"), u("社區派發", "Community distribution")],
    productIds: ["m-3912e383", "nptb001", "npvc008", "npik004", "npwb001", "nltfb002"],
  },
  {
    id: "community",
    sector: "education",
    name: u("宗教及社區團體", "Religious & community groups"),
    why: u("節日探訪及聚會送溫暖實用的家居小禮。", "Warm, practical home gifts for festive visits and gatherings."),
    uses: [u("節日探訪", "Festive visits"), u("會眾及會員聚會", "Member gatherings")],
    productIds: ["npab001b", "nptj001", "nltfb003", "nphp007", "clsl006", "npvc012"],
  },

  // Tech, media & creative
  {
    id: "tech",
    sector: "tech",
    name: u("科技公司及初創", "Tech companies & start-ups"),
    why: u("充電、收納、音響類產品最受科技人歡迎，適合迎新套裝。", "Charging, cable and audio gear wins with tech teams — perfect for welcome kits."),
    uses: [u("新員工迎新套裝", "Onboarding kits"), u("黑客松及產品發佈", "Hackathons & launches"), u("合作夥伴禮", "Partner gifts")],
    productIds: ["npdc004", "clps008", "npbte001", "npps011", "npvc020", "npbs0001"],
  },
  {
    id: "telecom",
    sector: "tech",
    name: u("電訊及電子產品零售", "Telecoms & electronics retail"),
    why: u("上台及購機贈品宜與手機配件相關，客人即時用得着。", "Contract and purchase gifts should be phone accessories customers use immediately."),
    uses: [u("上台及購機贈品", "Contract sign-up gifts"), u("門市推廣", "In-store promotions")],
    productIds: ["npdc006", "npps010", "npks0001", "nprf026", "clps006", "npbte001"],
  },
  {
    id: "media",
    sector: "tech",
    name: u("廣告、公關及媒體", "Advertising, PR & media"),
    why: u("公關包要上鏡、有話題，設計感強的產品更易被分享。", "PR kits need to photograph well — design-led products get shared."),
    uses: [u("KOL 公關包", "Influencer kits"), u("傳媒活動", "Media events"), u("客戶提案答謝", "Pitch thank-yous")],
    productIds: ["npks0003", "clrf019", "coad001", "cohb002", "npcg005", "npvc002"],
  },
  {
    id: "gaming",
    sector: "tech",
    name: u("遊戲及電競", "Gaming & esports"),
    why: u("耳機、喇叭、燈光類產品貼合玩家喜好，適合作比賽獎品。", "Earbuds, speakers and ambient lights suit gamers and make great prizes."),
    uses: [u("比賽獎品", "Tournament prizes"), u("玩家活動", "Player events"), u("直播抽獎", "Livestream giveaways")],
    productIds: ["npks0004", "npbte001", "nprf024", "npdc004", "npad006", "npps002"],
  },

  // Retail & consumer brands
  {
    id: "retail",
    sector: "retail",
    name: u("零售商店及商場", "Retailers & shopping malls"),
    why: u("滿額贈品要單價低、吸引力高，購物袋及隨身小電器最有效。", "Spend-and-get gifts need low cost and high appeal — bags and mini gadgets work best."),
    uses: [u("滿額贈品", "Spend-and-get"), u("會員換領", "Member redemption"), u("商場節日活動", "Mall festive events")],
    productIds: ["m-4e2baf5f", "nprf026", "npvc006", "npwb002", "npik004", "npad010"],
  },
  {
    id: "fashion",
    sector: "retail",
    name: u("時裝及化妝品品牌", "Fashion & cosmetics brands"),
    why: u("VIP 禮宜選美髮及香氛產品，與品牌形象一致。", "VIP gifts in hair styling and fragrance stay true to the brand image."),
    uses: [u("VIP 生日禮", "VIP birthdays"), u("新品發佈", "Product launches"), u("滿額贈品", "Purchase gifts")],
    productIds: ["cohd003", "cohs004", "cbem001", "coad001", "npad010", "npab001c"],
  },
  {
    id: "auto",
    sector: "retail",
    name: u("汽車經銷及車行", "Car dealers & garages"),
    why: u("交車禮宜選車上及出行用得着的產品，配合高檔形象。", "Handover gifts for the car and the road, matching a premium image."),
    uses: [u("新車交車禮", "Car handover gifts"), u("試車活動", "Test-drive events"), u("保養客戶答謝", "Service customer thanks")],
    productIds: ["npvc002", "clps009", "npdc004", "npvc021", "nprf024", "nphu001"],
  },
  {
    id: "family",
    sector: "retail",
    name: u("母嬰及家庭品牌", "Baby & family brands"),
    why: u("一家人都用得着的廚房小家電及保溫用品，最得家長歡心。", "Kitchen gadgets and food jars the whole family uses win parents over."),
    uses: [u("會員迎新禮", "Member welcome"), u("親子活動", "Family events"), u("展覽推廣", "Expo promotions")],
    productIds: ["npelb001", "nltfb006", "ccim002", "nptb009", "cbhp002", "nptj009"],
  },
  {
    id: "wine-food",
    sector: "retail",
    name: u("酒商及食品進口商", "Wine & food importers"),
    why: u("年節禮盒配上高質廚具，送給餐廳客戶及企業買家。", "Pair festive hampers with quality cookware for restaurant clients and corporate buyers."),
    uses: [u("年節禮盒", "Festive hampers"), u("餐廳客戶答謝", "Restaurant client thanks"), u("品酒活動", "Tasting events")],
    productIds: ["nptj004", "npkcb002", "npcg004", "cccp007", "npnp3001", "nphcp26001"],
  },

  // Engineering, logistics & manufacturing
  {
    id: "construction",
    sector: "industry",
    name: u("建築及工程", "Construction & engineering"),
    why: u("前線同事最需要降溫及大容量保溫用品，安全週及慰勞活動適用。", "Frontline teams need cooling and large-capacity drinkware for safety weeks and thank-yous."),
    uses: [u("工地安全週", "Site safety week"), u("夏日慰勞", "Summer appreciation"), u("工程完工禮", "Project completion")],
    productIds: ["nprf016", "clrf004a-2026", "npvc012", "nptj003", "npik004", "nprf007"],
  },
  {
    id: "logistics",
    sector: "industry",
    name: u("物流及運輸", "Logistics & transport"),
    why: u("司機及倉務同事長時間工作，耐用的保溫及降溫產品最貼心。", "Drivers and warehouse staff work long hours — durable cooling and drinkware help."),
    uses: [u("司機及倉務慰勞", "Driver & warehouse thanks"), u("客戶答謝", "Client appreciation")],
    productIds: ["nprf016", "npvc012", "npdc005", "nptb007", "clrf014", "nppr001"],
  },
  {
    id: "manufacturing",
    sector: "industry",
    name: u("製造及貿易公司", "Manufacturers & traders"),
    why: u("海外買家及供應商來訪，送一份展示香港品味的實用禮品。", "Overseas buyers and suppliers visiting — a practical gift with Hong Kong taste."),
    uses: [u("買家來訪禮", "Buyer visit gifts"), u("展覽贈品", "Trade-show giveaways"), u("供應商答謝", "Supplier thanks")],
    productIds: ["npps002", "nptj001", "npvc013", "clps009", "npap001", "nptk004"],
  },
  {
    id: "utility",
    sector: "industry",
    name: u("公用事業及能源", "Utilities & energy"),
    why: u("社區推廣宜配合節能、環保主題，選充電式及可重用產品。", "Community campaigns suit rechargeable and reusable products with a sustainability angle."),
    uses: [u("社區節能推廣", "Energy-saving campaigns"), u("客戶服務日", "Customer days")],
    productIds: ["npik006", "nptb001", "m-71103030", "npwb002", "nphp007", "npvc008"],
  },

  // Public sector & associations
  {
    id: "government",
    sector: "public",
    name: u("政府部門及公營機構", "Government & public bodies"),
    why: u("推廣活動講求預算清晰、數量大，選單價低而實用的產品。", "Campaigns need clear budgets and volume — low-cost, useful products."),
    uses: [u("公眾推廣活動", "Public campaigns"), u("嘉賓紀念品", "Guest souvenirs"), u("員工嘉許", "Staff commendations")],
    productIds: ["m-c37733ea", "npwb001", "npvc006", "npdc003", "nprf026", "npik004"],
  },
  {
    id: "association",
    sector: "public",
    name: u("商會、專業學會及工會", "Chambers, institutes & unions"),
    why: u("週年晚宴及會員大會需要抽獎大獎及會員紀念品。", "Annual dinners and AGMs need lucky-draw prizes and member souvenirs."),
    uses: [u("週年晚宴抽獎", "Annual dinner draws"), u("會員大會紀念品", "AGM souvenirs"), u("理事答謝", "Committee thanks")],
    productIds: ["npaf001", "cbmg001", "npvc010", "clps008", "nptj001", "npbs0001"],
  },
  {
    id: "sports",
    sector: "public",
    name: u("體育總會及賽事主辦", "Sports bodies & event organisers"),
    why: u("完賽包及義工禮要輕便耐用，運動水壺及降溫產品最合用。", "Finisher packs and volunteer gifts should be light and durable."),
    uses: [u("完賽包", "Finisher packs"), u("義工禮", "Volunteer gifts"), u("頒獎禮", "Prize-giving")],
    productIds: ["npwb002", "nprf016", "clrf004a-2026", "npwb001", "m-6bce85d9", "cbmg001"],
  },
  {
    id: "district",
    sector: "public",
    name: u("議員辦事處及地區團體", "District offices & local groups"),
    why: u("街站及長者活動派發量大，宜選實用、耐用、人人都用得着的產品。", "Street booths and elderly events hand out volume — practical items everyone uses."),
    uses: [u("街站派發", "Street booth giveaways"), u("長者活動", "Elderly events"), u("節日探訪", "Festive visits")],
    productIds: ["m-3912e383", "npvc006", "npik004", "nltfb002", "npwb001", "nphp004"],
  },
];

export const industryById = (id: string) => industries.find((i) => i.id === id);
