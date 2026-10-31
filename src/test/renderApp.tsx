import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { AppStoreProvider } from '../store/AppStore';
import { ToastProvider } from '../components/ui/Toast';

export function renderApp(initialEntry = '/') {
  const tree: ReactElement = (
    <MemoryRouter
      initialEntries={[initialEntry]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <ToastProvider>
        <AppStoreProvider>
          <App />
        </AppStoreProvider>
      </ToastProvider>
    </MemoryRouter>
  );

  return render(tree);
}
