import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initTheme } from './theme';
import App from './App.tsx';

initTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
