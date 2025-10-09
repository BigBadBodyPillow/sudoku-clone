import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// initialize app font from localStorage before rendering
const savedFont = (() => {
  try {
    const font = localStorage.getItem('font');
    // if not null/undefines/empty parse
    return font ? JSON.parse(font) : '';
  } catch {
    // if error just return an empty string
    return '';
  }
})();

if (savedFont) {
  // :root in css
  const root = document.documentElement;
  const backupFonts = ', system-ui, Avenir, Helvetica, Arial, sans-serif';
  root.style.setProperty('--app-font', `${savedFont}${backupFonts}`);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
