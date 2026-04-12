import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { cinematicReveal, fadeUpOnScroll } from '../lib/cinematicMotion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './contactShowcase.css';

const PHONE_DISPLAY = '+91 8289917044';
const PHONE_COPY = '+918289917044';
const MAIL_DISPLAY = 'ajaykj2000@gmail.com';
const MAIL_HREF = 'mailto:ajaykj2000@gmail.com';

const SOCIAL_ROWS = [
  { id: 'wa', label: 'WhatsApp', href: 'https://wa.me/918289917044', brand: 'wa' as const },
  { id: 'ig', label: 'Instagram', href: 'https://www.instagram.com/ajaykj2000', brand: 'ig' as const },
  { id: 'tw', label: 'Twitter / X', href: 'https://x.com/Ajay_k_Jayan', brand: 'tw' as const },
  { id: 'gh', label: 'GitHub', href: 'https://github.com/Ajay-k-jayan', brand: 'gh' as const },
  { id: 'in', label: 'LinkedIn', href: 'https://www.linkedin.com/in/ajay-k-jayan', brand: 'in' as const },
] as const;

type ChipBrand = 'phone' | 'mail' | (typeof SOCIAL_ROWS)[number]['brand'];

type ContactRow = {
  id: string;
  brand: ChipBrand;
  href: string;
  ariaLabel: string;
  tooltip: string;
};

const CONTACT_ROWS: ContactRow[] = [
  {
    id: 'phone',
    brand: 'phone',
    href: `tel:${PHONE_COPY}`,
    ariaLabel: `Call ${PHONE_DISPLAY}`,
    tooltip: PHONE_DISPLAY,
  },
  {
    id: 'mail',
    brand: 'mail',
    href: MAIL_HREF,
    ariaLabel: `Email ${MAIL_DISPLAY}`,
    tooltip: MAIL_DISPLAY,
  },
  ...SOCIAL_ROWS.map((s) => ({
    id: s.id,
    brand: s.brand,
    href: s.href,
    ariaLabel: `${s.label} (opens in new tab)`,
    tooltip: s.label,
  })),
];

