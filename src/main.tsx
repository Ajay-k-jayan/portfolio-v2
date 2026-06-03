import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './cinematic.css'
import './sectionPremium.css'
import './mobile-perf.css'
import App from './App.tsx'

// Detect Android early so CSS can target .is-android before first paint
if (/Android/i.test(navigator.userAgent)) {
  document.documentElement.classList.add('is-android')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
