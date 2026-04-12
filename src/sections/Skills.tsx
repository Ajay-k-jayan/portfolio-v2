import { useEffect, useRef } from 'react';
import { cinematicReveal } from '../lib/cinematicMotion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { SkillBento } from '../components/SkillBento';
import { SectionHeader } from '../components/SectionHeader';

export function Skills() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return () => {};
    return cinematicReveal(el, '[data-cinematic]', reducedMotion, {
      stagger: 0.1,
      rotateX: 8,
      y: 36,
      blur: 5,
      start: 'top 86%',
    });
  }, [reducedMotion]);

  return (
    <section
      ref={ref}
      id="skills"
      className="section content-section skills-section cinematic-scene cinematic-scene--perspective"
    >
      <div className="skills-intro">
        <SectionHeader
          title="Skills"
          lead="My production toolkit — frameworks, libraries, testing/quality, CI/CD, and cloud services."
        />
        <SkillBento />
      </div>
    </section>
  );
}
