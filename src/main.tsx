import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AppStoreProvider } from './store/AppStore';
import { ToastProvider } from './components/ui/Toast';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('找不到 #root 容器');
}

createRoot(container).render(
  <StrictMode>
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>
        <AppStoreProvider>
          <App />
        </AppStoreProvider>
      </ToastProvider>
    </HashRouter>
  </StrictMode>,
);
