// Downloads every model's product photos from the old store CDN into public/products/<id>/<n>.webp
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const models = JSON.parse(await fs.readFile(path.join(ROOT, ".import/models_raw.json"), "utf8"));
const OUT = path.join(ROOT, "public/products");
const MAX_PER_MODEL = 8;
const CONCURRENCY = 8;

const jobs = [];
for (const m of models) {
  m.images.slice(0, MAX_PER_MODEL).forEach((src, i) => {
    jobs.push({ src, dest: path.join(OUT, m.id, `${i + 1}.webp`) });
  });
}

let done = 0;
let failed = [];
async function worker() {
  while (jobs.length) {
    const job = jobs.shift();
    try {
      await fs.access(job.dest);
    } catch {
      try {
        const res = await fetch(`${job.src}?width=1800`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        await fs.mkdir(path.dirname(job.dest), { recursive: true });
        await sharp(buf)
          .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
          .flatten({ background: "#ffffff" })
          .webp({ quality: 82 })
          .toFile(job.dest);
      } catch (e) {
        failed.push(`${job.src} -> ${e.message}`);
      }
    }
    if (++done % 100 === 0) console.log(`${done} images`);
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(`done ${done}, failed ${failed.length}`);
if (failed.length) console.log(failed.join("\n"));
