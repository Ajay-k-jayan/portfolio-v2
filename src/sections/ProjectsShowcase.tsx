import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cinematicReveal } from '../lib/cinematicMotion';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    slug: 'aurex',
    title: 'Aurex — GRC Platform',
    badge: 'Flagship',
    desc: 'Cloud enterprise governance, risk, and compliance: real-time risk management, audit automation, and analytics. Long-running Angular product at Beinex.',
    stack: 'Angular, RxJS, REST, WebSockets, Micro-frontends',
    demo: '#contact',
    repo: 'https://github.com/Ajay-k-jayan',
    featured: true,
  },
  {
    slug: 'reports',
    title: 'Dynamic Report Builder',
    badge: 'Data at scale',
    desc: 'Configurable tables and optimized rendering for huge datasets with virtual scrolling and pagination.',
    stack: 'Angular, TypeScript, Performance tuning',
    demo: '#contact',
    repo: 'https://github.com/Ajay-k-jayan',
    featured: false,
  },
  {
    slug: 'realtime',
    title: 'Realtime Operations',
    badge: 'Live',
    desc: 'Workflow systems with WebSocket-backed live updates and resilient state handling.',
    stack: 'Angular, RxJS, WebSockets',
    demo: '#contact',
    repo: 'https://github.com/Ajay-k-jayan',
    featured: false,
  },
  {
    slug: 'dash',
    title: 'Interactive Dashboards',
    badge: 'Visualization',
    desc: 'Angular + D3.js dashboards for operational metrics and storytelling with data.',
    stack: 'Angular, D3.js, SCSS',
    demo: '#contact',
    repo: 'https://github.com/Ajay-k-jayan',
    featured: false,
  },
];

export function ProjectsShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return () => {};
    return cinematicReveal(section, '[data-cinematic]', reducedMotion, {
      stagger: 0.14,
      rotateX: 11,
      y: 36,
      start: 'top 90%',
    });
  }, [reducedMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getX = () => {
        const scroller = track.parentElement;
        const viewW = scroller?.clientWidth ?? window.innerWidth;
        const max = track.scrollWidth - viewW;
        return -Math.max(0, max);
      };

      gsap.fromTo(
        track,
        { x: 0, rotateX: reducedMotion ? 0 : 5 },
        {
          x: getX,
          rotateX: reducedMotion ? 0 : -7,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 12%',
            end: () => `+=${Math.max(track.scrollWidth, window.innerWidth)}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        },
      );

      const cards = section.querySelectorAll<HTMLElement>('.project-card');
      if (cards.length) {
        gsap.from(cards, {
          opacity: 0,
          y: reducedMotion ? 24 : 56,
          rotateX: reducedMotion ? 0 : 22,
          transformOrigin: '50% 0%',
          duration: reducedMotion ? 0.7 : 1,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="section content-section projects-section cinematic-scene"
    >
      <div className="projects-head">
        <h2 className="section-title clash" data-cinematic>
          Projects
        </h2>
        <p className="section-lead font-body" data-cinematic>
          Case studies of shipped work — architecture choices, trade‑offs, and outcomes.
        </p>
      </div>
      <div className="projects-scroller">
        <div ref={trackRef} className="projects-track">
          {PROJECTS.map((p) => (
            <article
              key={p.slug}
              className={`project-card glass-card ${p.featured ? 'project-card--hero' : ''}`}
            >
              <div className="project-card-top">
                <span className="project-badge font-body">{p.badge}</span>
                {p.featured && <span className="project-spotlight clash">Aurex</span>}
              </div>
              <h3 className="clash project-title">{p.title}</h3>
              <p className="font-body project-desc">{p.desc}</p>
              <p className="font-body project-stack">
                <strong>Stack:</strong> {p.stack}
              </p>
              <div className="project-actions">
                <a className="btn btn-primary btn-sm" href={p.demo}>
                  View / Demo
                </a>
                <a
                  className="btn btn-ghost btn-sm"
                  href={p.repo}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
