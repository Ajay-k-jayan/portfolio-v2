import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sphereState } from '../sphereState';

gsap.registerPlugin(ScrollTrigger);

export type SectionKey =
  | 'hero'
  | 'about'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'achievements'
  | 'certificates'
  | 'recommendations'
  | 'contact';

/** Target look per section — scrubbed between milestones as the user scrolls */
const SECTION_TARGETS: Record<SectionKey, typeof sphereState> = {
  hero: { offsetX: 0, offsetY: 0, scale: 1, opacity: 1, glow: 0.35 },
  /* Pushed toward the dock — fills space between copy and nav rail */
  about: { offsetX: 0.96, offsetY: -0.06, scale: 0.76, opacity: 0.9, glow: 0.34 },
  skills: { offsetX: 0.52, offsetY: 0.32, scale: 0.82, opacity: 0.52, glow: 0.28 },
  experience: { offsetX: 0.12, offsetY: -0.22, scale: 0.72, opacity: 0.38, glow: 0.22 },
  projects: { offsetX: -0.02, offsetY: 0.04, scale: 0.62, opacity: 0.48, glow: 0.26 },
  achievements: { offsetX: -0.18, offsetY: 0.1, scale: 0.58, opacity: 0.22, glow: 0.2 },
  certificates: { offsetX: 0.08, offsetY: -0.12, scale: 0.52, opacity: 0.1, glow: 0.15 },
  recommendations: { offsetX: -0.06, offsetY: 0.04, scale: 0.58, opacity: 0.26, glow: 0.32 },
  contact: { offsetX: 0, offsetY: 0, scale: 0.68, opacity: 0.42, glow: 0.85 },
};

const ORDER: SectionKey[] = [
  'hero',
  'about',
  'skills',
  'experience',
  'projects',
  'achievements',
  'certificates',
  'recommendations',
  'contact',
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpState(
  a: typeof sphereState,
  b: typeof sphereState,
  t: number,
): typeof sphereState {
  return {
    offsetX: lerp(a.offsetX, b.offsetX, t),
    offsetY: lerp(a.offsetY, b.offsetY, t),
    scale: lerp(a.scale, b.scale, t),
    opacity: lerp(a.opacity, b.opacity, t),
    glow: lerp(a.glow, b.glow, t),
  };
}

function sectionAnchorProgress(id: SectionKey): number {
  const el = document.getElementById(id);
  if (!el) return 0;
  const max = ScrollTrigger.maxScroll(window);
  if (max <= 0) return 0;
  const top = el.getBoundingClientRect().top + window.scrollY;
  return gsap.utils.clamp(0, 1, top / max);
}

function applySphereAtProgress(p: number) {
  const anchors = ORDER.map((key) => ({
    p: sectionAnchorProgress(key),
    state: SECTION_TARGETS[key],
  }));

  let i = 0;
  for (; i < anchors.length - 1; i++) {
    if (p >= anchors[i].p && p <= anchors[i + 1].p) break;
  }
  if (p < anchors[0].p) {
    Object.assign(sphereState, anchors[0].state);
    return;
  }
  if (p > anchors[anchors.length - 1].p) {
    Object.assign(sphereState, anchors[anchors.length - 1].state);
    return;
  }

  const left = anchors[Math.max(0, i)];
  const right = anchors[Math.min(anchors.length - 1, i + 1)];
  const span = right.p - left.p;
  const t = span > 0 ? (p - left.p) / span : 0;
  Object.assign(sphereState, lerpState(left.state, right.state, t));
}

/**
 * ScrollTrigger scrub (1.5) gives inertia-style follow; mapping uses ease: none between section anchors.
 */
export function initScrollSphere() {
  const st = ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5,
    onUpdate(self) {
      applySphereAtProgress(self.progress);
    },
  });

  ScrollTrigger.addEventListener('refresh', () => {
    applySphereAtProgress(st.progress);
  });

  applySphereAtProgress(st.progress);

  return () => {
    st.kill();
  };
}
