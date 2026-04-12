import { useEffect, useRef } from 'react';
import { cinematicReveal, fadeUpOnScroll } from '../lib/cinematicMotion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { SectionHeader } from '../components/SectionHeader';
import { AchievementBento, type AchievementBentoItem } from '../components/AchievementBento';

type AchievementItem = AchievementBentoItem & { detail?: string };

const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'excelencia',
    label: 'Award',
    title: 'Beinex Excelencia Award',
    year: '2024',
    blurb: 'Outstanding delivery & ownership',
    detail: 'Recognition from leadership for execution, clarity, and owning outcomes end to end.',
  },
  {
    id: 'star-performer',
    label: 'Internship',
    title: 'Star Performer',
    blurb: 'Accelerated impact on product work',
    detail: 'Shipped meaningful features early — velocity, quality, and collaboration that stood out.',
  },
];

export function Achievements() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return () => {};
    return cinematicReveal(root, '[data-cinematic]', reducedMotion, {
      stagger: 0.1,
      rotateX: 10,
      y: 42,
      start: 'top 86%',
    });
  }, [reducedMotion]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return () => {};
    // Stagger tile reveal for wow factor
    return fadeUpOnScroll(root, '.ach-bento__cell', reducedMotion, {
      y: 40,
      stagger: 0.12,
      duration: 0.9,
      start: 'top 88%',
    });
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      id="achievements"
      className="section content-section achievements-section cinematic-scene cinematic-scene--perspective"
    >
      <div className="achievements-stage">
        <SectionHeader
          title="Achievements"
          lead="Proof you can point to — not buzzwords. Highlights that survived real deadlines, reviews, and shipping."
        />
        <AchievementBento items={ACHIEVEMENTS} />
      </div>
    </section>
  );
}
