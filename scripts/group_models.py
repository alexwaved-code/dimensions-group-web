"""Group raw Shopify listings into showcase models (colour variants merged).

Input:  .import/feed.json, .import/with_logo_handles.json
Output: .import/models_raw.json
"""
import hashlib
import json
import re
from collections import OrderedDict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMPORT = ROOT / ".import"

COLOURS = OrderedDict([
    ("薄荷綠", ("Mint Green", "#a8d5c2")), ("低調灰", ("Slate Grey", "#7d7f84")),
    ("牛油果綠", ("Avocado Green", "#a3b37a")), ("奶油白", ("Cream White", "#f2ece0")),
    ("水湖藍", ("Lake Blue", "#6fb3c8")), ("玫瑰金", ("Rose Gold", "#d4a59a")),
    ("深灰色", ("Charcoal", "#4a4b4f")), ("深灰", ("Charcoal", "#4a4b4f")),
    ("淺灰白", ("Light Grey", "#d9d9d9")), ("灰藍色", ("Steel Blue", "#6b7f99")),
    ("深藍色", ("Navy", "#1f2f52")), ("深藍", ("Navy", "#1f2f52")),
    ("淺藍色", ("Light Blue", "#a9cbe6")), ("米白色", ("Ivory", "#efe9dd")), ("米白", ("Ivory", "#efe9dd")),
    ("米黃色", ("Beige", "#e3d5b8")), ("米黃", ("Beige", "#e3d5b8")), ("米色", ("Beige", "#e3d5b8")),
    ("卡其色", ("Khaki", "#bfae8a")), ("軍綠色", ("Olive", "#5c6b4a")),
    ("粉紅色", ("Pink", "#f3c6cf")), ("粉紅", ("Pink", "#f3c6cf")),
    ("黑色", ("Black", "#1d1d1f")), ("白色", ("White", "#f5f5f7")), ("灰色", ("Grey", "#8e8e93")),
    ("藍色", ("Blue", "#3a6ea5")), ("綠色", ("Green", "#5e8c6a")), ("緑色", ("Green", "#5e8c6a")),
    ("紫色", ("Purple", "#9b84c4")), ("橙色", ("Orange", "#e98b3a")), ("紅色", ("Red", "#c0392b")),
    ("黃色", ("Yellow", "#f2c94c")), ("金色", ("Gold", "#c9a96e")), ("銀色", ("Silver", "#c7c9cc")),
    ("黑", ("Black", "#1d1d1f")), ("白", ("White", "#f5f5f7")),
])

SKU_COLOUR_SUFFIX = re.compile(r"(BK|WH|GY|GR|PK|BL|BU|OR|PR|GN|BG|BE|SV|GL|SL|RD|DB|YL|NV|LB|DG|RG)$")

EXCLUDE_TITLE = re.compile(r"PELLINI|Barissimo|Tchibo|苦蕎茶|Monster|米奇", re.I)

BRAND_STRIP = re.compile(r"\b(Codes\s*Codes|CodesCodes|Codes\s*Living|Codes\s*Body|Codes\s*Cucina|Codes|CL\s*Living)\b\s*", re.I)


def extract_sku(title, variants):
    for v in variants:
        if v.get("sku"):
            return v["sku"].strip().replace("TEST - ", "").replace("TEST-", "")
    m = re.search(r"#\s*(?:TEST\s*-\s*)?([A-Za-z0-9][A-Za-z0-9\-]+)", title)
    if m:
        return m.group(1)
    m = re.search(r"\s-\s*([A-Z]{2,}[A-Z0-9]+)\s*$", title)
    return m.group(1) if m else ""


def clean_title(title):
    t = re.sub(r"#\s*(TEST\s*-\s*)?[A-Za-z0-9\-]+", "", title)
    t = re.sub(r"\s-\s*[A-Z]{2,}[A-Z0-9]+\s*$", "", t)
    t = re.sub(r"\b(NPVC002|F303-BK)\b", "", t)
    t = t.replace("全城熱賣 - ", "")
    t = BRAND_STRIP.sub("", t)
    return re.sub(r"\s+", " ", t).strip(" -_")


