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
  const lineGlowRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return () => {};
    return cinematicReveal(root, '[data-cinematic]', reducedMotion, {
      stagger: 0.12,
      rotateX: 10,
      y: 34,
      start: 'top 88%',
    });
  }, [reducedMotion]);

  useEffect(() => {
    const root = rootRef.current;
    const track = timelineTrackRef.current;
    const lineRail = lineRailRef.current;
    const lineFill = lineFillRef.current;
    const lineGlow = lineGlowRef.current;
    if (!root || !track || !lineRail || !lineFill || !lineGlow) return;
    const trackEl = track;

    const rows = root.querySelectorAll<HTMLElement>('.timeline-row');
    const detailsEls = root.querySelectorAll<HTMLDetailsElement>('.timeline-card-details');
    const nodes = root.querySelectorAll<HTMLElement>('.timeline-node');

    let lineTopPx = 0;
    let lineHeightPx = 1;
    let nodeCenters: number[] = [];
    let rowSwitchBoundaries: number[] = [];
    let rafRefreshId: number | null = null;
    const getTopRelativeToTrack = (node: HTMLElement) => {
      let top = 0;
      let current: HTMLElement | null = node;
      while (current && current !== trackEl) {
        top += current.offsetTop;
        current = current.offsetParent as HTMLElement | null;
      }
      return top;
    };
    const getNodeCenterInTrack = (node: HTMLElement) => {
      const top = getTopRelativeToTrack(node);
      return top + node.offsetHeight / 2;
    };

    const setRowStates = (activeIndex: number, glowY: number) => {
      rows.forEach((row, i) => {
        row.classList.toggle('timeline-row--active', i === activeIndex);
        row.classList.toggle('timeline-row--passed', i < activeIndex);
        row.classList.toggle('timeline-row--upcoming', i > activeIndex);

        const nodeY = nodeCenters[i] ?? glowY;
        const distance = Math.abs(glowY - nodeY);
        const emphasis = gsap.utils.clamp(0, 1, 1 - distance / 230);
        row.style.setProperty('--row-emphasis', emphasis.toFixed(4));
      });
    };

    const buildSwitchBoundaries = () => {
      if (nodeCenters.length < 2) {
        rowSwitchBoundaries = [];
        return;
      }
      rowSwitchBoundaries = [];
      for (let i = 0; i < nodeCenters.length - 1; i += 1) {
        rowSwitchBoundaries.push((nodeCenters[i] + nodeCenters[i + 1]) / 2);
      }
    };

    const getActiveIndexFromGlow = (glowY: number) => {
      if (!nodeCenters.length) return 0;
      if (!rowSwitchBoundaries.length) return 0;
      for (let i = 0; i < rowSwitchBoundaries.length; i += 1) {
        if (glowY < rowSwitchBoundaries[i]) return i;
      }
      return rowSwitchBoundaries.length;
    };

    if (reducedMotion) {
      nodeCenters = Array.from(nodes, (node) => getNodeCenterInTrack(node));
      buildSwitchBoundaries();
      lineTopPx = nodeCenters[0] ?? 0;
      lineHeightPx = Math.max(1, (nodeCenters[nodeCenters.length - 1] ?? 1) - lineTopPx);
      gsap.set(lineFill, { scaleY: 1, transformOrigin: 'top center' });
      gsap.set(lineGlow, { top: '100%' });
      root.style.setProperty('--timeline-progress', '1');
      root.style.setProperty('--timeline-glow-y', `${lineTopPx + lineHeightPx}px`);
      setRowStates(Math.max(0, rows.length - 1), lineTopPx + lineHeightPx);
      return () => {};
    }

    const syncLineToNodes = () => {
      if (nodes.length < 2) {
        gsap.set(lineRail, { top: 0, height: Math.max(0, trackEl.scrollHeight) });
        return;
      }

      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];
      const firstCenter = getNodeCenterInTrack(firstNode);
      const lastCenter = getNodeCenterInTrack(lastNode);
      const lineTop = Math.max(0, firstCenter);
      const lineEnd = Math.min(trackEl.scrollHeight, lastCenter);
      const measured = lineEnd - lineTop;
      const lineHeight = measured > 10 ? measured : Math.max(0, trackEl.scrollHeight - lineTop);

      nodeCenters = Array.from(nodes, (node) => getNodeCenterInTrack(node));
      buildSwitchBoundaries();
      lineTopPx = lineTop;
      lineHeightPx = Math.max(1, lineHeight);
      gsap.set(lineRail, { top: lineTopPx, height: lineHeightPx });
    };

    const scheduleRefresh = () => {
      if (rafRefreshId !== null) return;
      rafRefreshId = window.requestAnimationFrame(() => {
        rafRefreshId = null;
        syncLineToNodes();
        ScrollTrigger.refresh();
      });
    };

    let resizeObserver: ResizeObserver | null = null;

    const ctx = gsap.context(() => {
      gsap.set(lineFill, { scaleY: 0, transformOrigin: 'top center' });
      gsap.set(lineGlow, { top: '0%' });
      syncLineToNodes();

      ScrollTrigger.create({
        trigger: trackEl,
        start: 'top 82%',
        end: 'bottom 24%',
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const progress = gsap.utils.clamp(0, 1, self.progress);
          const glowY = lineTopPx + lineHeightPx * progress;
          gsap.set(lineFill, { scaleY: progress, transformOrigin: 'top center' });
          gsap.set(lineGlow, { top: `${progress * 100}%` });
          root.style.setProperty('--timeline-progress', progress.toFixed(4));
          root.style.setProperty('--timeline-glow-y', `${glowY}px`);

          const activeIndex = getActiveIndexFromGlow(glowY);
          setRowStates(activeIndex, glowY);
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

      nodes.forEach((node) => {
        gsap.fromTo(
          node,
          { scale: 0.72, opacity: 0.65 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: node,
              start: 'top 84%',
              end: 'top 62%',
              scrub: 0.6,
            },
          },
        );
      });

      detailsEls.forEach((detailsEl) => {
        detailsEl.addEventListener('toggle', scheduleRefresh);
      });
      ScrollTrigger.addEventListener('refreshInit', syncLineToNodes);
      window.addEventListener('resize', scheduleRefresh);
      resizeObserver = new ResizeObserver(() => {
        scheduleRefresh();
      });
      resizeObserver.observe(trackEl);
      rows.forEach((row) => resizeObserver?.observe(row));
      detailsEls.forEach((detailsEl) => resizeObserver?.observe(detailsEl));

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
        detailsEl.removeEventListener('toggle', scheduleRefresh);
      });
      ScrollTrigger.removeEventListener('refreshInit', syncLineToNodes);
      window.removeEventListener('resize', scheduleRefresh);
      resizeObserver?.disconnect();
      if (rafRefreshId !== null) {
        window.cancelAnimationFrame(rafRefreshId);
      }
      rows.forEach((row) => row.style.removeProperty('--row-emphasis'));
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      id="experience"
      aria-label="Experience Timeline"
      className="section content-section experience-section cinematic-scene"
    >
      <h2 className="section-title clash" data-cinematic>
        Experience
      </h2>
      <p className="section-lead font-body" data-cinematic>
        Career timeline - roles, responsibilities, and impact across teams and products.
      </p>
      <div className="timeline">
        <div ref={timelineTrackRef} className="timeline-track">
          <div className="timeline-intensity" aria-hidden />
          <div ref={lineRailRef} className="timeline-line" aria-hidden>
            <div ref={lineFillRef} className="timeline-line-fill" />
            <span ref={lineGlowRef} className="timeline-line-glow" />
          </div>
          <ul className="timeline-list">
            {ROLES.map((job, i) => (
              <li
                key={`${job.range}-${job.title}`}
                className={`timeline-row ${i % 2 === 0 ? 'timeline-row--left' : 'timeline-row--right'}`}
                data-timeline-row
              >
                <div className="timeline-node" aria-hidden>
                  <span className="timeline-node-ring" />
                </div>
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
