import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTimeGreeting } from '../hooks/useTimeGreeting';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

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
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedRoleLine, setTypedRoleLine] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const article = /^[aeiou]/i.test(ROLES[roleIndex]) ? 'an' : 'a';
  const fullRoleLine = `I\u2019m ${article} ${ROLES[roleIndex]}`;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (reducedMotion) {
      gsap.set(gsap.utils.selector(root)('.hero-greet, .hero-name, .hero-role-wrap, .hero-actions a'), {
        clearProps: 'opacity,transform',
      });
      return;
    }

    let ctx: gsap.Context | null = null;
    const raf = requestAnimationFrame(() => {
      if (!rootRef.current) return;
      ctx = gsap.context(() => {
        const q = gsap.utils.selector(rootRef.current!);
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from(q('.hero-greet'), { opacity: 0, y: 28, duration: 0.85 }, 0)
          .from(q('.hero-name'), { opacity: 0, y: 52, scale: 0.9, duration: 1.2 }, 0.12)
          .from(q('.hero-role-wrap'), { opacity: 0, y: 24, duration: 0.8 }, 0.28)
          .from(q('.hero-actions a'), { opacity: 0, y: 20, duration: 0.7, stagger: 0.1 }, 0.42);

        gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: '+=72%',
            scrub: 1.35,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
          .to(
            q('.hero-name'),
            {
              scale: 1.9,
              y: -118,
              opacity: 0,
              filter: 'blur(4px)',
              transformOrigin: '50% 50%',
              ease: 'none',
            },
            0,
          )
          .to(
            q('.hero-greet, .hero-role-wrap, .hero-actions'),
            {
              opacity: 0,
              y: -28,
              ease: 'none',
            },
            0.08,
          )
          .to(
            rootRef.current,
            {
              autoAlpha: 0,
              ease: 'none',
            },
            0.55,
          );
      }, rootRef.current);
    });

    return () => {
      cancelAnimationFrame(raf);
      ctx?.revert();
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      setTypedRoleLine(fullRoleLine);
      const id = window.setInterval(() => {
        setRoleIndex((i) => (i + 1) % ROLES.length);
      }, 2500);
      return () => clearInterval(id);
    }

    const isFinishedTyping = !isDeleting && typedRoleLine === fullRoleLine;
    const isFinishedDeleting = isDeleting && typedRoleLine.length === 0;

    if (isFinishedDeleting) {
      setIsDeleting(false);
      setRoleIndex((i) => (i + 1) % ROLES.length);
      return;
    }

    const timeout = window.setTimeout(
      () => {
        if (isFinishedTyping) {
          setIsDeleting(true);
          return;
        }
        setTypedRoleLine((prev) =>
          isDeleting ? prev.slice(0, -1) : fullRoleLine.slice(0, prev.length + 1),
        );
      },
      isFinishedTyping ? 1300 : isDeleting ? 55 : 95,
    );

    return () => clearTimeout(timeout);
  }, [fullRoleLine, isDeleting, reducedMotion, roleIndex, typedRoleLine]);

  return (
    <section ref={rootRef} id="hero" className="section hero-section">
      <div className="hero-inner">
        <p className="hero-greet font-body">{greeting}</p>
        <h1 className="hero-name clash gradient-text-animated">AJAY K J</h1>
        <div className="hero-role-wrap font-body">
          <span className="hero-role" aria-live="polite">
            {typedRoleLine}
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