def find_colour(text):
    for zh, (en, hexv) in COLOURS.items():
        if zh in text:
            return {"zh": zh, "en": en, "hex": hexv}
    return None


def strip_colour(title):
    t = re.sub(r"[（(][^（）()]*?(色|黑|白|木紋)[^（）()]*?[）)]", "", title)
    t = re.sub(r"[（(]\s*[）)]", "", t)
    return re.sub(r"\s+", " ", t).strip()


FAMILY_MERGE = [
    re.compile(r"^(NP-SHOPBAG-00\d)[A-E]$"),
    re.compile(r"^(NPTB00[12])D\d$"),
    re.compile(r"^(NPAD010)[A-E]$"),
    re.compile(r"^(NPTB017A)\d$"),
    re.compile(r"^(NPAD00[45])BK-1$"),
]


def model_key(sku, base_title):
    if sku:
        s = SKU_COLOUR_SUFFIX.sub("", sku).upper()
        for rule in FAMILY_MERGE:
            m = rule.match(s)
            if m:
                return m.group(1)
        if len(s) >= 5:
            return s
    return base_title


def design_label(title):
    m = re.search(r"[（(]([^（）()]+)[）)]\s*$", title) or re.search(r"_([^_]+)$", title)
    return m.group(1).strip() if m else None


def family_name(title):
    t = re.sub(r"[（(][^（）()]+[）)]\s*$", "", title)
    t = re.sub(r"_[^_]+$", "", t)
    return t.strip()


def body_sections(html):
    text = re.sub(r"<br\s*/?>", "\n", html or "")
    text = re.sub(r"</p>|</li>|</div>|</h\d>", "\n", text)
    text = re.sub(r"<[^>]+>", "", text)
    text = text.replace("&nbsp;", " ").replace("&amp;", "&")
    text = BRAND_STRIP.sub("", text)
    text = text.split("***溫馨提示***")[0]
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    features, specs, other = [], [], []
    mode = "other"
    for l in lines:
        if re.match(r"^(產品特色|產品特點|特點|特色)[:：]?$", l):
            mode = "features"; continue
        if re.match(r"^(規格資訊|產品規格|規格|規格參數)[:：]?$", l):
            mode = "specs"; continue
        item = l.lstrip("-•· ").strip()
        if not item:
            continue
        if mode == "specs":
            m = re.match(r"^([^:：]{1,14})[:：]\s*(.+)$", item)
            if m:
                specs.append({"label": m.group(1).strip(), "value": m.group(2).strip()})
            else:
                specs.append({"label": "", "value": item})
        elif mode == "features":
            features.append(item)
        else:
            other.append(item)
    if not features:
        features = [o for o in other if 6 <= len(o) <= 160][:8]
    return features, specs


CATEGORY_RULES = [
    ("accessories", ["清潔電器配件", "清潔用品配件", "廚房電器配件", "生活配件"]),
    ("climate", ["風扇", "暖風機", "冷風機", "抽濕機", "空氣清新機", "加濕器", "座地風扇", "循環扇"]),
    ("home-care", ["吸塵機", "塵蟎機", "掃地機械人", "電動拖地機", "蒸氣清潔機", "清潔電器", "Electrical Cleaner",
                   "電動清潔刷", "地拖 拖把", "清潔刷", "熨斗 掛熨機", "掛燙機", "乾衣機"]),
    ("kitchen", ["電熱水壺 飲水機", "咖啡機 磨豆機 奶泡機 咖啡豆", "豆漿機 榨汁機", "打蛋器 打麵粉機 攪拌棒", "電煮鍋",
                 "養生壺 磨粉機 茶包", "電飯煲", "電燉煱 打邊爐機", "食物切碎器", "爆谷機 雪糕機", "氣炸焗爐", "電飯盒",
                 "電動真空機 真空保鮮袋", "Grilling", "Food Processing"]),
    ("personal-care", ["風筒", "直髮夾", "直髮捲髮器", "鬚刨", "理髮剪", "水牙線機"]),
    ("wellness", ["按摩器", "美容儀", "電暖毯", "血壓計"]),
    ("power-audio", ["拖板", "數據線", "藍牙喇叭/耳機", "卡拉ok", "收音機"]),
    ("drinkware", ["保溫壺", "保溫杯", "燜燒壺", "水壺"]),
    ("cookware", ["煮食鍋具", "餐具", "菜板", "食物盒 飯盒", "油壺", "米桶"]),
    ("aroma", ["香薰機", "香薰", "香囊", "鹽燈", "鹽燭台", "鹽皂 浴鹽", "岩鹽板"]),
    ("lifestyle", ["收納箱 收納袋", "購物袋", "購物車", "摺疊凳", "污衣籃", "旅行袋", "保險箱", "晾衣架", "滅蚊燈", "碎紙機"]),
]

