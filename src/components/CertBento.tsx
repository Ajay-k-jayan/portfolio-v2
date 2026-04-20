import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './certBento.css';

gsap.registerPlugin(ScrollTrigger);

export type CertBentoItem = {
  org: string;
  name: string;
  logoUrl?: string | null;
  certUrl?: string;
};

type CertBentoProps = {
  items: CertBentoItem[];
};

function ExternalDocHint() {
  return (
    <svg className="cert-bento__external-icon" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42L17.59 5H14V3Zm-9 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6h-2v6H5V9h6V7H5Z"
      />
    </svg>
  );
}

export function CertBento({ items }: CertBentoProps) {
  const rootRef = useRef<HTMLUListElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cells = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.cert-bento__cell'));
    if (!cells.length) return () => {};

    let ctx: gsap.Context | null = null;
    let cancelled = false;

    if (reducedMotion) {
      gsap.set(cells, { clearProps: 'all' });
      gsap.set(cells, { opacity: 1 });
      gsap.set(root, { clearProps: 'all' });
      root.classList.add('cert-bento--ready');
      return () => {
        root.classList.remove('cert-bento--ready');
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

            const media = cell.querySelector<HTMLElement>('.cert-bento__media');
            if (media) {
              gsap.fromTo(
                media,
                { y: -6 },
                {
                  y: 6,
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
          root.classList.add('cert-bento--ready');
        }, root);
      });
    });

    return () => {
      cancelled = true;
      root.classList.remove('cert-bento--ready');
      ctx?.revert();
    };
  }, [reducedMotion, items.length]);

  return (
    <ul ref={rootRef} className="cert-bento font-body" aria-label="Certificates">
      {items.map((c) => (
        <li key={`${c.org}-${c.name}`} className="cert-bento__cell wow-tilt wow-reverse">
          <a
            className="cert-bento__link"
            href={c.certUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${c.name} certificate link`}
          >
            <div className="cert-bento__media" aria-hidden>
              <div className="cert-bento__icon">
                {c.logoUrl ? (
                  <img src={c.logoUrl} alt="" className="cert-bento__icon-img" loading="lazy" decoding="async" />
                ) : (
                  <span className="cert-bento__icon-fallback clash">
                    {c.org.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <div className="cert-bento__body">
              <span className="cert-bento__org">{c.org}</span>
              <h3 className="cert-bento__name clash">{c.name}</h3>
              <p className="cert-bento__badge">View certificate</p>
            </div>
            <ExternalDocHint />
          </a>
        </li>
      ))}
    </ul>
  );
}
