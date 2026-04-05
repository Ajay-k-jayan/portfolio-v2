import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Inserts animated accent lines after each .content-section h2.section-title (Hero excluded by markup).
 */
export function usePremiumTitleLines() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const created: HTMLElement[] = [];
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>('.content-section h2.section-title').forEach((h2) => {
        if (h2.closest('.about-no-title-accent')) return;
        const next = h2.nextElementSibling;
        if (next?.classList.contains('section-title-line')) return;

        const line = document.createElement('span');
        line.className = 'section-title-line';
        line.setAttribute('aria-hidden', 'true');
        h2.insertAdjacentElement('afterend', line);
        created.push(line);

        // Always show the line; only animate when motion is allowed
        if (!reducedMotion) {
          const centered = !!h2.closest('.contact-section');
          gsap.from(line, {
            scaleX: 0,
            opacity: 0,
            duration: 1.1,
            ease: 'power3.out',
            transformOrigin: centered ? 'center center' : 'left center',
            scrollTrigger: {
              trigger: h2,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          });
        }
      });
    });

    return () => {
      created.forEach((el) => el.remove());
      ctx.revert();
    };
  }, [reducedMotion]);
}
