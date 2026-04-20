import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './achievementBento.css';

gsap.registerPlugin(ScrollTrigger);

export type AchievementBentoItem = {
  id: string;
  label: string;
  title: string;
  blurb: string;
  year?: string;
};

type AchievementBentoProps = {
  items: AchievementBentoItem[];
};

function TrophyGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6m12 5h1.5a2.5 2.5 0 0 0 0-5H18" strokeLinecap="round" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      <path d="M10 15v2c0 .6-.5 1-.9 1.2C8 19 7 20.5 7 22m10 0c0-1.5-1-3-2.1-3.8-.4-.2-.9-.6-.9-1.2v-2" />
    </svg>
  );
}

function SparkGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="m12 3 1.8 5.5h5.7l-4.6 3.4 1.8 5.5-4.7-3.4-4.7 3.4 1.8-5.5-4.6-3.4h5.7L12 3Z" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="9" strokeDasharray="3 4" opacity="0.45" />
    </svg>
  );
}

export function AchievementBento({ items }: AchievementBentoProps) {
  const rootRef = useRef<HTMLUListElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cells = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.ach-bento__cell'));
    if (!cells.length) return () => {};

    let ctx: gsap.Context | null = null;
    let cancelled = false;

    if (reducedMotion) {
      gsap.set(cells, { clearProps: 'all' });
      gsap.set(cells, { opacity: 1 });
      gsap.set(root, { clearProps: 'all' });
      root.classList.add('ach-bento--ready');
      return () => {
        root.classList.remove('ach-bento--ready');
      };
    }

    gsap.set(root, { opacity: 1 });
    cells.forEach((cell, i) => {
      const fromLeft = i % 2 === 0;
      gsap.set(cell, { opacity: 0, x: fromLeft ? -36 : 36, y: 26 });
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;

        ctx = gsap.context(() => {
          cells.forEach((cell, i) => {
            const fromLeft = i % 2 === 0;
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

            const media = cell.querySelector<HTMLElement>('.ach-bento__media');
            if (media) {
              gsap.fromTo(
                media,
                { y: -10, rotateX: 4 },
                {
                  y: 10,
                  rotateX: -4,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: cell,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.15,
                  },
                },
              );
            }
          });

          ScrollTrigger.refresh();
          root.classList.add('ach-bento--ready');
        }, root);
      });
    });

    return () => {
      cancelled = true;
      root.classList.remove('ach-bento--ready');
      ctx?.revert();
    };
  }, [reducedMotion, items.length]);

  return (
    <ul ref={rootRef} className="ach-bento font-body" aria-label="Achievements">
      {items.map((a) => {
        const Emblem = /award/i.test(a.label) ? TrophyGlyph : SparkGlyph;
        return (
          <li key={a.id} className="ach-bento__cell wow-tilt wow-reverse">
            <div className="ach-bento__head">
              <span className="ach-bento__label">{a.label}</span>
              {a.year ? <span className="ach-bento__year">{a.year}</span> : null}
            </div>
            <div className="ach-bento__row">
              <h3 className="ach-bento__title clash">{a.title}</h3>
              <div className="ach-bento__media" aria-hidden>
                <span className="ach-bento__emblem-ring" />
                <span className="ach-bento__emblem-core">
                  <Emblem />
                </span>
              </div>
              {/* Subtext removed per request */}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

