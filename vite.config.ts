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
      return html.replaceAll('__SITE_URL__', siteOrigin);
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
        'User-agent: Bingbot',
        'Allow: /',
        '',
        'User-agent: GPTBot',
        'Allow: /',
        '',
        `Sitemap: ${siteOrigin}/sitemap.xml`,
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
        '> Senior Software Engineer · Angular, TypeScript, and frontend specialist (Kerala, India).',
        '',
        '## Canonical site',
        `- ${siteOrigin}/`,
        '',
        '## Topics',
        '- Enterprise Angular (v16–19), micro-frontends, RxJS, performance',
        '- TypeScript, scalable web apps, REST, WebSockets',
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
