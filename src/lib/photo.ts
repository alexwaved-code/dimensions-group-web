import cutouts from "@/data/cutouts.json";

const CUTOUTS = new Set(cutouts);

export const isCutout = (src: string) => CUTOUTS.has(src);

const CARD_TINT: Record<string, string> = {
  climate: "#e4f0f8",
  "home-care": "#e3f2e8",
  kitchen: "#f6eee4",
  "personal-care": "#f8eaea",
  wellness: "#f0e8f4",
  "power-audio": "#e7edf4",
  drinkware: "#e2f1f8",
  cookware: "#f3eee4",
  aroma: "#e7f3e4",
  lifestyle: "#f1eee6",
  accessories: "#e9ecef",
};

export function cardTint(category?: string) {
  return CARD_TINT[category ?? ""] ?? "#eef1f3";
}
