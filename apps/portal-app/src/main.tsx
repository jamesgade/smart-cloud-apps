import { StrictMode, startTransition } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import './styles.scss'
import AppContextProvider from './app/contexts/AppContext';

// Remove loading skeleton once React is ready
const removeLoadingSkeleton = () => {
  const skeleton = document.querySelector('.loading-skeleton');
  if (skeleton) {
    skeleton.remove();
  }
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Use startTransition to mark rendering as non-urgent, allowing browser to paint earlier
// This helps reduce Total Blocking Time (TBT) by yielding to the browser
startTransition(() => {
  root.render(
    <StrictMode>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </StrictMode>
  );
  
  // Hide critical hero and show React content when ready
  const hideCriticalHero = () => {
    const heroCritical = document.querySelector('.hero-critical');
    if (heroCritical) {
      document.documentElement.classList.add('react-loaded');
    }
    removeLoadingSkeleton();
  };
  
  // Hide critical hero after React hydrates
  if ('requestIdleCallback' in window) {
    requestIdleCallback(hideCriticalHero, { timeout: 200 });
  } else {
    requestAnimationFrame(() => {
      setTimeout(hideCriticalHero, 100);
    });
  }
});
