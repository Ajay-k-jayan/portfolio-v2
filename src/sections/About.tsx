import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        return;
      }

      const title = section.querySelector<HTMLElement>('.about-copy h2.section-title');
      const blocks = section.querySelectorAll<HTMLElement>('[data-about-block]');

      if (title) {
        gsap.fromTo(
          title,
          { opacity: 0.08, y: 44, filter: 'blur(12px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 76%',
              end: 'top 38%',
              scrub: 0.55,
            },
          },
        );
      }

      if (!blocks.length) return;

      gsap.fromTo(
        blocks,
        { opacity: 0, x: -52, skewX: -2 },
        {
          opacity: 1,
          x: 0,
          skewX: 0,
          ease: 'none',
          stagger: 0.11,
          scrollTrigger: {
            trigger: section,
            start: 'top 62%',
            end: 'bottom 48%',
            scrub: 0.85,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={ref}
      id="about"
      className="section content-section about-section cinematic-scene cinematic-scene--perspective"
    >
      <div className="about-grid">
        <div className="about-copy">
          <h2 className="section-title clash" data-about-heading>
            About
          </h2>
          <p className="section-lead font-body" data-about-block>
            Frontend engineer with <strong>3+ years</strong> focused on{' '}
            <strong>Angular</strong> and enterprise UIs. I care about scalable architecture,
            performance budgets, and maintainable design systems—from reactive forms and{' '}
            <strong>RxJS</strong> flows to lazy loading, micro-frontends, and crisp UX under
            heavy data.
          </p>
          <p className="font-body" data-about-block>
            I collaborate closely with backend and QA, lead reviews with ESLint, Stylelint, and
            SonarLint, and keep delivery predictable with clear Agile rituals.
          </p>
          <p className="font-body muted" data-about-block>
            Diploma in Computer Engineering, Government Polytechnic College, Perumbavoor
            (2018–2021).
          </p>
        </div>

        {/* Layout reserve: fixed hero PersistentParticleSphere moves here via scrollSphere (single canvas) */}
        <div className="about-sphere-stage" aria-hidden />
      </div>
    </section>
  );
}
