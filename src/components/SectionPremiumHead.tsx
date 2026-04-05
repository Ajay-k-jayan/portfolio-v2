import './sectionPremiumHead.css';

export type SectionPremiumHeadMotion = 'reveal' | 'cinematic';

export type SectionPremiumHeadVariant = 'ice' | 'gold';

type SectionPremiumHeadProps = {
  kicker: string;
  title: string;
  titleId?: string;
  lead: string;
  pills: string[];
  pillsAriaLabel: string;
  variant?: SectionPremiumHeadVariant;
  motion?: SectionPremiumHeadMotion;
};

function motionProps(motion: SectionPremiumHeadMotion) {
  return motion === 'reveal' ? { 'data-reveal': true } : { 'data-cinematic': true };
}

export function SectionPremiumHead({
  kicker,
  title,
  titleId,
  lead,
  pills,
  pillsAriaLabel,
  variant = 'ice',
  motion = 'cinematic',
}: SectionPremiumHeadProps) {
  const m = motionProps(motion);
  return (
    <header className={`section-premium-head section-premium-head--${variant}`}>
      <div className="section-premium-head__rail" aria-hidden />
      <div className="section-premium-head__top">
        <p className="section-premium-head__kicker font-body" {...m}>
          {kicker}
        </p>
        <ul className="section-premium-head__pills font-body" aria-label={pillsAriaLabel} {...m}>
          {pills.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      </div>
      <h2 id={titleId} className="section-premium-head__title clash" {...m}>
        <span className="section-premium-head__title-word">{title}</span>
        <span className="section-premium-head__title-glow" aria-hidden>
          {title}
        </span>
      </h2>
      <p className="section-premium-head__lead font-body" {...m}>
        {lead}
      </p>
    </header>
  );
}
