import { useEffect, useMemo, useState } from 'react';
import { getLenis } from '../lib/initLenisScroll';

type PaletteItem = {
  id: string;
  label: string;
  hint: string;
  run: () => void;
};

const SECTION_IDS = ['hero', 'about', 'skills', 'experience', 'projects', 'achievements', 'certifications', 'recommendations', 'contact'];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const items = useMemo<PaletteItem[]>(() => {
    const goTo = (id: string) => () => {
      const el = document.getElementById(id);
      if (!el) return;
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(el, { offset: 0, immediate: false });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setOpen(false);
    };

    const base: PaletteItem[] = SECTION_IDS.map((id) => ({
      id: `section-${id}`,
      label: `Go to ${id.charAt(0).toUpperCase()}${id.slice(1)}`,
      hint: 'Section navigation',
      run: goTo(id),
    }));

    return [
      ...base,
      {
        id: 'action-email',
        label: 'Compose email',
        hint: 'Open mail app',
        run: () => {
          window.location.href = 'mailto:ajaykj2000@gmail.com';
          setOpen(false);
        },
      },
      {
        id: 'action-linkedin',
        label: 'Open LinkedIn',
        hint: 'External profile',
        run: () => {
          window.open('https://www.linkedin.com/in/ajay-k-jayan/', '_blank', 'noopener,noreferrer');
          setOpen(false);
        },
      },
      {
        id: 'action-github',
        label: 'Open GitHub',
        hint: 'External profile',
        run: () => {
          window.open('https://github.com/Ajay-k-jayan', '_blank', 'noopener,noreferrer');
          setOpen(false);
        },
      },
    ];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => `${item.label} ${item.hint}`.toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    const onNav = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (event.key === 'Enter') {
        event.preventDefault();
        filtered[activeIndex]?.run();
      }
    };
    window.addEventListener('keydown', onNav);
    return () => window.removeEventListener('keydown', onNav);
  }, [activeIndex, filtered, open]);

  return (
    <>
      <button
        type="button"
        className="command-palette-toggle"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
      >
        <span>⌘K</span>
      </button>
      {open && (
        <div className="command-palette-layer" role="dialog" aria-modal="true" aria-label="Command palette">
          <button type="button" className="command-palette-backdrop" onClick={() => setOpen(false)} aria-label="Close command palette" />
          <div className="command-palette">
            <div className="command-palette__head">
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search sections or actions..."
                className="command-palette__input"
              />
              <span className="command-palette__hint">Esc</span>
            </div>
            <ul className="command-palette__list">
              {filtered.length ? (
                filtered.map((item, index) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`command-palette__item ${index === activeIndex ? 'is-active' : ''}`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={item.run}
                    >
                      <span>{item.label}</span>
                      <span>{item.hint}</span>
                    </button>
                  </li>
                ))
              ) : (
                <li className="command-palette__empty">No matching commands</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
