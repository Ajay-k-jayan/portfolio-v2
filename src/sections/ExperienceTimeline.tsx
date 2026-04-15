import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cinematicReveal } from '../lib/cinematicMotion';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const ROLES = [
  {
    title: 'Senior Software Engineer',
    range: 'Sep 2025 — Present',
    company: 'Beinex Consultancy',
    location: 'Kochi',
    points: [
      'Lead cross-functional squad (3 FE, 3 BE, 2 QA); Scrum Master for sprint flow',
      'Enterprise Angular (v16–19), micro-frontends, performance & change-detection tuning',
      'RxJS-heavy integrations, CI/CD, structured reviews (ESLint, Stylelint, SonarLint, i18n checks)',
    ],
  },
  {
    title: 'Software Engineer',
    range: 'Sep 2023 — Sep 2025',
    company: 'Beinex Consultancy',
    location: 'Kochi',
    points: [
      'Scalable Angular apps for large datasets and workflow systems',
      'Dynamic report builder, virtual scrolling, pagination, WebSockets',
      'i18n, mentoring juniors — Beinex Excelencia Award (2024)',
    ],
  },
  {
    title: 'Associate Software Engineer',
    range: 'Sep 2022 — Sep 2023',
    company: 'Beinex Consultancy',
    location: 'Kochi',
    points: [
      'Dashboards with Angular + D3.js, reusable components, reactive forms',
      'Lazy loading, rendering optimizations, modern layout (Flexbox / Grid)',
    ],
  },
  {
    title: 'Full Stack Developer Intern',
    range: 'Jun 2022 — Sep 2022',
    company: 'Beinex Consultancy',
    location: 'Kochi',
    points: ['Angular + Django apps, REST APIs — Star Performer recognition'],
  },
];

export function ExperienceTimeline() {
  const rootRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return () => {};
    return cinematicReveal(root, '[data-cinematic]', reducedMotion, {
      stagger: 0.12,
      rotateX: 10,
      y: 40,
      start: 'top 88%',
    });
  }, [reducedMotion]);

  useEffect(() => {
    const root = rootRef.current;
    const line = lineRef.current;
    if (!root || !line) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: {
            trigger: root,
            start: 'top 70%',
            end: 'bottom 62%',
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        },
      );

      const cards = root.querySelectorAll<HTMLElement>('.timeline-card');
      cards.forEach((card, i) => {
        const left = i % 2 === 0;
        gsap.from(card, {
          opacity: 0,
          x: reducedMotion ? 0 : left ? -56 : 56,
          rotateY: reducedMotion ? 0 : left ? 12 : -12,
          z: reducedMotion ? 0 : -64,
          scale: reducedMotion ? 1 : 0.94,
          duration: reducedMotion ? 0.65 : 1.02,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        });
      });

      const nodes = root.querySelectorAll<HTMLElement>('.timeline-node');
      nodes.forEach((node) => {
        gsap.to(node, {
          boxShadow: '0 0 0 6px rgba(139,92,246,0.35)',
          repeat: -1,
          yoyo: true,
          duration: 2.4,
          ease: 'sine.inOut',
          scrollTrigger: {
            trigger: node,
            start: 'top 90%',
            toggleActions: 'play pause resume pause',
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      id="experience"
      className="section content-section experience-section cinematic-scene"
    >
      <h2 className="section-title clash" data-cinematic>
        Experience
      </h2>
      <p className="section-lead font-body" data-cinematic>
        Career timeline — roles, responsibilities, and impact across teams and products.
      </p>
      <div className="timeline">
        <div className="timeline-line" aria-hidden>
          <div ref={lineRef} className="timeline-line-fill" />
        </div>
        <ul className="timeline-list">
          {ROLES.map((job, i) => (
            <li
              key={`${job.range}-${job.title}`}
              className={`timeline-row ${i % 2 === 0 ? 'timeline-row--left' : 'timeline-row--right'}`}
            >
              <div className="timeline-node" aria-hidden />
              <article className="timeline-card glass-card">
                <details className="timeline-card-details">
                  <summary className="timeline-card-summary">
                    <div className="timeline-summary-main">
                      <h3 className="clash timeline-company">{job.company}</h3>
                      <span className="font-body muted timeline-range">{job.range}</span>
                      <p className="font-body timeline-role">{job.title}</p>
                    </div>
                    <span className="timeline-expand-icon" aria-hidden>
                      ▼
                    </span>
                  </summary>
                  <div className="timeline-card-expanded">
                    <p className="font-body timeline-expanded-location">{job.location}</p>
                    <ul className="font-body timeline-bullets">
                      {job.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </details>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
