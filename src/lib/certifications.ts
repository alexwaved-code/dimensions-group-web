import type { L } from "./i18n";

export type CertInfo = { key: string; short: string; name: L; description: L; scope: L };

export const certLibrary: CertInfo[] = [
  {
    key: "LFGB",
    short: "LFGB",
    name: { en: "LFGB Food Contact", zh: "德國 LFGB 食品接觸認證" },
    description: {
      en: "German food and feed code. Confirms materials in contact with food release no harmful substances.",
      zh: "德國食品及日用品法規，確認接觸食物的物料不會釋出有害物質。",
    },
    scope: { en: "Kitchen appliances, cookware, drinkware", zh: "廚房電器、廚具、杯壺" },
  },
  {
    key: "FDA",
    short: "FDA",
    name: { en: "FDA-Compliant Materials", zh: "符合 FDA 標準物料" },
    description: {
      en: "Materials meet U.S. Food and Drug Administration requirements for food-contact use.",
      zh: "物料符合美國食品藥物管理局對食品接觸用途的要求。",
    },
    scope: { en: "Utensils and food-contact parts", zh: "餐具及食品接觸部件" },
  },
  {
    key: "EU REACH",
    short: "REACH",
    name: { en: "EU REACH", zh: "歐盟 REACH 法規" },
    description: {
      en: "EU regulation on chemicals. Restricts substances of very high concern in consumer products.",
      zh: "歐盟化學品法規，限制消費品中的高度關注物質。",
    },
    scope: { en: "Fragrance, textiles, plastics", zh: "香薰、織品、塑膠製品" },
  },
  {
    key: "GS",
    short: "GS",
    name: { en: "GS Geprüfte Sicherheit", zh: "德國 GS 安全認證" },
    description: {
      en: "Voluntary German safety mark issued after independent testing against European safety standards.",
      zh: "經獨立機構按歐洲安全標準測試後頒發的德國自願性安全標誌。",
    },
    scope: { en: "Electrical appliances", zh: "電器產品" },
  },
  {
    key: "IMQ",
    short: "IMQ",
    name: { en: "IMQ Quality Mark", zh: "意大利 IMQ 品質認證" },
    description: {
      en: "Italian certification mark confirming electrical safety and quality through independent testing.",
      zh: "意大利認證標誌，經獨立測試確認電氣安全及品質。",
    },
    scope: { en: "Electrical appliances", zh: "電器產品" },
  },
  {
    key: "CSI",
    short: "CSI",
    name: { en: "CSI Food Contact Testing", zh: "CSI 食品接觸安全測試" },
    description: {
      en: "Independent laboratory testing of food-contact components for safety and migration limits.",
      zh: "由獨立實驗室測試食品接觸部件的安全及遷移限量。",
    },
    scope: { en: "Coffee and beverage appliances", zh: "咖啡及飲品電器" },
  },
  {
    key: "BPA-free",
    short: "BPA",
    name: { en: "BPA-free", zh: "不含雙酚 A" },
    description: {
      en: "Made without bisphenol A, a compound restricted in food-contact plastics in many markets.",
      zh: "不含雙酚 A，此物質在多個市場的食品接觸塑膠中受到限制。",
    },
    scope: { en: "Bottles and food-contact plastics", zh: "水壺及食品接觸塑膠" },
  },
];

export const marketStandards: CertInfo[] = [
  {
    key: "HK-EPSR",
    short: "HK",
    name: { en: "Hong Kong Electrical Products (Safety) Regulation", zh: "香港《電氣產品（安全）規例》" },
    description: {
      en: "Administered by EMSD. Household electrical products supplied in Hong Kong must comply with essential safety requirements.",
      zh: "由機電工程署執行，在香港供應的家用電氣產品須符合基本安全規定。",
    },
    scope: { en: "Electrical products sold in Hong Kong", zh: "在港銷售的電氣產品" },
  },
  {
    key: "CE",
    short: "CE",
    name: { en: "CE Marking", zh: "歐盟 CE 標誌" },
    description: {
      en: "Declares conformity with EU health, safety and environmental requirements for the European market.",
      zh: "聲明產品符合歐盟健康、安全及環保要求，適用於歐洲市場。",
    },
    scope: { en: "Products for the European market", zh: "銷往歐洲市場的產品" },
  },
  {
    key: "RoHS",
    short: "RoHS",
    name: { en: "RoHS", zh: "RoHS 有害物質限制" },
    description: {
      en: "Restricts lead, mercury, cadmium and other hazardous substances in electrical and electronic equipment.",
      zh: "限制電器及電子設備中的鉛、汞、鎘等有害物質。",
    },
    scope: { en: "Electrical and electronic equipment", zh: "電器及電子設備" },
  },
  {
    key: "FCC",
    short: "FCC",
    name: { en: "FCC", zh: "美國 FCC 認證" },
    description: {
      en: "U.S. requirement limiting electromagnetic interference from electronic devices.",
      zh: "美國對電子產品電磁干擾的限制要求。",
    },
    scope: { en: "Products for the U.S. market", zh: "銷往美國市場的產品" },
  },
];

export const certInfo = (key: string): CertInfo =>
  certLibrary.find((c) => c.key.toLowerCase() === key.toLowerCase()) ?? {
    key,
    short: key.slice(0, 5),
    name: { en: key, zh: key },
    description: { en: "Stated on the product documentation.", zh: "於產品資料中列明。" },
    scope: { en: "", zh: "" },
  };
