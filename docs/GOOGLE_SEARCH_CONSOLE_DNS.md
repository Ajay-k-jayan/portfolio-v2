# Google Search Console — DNS (domain provider) verification

Use this when Search Console shows **Domain name provider** verification.

## TXT record (copy exactly)

| Field | Value |
|--------|--------|
| **Type** | `TXT` |
| **Name / Host** | `@` (or leave blank for root) |
| **Value** | `google-site-verification=mJmzuFILTFLJMLcIxlMZ8h1d-KKuWmP7eERZVrpske4` |
| **TTL** | Default (e.g. 3600) |

## If your site is only `ajaykj.vercel.app` (Vercel subdomain)

You **cannot** add a custom TXT record on `*.vercel.app`. Use one of these instead (already in this repo):

- **HTML tag** — meta tags in `index.html`
- **HTML file** — `https://ajaykj.vercel.app/googledf54218ef5a5aaef.html`

After deploy, click **Verify** for the HTML method in Search Console.

## If you use a custom domain on Vercel (e.g. `yourname.com`)

1. Open [Vercel Dashboard](https://vercel.com) → your project → **Settings** → **Domains**.
2. Select your domain → **DNS Records** (or manage DNS at your registrar if nameservers point elsewhere).
3. **Add record** → Type **TXT** → Name **`@`** → Value:
   ```
   google-site-verification=mJmzuFILTFLJMLcIxlMZ8h1d-KKuWmP7eERZVrpske4
   ```
4. Save. DNS can take **15 minutes to 48 hours**.
5. In Search Console → **Verify**.

## Other registrars (GoDaddy, Namecheap, Cloudflare, etc.)

1. Sign in to DNS for `ajaykj.vercel.app` **only if you own that hostname** — usually you manage DNS for a **custom** domain, not `vercel.app`.
2. Add a **TXT** record at **root** (`@`) with the **Value** above.
3. Wait for propagation, then **Verify** in Search Console.

## After verification

1. Submit sitemap: `https://ajaykj.vercel.app/sitemap.xml`
2. URL Inspection → `https://ajaykj.vercel.app/` → **Request indexing**
3. Keep the meta tags and `googledf54218ef5a5aaef.html` file — do not remove them.
