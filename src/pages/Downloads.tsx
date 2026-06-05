import { useEffect, useRef, useState } from 'react';
import './Downloads.css';

const RESUME_PDF = '/Ajay_KJ.pdf';

export function Downloads() {
  const iframeRef  = useRef<HTMLIFrameElement>(null);
  const [pdfReady, setPdfReady] = useState(false);

  useEffect(() => {
    // Brief delay so page animates in before iframe loads
    const t = setTimeout(() => setPdfReady(true), 320);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="dl">
      {/* Background */}
      <div className="dl__bg"   aria-hidden />
      <div className="dl__orb dl__orb--a" aria-hidden />
      <div className="dl__orb dl__orb--b" aria-hidden />

      {/* Header */}
      <header className="dl__header">
        <a href="/" className="dl__back" aria-label="Back to portfolio">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          <span>Portfolio</span>
        </a>

        <div className="dl__header-center">
          <span className="dl__header-name">Ajay K J</span>
          <span className="dl__header-sep" aria-hidden>·</span>
          <span className="dl__header-doc">Resume</span>
        </div>

        <a
          href={RESUME_PDF}
          download="Ajay_KJ_Resume.pdf"
          className="dl__btn dl__btn--download"
          aria-label="Download resume PDF"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download
        </a>
      </header>

      {/* PDF viewer */}
      <main className="dl__main" role="main">
        <div className="dl__viewer">
          {pdfReady ? (
            <iframe
              ref={iframeRef}
              src={`${RESUME_PDF}#view=FitH&toolbar=0`}
              className="dl__iframe"
              title="Ajay K J — Resume"
              aria-label="Resume PDF viewer"
            />
          ) : (
            <div className="dl__placeholder" aria-hidden>
              <div className="dl__placeholder-ring" />
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="dl__actions">
          <a
            href={RESUME_PDF}
            download="Ajay_KJ_Resume.pdf"
            className="dl__btn dl__btn--primary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download PDF
          </a>
          <a
            href={RESUME_PDF}
            target="_blank"
            rel="noopener noreferrer"
            className="dl__btn dl__btn--ghost"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Open in new tab
          </a>
          <a href="/#contact" className="dl__btn dl__btn--ghost">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3.5" y="5.5" width="17" height="13" rx="1.5"/>
              <path d="m4 7 8 5 8-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Contact me
          </a>
        </div>
      </main>
    </div>
  );
}
