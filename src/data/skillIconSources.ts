/**
 * Full-color brand marks for the skills bento (Devicon, Simple Icons, Wikimedia).
 * Prefer *-original.svg from Devicon where available.
 */
const D = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

/** Simple Icons CDN — single-path SVG in the given brand hex (no #). */
const si = (slug: string, hex: string) => `https://cdn.simpleicons.org/${slug}/${hex}`;

export const SKILL_ICON_SRC: Record<string, string> = {
  html5: `${D}/html5/html5-original.svg`,
  css3: `${D}/css3/css3-original.svg`,
  scss: `${D}/sass/sass-original.svg`,
  javascript: `${D}/javascript/javascript-original.svg`,
  typescript: `${D}/typescript/typescript-original.svg`,
  angular: `${D}/angular/angular-original.svg`,

  'reactive-forms': `${D}/angular/angular-original.svg`,
  rxjs: `${D}/rxjs/rxjs-original.svg`,
  lazy: '',
  components: '',
  bem: si('bem', 'FFFFFF'),
  'atomic-design': `${D}/figma/figma-original.svg`,
  'design-systems': `${D}/materialui/materialui-original.svg`,
  micro: `${D}/webpack/webpack-original.svg`,
  ngrx: `${D}/ngrx/ngrx-original.svg`,

  bootstrap: `${D}/bootstrap/bootstrap-original.svg`,
  material: `${D}/angularmaterial/angularmaterial-original.svg`,
  tailwind: `${D}/tailwindcss/tailwindcss-original.svg`,
  d3: `${D}/d3js/d3js-original.svg`,
  storybook: `${D}/storybook/storybook-original.svg`,
  figma: `${D}/figma/figma-original.svg`,
  /** Adobe XD was removed from Simple Icons CDN; Devicon still ships the mark. */
  'adobe-xd': `${D}/xd/xd-plain.svg`,

  rest: si('express', 'FFFFFF'),
  websockets: si('socketdotio', 'FFFFFF'),
  graphql: `${D}/graphql/graphql-plain.svg`,
  openapi: `${D}/openapi/openapi-original.svg`,

  git: `${D}/git/git-original.svg`,
  jenkins: `${D}/jenkins/jenkins-original.svg`,
  cicd: `${D}/githubactions/githubactions-original.svg`,
  devops: `${D}/amazonwebservices/amazonwebservices-original-wordmark.svg`,
  jira: `${D}/jira/jira-original.svg`,
  swagger: `${D}/swagger/swagger-original.svg`,
  postman: `${D}/postman/postman-original.svg`,
  // Use white Simple Icons for dark backgrounds
  vercel: si('vercel', 'FFFFFF'),
  'mysql-workbench': `${D}/mysql/mysql-original.svg`,
  'visual-studio': `${D}/visualstudio/visualstudio-original.svg`,
  copilot: si('githubcopilot', '6E40C9'),
  'cursor-ai': si('cursor', 'FFFFFF'),
  'claude-ai': si('anthropic', 'D97757'),
  chatgpt:
    'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  webpack: `${D}/webpack/webpack-original.svg`,

  /** Atlassian — matches agile docs host; distinct from Jira product tile */
  agile: si('atlassian', '0052CC'),
  waterfall: `${D}/azuredevops/azuredevops-original.svg`,

  php: `${D}/php/php-original.svg`,
  django: `${D}/django/django-plain.svg`,
  drf: `${D}/djangorest/djangorest-original.svg`,
  fastapi: `${D}/fastapi/fastapi-original.svg`,

  sqlite: `${D}/sqlite/sqlite-original.svg`,
  mysql: `${D}/mysql/mysql-original.svg`,
  cockroachdb: si('cockroachlabs', '6933FF'),
  druid: si('apachedruid', '29F1FB'),

  performance: `${D}/chrome/chrome-original.svg`,
  eslint: `${D}/eslint/eslint-original.svg`,
  testing: `${D}/jasmine/jasmine-original.svg`,
  enterprise: `${D}/kubernetes/kubernetes-original.svg`,
  i18n: si('googletranslate', '4285F4'),
  a11y: `${D}/firefox/firefox-original.svg`,
};
