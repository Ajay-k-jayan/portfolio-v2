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
          y: 24,
          filter: 'blur(4px)',
          letterSpacing: '0.03em',
        });
      }

      if (blocks.length) {
        gsap.set(blocks, {
          opacity: 0,
          y: 26,
          filter: 'blur(3px)',
        });
      }

      const revealTl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 42%',
          scrub: 0.7,
        },
      });

      if (title) {
        revealTl.to(title, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          letterSpacing: '0.005em',
          duration: 0.28,
        });
      }

      if (blocks.length) {
        revealTl.to(
          blocks,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.32,
            stagger: 0.1,
          },
          title ? 0.03 : 0,
        );
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
