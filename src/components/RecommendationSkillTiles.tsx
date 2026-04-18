import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './skillBento.css';
import './recommendationTiles.css';

gsap.registerPlugin(ScrollTrigger);

export type RecommendationTile = {
  name: string;
  date: string;
  quote: string;
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function RecommendationSkillTiles({ items, sourceUrl }: { items: RecommendationTile[]; sourceUrl: string }) {
  const rootRef = useRef<HTMLUListElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cells = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.skill-bento__cell'));
    if (!cells.length) return () => {};

    let ctx: gsap.Context | null = null;
    let cancelled = false;

    if (reducedMotion) {
      gsap.set(cells, { clearProps: 'all' });
      gsap.set(cells, { opacity: 1 });
      gsap.set(root, { clearProps: 'all' });
      root.classList.add('rec-stack--ready');
      return () => {
        root.classList.remove('rec-stack--ready');
      };
    }

    gsap.set(root, { opacity: 1 });
    cells.forEach((cell) => {
      gsap.set(cell, { opacity: 0, y: 26 });
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;

        ctx = gsap.context(() => {
          cells.forEach((cell) => {
            gsap.fromTo(
              cell,
              { opacity: 0, y: 26 },
              {
                opacity: 1,
                y: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: cell,
                  start: 'top bottom',
                  end: 'top 70%',
                  scrub: 0.4,
                  invalidateOnRefresh: true,
                },
              },
            );

            const media = cell.querySelector<HTMLElement>('.rec-tile__media');
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
                    scrub: 0.9,
                  },
                },
              );
            }
          });

          ScrollTrigger.refresh();
          root.classList.add('rec-stack--ready');
        }, root);
      });
    });

    return () => {
      cancelled = true;
      root.classList.remove('rec-stack--ready');
      ctx?.revert();
    };
  }, [reducedMotion, items.length]);

  return (
    <ul ref={rootRef} className="skill-bento rec-stack font-body" aria-label="Peer recommendations">
      {items.map((r) => (
        <li
          key={`${r.name}-${r.date}`}
          className="skill-bento__cell skill-bento__cell--normal rec-tile rec-tile--wide wow-tilt wow-reverse"
        >
          <a
            className="skill-bento__docs-link"
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${r.name} — open LinkedIn recommendations`}
          />
          <div className="rec-tile__header">
            <span className="skill-bento__cat">Recommendation</span>
            <span className="skill-bento__tier skill-bento__tier--advanced">{r.date}</span>
            <p className="rec-tile__author clash">{r.name}</p>
          </div>
          <div className="rec-tile__content">
            <p className="muted rec-tile__quote">{r.quote}</p>
            <div className="rec-tile__media skill-bento__media" aria-hidden>
              <div className="skill-bento__media-face skill-bento__media-face--icon">
                <div className="skill-bento__icon">
                  <span className="clash" style={{ color: '#e5eaf3' }}>{initialsFromName(r.name)}</span>
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