ACCESSORY_NAME = re.compile(r"濾芯|濾網|過濾盤|刷頭|拖布|替換頭|支架")


def categorize(m):
    if ACCESSORY_NAME.search(re.sub(r"[（(][^（）()]*[）)]", "", m["nameZh"])):
        return "accessories"
    if "碎紙機" in m["tags"]:
        return "lifestyle"
    if "香薰" in m["nameZh"] and "淨化器" not in m["nameZh"] and "風筒" not in m["nameZh"]:
        return "aroma"
    for cat, tags in CATEGORY_RULES:
        if any(t in m["tags"] for t in tags):
            return cat
    name = m["nameZh"]
    if "風筒" in name:
        return "personal-care"
    if "香薰" in name or "加濕" in name:
        return "climate"
    return "lifestyle"


def main():
    feed = json.loads((IMPORT / "feed.json").read_text())
    logo_handles = set(json.loads((IMPORT / "with_logo_handles.json").read_text()))
    models = OrderedDict()
    excluded = []
    for p in feed:
        if EXCLUDE_TITLE.search(p["title"]):
            excluded.append(p["title"]); continue
        sku = extract_sku(p["title"], p["variants"])
        title = clean_title(p["title"])
        colour = find_colour(title)
        base = strip_colour(title)
        key = model_key(sku, base)
        merged_family = any(r.match(SKU_COLOUR_SUFFIX.sub("", sku).upper()) for r in FAMILY_MERGE) if sku else False
        design = None
        if merged_family:
            design = design_label(title)
            if design and design not in COLOURS:
                colour = None
            else:
                design = None
            base = family_name(strip_colour(title)) if not design else family_name(title)
        features, specs = body_sections(p["body_html"])
        images = [i["src"].split("?")[0] for i in p["images"]]
        m = models.setdefault(key, {
            "key": key, "nameZh": base, "tags": [], "variants": [], "images": [],
            "features": features, "specs": specs, "hasOldLogo": False, "handles": [],
            "grams": 0,
        })
        m["tags"] = sorted(set(m["tags"]) | set(p["tags"]))
        m["handles"].append(p["handle"])
        m["hasOldLogo"] = m["hasOldLogo"] or p["handle"] in logo_handles
        if len(features) > len(m["features"]):
            m["features"] = features
        if len(specs) > len(m["specs"]):
            m["specs"] = specs
        m["grams"] = max(m["grams"], max((v.get("grams") or 0) for v in p["variants"]))
        m["price"] = max(m.get("price", 0), max(float(v.get("price") or 0) for v in p["variants"]))
        m["variants"].append({
            "sku": sku, "colour": colour, "design": design, "title": title,
            "image": images[0] if images else None,
        })
        for img in images:
            if img not in m["images"]:
                m["images"].append(img)
    out = list(models.values())
    for m in out:
        m["category"] = categorize(m)
        ascii_key = re.sub(r"[^a-z0-9\-]+", "-", m["key"].lower()).strip("-")
        if not re.search(r"[a-z]{2}\d", ascii_key):
            ascii_key = "m-" + hashlib.sha1(m["key"].encode()).hexdigest()[:8]
        m["id"] = ascii_key
    (IMPORT / "models_raw.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
    print(f"{len(feed)} listings -> {len(out)} models; excluded {len(excluded)}: {excluded}")


if __name__ == "__main__":
    main()
