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
  certUrl?: string;
};

const LINKEDIN_CERT_URL = 'https://www.linkedin.com/in/ajay-k-jayan/';

function normalizeCertUrl(rawUrl?: string): string {
  if (!rawUrl) return LINKEDIN_CERT_URL;

  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.toLowerCase();

    if (host.includes('skilljar.com')) {
      const next = parsed.searchParams.get('next');
      if (next) {
        const match = decodeURIComponent(next).match(/\/c\/([A-Za-z0-9]+)/);
        if (match?.[1]) {
          return `https://verify.skilljar.com/c/${match[1]}`;
        }
      }
    }
  } catch {
    // Keep original URL when parsing fails.
  }

  return rawUrl;
}

const ITEMS: CertItem[] = [
  {
    org: 'Meta',
    name: 'Programming with JavaScript',
    provider: 'meta',
    certUrl: 'https://www.coursera.org/account/accomplishments/certificate/7CHPEWSYGXD9',
  },
  {
    org: 'Meta',
    name: 'Version Control',
    provider: 'meta',
    certUrl: 'https://www.coursera.org/account/accomplishments/certificate/2GZUY2SUXAVB',
  },
  {
    org: 'Meta',
    name: 'Introduction to Front-End Development',
    provider: 'meta',
    certUrl: 'https://www.coursera.org/account/accomplishments/certificate/8DVW7S7CAFMH',
  },
  {
    org: 'Coursera',
    name: 'Modern JavaScript: ES6 Basics',
    provider: 'coursera',
    certUrl: 'https://coursera.org/share/e6eeaf6c1b164db0eea5ab20f68680b9',
  },
  {
    org: 'LetsUpgrade',
    name: 'React.js Essentials Bootcamp',
    provider: 'letsupgrade',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
    certUrl: 'https://verify.letsupgrade.in/certificate/LUERJSJUN123217',
  },
  {
    org: 'Coursera',
    name: 'Regular Expressions in Python',
    provider: 'coursera',
    certUrl: 'https://www.coursera.org/account/accomplishments/certificate/PJJXDR63PLZZ',
  },
  {
    org: 'Coursera',
    name: 'Get Started with Figma',
    provider: 'coursera',
    certUrl: 'https://www.coursera.org/account/accomplishments/certificate/TM6KQS57MASK',
  },
  {
    org: 'DeepLearning.AI',
    name: 'AI For Everyone',
    provider: 'deeplearning',
    certUrl: 'https://www.coursera.org/account/accomplishments/certificate/27YGB49FSF6Q',
  },
  {
    org: 'AWS',
    name: 'AWS Fundamentals: Going Cloud-Native',
    provider: 'aws',
    certUrl: 'https://www.coursera.org/account/accomplishments/certificate/9KLJZPV5CWY6',
  },
  {
    org: 'Coursera',
    name: 'Programming for Everybody (Getting Started with Python)',
    provider: 'michigan',
    certUrl: 'https://www.coursera.org/account/accomplishments/certificate/V6RS8KL44Q5B',
  },
  {
    org: 'Anthropic',
    name: 'AI Fluency: Framework & Foundations',
    provider: 'anthropic',
    certUrl: 'https://verify.skilljar.com/c/ykakzz7ivwtr',
  },
  {
    org: 'Anthropic',
    name: 'AI Capabilities and Limitations',
    provider: 'anthropic',
    certUrl: 'https://verify.skilljar.com/c/hobrx8z5zn7k',
  },
  {
    org: 'Anthropic',
    name: 'AI Fluency for educators',
    provider: 'anthropic',
    certUrl: 'https://verify.skilljar.com/c/j6hz6zcbgty3',
  },
  {
    org: 'Anthropic',
    name: 'AI Fluency for nonprofits',
    provider: 'anthropic',
    certUrl: 'https://verify.skilljar.com/c/toms4xkgh9a7',
  },
  {
    org: 'Anthropic',
    name: 'AI Fluency for students',
    provider: 'anthropic',
    certUrl: 'https://verify.skilljar.com/c/e7nhd57xtson',
  },
  {
    org: 'Anthropic',
    name: 'Teaching AI Fluency',
    provider: 'anthropic',
    certUrl: 'https://verify.skilljar.com/c/jpa3443fmrhn',
  },
  {
    org: 'Anthropic',
    name: 'Claude 101',
    provider: 'anthropic',
    certUrl: 'https://verify.skilljar.com/c/j7jfnvgs94aj',
  },
  {
    org: 'Anthropic',
    name: 'Building with the Claude API',
    provider: 'anthropic',
    certUrl: 'https://verify.skilljar.com/c/yy6bgip3fjiw',
  },
  {
    org: 'Anthropic',
    name: 'Introduction to Claude Cowork',
    provider: 'anthropic',
    certUrl: 'https://verify.skilljar.com/c/p3586pqen568',
  },
  {
    org: 'Anthropic',
    name: 'Claude Code 101',
    provider: 'anthropic',
    certUrl: 'https://verify.skilljar.com/c/8byo99i49kbs',
  },
  {
    org: 'Anthropic',
    name: 'Claude Code in Action',
    provider: 'anthropic',
    certUrl: 'https://verify.skilljar.com/c/54mbn24tbipy',
  },
  {
    org: 'Anthropic',
    name: 'Introduction to agent skills',
    provider: 'anthropic',
    certUrl: 'https://verify.skilljar.com/c/6tvrhxistwf2',
  },
  {
    org: 'Anthropic',
    name: 'Introduction to subagents',
    provider: 'anthropic',
    certUrl: 'https://verify.skilljar.com/c/m4hf6uxodihg',
  },
  {
    org: 'Anthropic',
    name: 'Claude with Amazon Bedrock',
    provider: 'anthropic',
    certUrl: 'https://verify.skilljar.com/c/q7x5bc6qo78f',
  },
  {
    org: 'Anthropic',
    name: "Claude with Google Cloud's Vertex AI",
    provider: 'anthropic',
    certUrl: 'https://verify.skilljar.com/c/x4puyp7qn2v7',
  },
  {
    org: 'Anthropic',
    name: 'Introduction to Model Context Protocol',
    provider: 'anthropic',
    certUrl: 'https://verify.skilljar.com/c/os5baz5ovkn4',
  },
  {
    org: 'Anthropic',
    name: 'Model Context Protocol: Advanced Topics',
    provider: 'anthropic',
    certUrl: 'https://verify.skilljar.com/c/o74mdizi5b56',
  },
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
        certUrl: normalizeCertUrl(c.certUrl),
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
