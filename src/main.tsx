import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { CoinProvider } from './context/CoinContext';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root')!;

const AppWithProviders = () => (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <CoinProvider>
          <App />
        </CoinProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

// Always use createRoot for deployment to avoid hydration issues
createRoot(rootElement).render(<AppWithProviders />);