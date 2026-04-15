import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './CustomCursor.css';

const LERP_OUTER = 0.15;
const LERP_TRAIL = [0.13, 0.1, 0.075] as const;

const INTERACTIVE_SELECTOR = [
  'a[href]',
  'button',
  '[role="button"]',
  'input',
  'textarea',
  'select',
  'summary',
  '.btn',
  '.side-dock-link',
  '.mobile-nav-toggle',
  '.mobile-drawer-link',
  '.mobile-drawer-close',
  '[data-cursor-hover]',
].join(',');

export function CustomCursor() {
  const reduced = useReducedMotion();
  const enabled =
    !reduced &&
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches;

  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const trail0 = useRef<HTMLDivElement>(null);
  const trail1 = useRef<HTMLDivElement>(null);
  const trail2 = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: -100, y: -100 });
  const outer = useRef({ x: -100, y: -100 });
  const trails = useRef([
    { x: -100, y: -100 },
    { x: -100, y: -100 },
    { x: -100, y: -100 },
  ]);
  const innerPulse = useRef(1);
  const outerPulse = useRef(1);
  const hoverRef = useRef(false);
  const seededRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('custom-cursor-on');
    return () => document.documentElement.classList.remove('custom-cursor-on');
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const root = rootRef.current;
    const setHoverClass = (on: boolean) => {
      if (on === hoverRef.current) return;
      hoverRef.current = on;
      root?.classList.toggle('is-hover', on);
    };

    const seedFrom = (cx: number, cy: number) => {
      if (seededRef.current) return;
      seededRef.current = true;
      mouse.current = { x: cx, y: cy };
      outer.current = { x: cx, y: cy };
      trails.current = trails.current.map(() => ({ x: cx, y: cy }));
    };

    const onMove = (e: MouseEvent) => {
      seedFrom(e.clientX, e.clientY);
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      root?.classList.add('is-visible');

      const t = e.target;
      if (t instanceof Element) {
        setHoverClass(!!t.closest(INTERACTIVE_SELECTOR));
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      setHoverClass(!!t.closest(INTERACTIVE_SELECTOR));
    };

    const onDown = () => {
      innerPulse.current = 0.5;
      outerPulse.current = 0.84;
    };

    const onLeave = () => {
      root?.classList.remove('is-visible');
    };

    const onBlur = () => {
      root?.classList.remove('is-visible');
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, true);
    window.addEventListener('mousedown', onDown, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    window.addEventListener('blur', onBlur);

    let raf = 0;
    const tick = () => {
      const mx = mouse.current.x;
      const my = mouse.current.y;

      const ox = outer.current.x + (mx - outer.current.x) * LERP_OUTER;
      const oy = outer.current.y + (my - outer.current.y) * LERP_OUTER;
      outer.current = { x: ox, y: oy };

      let px = ox;
      let py = oy;
      for (let i = 0; i < trails.current.length; i++) {
        const tr = trails.current[i];
        const k = LERP_TRAIL[i] ?? 0.07;
        tr.x += (px - tr.x) * k;
        tr.y += (py - tr.y) * k;
        px = tr.x;
        py = tr.y;
      }

      innerPulse.current += (1 - innerPulse.current) * 0.42;
      outerPulse.current += (1 - outerPulse.current) * 0.32;

      const ir = innerRef.current;
      const or = outerRef.current;
      if (ir) {
        ir.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%) scale(${innerPulse.current})`;
      }
      if (or) {
        or.style.transform = `translate3d(${ox}px,${oy}px,0) translate(-50%,-50%) scale(${outerPulse.current})`;
      }

      const trailEls = [trail0.current, trail1.current, trail2.current];
      for (let i = 0; i < trailEls.length; i++) {
        const el = trailEls[i];
        const tr = trails.current[i];
        if (el && tr) {
          const base = 0.12 + i * 0.07;
          el.style.opacity = String(base);
          el.style.transform = `translate3d(${tr.x}px,${tr.y}px,0) translate(-50%,-50%) scale(${0.85 + i * 0.05})`;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver, true);
      window.removeEventListener('mousedown', onDown);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('blur', onBlur);
      root?.classList.remove('is-visible', 'is-hover');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="custom-cursor" aria-hidden>
      <div ref={trail0} className="custom-cursor__trail" />
      <div ref={trail1} className="custom-cursor__trail" />
      <div ref={trail2} className="custom-cursor__trail" />
      <div ref={outerRef} className="custom-cursor__outer" />
      <div ref={innerRef} className="custom-cursor__inner" />
    </div>
  );
}
