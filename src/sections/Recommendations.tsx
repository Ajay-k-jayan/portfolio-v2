import { useEffect, useRef } from 'react';
import { cinematicReveal } from '../lib/cinematicMotion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { SectionHeader } from '../components/SectionHeader';
import { RecommendationSkillTiles } from '../components/RecommendationSkillTiles';
import './recommendations.css';

const LINKEDIN_PROFILE = 'https://www.linkedin.com/in/ajay-k-jayan';
/** LinkedIn “Recommendations” tab — all endorsements live here */
const LINKEDIN_RECOMMENDATIONS = `${LINKEDIN_PROFILE}/details/recommendations/`;

type RecommendationItem = {
  name: string;
  date: string;
  quote: string;
};

const RECOMMENDATIONS: RecommendationItem[] = [
  {
    name: 'Aneena Joy',
    date: 'January 2026',
    quote:
      'I collaborated closely with Ajay K J, a highly skilled and dependable Frontend Developer. He consistently delivered clean, responsive, and user-friendly UI implementations while ensuring alignment with design and functional requirements. Ajay was always receptive to feedback, quick to resolve UI issues, and proactive in collaborating with QA to ensure high-quality releases. His strong attention to detail, problem-solving ability, and positive attitude made him a valuable team member. I highly recommend Ajay for any Frontend Developer role.',
  },
  {
    name: 'Aswin K T',
    date: 'July 2025',
    quote:
      "I had the pleasure of working with Ajay K J since our internship days, and I've seen him grow into a highly skilled and dependable front-end developer. His expertise in Angular is exceptional, and his ability to quickly adapt to new challenges and technologies is impressive. Ajay consistently brought fresh ideas to the table and collaborated seamlessly with the team. I’ve learned a lot from working alongside him, and I’m confident he will be an asset to any organization he joins.",
  },
  {
    name: 'Ushanandini A',
    date: 'April 2025',
    quote:
      'Ajay is a very talented person that I know from Beinex. He is smart and always on top for problem solving. He always try to learn something new. I\'m very much happy that I could work with him.',
  },
  {
    name: 'Haritha Unni',
    date: 'January 2025',
    quote:
      'Ajay is a highly skilled and hardworking Angular developer with a deep understanding of front-end technologies. He is a problem-solver, always eager to learn and adapt to new challenges, making him a valuable asset to any development team. Highly recommended for any project requiring expertise in Angular and front-end development!',
  },
  {
    name: 'Alan Babu',
    date: 'January 2025',
    quote:
      'I had the pleasure of working with Ajay, and I can confidently say he is an outstanding software developer. His expertise in Angular, keen attention to detail, and exceptional problem-solving skills are truly remarkable. He is a fantastic team player and always ready to take on challenges.',
  },
];

export function Recommendations() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return () => {};
    return cinematicReveal(root, '[data-cinematic]', reducedMotion, {
      stagger: 0.1,
      rotateX: 10,
      y: 44,
      start: 'top 86%',
    });
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      id="recommendations"
      className="section content-section recommendations-section cinematic-scene cinematic-scene--perspective"
      aria-labelledby="recommendations-heading"
    >
      <div>
        <SectionHeader
          titleId="recommendations-heading"
          title="Recommendations"
          lead="Every quote below is mirrored on my LinkedIn recommendations tab — open it anytime for the source of truth."
        />
        <RecommendationSkillTiles items={RECOMMENDATIONS} sourceUrl={LINKEDIN_RECOMMENDATIONS} />
        <div className="recommendations-linkout" data-cinematic style={{ marginTop: '18px', textAlign: 'center' }}>
          <a
            className="btn btn-primary"
            href={LINKEDIN_RECOMMENDATIONS}
            target="_blank"
            rel="noopener noreferrer"
          >
            View all on LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
