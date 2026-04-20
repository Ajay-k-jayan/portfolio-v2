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
        const reset = section.querySelectorAll('[data-about-heading], [data-about-block]');
        if (reset.length) {
          gsap.set(reset, {
            clearProps: 'all',
          });
        }
        return;
      }

      const title = section.querySelector<HTMLElement>('[data-about-heading]');
      const blocks = section.querySelectorAll<HTMLElement>('[data-about-block]');

      if (title) {
        gsap.set(title, {
          opacity: 0,
          y: 84,
          z: -180,
          rotateX: 28,
          rotateY: -12,
          filter: 'blur(14px)',
          letterSpacing: '0.14em',
          transformOrigin: '0% 60%',
          textShadow: '0 0 0 rgba(59,130,246,0)',
        });
      }

      if (blocks.length) {
        gsap.set(blocks, {
          opacity: 0,
          y: 90,
          x: (_i: number) => (_i % 2 === 0 ? -42 : 42),
          z: -120,
          rotateX: 16,
          rotateY: (_i: number) => (_i % 2 === 0 ? -8 : 8),
          filter: 'blur(8px)',
          transformPerspective: 1100,
          clipPath: 'inset(0 0 100% 0)',
        });
      }

      const revealTl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.25,
        },
      });

      if (title) {
        revealTl.to(title, {
          opacity: 1,
          y: 0,
          z: 0,
          rotateX: 0,
          rotateY: 0,
          filter: 'blur(0px)',
          letterSpacing: '0.01em',
          textShadow: '0 0 28px rgba(59,130,246,0.28)',
          duration: 0.34,
        });
      }

      if (blocks.length) {
        revealTl.to(
          blocks,
          {
            opacity: 1,
            y: 0,
            x: 0,
            z: 0,
            rotateX: 0,
            rotateY: 0,
            filter: 'blur(0px)',
            clipPath: 'inset(0 0 0% 0)',
            duration: 0.4,
            stagger: 0.14,
          },
          title ? 0.05 : 0,
        );
      }

      if (title || blocks.length) {
        const driftTargets = [title, ...Array.from(blocks)].filter(Boolean);
        if (driftTargets.length) {
          gsap.to(driftTargets, {
            yPercent: -14,
            z: 36,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.35,
            },
          });
        }
      }

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
            I am currently working as a <strong>Senior Software Engineer</strong> with over{' '}
            <strong>3 years</strong> of experience in web development.
          </p>
          <p className="font-body" data-about-block>
            I mainly focus on frontend development using <strong>Angular</strong> and have
            experience building scalable web applications, handling large datasets, and developing
            workflow-based systems.
          </p>
          <p className="font-body" data-about-block>
            My core skills include <strong>Angular</strong>, <strong>TypeScript</strong>,{' '}
            <strong>JavaScript</strong>, and <strong>RxJS</strong>. I also have experience
            working with REST APIs, WebSockets, and micro frontend architecture.
          </p>
          <p className="font-body" data-about-block>
            In addition to frontend, I have basic experience with backend technologies like Django
            and FastAPI, and I have worked with databases such as MySQL and CockroachDB.
          </p>
          <p className="font-body muted" data-about-block>
            I am interested in building efficient, scalable, and user-friendly applications, and I
            enjoy learning new technologies and improving my skills.
          </p>
        </div>

        {/* Layout reserve: fixed hero PersistentParticleSphere moves here via scrollSphere (single canvas) */}
        <div className="about-sphere-stage" aria-hidden />
      </div>
    </section>
  );
}
