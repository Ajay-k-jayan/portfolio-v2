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
  const timelineTrackRef = useRef<HTMLDivElement>(null);
  const lineRailRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
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
    const track = timelineTrackRef.current;
    const lineRail = lineRailRef.current;
    const lineFill = lineFillRef.current;
    if (!root || !track || !lineRail || !lineFill) return;

    const rows = root.querySelectorAll<HTMLElement>('.timeline-row');
    const detailsEls = root.querySelectorAll<HTMLDetailsElement>('.timeline-card-details');
    const nodes = root.querySelectorAll<HTMLElement>('.timeline-node');

    if (reducedMotion) {
      gsap.set(lineFill, { scaleY: 1, transformOrigin: 'top center' });
      return () => {};
    }

    const refreshTimeline = () => ScrollTrigger.refresh();
    const syncLineToNodes = () => {
      if (nodes.length < 2) return;
      const trackRect = track.getBoundingClientRect();
      const firstNodeRect = nodes[0].getBoundingClientRect();
      const lastNodeRect = nodes[nodes.length - 1].getBoundingClientRect();

      const firstCenter = firstNodeRect.top + firstNodeRect.height / 2 - trackRect.top;
      const lastCenter = lastNodeRect.top + lastNodeRect.height / 2 - trackRect.top;
      const lineTop = Math.max(0, firstCenter);
      const lineEnd = Math.min(trackRect.height, lastCenter);
      const lineHeight = Math.max(0, lineEnd - lineTop);

      gsap.set(lineRail, { top: lineTop, height: lineHeight });
    };

    const ctx = gsap.context(() => {
      gsap.set(lineFill, { scaleY: 0, transformOrigin: 'top center' });
      syncLineToNodes();

      ScrollTrigger.create({
        trigger: nodes[0],
        start: 'center 78%',
        endTrigger: nodes[nodes.length - 1],
        end: 'center 28%',
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const progress = gsap.utils.clamp(0, 1, self.progress);
          gsap.set(lineFill, { scaleY: progress, transformOrigin: 'top center' });

          // Keep row highlighting synced to timeline progression without over-highlighting.
          const activeIndex = Math.max(0, Math.min(rows.length - 1, Math.round(progress * (rows.length - 1))));
          rows.forEach((row, i) => {
            row.classList.toggle('timeline-row--active', i === activeIndex);
          });
        },
      });

      const cards = root.querySelectorAll<HTMLElement>('.timeline-card');
      cards.forEach((card, i) => {
        const fromLeft = i % 2 === 0;
        const x = fromLeft ? -22 : 22;
        gsap.fromTo(
          card,
          { opacity: 0, y: 28, x },
          {
            opacity: 1,
            y: 0,
            x: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'top 58%',
              scrub: 0.95,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      detailsEls.forEach((detailsEl) => {
        detailsEl.addEventListener('toggle', refreshTimeline);
      });
      ScrollTrigger.addEventListener('refreshInit', syncLineToNodes);
      window.addEventListener('resize', syncLineToNodes);

      requestAnimationFrame(() => {
        syncLineToNodes();
        ScrollTrigger.refresh();
      });
      setTimeout(() => {
        syncLineToNodes();
        ScrollTrigger.refresh();
      }, 120);
    }, root);

    return () => {
      detailsEls.forEach((detailsEl) => {
        detailsEl.removeEventListener('toggle', refreshTimeline);
      });
      ScrollTrigger.removeEventListener('refreshInit', syncLineToNodes);
      window.removeEventListener('resize', syncLineToNodes);
      ctx.revert();
    };
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
        <div ref={timelineTrackRef} className="timeline-track">
          <div ref={lineRailRef} className="timeline-line" aria-hidden>
            <div ref={lineFillRef} className="timeline-line-fill" />
          </div>
          <ul className="timeline-list">
            {ROLES.map((job, i) => (
              <li
                key={`${job.range}-${job.title}`}
                className={`timeline-row ${i % 2 === 0 ? 'timeline-row--left' : 'timeline-row--right'}`}
                data-timeline-row
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
      </div>
    </section>
  );
}
