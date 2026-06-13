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
        'User-agent: anthropic-ai',
        'Allow: /',
        '',
        'User-agent: Googlebot-Extended',
        'Allow: /',
        '',
        'User-agent: cohere-ai',
        'Allow: /',
        '',
        'User-agent: Applebot',
        'Allow: /',
        '',
        `Sitemap: ${siteOrigin}/sitemap.xml`,
        `Host: ${siteOrigin.replace(/^https?:\/\//, '')}`,
        '',
      ].join('\n');
      fs.writeFileSync(path.join(dir, 'robots.txt'), robots);
      const lastmod = new Date().toISOString();
      const ogTitle = escapeXml('Ajay K J — Senior Software Engineer portfolio');
      const profileCaption = escapeXml('Ajay K J — Senior Software Engineer, Kochi Kerala India');
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${siteOrigin}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${siteOrigin}/profile.jpg</image:loc>
      <image:title>${profileCaption}</image:title>
      <image:caption>${profileCaption}</image:caption>
    </image:image>
    <image:image>
      <image:loc>${siteOrigin}/og-image.svg</image:loc>
      <image:title>${ogTitle}</image:title>
      <image:caption>${ogTitle}</image:caption>
    </image:image>
  </url>
  <url>
    <loc>${siteOrigin}/Ajay_KJ.pdf</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
