import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type CinematicRevealOpts = {
  stagger?: number;
  rotateX?: number;
  y?: number;
  blur?: number;
  start?: string;
};

/**
 * Cinematic section entrance: 3D tilt + depth + blur resolve (respects reduced motion).
 */
export function cinematicReveal(
  root: HTMLElement,
  selector: string,
  reducedMotion: boolean,
  opts: CinematicRevealOpts = {},
): () => void {
  const {
    stagger = 0.09,
    rotateX = 12,
    y = 56,
    blur = 7,
    start = 'top 86%',
  } = opts;

  const targets = root.querySelectorAll<HTMLElement>(selector);
  if (!targets.length) return () => {};

  if (reducedMotion) {
    gsap.set(targets, { clearProps: 'all' });
    return () => {};
  }

  gsap.set(root, { perspective: 1500 });
  gsap.set(targets, {
    opacity: 0,
    y,
    rotateX,
    filter: `blur(${blur}px)`,
    transformOrigin: '50% 18%',
    force3D: true,
  });

  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    gsap.to(targets, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      duration: 1.12,
      stagger,
      ease: 'power3.out',
      overwrite: 'auto',
      onComplete: () => {
        gsap.set(targets, { clearProps: 'filter' });
      },
    });
  };

  const st = ScrollTrigger.create({
    trigger: root,
    start,
    once: true,
    onEnter: run,
  });

  const sync = () => {
    ScrollTrigger.refresh();
    const r = root.getBoundingClientRect();
    const vh = window.innerHeight;
    if (r.top < vh * 0.9 && r.bottom > 48) {
      run();
      st.kill();
    }
  };
  requestAnimationFrame(() => requestAnimationFrame(sync));

  return () => {
    st.kill();
  };
}

export type FadeUpScrollOpts = {
  y?: number;
  stagger?: number;
  duration?: number;
  start?: string;
  delay?: number;
};

/**
 * Scroll-triggered fade + lift (no 3D / blur) — use for cards, panels, and chained blocks.
 */
export function fadeUpOnScroll(
  root: HTMLElement,
  selector: string,
  reducedMotion: boolean,
  opts: FadeUpScrollOpts = {},
): () => void {
  const {
    y = 48,
    stagger = 0.09,
    duration = 0.88,
    start = 'top 84%',
    delay = 0,
  } = opts;

  const elts = root.querySelectorAll<HTMLElement>(selector);
  if (!elts.length) return () => {};

  if (reducedMotion) {
    gsap.set(elts, { clearProps: 'all' });
    return () => {};
  }

  gsap.set(elts, { opacity: 0, y });

  const ctx = gsap.context(() => {
    gsap.to(elts, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: 'power3.out',
      stagger,
      scrollTrigger: {
        trigger: root,
        start,
        toggleActions: 'play none none none',
      },
    });
  }, root);

  return () => ctx.revert();
}

/** Parallel depth: element drifts on Y while section crosses viewport (scrub). */
export function parallaxYScrub(
  root: HTMLElement,
  el: HTMLElement,
  range: number,
  reducedMotion: boolean,
): () => void {
  if (reducedMotion) return () => {};

  const tween = gsap.fromTo(
    el,
    { y: -range * 0.5 },
    {
      y: range * 0.5,
      ease: 'none',
      scrollTrigger: {
        trigger: root,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.85,
      },
    },
  );

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

/** Second layer at different amplitude (parallel parallax). */
export function parallaxYScrubLayer(
  root: HTMLElement,
  el: HTMLElement,
  range: number,
  reducedMotion: boolean,
  scrub = 1.2,
): () => void {
  if (reducedMotion) return () => {};

  const tween = gsap.fromTo(
    el,
    { y: range * 0.6 },
    {
      y: -range * 0.6,
      ease: 'none',
      scrollTrigger: {
        trigger: root,
        start: 'top bottom',
        end: 'bottom top',
        scrub,
      },
    },
  );

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

/**
 * Lightweight global fade-up initializer for common cards/elements across the site.
 * Targets:
 *  - [data-fade-up]
 *  - .glass-card, .skill-bento__cell, .rec-tile, .ach-bento__cell, .timeline-row, .project-card
 */
export function initUniversalFadeUp(reducedMotion = false) {
  if (reducedMotion) return () => {};
  const selectors = [
    '[data-fade-up]',
    '.glass-card',
    '.skill-bento__cell',
    '.rec-tile',
    '.ach-bento__cell',
    '.timeline-row',
    '.project-card',
  ].join(', ');

  const targets = Array.from(document.querySelectorAll<HTMLElement>(selectors));
  if (!targets.length) return () => {};

  gsap.set(targets, { opacity: 0, y: 36 });

  const revealBatch = (batch: Element[]) => {
    gsap.to(batch, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: { each: 0.06, from: 'edges' },
      overwrite: 'auto',
    });
  };

  const ctx = gsap.context(() => {
    ScrollTrigger.batch(targets, {
      start: 'top 88%',
      onEnter: revealBatch,
      onLeaveBack: (batch) => {
        // Do not affect skills — they manage their own state
        const filtered = (batch as HTMLElement[]).filter((el) => !el.classList.contains('skill-bento__cell'));
        gsap.to(filtered, {
          opacity: 0,
          y: 36,
          duration: 0.6,
          ease: 'power1.out',
          overwrite: 'auto',
        });
      },
    });

    // Heavier “wow” tilt for elements explicitly opted-in with .wow-tilt
    const heavy = Array.from(document.querySelectorAll<HTMLElement>('.wow-tilt'));
    if (heavy.length) {
      gsap.set(heavy, {
        opacity: 0,
        y: 56,
        rotateX: 12,
        filter: 'blur(8px)',
        transformOrigin: '50% 18%',
        force3D: true,
      });
      ScrollTrigger.batch(heavy, {
        start: 'top 90%',
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            duration: 1.05,
            ease: 'power3.out',
            stagger: { each: 0.08 },
            overwrite: 'auto',
            onComplete: () => {
              gsap.set(batch, { clearProps: 'filter' });
            },
          });
        },
      });
    }

    // Reversible fade for elements with .wow-reverse (play forward on enter, reverse on leave back)
    const reversible = Array.from(document.querySelectorAll<HTMLElement>('.wow-reverse'));
    if (reversible.length) {
      gsap.set(reversible, { opacity: 0, y: 40 });
      ScrollTrigger.batch(reversible, {
        start: 'top 88%',
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.08,
          });
        },
        onLeaveBack: (batch) => {
          gsap.to(batch, {
            opacity: 0,
            y: 40,
            duration: 0.65,
            ease: 'power2.out',
            stagger: 0.06,
          });
        },
      });
    }
  });

  const syncBatchInView = () => {
    ScrollTrigger.refresh();
    const vh = window.innerHeight;
    const line = vh * 0.88;
    const visible = targets.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.top < line && r.bottom > 40;
    });
    if (visible.length) revealBatch(visible);
  };
  requestAnimationFrame(() => requestAnimationFrame(syncBatchInView));

  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener('load', refresh);

  return () => {
    window.removeEventListener('load', refresh);
    ctx.revert();
  };
}
