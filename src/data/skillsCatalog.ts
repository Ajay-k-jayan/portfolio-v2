/** Shared catalog for Skills section layouts */

export type SkillTier = 'advanced' | 'expertise';

export type SkillCatalogItem = {
  id: string;
  label: string;
  category: string;
  /** Official docs / primary reference — opens in new tab from the bento */
  docsUrl: string;
  /** Bento layout hint */
  bento: 'featured' | 'wide' | 'normal';
  /** Proficiency band; entrance direction uses this when set */
  tier?: SkillTier;
  glow?: string;
};

/** Default tier from layout: wide/featured read as deeper stack ownership → expertise (left-in); normal → advanced (right-in). */
export function resolveSkillTier(item: SkillCatalogItem): SkillTier {
  if (item.tier) return item.tier;
  if (item.bento === 'featured' || item.bento === 'wide') return 'expertise';
  return 'advanced';
}

export const SKILLS_CATALOG: SkillCatalogItem[] = [
  /* ─── Frontend ─── */
  { id: 'html5', label: 'HTML5', category: 'Frontend', docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTML', bento: 'normal', glow: '#f87171' },
  { id: 'css3', label: 'CSS3', category: 'Frontend', docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/CSS', bento: 'normal', glow: '#60a5fa' },
  { id: 'scss', label: 'SCSS', category: 'Frontend', docsUrl: 'https://sass-lang.com/documentation/', bento: 'wide', glow: '#cf649a' },
  { id: 'javascript', label: 'JavaScript', category: 'Frontend', docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', bento: 'wide', glow: '#f7df1e' },
  { id: 'typescript', label: 'TypeScript', category: 'Frontend', docsUrl: 'https://www.typescriptlang.org/docs/', bento: 'featured', glow: '#3178c6' },
  { id: 'angular', label: 'Angular (v11–19)', category: 'Frontend', docsUrl: 'https://angular.dev/overview', bento: 'featured', glow: '#dd0031' },

  /* ─── Core concepts ─── */
  { id: 'reactive-forms', label: 'Reactive Forms', category: 'Core', docsUrl: 'https://angular.dev/guide/forms/reactive-forms', bento: 'normal', glow: '#dd0031' },
  { id: 'rxjs', label: 'RxJS', category: 'Core', docsUrl: 'https://rxjs.dev/guide/overview', bento: 'normal', glow: '#b7178c' },
  { id: 'lazy', label: 'Lazy loading', category: 'Core', docsUrl: 'https://angular.dev/guide/routing/lazy-loading', bento: 'normal', glow: '#6366f1' },
  { id: 'components', label: 'Reusable components', category: 'Core', docsUrl: 'https://angular.dev/guide/components', bento: 'wide', glow: '#94a3b8' },
  { id: 'bem', label: 'BEM', category: 'Core', docsUrl: 'https://getbem.com/naming/', bento: 'normal', glow: '#64748b' },
  { id: 'atomic-design', label: 'Atomic Design', category: 'Core', docsUrl: 'https://atomicdesign.bradfrost.com/chapter-2/', bento: 'normal', glow: '#8b5cf6' },
  { id: 'design-systems', label: 'Design systems', category: 'Core', docsUrl: 'https://m3.material.io/foundations', bento: 'wide', glow: '#a78bfa' },
  { id: 'micro', label: 'Micro-frontends', category: 'Architecture', docsUrl: 'https://micro-frontends.org/', bento: 'wide', glow: '#475569' },
  { id: 'ngrx', label: 'NgRx', category: 'State', docsUrl: 'https://ngrx.io/docs', bento: 'normal', glow: '#6b21a8' },

  /* ─── UI & visualization ─── */
  { id: 'bootstrap', label: 'Bootstrap', category: 'UI', docsUrl: 'https://getbootstrap.com/docs/5.3/getting-started/introduction/', bento: 'normal', glow: '#7952b3' },
  { id: 'material', label: 'Angular Material', category: 'UI', docsUrl: 'https://material.angular.dev/', bento: 'wide', glow: '#3f51b5' },
  { id: 'tailwind', label: 'Tailwind CSS', category: 'UI', docsUrl: 'https://tailwindcss.com/docs', bento: 'wide', glow: '#38bdf8' },
  { id: 'd3', label: 'D3.js', category: 'UI', docsUrl: 'https://d3js.org/', bento: 'normal', glow: '#f9a03c' },
  { id: 'storybook', label: 'Storybook', category: 'UI', docsUrl: 'https://storybook.js.org/docs', bento: 'normal', glow: '#ff4785' },
  { id: 'figma', label: 'Figma', category: 'UI', docsUrl: 'https://www.figma.com/developers', bento: 'normal', glow: '#a259ff' },
  { id: 'adobe-xd', label: 'Adobe XD', category: 'UI', docsUrl: 'https://helpx.adobe.com/support/xd.html', bento: 'normal', glow: '#ff61f6' },

  /* ─── API & integration ─── */
  { id: 'rest', label: 'REST APIs', category: 'API', docsUrl: 'https://developer.mozilla.org/en-US/docs/Glossary/REST', bento: 'normal', glow: '#10b981' },
  { id: 'websockets', label: 'WebSockets', category: 'API', docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API', bento: 'normal', glow: '#0ea5e9' },
  { id: 'graphql', label: 'GraphQL (Basic)', category: 'API', docsUrl: 'https://graphql.org/learn/', bento: 'normal', glow: '#e10098' },
  { id: 'openapi', label: 'OpenAPI', category: 'API', docsUrl: 'https://swagger.io/specification/', bento: 'normal', glow: '#15803d' },

  /* ─── Tools & platforms ─── */
  { id: 'git', label: 'Git', category: 'Tools', docsUrl: 'https://git-scm.com/doc', bento: 'normal', glow: '#f97316' },
  { id: 'jenkins', label: 'Jenkins', category: 'Tools', docsUrl: 'https://www.jenkins.io/doc/', bento: 'normal', glow: '#d24939' },
  { id: 'cicd', label: 'CI / CD pipelines', category: 'Tools', docsUrl: 'https://docs.github.com/en/actions', bento: 'wide', glow: '#a78bfa' },
  { id: 'devops', label: 'DevOps practices', category: 'Tools', docsUrl: 'https://aws.amazon.com/what-is/devops/', bento: 'wide', glow: '#0891b2' },
  { id: 'jira', label: 'Jira', category: 'Tools', docsUrl: 'https://support.atlassian.com/jira-software-cloud/', bento: 'normal', glow: '#0052cc' },
  { id: 'swagger', label: 'Swagger', category: 'Tools', docsUrl: 'https://swagger.io/docs/', bento: 'normal', glow: '#85ea2d' },
  { id: 'postman', label: 'Postman', category: 'Tools', docsUrl: 'https://learning.postman.com/docs/', bento: 'normal', glow: '#ff6c37' },
  { id: 'vercel', label: 'Vercel', category: 'Tools', docsUrl: 'https://vercel.com/docs', bento: 'normal', glow: '#fafafa' },
  { id: 'mysql-workbench', label: 'MySQL Workbench', category: 'Tools', docsUrl: 'https://dev.mysql.com/doc/workbench/en/', bento: 'normal', glow: '#00758f' },
  { id: 'visual-studio', label: 'Visual Studio', category: 'Tools', docsUrl: 'https://learn.microsoft.com/en-us/visualstudio/', bento: 'normal', glow: '#5c2d91' },
  { id: 'copilot', label: 'GitHub Copilot', category: 'Tools', docsUrl: 'https://docs.github.com/en/copilot', bento: 'normal', glow: '#6e40c9' },
  { id: 'cursor-ai', label: 'Cursor AI', category: 'Tools', docsUrl: 'https://cursor.com/docs', bento: 'normal', glow: '#f5f5f5' },
  { id: 'claude-ai', label: 'Claude AI', category: 'Tools', docsUrl: 'https://docs.anthropic.com/', bento: 'normal', glow: '#d97757' },
  { id: 'chatgpt', label: 'ChatGPT', category: 'Tools', docsUrl: 'https://help.openai.com/', bento: 'normal', glow: '#10a37f' },
  { id: 'webpack', label: 'Webpack / build', category: 'Tools', docsUrl: 'https://webpack.js.org/concepts/', bento: 'wide', glow: '#8dd6f9' },

  /* ─── Methodologies ─── */
  { id: 'agile', label: 'Agile', category: 'Methodology', docsUrl: 'https://www.atlassian.com/agile', bento: 'normal', glow: '#22c55e' },
  { id: 'waterfall', label: 'Waterfall', category: 'Methodology', docsUrl: 'https://en.wikipedia.org/wiki/Waterfall_model', bento: 'normal', glow: '#64748b' },

  /* ─── Backend ─── */
  { id: 'php', label: 'PHP', category: 'Backend', docsUrl: 'https://www.php.net/docs.php', bento: 'normal', glow: '#777bb4' },
  { id: 'django', label: 'Python (Django)', category: 'Backend', docsUrl: 'https://docs.djangoproject.com/', bento: 'wide', glow: '#092e20' },
  { id: 'drf', label: 'Django REST Framework', category: 'Backend', docsUrl: 'https://www.django-rest-framework.org/', bento: 'normal', glow: '#092e20' },
  { id: 'fastapi', label: 'FastAPI', category: 'Backend', docsUrl: 'https://fastapi.tiangolo.com/', bento: 'normal', glow: '#009688' },

  /* ─── Databases ─── */
  { id: 'sqlite', label: 'SQLite', category: 'Database', docsUrl: 'https://www.sqlite.org/docs.html', bento: 'normal', glow: '#003b57' },
  { id: 'mysql', label: 'MySQL', category: 'Database', docsUrl: 'https://dev.mysql.com/doc/', bento: 'normal', glow: '#00758f' },
  { id: 'cockroachdb', label: 'CockroachDB', category: 'Database', docsUrl: 'https://www.cockroachlabs.com/docs/', bento: 'normal', glow: '#6933ff' },
  { id: 'druid', label: 'Apache Druid', category: 'Database', docsUrl: 'https://druid.apache.org/docs/latest/design/', bento: 'wide', glow: '#f99d1c' },

  /* ─── Quality, scale, UX ─── */
  { id: 'performance', label: 'Performance', category: 'Quality', docsUrl: 'https://web.dev/learn/performance/', bento: 'normal', glow: '#64748b' },
  { id: 'eslint', label: 'ESLint', category: 'Quality', docsUrl: 'https://eslint.org/docs/latest/', bento: 'normal', glow: '#818cf8' },
  { id: 'testing', label: 'Testing', category: 'Quality', docsUrl: 'https://angular.dev/guide/testing', bento: 'normal', glow: '#7c3aed' },
  { id: 'enterprise', label: 'Enterprise scale', category: 'Scale', docsUrl: 'https://angular.dev/best-practices', bento: 'normal', glow: '#94a3b8' },
  { id: 'i18n', label: 'i18n', category: 'UX', docsUrl: 'https://angular.dev/guide/i18n', bento: 'normal', glow: '#22d3ee' },
  { id: 'a11y', label: 'Accessibility', category: 'UX', docsUrl: 'https://www.w3.org/WAI/WCAG22/quickref/', bento: 'wide', glow: '#0369a1' },
];
