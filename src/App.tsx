import { lazy, Suspense, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Analytics } from '@vercel/analytics/react';

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

  /* Deep-link to sections via #id for crawlable in-page URLs; strip only invalid hashes. */
  useEffect(() => {
    const sectionIds = new Set([
      'hero',
      'about',
      'skills',
      'experience',
      'projects',
      'achievements',
      'certificates',
      'recommendations',
      'contact',
    ]);

    const scrollToSection = (id: string) => {
      const el = document.getElementById(id);
      const lenis = getLenis();
      if (el && lenis) {
        lenis.scrollTo(el, { offset: 0, immediate: true });
      } else if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: y, left: 0, behavior: 'auto' });
      } else if (id === 'hero') {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    const hashId = window.location.hash.replace(/^#/, '');
    if (hashId && sectionIds.has(hashId)) {
      scrollToSection(hashId);
      return;
    }

    scrollToSection('hero');
    if (window.location.hash && (!hashId || !sectionIds.has(hashId))) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  return (
    <>
      <a
        className="skip-link font-body"
        href="#main-content"
        onClick={() => {
          requestAnimationFrame(() => {
            document.getElementById('main-content')?.focus({ preventScroll: true });
          });
        }}
      >
        Skip to main content
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

      <main id="main-content" className="page" tabIndex={-1}>
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
      <Analytics />
    </>
  );
}
