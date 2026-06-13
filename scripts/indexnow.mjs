// IndexNow — instantly notify Bing, Yandex, and partner engines that URLs changed.
// Run AFTER a deploy is live: `npm run indexnow` (the key file must be reachable at the
// site root for the engines to verify ownership).
//
// Submitting to one IndexNow endpoint shares the ping with all participating engines.
// Docs: https://www.indexnow.org/documentation

const SITE = (process.env.VITE_SITE_URL || 'https://ajaykj.vercel.app').replace(/\/$/, '');
const KEY = '7c5052c14e94b5cfab60fbdb202aaf59';
const HOST = SITE.replace(/^https?:\/\//, '');

// URLs worth re-crawling on each deploy.
const urlList = [
  `${SITE}/`,
  `${SITE}/Ajay_KJ.pdf`,
  `${SITE}/sitemap.xml`,
];

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: `${SITE}/${KEY}.txt`,
  urlList,
};

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
});

// IndexNow returns 200 (accepted) or 202 (received). 422/403 usually means the key
// file is not yet reachable at the root — deploy first, then re-run.
console.log(`IndexNow: HTTP ${res.status} ${res.statusText}`);
console.log(`Submitted ${urlList.length} URL(s) for ${HOST}`);
if (!res.ok && res.status !== 202) {
  const body = await res.text().catch(() => '');
  console.error('Response body:', body);
  process.exit(1);
}
