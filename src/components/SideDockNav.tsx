import { useEffect, useRef, useState, type FC, type MouseEvent } from 'react';
import { getLenis } from '../lib/initLenisScroll';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Item = {
  id: string;
  label: string;
};

/** Hero uses "Home"; every other label matches that section's on-page heading (h2). */
const NAV: Item[] = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'certificates', label: 'Certifications' },
  { id: 'recommendations', label: 'Recommendations' },
  { id: 'contact', label: 'Contact' },
];

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" strokeLinejoin="round" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20.5c.5-4 3.5-6 6.5-6s6 2 6.5 6" strokeLinecap="round" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="m12 4 8 4-8 4-8-4 8-4Z" strokeLinejoin="round" />
      <path d="m4 12 8 4 8-4M4 16l8 4 8-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBriefcase() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3.5" y="7.5" width="17" height="12" rx="1.5" />
      <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="4" y="4" width="7" height="7" rx="1.2" />
      <rect x="13" y="4" width="7" height="7" rx="1.2" />
      <rect x="4" y="13" width="7" height="7" rx="1.2" />
      <rect x="13" y="13" width="7" height="7" rx="1.2" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path
        d="M12 3.5 14.2 9l5.8.4-4.5 3.8 1.4 5.6L12 16.9 6.1 18.8l1.4-5.6L3 9.4 8.8 9 12 3.5Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCertificate() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M8 4.5h8a2 2 0 0 1 2 2v10l-3-2-3 2v-2H8a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
      <path d="M10 9h4M10 12h4" strokeLinecap="round" />
    </svg>
  );
}

function IconQuote() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path
        d="M6.5 8.5c0-2.2 1.8-4 4-4v3c-.8 0-1.5.7-1.5 1.5V14H5v-4a1.5 1.5 0 0 1 1.5-1.5Z"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 8.5c0-2.2 1.8-4 4-4v3c-.8 0-1.5.7-1.5 1.5V14H13v-4a1.5 1.5 0 0 1 1.5-1.5Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4 7 8 5 8-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ICONS: Record<string, FC> = {
  hero: IconHome,
  about: IconUser,
  skills: IconLayers,
  experience: IconBriefcase,
  projects: IconGrid,
  achievements: IconStar,
  certificates: IconCertificate,
  recommendations: IconQuote,
  contact: IconMail,
};

const TOOLTIP_MIN_LEFT_SPACE = 168;

function pickActiveSection(): string {
  const vh = window.innerHeight;
  const line = vh * 0.42;
  let bestId = NAV[0].id;
  let bestDist = Number.POSITIVE_INFINITY;

  for (const item of NAV) {
    const el = document.getElementById(item.id);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (r.bottom < 72 || r.top > vh - 48) continue;
    const anchor = r.top + Math.min(r.height * 0.35, 160);
    const dist = Math.abs(anchor - line);
    if (dist < bestDist) {
      bestDist = dist;
      bestId = item.id;
    }
  }
  return bestId;
}

/**
 * Fixed right icon rail: sliding scroll indicator + tooltips (flip left/right by space).
 */
export function SideDockNav() {
  const dockRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [tooltipsRight, setTooltipsRight] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeIndex = NAV.findIndex((n) => n.id === active);

  useEffect(() => {
    const tick = () => setActive(pickActiveSection());
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick, { passive: true });
    return () => {
      window.removeEventListener('scroll', tick);
      window.removeEventListener('resize', tick);
    };
  }, []);

  useEffect(() => {
    const el = dockRef.current;
    if (!el) return;
    const measure = () => {
      const left = el.getBoundingClientRect().left;
      setTooltipsRight(left < TOOLTIP_MIN_LEFT_SPACE);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('scroll', measure, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
    };
  }, []);

  const handleNav = (id: string) => {
    const lenis = getLenis();
    if (id === 'hero') {
      if (lenis) {
        lenis.scrollTo(0, { offset: 0, immediate: false });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    } else {
      const el = document.getElementById(id);
      if (!el) return;
      if (lenis) {
        lenis.scrollTo(el, { offset: 0, immediate: false });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    requestAnimationFrame(() => ScrollTrigger.refresh());
    setActive(id);
    setMobileOpen(false);
  };

  const handleLinkClick = (id: string, e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    handleNav(id);
  };
  const toggleMobile = () => setMobileOpen((v) => !v);
  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Desktop/right rail (also present on tablet; mobile drawer provides alternative) */}
      <nav
        ref={dockRef}
        className={`side-dock font-body${tooltipsRight ? ' side-dock--tooltips-right' : ''}`}
        aria-label="Section navigation"
      >
        <div
          className="side-dock-shell"
          style={{ ['--active-index' as string]: Math.max(activeIndex, 0) }}
        >
          <span className={`side-dock-indicator ${activeIndex < 0 ? 'side-dock-indicator--hidden' : ''}`} aria-hidden />
          <ul className="side-dock-list">
            {NAV.map((item) => {
              const Icon = ICONS[item.id];
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href="#"
                    className={`side-dock-link ${isActive ? 'side-dock-link--active' : ''}`}
                    data-tooltip={item.label}
                    aria-label={item.label}
                    aria-current={isActive ? 'location' : undefined}
                    onClick={(e) => handleLinkClick(item.id, e)}
                  >
                    {Icon ? <Icon /> : null}
                    <span className="side-dock-text">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile hamburger toggle */}
      <button
        type="button"
        className={`mobile-nav-toggle font-body${mobileOpen ? ' is-open' : ''}`}
        aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-controls="mobile-drawer"
        aria-expanded={mobileOpen}
        onClick={toggleMobile}
      >
        <span className="mobile-nav-toggle-bar" aria-hidden />
        <span className="mobile-nav-toggle-bar" aria-hidden />
        <span className="mobile-nav-toggle-bar" aria-hidden />
      </button>

      {/* Backdrop */}
      <div
        className={`mobile-drawer-backdrop${mobileOpen ? ' is-open' : ''}`}
        onClick={closeMobile}
        aria-hidden
      />

      {/* Mobile drawer */}
      <nav
        id="mobile-drawer"
        className={`mobile-drawer font-body${mobileOpen ? ' is-open' : ''}`}
        aria-label="Mobile navigation"
      >
        <div className="mobile-drawer-header">
          <h2 className="mobile-drawer-title clash">Menu</h2>
          <button
            type="button"
            className="mobile-drawer-close"
            aria-label="Close menu"
            onClick={closeMobile}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
              <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <ul className="mobile-drawer-list">
          {NAV.map((item) => {
            const Icon = ICONS[item.id];
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href="#"
                  className={`mobile-drawer-link ${isActive ? 'mobile-drawer-link--active' : ''}`}
                  onClick={(e) => handleLinkClick(item.id, e)}
                >
                  {Icon ? <Icon /> : null}
                  <span className="mobile-drawer-text">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
