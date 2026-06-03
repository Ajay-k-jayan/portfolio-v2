import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';

let lenisRef: Lenis | null = null;

/**
 * Smooth wheel / touch scroll + GSAP ScrollTrigger sync.
 * Skipped when `prefers-reduced-motion: reduce` (native scroll).
 */
export function initLenisScroll(): () => void {
  if (typeof window === 'undefined') return () => {};

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.ticker.lagSmoothing(0);
    return () => {};
  }

  // Android Chrome: native momentum scroll is smoother than Lenis lerp.
  // Lenis on Android stacks on top of native inertia, adding input lag and jank.
  const isAndroid = /Android/i.test(navigator.userAgent);
  if (isAndroid) {
    gsap.ticker.lagSmoothing(0);
    return () => {};
  }

  // Other touch devices (iOS, iPad): use lighter smoothing so it still feels native.
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  const lenis = new Lenis({
    lerp: isTouch ? 0.14 : 0.08,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: isTouch ? 1.5 : 1,
    allowNestedScroll: true,
    anchors: true,
    stopInertiaOnNavigate: true,
  });
  lenisRef = lenis;

  lenis.on('scroll', ScrollTrigger.update);

  const onTick = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(onTick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(onTick);
    lenis.destroy();
    lenisRef = null;
    ScrollTrigger.refresh();
  };
}

export function getLenis(): Lenis | null {
  return lenisRef;
}
