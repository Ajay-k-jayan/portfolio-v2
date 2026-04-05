import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './recommendationBento.css';

gsap.registerPlugin(ScrollTrigger);

export type RecommendationItem = {
  name: string;
  date: string;
  quote: string;
};

type Props = {
  items: RecommendationItem[];
  sourceUrl?: string;
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function RecommendationBento({ items, sourceUrl }: Props) {
  const rootRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cells = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.rec-bento__cell'));
    gsap.set(root, { opacity: 1 });
    cells.forEach((cell, i) => {
      const from = i % 2 === 0 ? -30 : 30;
      gsap.fromTo(
        cell,
        { opacity: 0, x: from, y: 22 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: cell,
            start: 'top bottom',
            end: 'top 70%',
            scrub: 0.4,
          },
        },
      );
    });
    ScrollTrigger.refresh();
  }, []);

  return (
    <>
      {sourceUrl ? (
        <div className="rec-bento__source glass-card font-body" data-cinematic>
          <div className="rec-bento__source-media" aria-hidden>
            <span className="rec-bento__source-badge clash">in</span>
          </div>
          <div className="rec-bento__source-body">
            <h3 className="rec-bento__source-title clash">View the full recommendation wall</h3>
            <p className="rec-bento__source-sub">Verified on LinkedIn — opens in a new tab</p>
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
              Open recommendations tab
            </a>
          </div>
        </div>
      ) : null}
      <ul ref={rootRef} className="rec-bento font-body" aria-label="Recommendations">
        {items.map((r) => (
          <li key={`${r.name}-${r.date}`} className="rec-bento__cell">
            <div className="rec-bento__head">
              <span className="rec-bento__avatar clash" aria-hidden>
                {initialsFromName(r.name)}
              </span>
              <time className="rec-bento__date">{r.date}</time>
            </div>
            <cite className="rec-bento__name clash">{r.name}</cite>
            <blockquote className="rec-bento__quote">{r.quote}</blockquote>
          </li>
        ))}
      </ul>
    </>
  );
}

