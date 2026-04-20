import { useEffect, useRef, useState } from 'react';
import { cinematicReveal } from '../lib/cinematicMotion';
import { useReducedMotion } from '../hooks/useReducedMotion';

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
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const cards = Array.from(track.querySelectorAll<HTMLElement>('.project-slide'));
    if (!cards.length) return;

    const onScroll = () => {
      const pos = viewport.scrollLeft + viewport.clientWidth / 2;
      let closestIndex = 0;
      let closestDist = Number.POSITIVE_INFINITY;
      cards.forEach((card, idx) => {
        const center = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(center - pos);
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = idx;
        }
      });
      setActiveIndex(closestIndex);
    };

    onScroll();
    viewport.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      viewport.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const scrollToIndex = (index: number, behavior: ScrollBehavior = 'smooth') => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>('.project-slide'));
    if (!cards.length) return;
    const next = Math.max(0, Math.min(cards.length - 1, index));
    viewport.scrollTo({ left: cards[next].offsetLeft, behavior });
    setActiveIndex(next);
  };

  const goNext = () => scrollToIndex((activeIndex + 1) % PROJECTS.length);
  const goPrev = () => scrollToIndex((activeIndex - 1 + PROJECTS.length) % PROJECTS.length);

  useEffect(() => {
    if (reducedMotion || isPaused) return;
    const id = window.setInterval(() => {
      scrollToIndex((activeIndex + 1) % PROJECTS.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [activeIndex, isPaused, reducedMotion]);

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
      <div
        className="projects-scroller"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
      >
        <div className="projects-carousel-controls">
          <button
            type="button"
            className="projects-nav-btn"
            aria-label="Previous project"
            onClick={goPrev}
          >
            ‹
          </button>
          <button
            type="button"
            className="projects-nav-btn"
            aria-label="Next project"
            onClick={goNext}
          >
            ›
          </button>
        </div>
        <div
          ref={viewportRef}
          className="projects-viewport"
          tabIndex={0}
          role="region"
          aria-label="Projects carousel"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              goPrev();
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              goNext();
            }
          }}
        >
        <div ref={trackRef} className="projects-track">
          {PROJECTS.map((p, i) => (
            <article
              key={p.slug}
              className={`project-card project-slide glass-card ${p.featured ? 'project-card--hero' : ''} ${
                i === activeIndex ? 'project-card--active' : ''
              }`}
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
        <div className="projects-dots" role="tablist" aria-label="Project slides">
          {PROJECTS.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              className={`projects-dot ${i === activeIndex ? 'projects-dot--active' : ''}`}
              aria-label={`Go to ${p.title}`}
              aria-selected={i === activeIndex}
              role="tab"
              onClick={() => scrollToIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
