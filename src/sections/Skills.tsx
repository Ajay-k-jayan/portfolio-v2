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
      aria-labelledby="skills-heading"
    >
      <div className="skills-intro">
        <SectionHeader
          titleId="skills-heading"
          title="Skills"
          lead="Angular, TypeScript, and frontend engineering — frameworks, testing, CI/CD, and cloud tooling I use in production."
        />
        <SkillBento />
      </div>
    </section>
  );
}
