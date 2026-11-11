"""Merge grouped models + bilingual copy + local images + image audit into src/data/catalog.json."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMPORT = ROOT / ".import"
PUBLIC = ROOT / "public"
OUT = ROOT / "src/data/catalog.json"

BRAND = re.compile(r"codes\s*codes|codescodes|codes\s*living|codes\s*body|codes\s*cucina|\bcodes\b", re.I)
MAX_IMAGES = 8


def load_copy():
    copy = {}
    for f in sorted((IMPORT / "i18n_out").glob("batch_*.json")):
        try:
            for item in json.loads(f.read_text()):
                copy[item["id"]] = item
        except json.JSONDecodeError:
            print(f"skip unreadable {f.name}")
    return copy


def load_audit():
    p = IMPORT / "image_audit.json"
    return json.loads(p.read_text()) if p.exists() else {}


def load_white():
    p = IMPORT / "white_bg.json"
    return set(json.loads(p.read_text())) if p.exists() else set()


def price_band(price):
    if price <= 0:
        return None
    if price < 150:
        return "a"
    if price < 300:
        return "b"
    if price < 600:
        return "c"
    return "d"


def L(en, zh=None):
    return {"en": en, "zh": zh if zh is not None else en}


def main():
    models = json.loads((IMPORT / "models_raw.json").read_text())
    copy = load_copy()
    audit = load_audit()
    white = load_white()
    products, slugs = [], set()
    for m in models:
        c = copy.get(m["id"])
        local = sorted((PUBLIC / "products" / m["id"]).glob("*.webp"), key=lambda p: int(p.stem))
        files = [f"{m['id']}/{p.name}" for p in local]

        def flag(f):
            return audit.get(f, {}).get("flag")

        clean = [f for f in files if flag(f) not in ("brand", "retail")]
        clean_white = [f for f in clean if f in white and flag(f) != "poster"]
        branded_white = [f for f in files if flag(f) == "brand" and f in white]

        def rank(f):
            if f in clean_white:
                return 0
            if not clean_white and f in branded_white:
                return 1
            if flag(f) == "poster":
                return 3
            if flag(f) in ("brand", "retail"):
                return 9
            return 2

        usable = sorted((f for f in files if rank(f) < 9), key=rank)
        images = [f"/products/{f}" for f in usable]

        src_images = m["images"][:MAX_IMAGES]
        variants = []
        for i, v in enumerate(m["variants"]):
            label = c["variants"][i] if c and i < len(c["variants"]) else None
            if not label:
                col = v.get("colour")
                label = L(col["en"], col["zh"]) if col else L(v.get("design") or "Standard", v.get("design") or "標準款")
            img = None
            if v.get("image") in src_images:
                f = f"{m['id']}/{src_images.index(v['image']) + 1}.webp"
                if f"/products/{f}" in images:
                    img = f"/products/{f}"
            variants.append({
                "sku": v["sku"] or None,
                "label": label,
                "hex": (v.get("colour") or {}).get("hex"),
                "image": img,
            })

        slug = (c or {}).get("slug") or m["id"]
        slug = re.sub(r"[^a-z0-9\-]+", "-", slug.lower()).strip("-")
        base, n = slug, 2
        while slug in slugs:
            slug = f"{base}-{n}"; n += 1
        slugs.add(slug)

        name_zh = BRAND.sub("", m["nameZh"]).strip()
        p = {
            "id": m["id"],
            "slug": slug,
            "category": m["category"],
            "name": c["name"] if c else L(name_zh, name_zh),
            "tagline": c["tagline"] if c else L("", ""),
            "summary": c["summary"] if c else L("", ""),
            "features": c["features"] if c else [L(f, f) for f in m["features"][:5]],
            "specs": c["specs"] if c else [{"label": L(s["label"]), "value": L(s["value"])} for s in m["specs"][:8]],
            "variants": variants,
            "images": images,
            "certs": (c or {}).get("certs", []),
            "giftable": bool((c or {}).get("giftable", m["category"] not in ("accessories",))),
            "keywords": (c or {}).get("keywords", []),
            "band": price_band(m.get("price", 0)),
            "translated": bool(c),
        }
        dump = json.dumps(p, ensure_ascii=False)
        if BRAND.search(dump):
            print(f"WARNING brand text remains in {m['id']}: {BRAND.findall(dump)}")
        products.append(p)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(products, ensure_ascii=False, indent=1))
    no_img = [p["id"] for p in products if not p["images"]]
    print(f"{len(products)} products, {sum(p['translated'] for p in products)} translated, "
          f"{sum(len(p['images']) for p in products)} images, no-image: {no_img}")


if __name__ == "__main__":
    main()