function ChipIcon({ brand }: { brand: ChipBrand }) {
  const stroke = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none' as const, stroke: 'currentColor', strokeWidth: 1.75, 'aria-hidden': true as const };
  const fill = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true as const };

  switch (brand) {
    case 'phone':
      return (
        <svg {...stroke}>
          <path
            d="M15.6 14.5 20 18.9a2 2 0 0 1 0 2.8l-.6.6a16 16 0 0 1-22.6 0 16 16 0 0 1 0-22.6l.6-.6a2 2 0 0 1 2.8 0l4.4 4.4a2 2 0 0 1 0 2.8l-1.2 1.2a12 12 0 0 0 5.1 5.1l1.2-1.2a2 2 0 0 1 2.8 0Z"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'mail':
      return (
        <svg {...stroke}>
          <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
          <path d="m4 7 8 5 8-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'wa':
      return (
        <svg {...fill}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      );
    case 'ig':
      return (
        <svg {...fill}>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case 'tw':
      return (
        <svg {...fill}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'gh':
      return (
        <svg {...fill}>
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );
    case 'in':
      return (
        <svg {...fill}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    default:
      return null;
  }
}

export function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const formspreeId = (import.meta as any)?.env?.VITE_FORMSPREE_ID as string | undefined;
  const endpoint = formspreeId ? `https://formspree.io/f/${formspreeId}` : undefined;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return () => {};
    return cinematicReveal(root, '[data-cinematic]', reducedMotion, {
      stagger: 0.1,
      rotateX: 10,
      y: 48,
      start: 'top 86%',
    });
  }, [reducedMotion]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return fadeUpOnScroll(root, '.contact-fade-up', reducedMotion, {
      y: 56,
      stagger: 0.14,
      duration: 1.02,
      start: 'top 84%',
    });
  }, [reducedMotion]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const panel = root.querySelector<HTMLElement>('.contact-panel-wrap--full');
    if (!panel) return;
    return fadeUpOnScroll(panel, '.contact-fade-up-inner', reducedMotion, {
      y: 44,
      stagger: 0.12,
      duration: 0.9,
      start: 'top 92%',
    });
  }, [reducedMotion]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // Per-row links animation for stronger feedback
    return fadeUpOnScroll(root, '.contact-link-row', reducedMotion, {
      y: 28,
      stagger: 0.08,
      duration: 0.7,
      start: 'top 88%',
      delay: 0.05,
    });
  }, [reducedMotion]);

  useEffect(() => {
    if (!sent) return;
    const el = successRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 12, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.7)' },
    );
  }, [sent]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot check (basic spam mitigation)
    if ((data.get('website') as string) || (data.get('_gotcha') as string)) {
      setSent(true);
      form.reset();
      return;
    }

    // Prefer a static form backend (Formspree). If not configured, fallback to mailto.
    if (!endpoint) {
      const name = encodeURIComponent(String(data.get('name') || ''));
      const email = encodeURIComponent(String(data.get('email') || ''));
      const message = encodeURIComponent(String(data.get('message') || ''));
      const subject = encodeURIComponent('Portfolio contact');
      // Compose a mailto fallback that the user can send manually
      window.location.href = `mailto:${MAIL_DISPLAY}?subject=${subject}&body=From:%20${name}%20(%20${email}%20)%0A%0A${message}`;
      setSent(true);
      form.reset();
      return;
    }

    try {
      setSending(true);
      const payload = {
        name: String(data.get('name') || ''),
        email: String(data.get('email') || ''),
        message: String(data.get('message') || ''),
        _subject: 'Portfolio contact',
      };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Send failed (${res.status})`);
      }
      setSent(true);
      form.reset();
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      ref={rootRef}
      id="contact"
      className="section content-section contact-section cinematic-scene"
    >
      <div className="contact-atmosphere" aria-hidden>
        <span className="contact-atmosphere__orb contact-atmosphere__orb--a" />
        <span className="contact-atmosphere__orb contact-atmosphere__orb--b" />
        <span className="contact-atmosphere__grid" />
      </div>

      <div className="contact-layout">
        <div className="contact-intro">
          <div className="contact-intro__header contact-fade-up wow-tilt wow-reverse" data-cinematic>
            <h2 className="section-title clash">Contact</h2>
            <p className="section-lead font-body">
              Based in Kerala, India. Open to frontend roles, architecture discussions, and
              Angular-first product work — tell me what you&apos;re building.
            </p>
          </div>

          <div className="contact-intro__connect contact-fade-up">
            <div className="contact-links">
              <ul className="contact-links__grid contact-fade-up wow-tilt wow-reverse">
                {CONTACT_ROWS.map((row) => {
                  const openInNewTab = row.href.startsWith('http');
                  return (
                    <li key={row.id} className="contact-link-row">
                      <a
                        href={row.href}
                        className={`contact-link-icon contact-link-icon--${row.brand}`}
                        data-tooltip={row.tooltip}
                        aria-label={row.ariaLabel}
                        {...(openInNewTab
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        <ChipIcon brand={row.brand} />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="contact-panel-wrap contact-panel-wrap--form contact-panel-wrap--full contact-fade-up wow-tilt wow-reverse">
          <aside className="contact-panel contact-panel--form-wide" aria-label="Contact form">
            <div className="contact-form-wide__ribbon" aria-hidden />
            <div className="contact-form-wide__inner">
              <div className="contact-form-wide__head contact-fade-up-inner">
                <div>
                  <p className="contact-form-wide__label font-body">Inbox</p>
                  <p className="contact-form-wide__title clash">Send a message</p>
                </div>
                <p className="contact-form-wide__hint font-body muted">
                  Brief intro or project context — I usually reply within a couple of business days.
                </p>
              </div>

              <form className="contact-form contact-form--wide contact-fade-up-inner" onSubmit={onSubmit}>
                {/* Honeypots: real users won't fill these */}
                <input className="visually-hidden" tabIndex={-1} autoComplete="off" name="_gotcha" type="text" />
                <label className="visually-hidden">
                  <span>Website</span>
                  <input name="website" type="text" autoComplete="off" />
                </label>
                <label className="field field--wide">
                  <span className="font-body">Name</span>
                  <input name="name" type="text" autoComplete="name" required placeholder="Your name" />
                </label>
                <label className="field field--wide">
                  <span className="font-body">Email</span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                  />
                </label>
                <label className="field field--wide field--full">
                  <span className="font-body">Message</span>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    placeholder="Project, role, or question — a few lines is enough"
                  />
                </label>
                <button type="submit" className="btn btn-primary btn-send contact-send-btn contact-send-btn--wide" disabled={sending}>
                  <span>{sending ? 'Sending…' : 'Send message'}</span>
                  <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>

              {error && (
                <div className="contact-success contact-success--wide font-body" role="alert">
                  {error}
                </div>
              )}

              {sent && (
                <div ref={successRef} className="contact-success contact-success--wide font-body" role="status">
                  Thanks — your message has been sent.
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
