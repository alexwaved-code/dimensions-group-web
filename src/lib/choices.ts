import type { L } from "./i18n";

export type Choice = { id: string; name: L; why: L; uses: L[]; productIds: string[] };

const u = (zh: string, en: string): L => ({ zh, en });

export const recipients: Choice[] = [
  {
    id: "for-executives",
    name: u("公司高層及董事", "Executives & directors"),
    why: u("見慣好東西，宜選做工精細、設計低調而有份量的產品。", "They've seen it all — choose fine craftsmanship with understated weight."),
    uses: [u("董事會答謝", "Board thanks"), u("高層節日禮", "Executive festive gifts")],
    productIds: ["npvc002", "cccm001", "npsm001", "nptj004", "clps009", "cohd003"],
  },
  {
    id: "for-key-clients",
    name: u("重要客戶", "Key clients"),
    why: u("放在辦公室或家中每天看見，品牌就每天出現一次。", "Something seen daily at home or work keeps your brand in view."),
    uses: [u("年度答謝", "Annual appreciation"), u("簽約及合作紀念", "Deal and partnership mementos")],
    productIds: ["npap001", "npcg005", "clad001", "npvc010", "clsl002", "npvc013"],
  },
  {
    id: "for-frontline",
    name: u("前線員工", "Frontline staff"),
    why: u("長時間站立或戶外工作，降溫、保溫及暖身產品最實際。", "Long shifts on their feet or outdoors — cooling, warming and drinkware help most."),
    uses: [u("夏日慰勞", "Summer thanks"), u("冬日送暖", "Winter care"), u("服務嘉許", "Service recognition")],
    productIds: ["nprf016", "npvc012", "clrf004a-2026", "nphp007", "nptj003", "npik004"],
  },
  {
    id: "for-office",
    name: u("辦公室同事", "Office teams"),
    why: u("放在桌上用得着的小電器及配件，提升每天的工作舒適度。", "Desk-side gadgets and accessories that make the workday more comfortable."),
    uses: [u("團隊獎勵", "Team rewards"), u("部門活動", "Department events")],
    productIds: ["nprf024", "npdc006", "npvc020", "npps010", "cbhp003", "nphu001"],
  },
  {
    id: "for-new-joiners",
    name: u("新入職員工", "New joiners"),
    why: u("迎新套裝宜輕巧實用，印上公司標誌，第一天就有歸屬感。", "Light, useful welcome kits with your logo build belonging from day one."),
    uses: [u("迎新套裝", "Welcome kits"), u("實習生禮物", "Intern gifts")],
    productIds: ["npvc008", "npdc004", "npps007", "npbs0001", "m-6bce85d9", "npwb002"],
  },
  {
    id: "for-elderly",
    name: u("長者", "Seniors"),
    why: u("操作簡單、保暖及健康相關的產品最受長者歡迎。", "Simple to use, warming and health-related products are most appreciated."),
    uses: [u("敬老活動", "Elderly events"), u("探訪禮物", "Visit gifts")],
    productIds: ["nphp004", "cbbmp001", "nppr001", "npkm001", "cbhp006", "nptj001"],
  },
  {
    id: "for-students",
    name: u("學生及年輕人", "Students & young people"),
    why: u("潮流、輕便、日常用得着，水壺、風扇及耳機最受歡迎。", "Trendy, portable and everyday — bottles, fans and earbuds are favourites."),
    uses: [u("獎學金及頒獎", "Scholarships & awards"), u("校園推廣", "Campus promotions")],
    productIds: ["npwb001", "nprf026", "npbte001", "npdc005", "npks0001", "m-c37733ea"],
  },
  {
    id: "for-women",
    name: u("女士", "Women"),
    why: u("美髮、美容及香氛產品貼心又實用。", "Hair styling, beauty and fragrance — thoughtful and practical."),
    uses: [u("婦女節", "Women's day"), u("VIP 客戶禮", "VIP client gifts")],
    productIds: ["cohb002", "npbfm002", "cbem001", "cohs004", "npad005", "cbwb001"],
  },
  {
    id: "for-men",
    name: u("男士", "Men"),
    why: u("理容、按摩及咖啡器具，實用而有質感。", "Grooming, massage and coffee gear — practical with quality feel."),
    uses: [u("父親節", "Father's day"), u("客戶及同事禮", "Client and colleague gifts")],
    productIds: ["npms002", "nphc001", "cbmg001", "npcg004", "clps008", "npvc009"],
  },
  {
    id: "for-families",
    name: u("一家大小", "Families"),
    why: u("全家都用得着的廚房電器，送一份可以一起享受的禮物。", "Kitchen appliances the whole family enjoys together."),
    uses: [u("家庭日", "Family days"), u("員工家屬禮", "Gifts for staff families")],
    productIds: ["nprc003", "npaf001", "ccim001", "npcookset001", "cctb002", "npelb001"],
  },
  {
    id: "for-outdoor",
    name: u("戶外及運動愛好者", "Outdoor & sports lovers"),
    why: u("露營燈、運動水壺、掛頸風扇及燜燒杯，郊遊必備。", "Camping lights, sports bottles, neck fans and food jars for days out."),
    uses: [u("行山及運動日", "Hiking & sports days"), u("戶外活動", "Outdoor events")],
    productIds: ["npik005", "npwb002", "nprf016", "nptb007", "cbmg001", "nptj007"],
  },
  {
    id: "for-coffee-tea",
    name: u("咖啡及茶愛好者", "Coffee & tea lovers"),
    why: u("磨豆機、手沖壺、奶泡器及茶隔保溫杯，配合每天的儀式感。", "Grinders, pour-over kettles, frothers and tea flasks for the daily ritual."),
    uses: [u("客戶及同事禮", "Client & colleague gifts"), u("下午茶活動", "Tea-break events")],
    productIds: ["npcg005", "npcg004", "npek002", "npmf001", "npvc013", "nptk004"],
  },
  {
    id: "for-travellers",
    name: u("經常出差人士", "Frequent travellers"),
    why: u("轉換插頭、旅行水煲、收線風筒及摺疊旅行袋，出差更方便。", "Adapters, travel kettles, compact dryers and packable bags make trips easier."),
    uses: [u("出差人員", "Business travellers"), u("會議及展覽嘉賓", "Conference guests")],
    productIds: ["clps009", "nptk003", "nptb007", "npdc004", "cbhd005", "npvc006"],
  },
];

