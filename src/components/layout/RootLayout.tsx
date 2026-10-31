import { Outlet } from 'react-router-dom';
import { AmbientBackground } from '../decorations/Ornaments';

/** Global frame: ambient background plus a phone-friendly max width. */
export function RootLayout() {
  return (
    <div className="relative min-h-dvh text-ink-800">
      <AmbientBackground />
      <div className="mx-auto min-h-dvh w-full max-w-[760px]">
        <Outlet />
      </div>
    </div>
  );
}
