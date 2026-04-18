import { useEffect, useMemo, useRef } from 'react';
import { cinematicReveal } from '../lib/cinematicMotion';
import type { CertProviderId } from '../data/certProviderAssets';
import { CERT_PROVIDER_LOGO } from '../data/certProviderAssets';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { SectionHeader } from '../components/SectionHeader';
import { CertBento } from '../components/CertBento';

type CertItem = {
  org: string;
  name: string;
  provider: CertProviderId;
  /** Optional logo URL (e.g. React for a LetsUpgrade bootcamp) */
  logoUrl?: string | null;
};

const ITEMS: CertItem[] = [
  { org: 'Meta', name: 'Programming with JavaScript', provider: 'meta' },
  { org: 'Meta', name: 'Version Control', provider: 'meta' },
  { org: 'Meta', name: 'Introduction to Front-End Development', provider: 'meta' },
  { org: 'Google', name: 'Modern JavaScript: ES6 Basics', provider: 'google' },
  {
    org: 'LetsUpgrade',
    name: 'React.js Essentials Bootcamp',
    provider: 'letsupgrade',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
  },
  { org: 'Coursera', name: 'Regular Expressions in Python', provider: 'coursera' },
  { org: 'Coursera', name: 'Get Started with Figma', provider: 'coursera' },
  { org: 'DeepLearning.AI', name: 'AI For Everyone', provider: 'deeplearning' },
  { org: 'AWS', name: 'AWS Fundamentals', provider: 'aws' },
  { org: 'University of Michigan', name: 'Programming for Everybody (Python)', provider: 'michigan' },
];

export function Certifications() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const certItems = useMemo(
    () =>
      ITEMS.map((c) => ({
        org: c.org,
        name: c.name,
        logoUrl: c.logoUrl !== undefined ? c.logoUrl : CERT_PROVIDER_LOGO[c.provider],
      })),
    [],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return () => {};
    return cinematicReveal(root, '[data-cinematic]', reducedMotion, {
      stagger: 0.1,
      rotateX: 10,
      y: 40,
      start: 'top 86%',
    });
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      id="certificates"
      className="section content-section certs-section cinematic-scene cinematic-scene--perspective"
    >
      <div className="certs-shell">
        <SectionHeader
          title="Certifications"
          lead="Provider logos match where these were issued — verify anytime on each platform."
        />
        <CertBento items={certItems} />
      </div>
    </section>
  );
}
