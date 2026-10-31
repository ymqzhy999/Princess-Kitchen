import { NavLink } from 'react-router-dom';
import { BookOpen, Heart, Home, ShoppingBag, UserRound, type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useAppStore } from '../../store/AppStore';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const ITEMS: NavItem[] = [
  { to: '/', label: '首页', icon: Home, end: true },
  { to: '/recipes', label: '菜谱', icon: BookOpen },
  { to: '/order', label: '今日菜单', icon: ShoppingBag },
  { to: '/favorites', label: '收藏', icon: Heart },
  { to: '/settings', label: '我的', icon: UserRound },
];

export function BottomNav() {
  const { order } = useAppStore();
  const dishCount = order.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)]">
      <nav
        aria-label="底部导航"
        className={cn(
          'pointer-events-auto mx-auto flex w-full max-w-[760px] items-stretch border-t border-white/80 bg-white/85 px-1.5 pt-1.5 shadow-[0_-8px_30px_-18px_rgba(163,45,83,0.35)] backdrop-blur-xl',
          'sm:mb-5 sm:max-w-[560px] sm:rounded-full sm:border sm:border-white/80 sm:px-3 sm:shadow-float',
        )}
      >
        {ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'relative flex flex-1 flex-col items-center gap-0.5 rounded-2xl pb-1.5 pt-1 transition-colors',
                isActive ? 'text-theme-deep' : 'text-ink-400 hover:text-ink-600',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'relative flex h-8 w-12 items-center justify-center rounded-full transition-all duration-300',
                    isActive
                      ? 'bg-gradient-to-br from-theme-soft to-lilac-100 shadow-innerSoft'
                      : 'bg-transparent',
                  )}
                >
                  <Icon
                    className="h-[19px] w-[19px]"
                    strokeWidth={isActive ? 2.2 : 1.8}
                    fill={isActive && to === '/favorites' ? 'currentColor' : 'none'}
                  />
                  {to === '/order' && dishCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-theme px-1 text-[9px] font-bold leading-none text-white shadow-sm">
                      {dishCount > 99 ? '99+' : dishCount}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    'text-[10px] leading-none tracking-wide transition-all',
                    isActive ? 'font-semibold' : 'font-normal',
                  )}
                >
                  {label}
                </span>
                {isActive && (
                  <span className="absolute -top-1.5 h-1 w-1 rounded-full bg-theme" aria-hidden="true" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