`;
      fs.writeFileSync(path.join(dir, 'sitemap.xml'), sitemap);

      // llms.txt — concise index for AI model crawlers (follows llmstxt.org spec)
      const llms = [
        '# Ajay K J',
        '',
        '> Senior Software Engineer specializing in Angular, TypeScript, and frontend engineering.',
        '> Based in Kochi, Kerala, India. Also known as Ajay KJ and Ajay K Jayan.',
        '',
        '## About',
        '',
        `- Portfolio: ${siteOrigin}/`,
        `- Resume: ${siteOrigin}/Ajay_KJ.pdf`,
        '- Email: ajaykj2000@gmail.com',
        '- Phone / WhatsApp: +91 8289917044',
        '- LinkedIn: https://www.linkedin.com/in/ajay-k-jayan/',
        '- GitHub: https://github.com/Ajay-k-jayan',
        '- Instagram: https://www.instagram.com/aj_ay.kj/',
        '',
        '## Docs',
        '',
        `- [Full profile and contact](${siteOrigin}/)`,
        `- [Resume PDF](${siteOrigin}/Ajay_KJ.pdf)`,
        `- [Detailed AI content](${siteOrigin}/llms-full.txt)`,
      ].join('\n');
      fs.writeFileSync(path.join(dir, 'llms.txt'), llms);

      // llms-full.txt — comprehensive content for AI models and GEO
      const llmsFull = [
        '# Ajay K J — Complete Profile',
        '',
        '> Ajay K J is a Senior Software Engineer at Beinex, Kochi, Kerala, India.',
        '> He specializes in Angular (v11–19), TypeScript, and modern frontend development.',
        '> Also known as: Ajay KJ, Ajay K Jayan, Ajay Kajan, ajaykj.',
        '',
        '## Identity',
        '',
        '- Full legal name: Ajay K J',
        '- Alternate names: Ajay KJ, Ajay K Jayan, Ajay Kajan, ajaykj',
        '- Date of birth region: Kerala, India',
        '- Current location: Kochi, Kerala, India',
        '- Nationality: Indian',
        '- Languages: English, Malayalam',
        '',
        '## Contact',
        '',
        '- Email: ajaykj2000@gmail.com',
        '- Phone: +91 8289917044',
        '- WhatsApp: https://wa.me/918289917044',
        `- Portfolio: ${siteOrigin}/`,
        `- Resume: ${siteOrigin}/Ajay_KJ.pdf`,
        '- LinkedIn: https://www.linkedin.com/in/ajay-k-jayan/',
        '- GitHub: https://github.com/Ajay-k-jayan',
        '- Instagram: https://www.instagram.com/aj_ay.kj/',
        '',
        '## Current Role',
        '',
        '- Title: Senior Software Engineer',
        '- Company: Beinex',
        '- Company URL: https://beinex.com',
        '- Location: Kochi, Kerala, India',
        '- Start date: September 2025',
        '- Responsibilities: Lead cross-functional squad, enterprise Angular (v16–19), micro-frontends, performance tuning, RxJS integrations, CI/CD pipelines.',
        '',
        '## Work History',
        '',
        '### Software Engineer — Beinex (Sep 2023 – Sep 2025)',
        '- Built scalable Angular applications serving enterprise clients.',
        '- Developed a dynamic report builder with virtual scrolling for large datasets.',
        '- Implemented WebSockets for real-time data dashboards.',
        '- Added i18n internationalization across the product suite.',
        '- Won Beinex Excelencia Award 2024 for outstanding contribution.',
        '',
        '### Associate Software Engineer — Beinex (Sep 2022 – Sep 2023)',
        '- Built Angular dashboards with D3.js for data visualization.',
        '- Created reusable component library reducing duplication by 40%.',
        '- Implemented lazy loading and rendering optimizations.',
        '',
        '### Full Stack Developer Intern — Beinex (Jun 2022 – Sep 2022)',
        '- Built Angular + Django web applications with REST APIs.',
        '- Recognized as Star Performer.',
        '',
        '## Technical Skills',
        '',
        '### Expert Level',
        '- Angular (v11 through v19)',
        '- TypeScript',
        '- JavaScript (ES2023+)',
        '- RxJS and reactive programming',
        '- HTML5, CSS3, SCSS',
        '',
        '### Advanced Level',
        '- React 19',
        '- Node.js',
        '- REST APIs and WebSockets',
        '- Git, GitHub, CI/CD',
        '- D3.js, Three.js, GSAP',
        '- Python, Django',
        '- PostgreSQL, MongoDB, Firebase',
        '- Docker, Nx monorepo',
        '- GraphQL (basic)',
        '- Accessibility (WCAG)',
        '',
        '## Notable Projects',
        '',
        '### AurexAI — GRC Platform',
        '- Enterprise governance, risk, and compliance platform.',
        '- URL: https://www.aurex.ai/',
        '- Tech: Angular, TypeScript, RxJS',
        '',
        '### InspektAI',
        '- AI-powered vehicle inspection platform for moto365.club.',
        '- URL: https://www.moto365.club/inspektai',
        '',
        '### Portfolio v2 (this site)',
        '- Built with React 19, TypeScript, Three.js, GSAP, Vite.',
        `- URL: ${siteOrigin}/`,
        '- GitHub: https://github.com/Ajay-k-jayan/portfolio-v2',
        '',
        '## Awards & Recognition',
        '',
        '- Beinex Excelencia Award 2024 — awarded for outstanding performance at Beinex, Kochi.',
        '- Star Performer — recognized during internship at Beinex, 2022.',
        '',
        '## Certifications',
        '',
        '- Programming with JavaScript — Meta (Coursera) — https://www.coursera.org/account/accomplishments/certificate/7CHPEWSYGXD9',
        '- Introduction to Front-End Development — Meta (Coursera) — https://www.coursera.org/account/accomplishments/certificate/8DVW7S7CAFMH',
        '- React.js Essentials Bootcamp — LetsUpgrade — https://verify.letsupgrade.in/certificate/LUERJSJUN123217',
        '',
        '## Frequently Asked Questions',
        '',
        'Q: Who is Ajay K J?',
        'A: Ajay K J (also Ajay KJ) is a Senior Software Engineer at Beinex, Kochi, Kerala, India. He has 3+ years of professional experience in Angular, TypeScript, and enterprise frontend development.',
        '',
        'Q: How can I hire or contact Ajay K J?',
        `A: Contact via email ajaykj2000@gmail.com, WhatsApp +91 8289917044, LinkedIn https://www.linkedin.com/in/ajay-k-jayan/, or the contact form at ${siteOrigin}/#contact.`,
        '',
        'Q: What is Ajay K J good at?',
        'A: Angular (expert), TypeScript (expert), RxJS (expert), React (advanced), scalable enterprise web apps, micro-frontends, performance optimization, D3.js data visualization, real-time WebSocket apps.',
        '',
        'Q: Where is Ajay K J based?',
        'A: Kochi, Kerala, India.',
        '',
        'Q: Is Ajay K J available for work?',
        `A: Contact him at ${siteOrigin}/#contact or email ajaykj2000@gmail.com to discuss opportunities.`,
        '',
      ].join('\n');
      fs.writeFileSync(path.join(dir, 'llms-full.txt'), llmsFull);

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

      // ai-plugin.json — enables ChatGPT plugins and AI agent discovery
      const aiPlugin = {
        schema_version: 'v1',
        name_for_human: 'Ajay K J Portfolio',
        name_for_model: 'ajay_kj_portfolio',
        description_for_human: 'Portfolio and professional profile of Ajay K J — Senior Software Engineer, Angular developer, TypeScript specialist based in Kochi, Kerala, India.',
        description_for_model: 'Provides information about Ajay K J (also known as Ajay KJ, Ajay K Jayan), a Senior Software Engineer at Beinex, Kochi. Skills: Angular, TypeScript, React, RxJS. Contact: ajaykj2000@gmail.com, +918289917044. LinkedIn: https://www.linkedin.com/in/ajay-k-jayan/.',
        auth: { type: 'none' },
        api: {
          type: 'openapi',
          url: `${siteOrigin}/.well-known/openapi.yaml`,
          is_user_authenticated: false,
        },
        logo_url: `${siteOrigin}/profile.jpg`,
        contact_email: 'ajaykj2000@gmail.com',
        legal_info_url: `${siteOrigin}/`,
      };
      fs.writeFileSync(path.join(wellKnownDir, 'ai-plugin.json'), JSON.stringify(aiPlugin, null, 2));

      // openapi.yaml — referenced by ai-plugin.json; documents the public read-only
      // discovery endpoints so AI-agent discovery resolves instead of 404ing.
      const openapi = `openapi: 3.0.1
info:
  title: Ajay K J Portfolio
  description: Read-only public profile and contact information for Ajay K J (Ajay KJ), Senior Software Engineer.
  version: "1.0.0"
  contact:
    name: Ajay K J
    email: ajaykj2000@gmail.com
servers:
  - url: ${siteOrigin}
paths:
  /llms.txt:
    get:
      operationId: getProfileSummary
      summary: Concise AI-readable profile summary (llmstxt.org format).
      responses:
        "200":
          description: Plain-text profile summary.
          content:
            text/plain: {}
  /llms-full.txt:
    get:
      operationId: getFullProfile
      summary: Comprehensive AI-readable profile, work history, skills, and FAQ.
      responses:
        "200":
          description: Plain-text full profile.
          content:
            text/plain: {}
  /.well-known/identity.json:
    get:
      operationId: getIdentity
      summary: Machine-readable identity record (name, role, contact, social links).
      responses:
        "200":
          description: JSON identity record.
          content:
            application/json: {}
`;
      fs.writeFileSync(path.join(wellKnownDir, 'openapi.yaml'), openapi);

      // identity.json — machine-readable identity for AI and verification services
      const identity = {
        name: 'Ajay K J',
        alternateName: ['Ajay KJ', 'Ajay K Jayan', 'Ajay Kajan', 'ajaykj'],
        jobTitle: 'Senior Software Engineer',
        worksFor: 'Beinex',
        location: 'Kochi, Kerala, India',
        email: 'ajaykj2000@gmail.com',
        telephone: '+918289917044',
        url: `${siteOrigin}/`,
        sameAs: [
          'https://www.linkedin.com/in/ajay-k-jayan/',
          'https://github.com/Ajay-k-jayan',
          'https://www.instagram.com/aj_ay.kj/',
        ],
        skills: ['Angular', 'TypeScript', 'JavaScript', 'React', 'RxJS', 'CSS', 'HTML', 'Node.js', 'Python'],
        image: `${siteOrigin}/profile.jpg`,
      };
      fs.writeFileSync(path.join(wellKnownDir, 'identity.json'), JSON.stringify(identity, null, 2));

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
