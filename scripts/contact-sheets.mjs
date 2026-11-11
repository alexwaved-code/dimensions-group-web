// Builds numbered contact sheets of all product photos for a manual brand-mark audit.
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "public/products");
const OUT = path.join(ROOT, ".import/sheets");
const COLS = 8, ROWS = 6, CELL = 240, LABEL = 22;

await fs.mkdir(OUT, { recursive: true });
const files = [];
for (const id of (await fs.readdir(SRC)).sort()) {
  for (const f of (await fs.readdir(path.join(SRC, id))).sort()) files.push(`${id}/${f}`);
}

const index = {};
const perSheet = COLS * ROWS;
for (let s = 0; s * perSheet < files.length; s++) {
  const batch = files.slice(s * perSheet, (s + 1) * perSheet);
  const composites = [];
  for (let i = 0; i < batch.length; i++) {
    const n = s * perSheet + i;
    index[n] = batch[i];
    const x = (i % COLS) * CELL, y = Math.floor(i / COLS) * (CELL + LABEL);
    const thumb = await sharp(path.join(SRC, batch[i])).resize(CELL, CELL, { fit: "contain", background: "#fff" }).toBuffer();
    composites.push({ input: thumb, left: x, top: y + LABEL });
    const svg = `<svg width="${CELL}" height="${LABEL}"><rect width="100%" height="100%" fill="#111"/><text x="6" y="16" font-size="14" font-family="Helvetica" fill="#fff">#${n} ${batch[i]}</text></svg>`;
    composites.push({ input: Buffer.from(svg), left: x, top: y });
  }
  await sharp({ create: { width: COLS * CELL, height: ROWS * (CELL + LABEL), channels: 3, background: "#ddd" } })
    .composite(composites).jpeg({ quality: 80 }).toFile(path.join(OUT, `sheet-${String(s + 1).padStart(2, "0")}.jpg`));
}
await fs.writeFile(path.join(OUT, "index.json"), JSON.stringify(index, null, 1));
console.log(`${files.length} images -> ${Math.ceil(files.length / perSheet)} sheets`);
