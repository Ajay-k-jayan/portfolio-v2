import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SKILLS_CATALOG, resolveSkillTier } from '../data/skillsCatalog';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { SkillIcon } from './skillIcons';
import './skillBento.css';

gsap.registerPlugin(ScrollTrigger);

function RatingStars({ rating }: { rating: number }) {
  const d = 'M12 3.2 14.4 9.2l6.4.5-4.9 4.1 1.5 6.2L12 16.9 6.6 20l1.5-6.2L3.2 9.7l6.4-.5L12 3.2Z';
  return (
    <div className="skill-bento__stars" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          className={`skill-bento__star-icon ${i < rating ? 'skill-bento__star-icon--filled' : 'skill-bento__star-icon--empty'}`}
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path fill="#fcd34d" stroke="#eab308" strokeWidth={0.35} strokeLinejoin="round" d={d} />
        </svg>
      ))}
    </div>
  );
}

const SKILL_RATINGS: Record<string, 1 | 2 | 3 | 4 | 5> = {
  html5: 5,
  css3: 5,
  scss: 5,
  javascript: 5,
  typescript: 5,
  angular: 5,
  'reactive-forms': 5,
  rxjs: 4,
  lazy: 5,
  components: 5,
  bem: 4,
  'atomic-design': 5,
  'design-systems': 5,
  micro: 4,
  ngrx: 3,
  bootstrap: 4,
  material: 4,
  tailwind: 4,
  d3: 4,
  storybook: 3,
  figma: 4,
  'adobe-xd': 4,
  rest: 4,
  websockets: 4,
  graphql: 2,
  openapi: 3,
  git: 5,
  jenkins: 4,
  cicd: 3,
  devops: 2,
  jira: 5,
  swagger: 3,
  postman: 4,
  vercel: 4,
  'mysql-workbench': 4,
  'visual-studio': 5,
  copilot: 4,
  'cursor-ai': 4,
  'claude-ai': 4,
  chatgpt: 5,
  webpack: 4,
  agile: 5,
  waterfall: 4,
  php: 2,
  django: 2,
  drf: 2,
  fastapi: 2,
  sqlite: 3,
  mysql: 3,
  cockroachdb: 2,
  druid: 2,
  performance: 4,
  eslint: 4,
  testing: 4,
  enterprise: 4,
  i18n: 4,
  a11y: 4,
};

/** Opens in new tab — decorative; link `aria-label` names the skill and docs. */
function ExternalDocHint() {
  return (
    <svg className="skill-bento__external-icon" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42L17.59 5H14V3Zm-9 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6h-2v6H5V9h6V7H5Z"
      />
    </svg>
  );
}

export function SkillBento() {
  const rootRef = useRef<HTMLUListElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cells = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.skill-bento__cell'));
    let ctx: gsap.Context | null = null;
    let cancelled = false;

    if (reducedMotion) {
      gsap.set(cells, { clearProps: 'all' });
      gsap.set(cells, { opacity: 1 });
      gsap.set(root, { clearProps: 'all' });
      root.classList.add('skill-bento--ready');
      return () => {
        root.classList.remove('skill-bento--ready');
      };
    }

    gsap.set(root, { opacity: 1 });
    cells.forEach((cell) => {
      const t = cell.dataset.skillTier;
      const fromLeft = t === 'expertise';
      gsap.set(cell, { opacity: 0, x: fromLeft ? -36 : 36, y: 26 });
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;

        ctx = gsap.context(() => {
          cells.forEach((cell) => {
            const t = cell.dataset.skillTier;
            const fromLeft = t === 'expertise';
            const xFrom = fromLeft ? -36 : 36;

            gsap.fromTo(
              cell,
              { opacity: 0, x: xFrom, y: 26 },
              {
                opacity: 1,
                x: 0,
                y: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: cell,
                  start: 'top bottom',
                  end: 'top 56%',
                  scrub: 1,
                  invalidateOnRefresh: true,
                },
              },
            );
          });

          ScrollTrigger.refresh();

          root.classList.add('skill-bento--ready');
        }, root);
      });
    });

    return () => {
      cancelled = true;
      root.classList.remove('skill-bento--ready');
      ctx?.revert();
    };
  }, [reducedMotion]);

  return (
    <ul ref={rootRef} className="skill-bento font-body" aria-label="Technical skills">
      {SKILLS_CATALOG.map((s) => {
        const tier = resolveSkillTier(s);
        const rating = SKILL_RATINGS[s.id] ?? (tier === 'expertise' ? 5 : 4);
        return (
        <li
          key={s.id}
          className={`skill-bento__cell skill-bento__cell--${s.bento} skill-bento__cell--tier-${tier}`}
          data-skill-tier={tier}
          style={
            {
              '--skill-glow': s.glow ?? 'rgba(99, 102, 241, 0.6)',
            } as React.CSSProperties
          }
        >
          <a
            href={s.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="skill-bento__docs-link"
            aria-label={`${s.label}, ${s.category}, ${tier === 'expertise' ? 'Expertise' : 'Advanced'}. Opens documentation in a new tab.`}
          >
            <span className="visually-hidden">Open documentation</span>
            <ExternalDocHint />
          </a>
          <div className="skill-bento__body">
            <span className="skill-bento__cat">{s.category}</span>
            <span className={`skill-bento__tier skill-bento__tier--${tier}`}>
              {tier === 'expertise' ? 'Expertise' : 'Advanced'}
            </span>
            <div className="skill-bento__rating" aria-label={`${s.label} rating: ${rating} out of 5`}>
              <RatingStars rating={rating} />
            </div>
            <h3 className="skill-bento__name clash">{s.label}</h3>
          </div>
          <div className="skill-bento__media">
            <div className="skill-bento__media-face skill-bento__media-face--icon" aria-hidden>
              <div className="skill-bento__icon">
                <SkillIcon id={s.id} label={s.label} />
              </div>
            </div>
            <div className="skill-bento__media-face skill-bento__media-face--stars">
              <RatingStars rating={rating} />
            </div>
          </div>
        </li>
        );
      })}
    </ul>
  );
}
