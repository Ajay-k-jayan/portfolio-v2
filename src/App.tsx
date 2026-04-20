import { lazy, Suspense, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PersistentParticleSphere = lazy(async () => {
  const m = await import('./components/PersistentParticleSphere');
  return { default: m.PersistentParticleSphere };
});
import { initScrollSphere } from './lib/scrollSphere';
import { getLenis, initLenisScroll } from './lib/initLenisScroll';
import { initUniversalFadeUp } from './lib/cinematicMotion';
import { useReducedMotion } from './hooks/useReducedMotion';
import { usePremiumTitleLines } from './hooks/usePremiumTitleLines';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Skills } from './sections/Skills';
import { ExperienceTimeline } from './sections/ExperienceTimeline';
import { ProjectsShowcase } from './sections/ProjectsShowcase';
import { Achievements } from './sections/Achievements';
import { Certifications } from './sections/Certifications';
import { Recommendations } from './sections/Recommendations';
import { Contact } from './sections/Contact';
import { SideDockNav } from './components/SideDockNav';
import { CustomCursor } from './components/CustomCursor';

export default function App() {
  const reducedMotion = useReducedMotion();
  const footerRef = useRef<HTMLElement>(null);
  usePremiumTitleLines();

  useEffect(() => {
    return initLenisScroll();
  }, []);

  useEffect(() => {
    const el = footerRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0,
        y: 36,
        rotateX: 18,
        transformOrigin: '50% 100%',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 98%',
          toggleActions: 'play none none none',
        },
      });
    }, el);
    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    const teardown = initScrollSphere();
    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(refresh);
    window.addEventListener('load', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      teardown();
    };
  }, []);

  useEffect(() => {
    const cleanup = initUniversalFadeUp(reducedMotion);
    return () => cleanup?.();
  }, [reducedMotion]);

  /* Align viewport with hash (#about, #skills, …) so URL, content, and dock stay in sync */
  useEffect(() => {
    const go = () => {
      const id = window.location.hash.replace(/^#/, '');
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(el, { offset: 0, immediate: false });
      } else {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        window.dispatchEvent(new Event('scroll'));
      });
    };
    go();
    window.addEventListener('hashchange', go);
    return () => window.removeEventListener('hashchange', go);
  }, []);

  return (
    <>
      <a className="skip-link font-body" href="#hero">
        Skip to content
      </a>

      <div className="fixed-scene" aria-hidden>
        <div className="fixed-scene-align">
          <Suspense fallback={null}>
            <PersistentParticleSphere reducedMotion={reducedMotion} />
          </Suspense>
          <div className="fixed-scene-vignette" />
        </div>
      </div>

      <SideDockNav />
      <CustomCursor />

      <main className="page">
        <Hero />
        <About />
        <Skills />
        <ExperienceTimeline />
        <ProjectsShowcase />
        <Achievements />
        <Certifications />
        <Recommendations />
        <Contact />
      </main>

      <footer
        ref={footerRef}
        className="site-footer site-footer--premium font-body muted cinematic-scene cinematic-scene--perspective"
      >
        © {new Date().getFullYear()} Ajay K J · Kerala, India
      </footer>
    </>
  );
}
