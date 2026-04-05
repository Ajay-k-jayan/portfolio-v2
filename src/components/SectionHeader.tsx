 

type SectionHeaderProps = {
  title: string;
  lead: string;
  titleId?: string;
};

export function SectionHeader({ title, lead, titleId }: SectionHeaderProps) {
  return (
    <div className="section-heading">
      <h2 id={titleId} className="section-title clash" data-cinematic>
        {title}
      </h2>
      <span className="section-title-line" aria-hidden />
      <p className="section-lead font-body" data-cinematic>
        {lead}
      </p>
    </div>
  );
}

