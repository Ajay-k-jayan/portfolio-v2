import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const fadeUp = { opacity: 0, y: 36 };

/**
 * Fade + slide up with stagger; uses power3.out for enter per spec.
 * Handles deep links / hash scroll: if the section is already on screen after refresh,
 * reveals immediately so copy is never stuck at opacity: 0.
 */
export function revealSection(
  root: HTMLElement,
  selector: string,
  stagger = 0.08,
) {
  const targets = root.querySelectorAll<HTMLElement>(selector);
  if (!targets.length) return () => {};

  gsap.set(targets, fadeUp);

  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: 0.95,
      ease: 'power3.out',
      stagger,
      overwrite: 'auto',
    });
  };

  const st = ScrollTrigger.create({
    trigger: root,
    start: 'top bottom',
    once: true,
    onEnter: run,
  });

  const sync = () => {
    ScrollTrigger.refresh();
    const inView =
      typeof ScrollTrigger.isInViewport === 'function'
        ? ScrollTrigger.isInViewport(root, 0.05)
        : (() => {
            const r = root.getBoundingClientRect();
            const vh = window.innerHeight;
            return r.top < vh && r.bottom > 0;
          })();
    if (inView) {
      run();
      st.kill();
    }
  };

  requestAnimationFrame(() => requestAnimationFrame(sync));

  return () => {
    st.kill();
  };
}
