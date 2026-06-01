# SEO indexing checklist — https://ajaykj.vercel.app/

Technical items below are handled in this repo. **You** complete Search Console, backlinks, and profiles.

---

## 3. Blocking issues (verified in code)

| Check | Status |
|--------|--------|
| **noindex** in HTML | None — `robots`, `googlebot`, and `bingbot` are set to **index, follow** |
| **robots.txt** | `Allow: /` for `*`, `Googlebot`, `Bingbot` — **no Disallow** |
| **Single `<title>`** | One title in `index.html` (not changed by React) |
| **Meta description** | One description; OG/Twitter titles aligned with page title |
| **X-Robots-Tag** | Not set in `vercel.json` (would block indexing if `noindex`) |

After deploy, confirm live:

- https://ajaykj.vercel.app/robots.txt  
- View source → search for `noindex` (should find **zero**)

---

## 4. Backlinks (your action — not in code)

Google needs **trust signals** from other sites:

1. **LinkedIn** — Add website: `https://ajaykj.vercel.app/` on your profile.
2. **GitHub** — Pin `portfolio-v2` repo; set website URL in profile README.
3. **Google Business Profile** — Only if you offer local/client services; optional for a personal portfolio.
4. **Share** — Post portfolio link on LinkedIn, Instagram bio (`aj_ay.kj`), dev communities.
5. **Ask** — Former colleagues/clients for a LinkedIn recommendation that mentions your site or GitHub.

`rel="me"` links in `index.html` already point to LinkedIn, GitHub, and Instagram.

---

## 5. On-page & performance (in repo)

| Item | What we did |
|------|-------------|
| **Keywords in title / H1 / H2** | Title + H1 (hero) + section H2s; About/Skills/Experience leads mention Angular, TypeScript, frontend, software engineer |
| **Meta description** | Keyword-rich, single canonical description |
| **Images** | Skill icons: `loading="lazy"`, `decoding="async"`, `width`/`height` 32×32; cert logos have descriptive `alt` |
| **Large images** | Add **`public/og-image.png`** (~1200×630, compressed PNG/WebP) for social + sitemap image |
| **Speed** | Vite splits `three` + `gsap`; long-cache headers on `/assets/*`; fonts use `display=swap` |

**Stack note:** This project is **React + Vite + TypeScript** (not Angular). Your **Angular** experience is in content and schema — correct for hiring SEO.

---

## Search Console (required for “listing”)

1. Deploy latest code (verification file + meta tags).
2. [Google Search Console](https://search.google.com/search-console) → verify property.
3. Submit sitemap: `https://ajaykj.vercel.app/sitemap.xml`
4. **URL inspection** → `https://ajaykj.vercel.app/` → **Request indexing**
5. Wait **days to weeks** for first results (normal for new sites).

---

## Optional DNS verification

See `docs/GOOGLE_SEARCH_CONSOLE_DNS.md` (custom domain only; `*.vercel.app` uses HTML tag/file).
