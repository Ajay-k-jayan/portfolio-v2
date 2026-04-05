import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useTimeGreeting } from '../hooks/useTimeGreeting';

const ROLES = [
  'Senior Software Engineer',
  'Angular Developer',
  'Frontend Developer',
  'JavaScript Enthusiast',
];

/** Add your file as `public/resume.pdf` (URL `/resume.pdf`). Change the path if you use another name. */
const RESUME_HREF = '/resume.pdf';

export function Hero() {
  const greeting = useTimeGreeting();
  const rootRef = useRef<HTMLElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const roleSkipIntro = useRef(true);
  const article = /^[aeiou]/i.test(ROLES[roleIndex]) ? 'an' : 'a';

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from(q('.hero-greet'), { opacity: 0, y: 28, duration: 0.85 }, 0)
        .from(q('.hero-name'), { opacity: 0, y: 40, duration: 1.05 }, 0.12)
        .from(q('.hero-role-wrap'), { opacity: 0, y: 24, duration: 0.8 }, 0.28)
        .from(q('.hero-actions a'), { opacity: 0, y: 20, duration: 0.7, stagger: 0.1 }, 0.42);
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      const el = roleRef.current;
      if (!el) return;
      gsap.to(el, {
        opacity: 0,
        y: -8,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => setRoleIndex((i) => (i + 1) % ROLES.length),
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = roleRef.current;
    if (!el) return;
    if (roleSkipIntro.current) {
      roleSkipIntro.current = false;
      return;
    }
    gsap.fromTo(
      el,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' },
    );
  }, [roleIndex]);

  return (
    <section ref={rootRef} id="hero" className="section hero-section">
      <div className="hero-inner">
        <p className="hero-greet font-body">{greeting}</p>
        <h1 className="hero-name clash gradient-text-animated">AJAY K J</h1>
        <div className="hero-role-wrap font-body">
          <span className="hero-role-label">I&apos;m {article} </span>
          <span ref={roleRef} className="hero-role">
            {ROLES[roleIndex]}
          </span>
        </div>
        <div className="hero-actions">
          <a className="btn btn-primary" href={RESUME_HREF} download>
            Download Resume
          </a>
          <a
            className="btn btn-ghost"
            href={RESUME_HREF}
            target="_blank"
            rel="noopener noreferrer"
          >
            Show Resume
          </a>
        </div>
      </div>
    </section>
  );
}
