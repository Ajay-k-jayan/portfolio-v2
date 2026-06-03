import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

/** Default production origin when `VITE_SITE_URL` is unset (canonical, OG, sitemap, robots). */
const DEFAULT_PRODUCTION_SITE = 'https://ajaykj.vercel.app';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function seoPlugin(siteOrigin: string): Plugin {
  return {
    name: 'seo-html-and-files',
    transformIndexHtml(html) {
      const lastMod = new Date().toISOString().split('T')[0];
      return html
        .replaceAll('__SITE_URL__', siteOrigin)
        .replaceAll('__LAST_MOD__', lastMod);
    },
    writeBundle(options) {
      const dir = options.dir ?? path.resolve('dist');
      fs.mkdirSync(dir, { recursive: true });
      const robots = [
        '# Allow all crawlers — no Disallow rules (site is public)',
        'User-agent: *',
        'Allow: /',
        '',
        'User-agent: Googlebot',
        'Allow: /',
        '',
        'User-agent: Googlebot-Image',
        'Allow: /',
        '',
        'User-agent: Bingbot',
        'Allow: /',
        '',
        'User-agent: Slurp',
        'Allow: /',
        '',
        'User-agent: DuckDuckBot',
        'Allow: /',
        '',
        'User-agent: Baiduspider',
        'Allow: /',
        '',
        'User-agent: YandexBot',
        'Allow: /',
        '',
        'User-agent: GPTBot',
        'Allow: /',
        '',
        'User-agent: ChatGPT-User',
        'Allow: /',
        '',
        'User-agent: PerplexityBot',
        'Allow: /',
        '',
        'User-agent: ClaudeBot',
        'Allow: /',
        '',
        `Sitemap: ${siteOrigin}/sitemap.xml`,
        `Host: ${siteOrigin.replace(/^https?:\/\//, '')}`,
        '',
      ].join('\n');
      fs.writeFileSync(path.join(dir, 'robots.txt'), robots);
      const lastmod = new Date().toISOString();
      const ogTitle = escapeXml('Ajay K J — Software engineer portfolio');
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${siteOrigin}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${siteOrigin}/og-image.png</image:loc>
      <image:title>${ogTitle}</image:title>
      <image:caption>${ogTitle}</image:caption>
    </image:image>
  </url>
</urlset>
`;
      fs.writeFileSync(path.join(dir, 'sitemap.xml'), sitemap);

      const llms = [
        '# Ajay K J',
        '> Senior Software Engineer · Angular, TypeScript, and frontend specialist based in Kochi, Kerala, India.',
        '> Also known as: Ajay KJ, Ajay K Jayan, ajaykj.',
        '',
        '## Canonical site',
        `- ${siteOrigin}/`,
        '',
        '## Identity',
        '- Full name: Ajay K J',
        '- Alternate names: Ajay KJ, Ajay K Jayan, Ajay Kajan, ajaykj',
        '- Location: Kochi, Kerala, India',
        '- Role: Senior Software Engineer',
        '',
        '## Topics',
        '- Enterprise Angular (v16–19), micro-frontends, RxJS, performance',
        '- TypeScript, scalable web apps, REST, WebSockets',
        '- React, Three.js, GSAP, CSS, HTML',
        '',
        '## Primary profiles',
        '- https://www.linkedin.com/in/ajay-k-jayan/',
        '- https://github.com/Ajay-k-jayan',
        '',
        '## Contact (also on the site)',
        '- Email: ajaykj2000@gmail.com',
        '',
      ].join('\n');
      fs.writeFileSync(path.join(dir, 'llms.txt'), llms);

      const humans = [
        '/* TEAM */',
        'Name: Ajay K J',
        'Also known as: Ajay KJ, Ajay K Jayan',
        'Role: Senior Software Engineer, Developer',
        'Location: Kochi, Kerala, India',
        'LinkedIn: https://www.linkedin.com/in/ajay-k-jayan/',
        'GitHub: https://github.com/Ajay-k-jayan',
        '',
        '/* SITE */',
        `URL: ${siteOrigin}/`,
        'Language: English',
        'Technology: React, TypeScript, Vite, GSAP, Three.js',
        '',
      ].join('\n');
      fs.writeFileSync(path.join(dir, 'humans.txt'), humans);

      const opensearch = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>Ajay K J</ShortName>
  <Description>Ajay K J — Senior Software Engineer portfolio (also known as Ajay KJ)</Description>
  <Tags>Ajay K J Ajay KJ Angular TypeScript frontend developer software engineer Kerala India</Tags>
  <Contact>ajaykj2000@gmail.com</Contact>
  <Url type="text/html" template="${siteOrigin}/#{searchTerms}"/>
  <Image width="16" height="16" type="image/svg+xml">${siteOrigin}/favicon.svg</Image>
  <Language>en-IN</Language>
  <OutputEncoding>UTF-8</OutputEncoding>
  <InputEncoding>UTF-8</InputEncoding>
  <Developer>Ajay K J</Developer>
  <Attribution>Portfolio of Ajay K J (Ajay KJ), Senior Software Engineer</Attribution>
  <AdultContent>false</AdultContent>
</OpenSearchDescription>
`;
      fs.writeFileSync(path.join(dir, 'opensearch.xml'), opensearch);

      const wellKnownDir = path.join(dir, '.well-known');
      fs.mkdirSync(wellKnownDir, { recursive: true });
      const securityTxtExpiry = new Date();
      securityTxtExpiry.setFullYear(securityTxtExpiry.getFullYear() + 1);
      const securityTxt = [
        'Contact: mailto:ajaykj2000@gmail.com',
        `Expires: ${securityTxtExpiry.toISOString()}`,
        `Canonical: ${siteOrigin}/.well-known/security.txt`,
        'Preferred-Languages: en',
        'Policy: This is a personal portfolio site. Report any issues to the contact above.',
      ].join('\n') + '\n';
      fs.writeFileSync(path.join(wellKnownDir, 'security.txt'), securityTxt);
    },
  };
}

/** Keep Vite's dep cache outside OneDrive-synced folders to avoid Windows EPERM on rmdir. */
function resolveViteCacheDir(env: Record<string, string>): string {
  const override = (env.VITE_CACHE_DIR || process.env.VITE_CACHE_DIR)?.trim();
  if (override) return path.resolve(override);
  if (process.platform === 'win32' && process.env.LOCALAPPDATA) {
    return path.join(process.env.LOCALAPPDATA, 'potfolio-v2-vite-cache');
  }
  return path.join(os.homedir(), '.cache', 'potfolio-v2-vite');
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteOrigin = (
    env.VITE_SITE_URL || (mode === 'production' ? DEFAULT_PRODUCTION_SITE : 'http://localhost:5173')
  ).replace(/\/$/, '');
  return {
    cacheDir: resolveViteCacheDir(env),
    plugins: [react(), seoPlugin(siteOrigin)],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/three')) {
              return 'three';
            }
            if (id.includes('node_modules/gsap')) {
              return 'gsap';
            }
          },
        },
      },
    },
  };
});
