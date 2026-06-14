import { useEffect, useRef, useState } from 'react';
import './PageLoader.css';

type Props = { onDone: () => void };

const RADIUS     = 110;
const CIRCUMF    = 2 * Math.PI * RADIUS;
const DURATION   = 2000; // ms for arc to fill

export function PageLoader({ onDone }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0–1
  const [burst,    setBurst]    = useState(false);

  useEffect(() => {
    let raf = 0;
    let start: number | null = null;

    const tick = (ts: number) => {
      if (!start) start = ts;
      const raw    = Math.min((ts - start) / DURATION, 1);
      const eased  = raw < 0.5
        ? 2 * raw * raw
        : 1 - Math.pow(-2 * raw + 2, 2) / 2; // ease-in-out-quad
      setProgress(eased);

      if (raw < 1) { raf = requestAnimationFrame(tick); return; }

      // Arc complete → burst ring outward, then exit
      setBurst(true);
      setTimeout(() => {
        const el = rootRef.current;
        if (!el) { onDone(); return; }
        el.classList.add('loader--exit');
        const end = () => onDone();
        el.addEventListener('transitionend', end, { once: true });
        setTimeout(end, 600); // safety fallback
      }, 380);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  const offset   = CIRCUMF * (1 - progress);
  const pct      = Math.round(progress * 100);
  // Leading-dot angle in degrees (starts at top = -90deg)
  const dotAngle = progress * 360 - 90;
  const dotRad   = dotAngle * (Math.PI / 180);
  const dotX     = 130 + RADIUS * Math.cos(dotRad);
  const dotY     = 130 + RADIUS * Math.sin(dotRad);

  return (
    <div ref={rootRef} className="loader" aria-label="Loading" aria-live="polite">
      <div className="loader__bg" aria-hidden />

      <div className="loader__stage">
        {/* Ring */}
        <div className={`loader__ring-wrap${burst ? ' loader__ring-wrap--burst' : ''}`}>
          <svg
            className="loader__ring-svg"
            viewBox="0 0 260 260"
            aria-hidden
          >
            <defs>
              <linearGradient id="ld-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#6366f1" />
                <stop offset="60%"  stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
              <filter id="ld-glow">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Track */}
            <circle
              cx="130" cy="130" r={RADIUS}
              fill="none"
              stroke="rgba(99,102,241,0.12)"
              strokeWidth="2"
            />

            {/* Filled arc */}
            <circle
              cx="130" cy="130" r={RADIUS}
              fill="none"
              stroke="url(#ld-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={CIRCUMF}
              strokeDashoffset={offset}
              transform="rotate(-90 130 130)"
              filter="url(#ld-glow)"
            />

            {/* Leading dot */}
            {progress > 0.01 && (
              <circle
                cx={dotX} cy={dotY} r="4"
                fill="#c4b5fd"
                filter="url(#ld-glow)"
              />
            )}
          </svg>

          {/* Center content */}
          <div className="loader__center">
            <div className="loader__name" aria-hidden="true">
              AJ
            </div>
            <p
              className="loader__pct"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {pct}
            </p>
          </div>
        </div>

        {/* Full name below ring */}
        <div
          className="loader__fullname"
          style={{ opacity: progress > 0.15 ? Math.min((progress - 0.15) / 0.25, 1) : 0 }}
        >
          AJAY K J
        </div>
      </div>
    </div>
  );
}
