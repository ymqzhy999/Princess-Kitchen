import { Heart } from 'lucide-react';
import { cn } from '../../lib/cn';

interface FavoriteButtonProps {
  active: boolean;
  onToggle: () => void;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function FavoriteButton({
  active,
  onToggle,
  label,
  className,
  size = 'sm',
}: FavoriteButtonProps) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggle();
      }}
      aria-pressed={active}
      aria-label={label ?? (active ? '取消收藏' : '收藏这道菜')}
      className={cn(
        'flex items-center justify-center rounded-full border border-white/70 backdrop-blur-md transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme/40',
        'active:scale-90',
        size === 'sm' ? 'h-8 w-8' : 'h-10 w-10',
        active
          ? 'bg-theme text-white shadow-float'
          : 'bg-white/85 text-ink-500 hover:bg-white hover:text-theme',
        className,
      )}
    >
      <Heart
        className={cn(size === 'sm' ? 'h-4 w-4' : 'h-5 w-5', active && 'fill-current')}
        strokeWidth={2}
      />
    </button>
  );
}
