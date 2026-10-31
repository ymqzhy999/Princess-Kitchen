import { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '../../lib/cn';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  /** Applied to the wrapper; use it to define the aspect ratio. */
  className?: string;
  imageClassName?: string;
  fallbackLabel?: string;
  loading?: 'lazy' | 'eager';
  /** Small, quiet fallback for thumbnails. */
  compact?: boolean;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  imageClassName,
  fallbackLabel = '实拍图待补充',
  loading = 'lazy',
  compact = false,
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-blush-100 via-cream-100 to-lilac-100',
          className,
        )}
      >
        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/40" />
        <div className="absolute -bottom-8 -left-4 h-24 w-24 rounded-full bg-white/30" />
        <div className="relative flex flex-col items-center gap-1.5 px-2 text-center text-blush-400">
          <ImageOff className={compact ? 'h-4 w-4' : 'h-6 w-6'} strokeWidth={1.5} />
          {!compact && <span className="text-[11px] tracking-wide">{fallbackLabel}</span>}
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className={cn('h-full w-full object-cover', imageClassName, className)}
    />
  );
}
