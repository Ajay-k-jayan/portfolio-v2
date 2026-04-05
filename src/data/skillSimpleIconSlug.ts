/**
 * Simple Icons slug per skill id (https://simpleicons.org — CC0).
 * Used with jsDelivr for the canonical monochrome brand marks.
 */
const SI_VER = '16.14.0';

export const SIMPLE_ICONS_CDN_BASE = `https://cdn.jsdelivr.net/npm/simple-icons@${SI_VER}/icons`;

/** Skill id → simple-icons filename without `.svg` */
export const SKILL_SIMPLE_ICON_SLUG: Record<string, string> = {
  html5: 'html5',
  css3: 'css',
  scss: 'sass',
  javascript: 'javascript',
  typescript: 'typescript',
  angular: 'angular',
  'reactive-forms': 'angular',
  rxjs: 'reactivex',
  lazy: 'angular',
  components: 'angular',
  bem: 'bem',
  'design-systems': 'materialdesign',
  micro: 'webpack',
  ngrx: 'ngrx',
  bootstrap: 'bootstrap',
  material: 'materialdesign',
  tailwind: 'tailwindcss',
  d3: 'd3',
  storybook: 'storybook',
  rest: 'json',
  websockets: 'socketdotio',
  graphql: 'graphql',
  openapi: 'openapiinitiative',
  git: 'git',
  jenkins: 'jenkins',
  cicd: 'githubactions',
  devops: 'docker',
  jira: 'jira',
  swagger: 'swagger',
  postman: 'postman',
  vercel: 'vercel',
  'mysql-workbench': 'mysql',
  copilot: 'githubcopilot',
  'cursor-ai': 'cursor',
  'claude-ai': 'anthropic',
  webpack: 'webpack',
  agile: 'atlassian',
  waterfall: 'wikipedia',
  php: 'php',
  django: 'django',
  drf: 'django',
  fastapi: 'fastapi',
  sqlite: 'sqlite',
  mysql: 'mysql',
  cockroachdb: 'cockroachlabs',
  druid: 'apachedruid',
  performance: 'lighthouse',
  eslint: 'eslint',
  testing: 'testinglibrary',
  enterprise: 'sap',
  i18n: 'i18next',
  a11y: 'mdnwebdocs',
};

export function skillSimpleIconUrl(id: string): string | undefined {
  const slug = SKILL_SIMPLE_ICON_SLUG[id];
  return slug ? `${SIMPLE_ICONS_CDN_BASE}/${slug}.svg` : undefined;
}
