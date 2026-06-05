import { useEffect, useRef } from 'react';
import './NotFound.css';

export function NotFound() {
  const countRef = useRef<HTMLSpanElement>(null);
  const glitchRef = useRef<HTMLDivElement>(null);

  // Glitch effect on the 404 number
  useEffect(() => {
    const el = glitchRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const glitch = () => {
      el.setAttribute('data-glitch', 'true');
      timer = setTimeout(() => {
        el.removeAttribute('data-glitch');
        timer = setTimeout(glitch, 2400 + Math.random() * 2000);
      }, 320);
    };
    timer = setTimeout(glitch, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Count-up animation: 0 → 404
  useEffect(() => {
    const el = countRef.current;
    if (!el) return;
    let frame = 0;
    let start: number | null = null;
    const DURATION = 900;
    const TARGET = 404;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(eased * TARGET));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="nf">
      {/* Background orbs */}
      <div className="nf__orb nf__orb--a" aria-hidden />
      <div className="nf__orb nf__orb--b" aria-hidden />

      {/* Scan-line overlay */}
      <div className="nf__scanlines" aria-hidden />

      {/* Grid */}
      <svg className="nf__grid" aria-hidden viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        {[100,200,300,400,500,600,700].map(x=>(
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="600" stroke="rgba(99,102,241,0.06)" strokeWidth="1"/>
        ))}
        {[100,200,300,400,500].map(y=>(
          <line key={`h${y}`} x1="0" y1={y} x2="800" y2={y} stroke="rgba(99,102,241,0.06)" strokeWidth="1"/>
        ))}
      </svg>

      <main className="nf__content" role="main">
        {/* 404 with glitch */}
        <div ref={glitchRef} className="nf__code" aria-label="404 — Page not found">
          <span className="nf__code-text" aria-hidden>
            <span ref={countRef}>0</span>
          </span>
          <span className="nf__code-ghost nf__code-ghost--a" aria-hidden>404</span>
          <span className="nf__code-ghost nf__code-ghost--b" aria-hidden>404</span>
        </div>

        {/* Divider line */}
        <div className="nf__divider" aria-hidden />

        <p className="nf__title">Page Not Found</p>
        <p className="nf__desc">
          Looks like this route doesn't exist in the codebase.
          <br />
          Let's navigate you back to a valid path.
        </p>

        {/* Terminal-style path */}
        <div className="nf__terminal" aria-hidden>
          <span className="nf__terminal-prompt">~/portfolio</span>
          <span className="nf__terminal-cmd"> cd <span className="nf__terminal-path">/home</span></span>
          <span className="nf__terminal-cursor" />
        </div>

        <a href="/" className="nf__btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to Portfolio
        </a>

        <div className="nf__links">
          <a href="/#about">About</a>
          <span aria-hidden>·</span>
          <a href="/#skills">Skills</a>
          <span aria-hidden>·</span>
          <a href="/#projects">Projects</a>
          <span aria-hidden>·</span>
          <a href="/#contact">Contact</a>
        </div>
      </main>
    </div>
  );
}
