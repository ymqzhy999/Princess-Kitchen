import { Star } from 'lucide-react';
import { cn } from '../../lib/cn';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  className?: string;
}

const SIZES = {
  sm: 'h-3.5 w-3.5',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
};

export function StarRating({
  value,
  onChange,
  size = 'sm',
  readOnly = false,
  className,
}: StarRatingProps) {
  if (readOnly || !onChange) {
    return (
      <div
        className={cn('flex items-center gap-0.5', className)}
        aria-label={`${value} 星评分（满分 5 星）`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              SIZES[size],
              star <= value ? 'fill-amber-300 text-amber-300' : 'fill-transparent text-blush-200',
            )}
            strokeWidth={1.6}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-1', className)} role="group" aria-label="评分">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          aria-label={`${star} 星`}
          aria-pressed={star === value}
          className="rounded-full p-0.5 transition-transform duration-150 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme/40 active:scale-95"
        >
          <Star
            className={cn(
              SIZES[size],
              'transition-colors',
              star <= value ? 'fill-amber-300 text-amber-300' : 'fill-transparent text-blush-300',
            )}
            strokeWidth={1.6}
          />
        </button>
      ))}
    </div>
  );
}
