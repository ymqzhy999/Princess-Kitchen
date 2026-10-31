import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

/** App shell for the five tab pages: safe areas, content width, bottom nav. */
export function AppLayout() {
  const { pathname } = useLocation();

  return (
    <div className="relative min-h-dvh">
      <ScrollToTop />
      <div className="mx-auto w-full max-w-[760px] px-4 pb-page pt-page sm:px-6">
        <div key={pathname} className="animate-fade-up">
          <Outlet />
        </div>
        {pathname !== '/' && pathname !== '/settings' && (
          <footer className="mt-8 text-center text-[8px] leading-relaxed text-ink-300">
            <p>戴诗佳女士所有，由 ymq 独立开发，版权所有 ©</p>
            <p className="mt-0.5 text-[7.5px] text-ink-300/80">
              All rights reserved by Ms. Dai Shijia. Independently developed by ymq. ©
            </p>
          </footer>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
