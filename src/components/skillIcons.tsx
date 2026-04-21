import { useCallback, useState } from 'react';
import { SKILL_ICON_SRC } from '../data/skillIconSources';

function initialsFrom(label?: string): string | null {
  if (!label) return null;
  const parts = label.trim().split(/\s+|\/|–|-+/).filter(Boolean);
  if (parts.length === 0) return null;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function IconFallback({ label }: { label?: string }) {
  const init = initialsFrom(label);
  if (!init) {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden className="skill-bento__svg skill-bento__svg--fallback">
        <rect width="32" height="32" rx="6" fill="#64748b" />
        <path stroke="#e2e8f0" strokeWidth="2" d="M12 20l8-8M20 20l-8-8" />
      </svg>
    );
  }
  return (
    <span className="clash" style={{ color: '#e5eaf3', fontSize: 14, lineHeight: 1 }}>
      {init}
    </span>
  );
}

/** Official / canonical brand artwork where possible; decorative (name is in the card heading). */
export function SkillIcon({ id, label }: { id: string; label?: string }) {
  const raw = SKILL_ICON_SRC[id];
  const src = typeof raw === 'string' ? raw.trim() : '';
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const onError = useCallback(() => {
    setFailedSrc(src);
  }, [src]);

  if (!src || failedSrc === src) {
    return <IconFallback label={label} />;
  }

  return (
    <img
      src={src}
      alt=""
      className="skill-bento__icon-img"
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={onError}
    />
  );
}
