import { readFileSync, renameSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const paths = JSON.parse(readFileSync(new URL("../src/data/cutouts.json", import.meta.url), "utf8"));
const only = process.argv.slice(2);

function knockout(data, w, h) {
  const bg = new Uint8Array(w * h);
  const stack = [];
  const near = (i) => {
    const o = i * 4;
    return data[o] >= 246 && data[o + 1] >= 246 && data[o + 2] >= 246;
  };
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = y * w + x;
    if (bg[i] || !near(i)) return;
    bg[i] = 1;
    stack.push(i);
  };
  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }
  while (stack.length) {
    const i = stack.pop();
    const x = i % w;
    const y = (i / w) | 0;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }
  for (let i = 0; i < w * h; i++) {
    if (!bg[i]) continue;
    data[i * 4 + 3] = 0;
  }
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      if (bg[i]) continue;
      if (!(bg[i - 1] || bg[i + 1] || bg[i - w] || bg[i + w])) continue;
      const o = i * 4;
      const min = Math.min(data[o], data[o + 1], data[o + 2]);
      if (min < 226) continue;
      data[o + 3] = Math.max(0, Math.min(255, Math.round(((246 - min) / 20) * 255)));
    }
  }
}

let n = 0;
for (const src of paths) {
  if (only.length && !only.some((id) => src.includes(id))) continue;
  const file = path.join("public", src.replace(/^\//, ""));
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  knockout(data, info.width, info.height);
  const tmp = file + ".tmp";
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 82, alphaQuality: 90 })
    .toFile(tmp);
  renameSync(tmp, file);
  n++;
  if (n % 40 === 0) console.log(n);
}
console.log("done", n);