export const festivals: Choice[] = [
  {
    id: "lunar-new-year",
    name: u("農曆新年", "Lunar New Year"),
    why: u("新年送養生、團圓及好意頭的禮物，客戶及員工都適用。", "Wellness, reunion and auspicious gifts for clients and staff alike."),
    uses: [u("拜年禮", "New Year visits"), u("開年飯", "Spring dinners"), u("利是以外的心意", "Beyond red packets")],
    productIds: ["nptk004", "nptj004", "clsl002", "cccp007", "cbss003", "npnp3001"],
  },
  {
    id: "mid-autumn",
    name: u("中秋節", "Mid-Autumn Festival"),
    why: u("月餅以外，送一份泡茶、保溫或點燈的團圓禮。", "Beyond mooncakes — tea, warmth and light for the reunion."),
    uses: [u("客戶節日禮", "Client festive gifts"), u("員工中秋禮", "Staff Mid-Autumn gifts")],
    productIds: ["nptj001", "npvc013", "npad003", "clsl006", "nptj005", "npek002"],
  },
  {
    id: "christmas",
    name: u("聖誕節", "Christmas"),
    why: u("節日氣氛濃厚的香氛、燈光及暖笠笠產品，派對抽獎亦適合。", "Festive scent, light and cosy pieces — great for party draws too."),
    uses: [u("聖誕派對抽獎", "Party lucky draws"), u("客戶聖誕禮", "Client Christmas gifts"), u("交換禮物", "Gift exchanges")],
    productIds: ["coad001", "npad004", "cbhp006", "ccim002", "npbs0001", "npab001a"],
  },
  {
    id: "summer",
    name: u("端午及夏日", "Dragon Boat & summer"),
    why: u("香港夏天又熱又長，降溫產品最受歡迎、最常用。", "Hong Kong summers are long and hot — cooling products get used the most."),
    uses: [u("夏日推廣", "Summer promotions"), u("員工防暑慰勞", "Heat-relief for staff")],
    productIds: ["nprf016", "clrf023", "coac002", "npwb002", "clrf022", "nprf007"],
  },
  {
    id: "winter",
    name: u("冬日送暖", "Winter warmth"),
    why: u("電熱毯、暖腳套及暖風機，天氣一凍就用得着。", "Heated throws, foot warmers and heaters — used the moment it turns cold."),
    uses: [u("冬至及年尾", "Winter solstice & year-end"), u("長者探訪", "Elderly visits")],
    productIds: ["cbhp003", "nphp004", "npfh002", "nphp005", "nptj003", "cbhp002"],
  },
  {
    id: "mothers-day",
    name: u("母親節", "Mother's Day"),
    why: u("美容及放鬆產品，讓媽媽好好寵愛自己。", "Beauty and relaxation gifts so mums can treat themselves."),
    uses: [u("會員母親節推廣", "Member promotions"), u("員工家屬禮", "Staff family gifts")],
    productIds: ["cohd004", "npbfm002", "cbem001", "cbfs001", "npem001", "cbwb001"],
  },
  {
    id: "fathers-day",
    name: u("父親節", "Father's Day"),
    why: u("理容、按摩及品味小物，實用又有心思。", "Grooming, massage and refined everyday pieces."),
    uses: [u("會員父親節推廣", "Member promotions"), u("員工家屬禮", "Staff family gifts")],
    productIds: ["npms002", "cbmg001", "npsm001", "npvc002", "npcg004", "nphc001"],
  },
  {
    id: "teachers-day",
    name: u("教師節及謝師", "Teachers' Day & thank-yous"),
    why: u("老師每天講課，護喉保溫杯、護眼及放鬆產品最貼心。", "Teachers talk all day — tea flasks, eye care and relaxation fit best."),
    uses: [u("謝師宴", "Thank-you dinners"), u("教師節", "Teachers' day")],
    productIds: ["npvc010", "npvc009", "clad001", "npem001", "npdc006", "nphu001"],
  },
  {
    id: "company-anniversary",
    name: u("公司週年及開業", "Anniversaries & openings"),
    why: u("由抽獎大獎到賓客紀念品，一次過配齊不同層次的禮品。", "From grand prizes to guest souvenirs — every tier in one go."),
    uses: [u("週年晚宴", "Anniversary dinners"), u("開幕嘉賓禮", "Opening guest gifts")],
    productIds: ["npaf001", "cccm001", "npvc002", "clps008", "npvc008", "npad010"],
  },
];

export const budgetNotes: Record<string, { why: L; uses: L[] }> = {
  a: {
    why: u("適合大量派發，單價低但同樣實用，印上標誌效果好。", "Built for volume — low per-unit cost, still useful, and great for logos."),
    uses: [u("展覽及活動贈品", "Event giveaways"), u("大量派發", "Mass distribution")],
  },
  b: {
    why: u("實用與質感兼備，員工禮及研討會最常用的預算。", "Practical with a quality feel — the go-to band for staff and seminars."),
    uses: [u("員工禮物", "Staff gifts"), u("研討會嘉賓", "Seminar guests")],
  },
  c: {
    why: u("有份量的家電及生活用品，適合客戶答謝及貴賓禮。", "Substantial appliances and lifestyle pieces for clients and VIPs."),
    uses: [u("客戶答謝", "Client appreciation"), u("貴賓禮", "VIP gifts")],
  },
  d: {
    why: u("高檔家電，適合作抽獎大獎、高層及重要客戶禮物。", "Premium appliances for grand prizes, executives and key clients."),
    uses: [u("抽獎大獎", "Grand prizes"), u("高層及重要客戶", "Executives & key clients")],
  },
};
