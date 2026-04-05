import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './certBento.css';

gsap.registerPlugin(ScrollTrigger);

export type CertBentoItem = {
  org: string;
  name: string;
  logoUrl?: string | null;
};

type CertBentoProps = {
  items: CertBentoItem[];
};

export function CertBento({ items }: CertBentoProps) {
  const rootRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cells = Array.from(root.querySelectorAll<HTMLElement>('.cert-bento__cell'));

    // Initial state for fade-up; avoid FOUC by setting quickly after mount
    gsap.set(cells, {
      opacity: 0,
      y: 36,
      willChange: 'transform, opacity',
      transformOrigin: '50% 50%',
      force3D: true,
    });

    // Batch fade-up to keep performance high and avoid overlaps
    const batchEnter = (batch: Element[]) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.95,
        ease: 'power3.out',
        stagger: { each: 0.08, from: 'edges' },
        overwrite: 'auto',
      });
    };
    const batchLeaveBack = (batch: Element[]) => {
      gsap.to(batch, {
        opacity: 0,
        y: 36,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const st = ScrollTrigger.batch(cells, {
      start: 'top 88%',
      onEnter: batchEnter,
      onLeaveBack: batchLeaveBack,
    });

    // Gentle micro-parallax for the icon media inside each card (contained)
    const mediaTweens: gsap.core.Tween[] = [];
    cells.forEach((cell) => {
      const media = cell.querySelector<HTMLElement>('.cert-bento__media');
      if (!media) return;
      const tween = gsap.fromTo(
        media,
        { y: -6 },
        {
          y: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: cell,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.9,
          },
        },
      );
      mediaTweens.push(tween);
    });

    ScrollTrigger.refresh();

    return () => {
      st?.forEach?.((t) => t.kill?.());
      mediaTweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, []);

  return (
    <ul ref={rootRef} className="cert-bento font-body" aria-label="Certificates">
      {items.map((c) => (
        <li key={`${c.org}-${c.name}`} className="cert-bento__cell wow-tilt wow-reverse">
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
            <p className="cert-bento__badge">Certificate</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

