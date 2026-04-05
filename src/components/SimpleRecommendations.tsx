import './simpleRecommendations.css';

export type SimpleRecommendation = {
  name: string;
  date: string;
  quote: string;
};

export function SimpleRecommendations({ items }: { items: SimpleRecommendation[] }) {
  return (
    <ul className="simple-recs font-body" aria-label="Recommendations">
      {items.map((r) => (
        <li key={`${r.name}-${r.date}`} className="simple-recs__item">
          <header className="simple-recs__head">
            <cite className="simple-recs__name clash">{r.name}</cite>
            <time className="simple-recs__date">{r.date}</time>
          </header>
          <blockquote className="simple-recs__quote">{r.quote}</blockquote>
        </li>
      ))}
    </ul>
  );
}

