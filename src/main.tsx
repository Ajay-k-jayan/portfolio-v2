import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './cinematic.css'
import './sectionPremium.css'
import './mobile-perf.css'
import App from './App.tsx'
import { NotFound } from './pages/NotFound.tsx'
import { Downloads } from './pages/Downloads.tsx'

// Detect Android early so CSS can target .is-android before first paint
if (/Android/i.test(navigator.userAgent)) {
  document.documentElement.classList.add('is-android')
}

// Minimal path-based routing
const { pathname } = window.location;
const norm = pathname.replace(/\/$/, '') || '/';

function Root() {
  if (norm === '/')                          return <App />;
  if (norm === '/downloads' || norm === '/resume') return <Downloads />;
  return <NotFound />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
