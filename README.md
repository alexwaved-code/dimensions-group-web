# Dimensions Group

Bilingual site for **Dimensions Group Co. Limited**: electrical-appliance corporate gifts, souvenirs, and event giveaways, with logo printing and custom packaging on request.

English lives at `/en`. Traditional Chinese lives at `/zh`.

**Open the site:** [https://dimensions-group-web.alexwaved.workers.dev](https://dimensions-group-web.alexwaved.workers.dev)

`www.dimensionsgroup.com.hk` is the name the site is written for. That hostname has no DNS record on the Cloudflare account this project deploys to, so the workers.dev address above is the one that opens.

## What is on the site

- Home, product catalogue, product pages, and spec sheets
- Gifting occasions, customisation, quality, about, FAQ, contact, and enquiry
- On-site assistant (`/api/chat`) and a Web3Forms enquiry form

## Stack

Next.js 16, React 19, Tailwind CSS 4, deployed with OpenNext to a Cloudflare Worker named `dimensions-group-web`.

## Run it locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Two files stay on your machine and are not in this repo:

| File | What it holds |
| --- | --- |
| `.dev.vars` | `OPENAI_API_KEY` for the assistant |
| `.env.local` | `NEXT_PUBLIC_WEB3FORMS_KEY` for the enquiry form |

Copy the names above into those files. Production reads the same values as Worker secrets and build-time env, not from git.

## Deploy

```bash
npm run deploy
```

That builds the Next.js app, packages it with OpenNext, and publishes the Worker.

## Catalogue data

Product copy and images are already compiled into `src/data` and `public`. `scripts/build_catalog.py` can rebuild `src/data/catalog.json` from the sheets in `.import`.
