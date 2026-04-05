import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
  // Stars removed per requirement — keep clean icon-only media for recommendations

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cells = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.skill-bento__cell'));

    gsap.set(root, { opacity: 1 });
    cells.forEach((cell, i) => {
      const from = i % 2 === 0 ? -36 : 36;
      gsap.fromTo(
        cell,
        { opacity: 0, x: from, y: 30, scale: 0.96, rotateX: 10, filter: 'blur(8px)' },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotateX: 0,
          filter: 'blur(0px)',
          ease: 'power3.out',
          duration: 0.9,
          scrollTrigger: {
            trigger: cell,
            start: 'top 85%',
            end: 'bottom 65%',
            toggleActions: 'play reverse play reverse',
          },
          onComplete: () => {
            gsap.set(cell, { clearProps: 'filter' });
          },
        },
      );
      gsap.fromTo(
        cell,
        { boxShadow: '0 0 0 rgba(59,130,246,0)' },
        {
          boxShadow: '0 0 36px rgba(59,130,246,0.16)',
          duration: 0.55,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
          scrollTrigger: { trigger: cell, start: 'top 85%', toggleActions: 'play none none none' },
          onComplete: () => {
            gsap.set(cell, { clearProps: 'boxShadow' });
          },
        },
      );
      const media = cell.querySelector<HTMLElement>('.skill-bento__media');
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
  }, []);

  return (
    <ul ref={rootRef} className="skill-bento rec-stack font-body" aria-label="Peer recommendations">
      {items.map((r, idx) => (
        <li
          key={`${r.name}-${r.date}`}
          className="skill-bento__cell skill-bento__cell--normal rec-tile rec-tile--wide wow-tilt wow-reverse"
          data-rec-accent={(idx % 3) + 1}
          data-fade-up
        >
          <a
            className="skill-bento__docs-link"
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open LinkedIn recommendations"
          />
          <div className="skill-bento__body">
            <span className="skill-bento__cat">Recommendation</span>
            <span className="skill-bento__tier skill-bento__tier--advanced">{r.date}</span>
            <p className="muted rec-tile__quote" style={{ margin: 0 }}>{r.quote}</p>
          </div>
          <div className="skill-bento__media" aria-hidden>
            <div className="skill-bento__media-face skill-bento__media-face--icon">
              <div className="skill-bento__icon">
                <span className="clash" style={{ color: '#e5eaf3' }}>{initialsFromName(r.name)}</span>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

