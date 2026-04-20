import { useEffect, useRef, useState } from 'react';
import { cinematicReveal } from '../lib/cinematicMotion';
import { useReducedMotion } from '../hooks/useReducedMotion';

const PROJECTS = [
  {
    slug: 'aurex',
    title: 'AurexAI — GRC Platform',
    badge: 'Flagship',
    desc: 'Cloud enterprise governance, risk, and compliance: real-time risk management, audit automation, and analytics. Long-running Angular product at Beinex.',
    stack: 'Angular, RxJS, REST, WebSockets, Micro-frontends',
    demo: 'https://www.aurex.ai/',
    repo: 'https://github.com/Ajay-k-jayan',
    showGithub: false,
    primaryLabel: 'Live Site',
    featured: true,
  },
  {
    slug: 'inspect-ai',
    title: 'InspektAI',
    badge: 'AI Evaluation',
    desc: 'AI-powered used-car inspection platform with 300+ checks, smart health summaries, future repair-cost prediction, and negotiation insights before purchase.',
    stack: 'Next.js, Tailwind CSS, Swagger, Jira, REST API, Figma, Razorpay',
    demo: 'https://www.moto365.club/inspektai',
    repo: 'https://github.com/Ajay-k-jayan',
    showGithub: false,
    primaryLabel: 'Live Site',
    featured: false,
  },
  {
    slug: 'portfolio-v2',
    title: 'Portfolio v2',
    badge: 'Latest Repo',
    desc: 'Current-generation personal portfolio with cinematic motion and premium UI sections.',
    stack: 'React, TypeScript, GSAP, Vite',
    demo: 'https://github.com/Ajay-k-jayan/portfolio-v2',
    repo: 'https://github.com/Ajay-k-jayan/portfolio-v2',
    showGithub: false,
    primaryLabel: 'GitHub Project',
    featured: false,
  },
  {
    slug: 'portfolio',
    title: 'Portfolio',
    badge: 'Recent',
    desc: 'Previous portfolio version with foundational structure and personal showcase content.',
    stack: 'TypeScript, Frontend',
    demo: 'https://github.com/Ajay-k-jayan/portfolio',
    repo: 'https://github.com/Ajay-k-jayan/portfolio',
    showGithub: false,
    primaryLabel: 'GitHub Project',
    featured: false,
  },
  {
    slug: 'blood-bank-management',
    title: 'Blood Bank Management',
    badge: 'Academic Project',
    desc: 'Diploma final year project focused on managing blood bank records and workflows.',
    stack: 'Python',
    demo: 'https://github.com/Ajay-k-jayan/Blood-Bank-Management',
    repo: 'https://github.com/Ajay-k-jayan/Blood-Bank-Management',
    showGithub: false,
    primaryLabel: 'GitHub Project',
    featured: false,
  },
  {
    slug: 'alien-invasion-game',
    title: 'Alien Invasion Game',
    badge: 'Game',
    desc: 'Python arcade-style game project with gameplay loop and basic mechanics.',
    stack: 'Python',
    demo: 'https://github.com/Ajay-k-jayan/Alien-invasion-game',
    repo: 'https://github.com/Ajay-k-jayan/Alien-invasion-game',
    showGithub: false,
    primaryLabel: 'GitHub Project',
    featured: false,
  },
  {
    slug: 'time-management',
    title: 'Time Management',
    badge: 'Utility',
    desc: 'Python project focused on practical time planning and productivity-oriented workflow handling.',
    stack: 'Python',
    demo: 'https://github.com/Ajay-k-jayan/Time-Management',
    repo: 'https://github.com/Ajay-k-jayan/Time-Management',
    showGithub: false,
    primaryLabel: 'GitHub Project',
    featured: false,
  },
  {
    slug: 'pets-store-html-project',
    title: 'Pets Store HTML Project',
    badge: 'Frontend',
    desc: 'Static web project for a pet store experience with basic product and layout flows.',
    stack: 'HTML, CSS, JavaScript',
    demo: 'https://github.com/Ajay-k-jayan/pets-store-html-project',
    repo: 'https://github.com/Ajay-k-jayan/pets-store-html-project',
    showGithub: false,
    primaryLabel: 'GitHub Project',
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
  const openExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
              className={`project-card project-slide glass-card ${i === activeIndex ? 'project-card--active' : ''}`}
            >
              <h3 className="clash project-title">{p.title}</h3>
              <p className="font-body project-desc">{p.desc}</p>
              <p className="font-body project-stack">
                <strong>Stack:</strong> {p.stack}
              </p>
              <div className="project-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => openExternal(p.demo)}
                >
                  {p.primaryLabel ?? 'View / Demo'}
                </button>
                {p.showGithub !== false && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => openExternal(p.repo)}
                  >
                    GitHub
                  </button>
                )}
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
