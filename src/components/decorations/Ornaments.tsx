import { useId } from 'react';
import { cn } from '../../lib/cn';

/** Hand-drawn style bow, used sparingly as a brand ornament. */
export function Bow({ className }: { className?: string }) {
  // React's useId contains colons; strip them so SVG url(#id) references stay simple.
  const gradientId = `bow-${useId().replace(/:/g, '')}`;

  return (
    <svg
      viewBox="0 0 120 100"
      fill="none"
      aria-hidden="true"
      className={cn('h-10 w-12 text-theme', className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="20" y1="16" x2="102" y2="88">
          <stop stopColor="currentColor" stopOpacity="0.95" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.62" />
        </linearGradient>
      </defs>
      <path
        d="M56 47C42 23 13 15 10 34c-3 20 23 31 46 20Z"
        fill={`url(#${gradientId})`}
        stroke="white"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <path
        d="M64 47c14-24 43-32 46-13 3 20-23 31-46 20Z"
        fill={`url(#${gradientId})`}
        stroke="white"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <path d="M56 52 44 88l14-7 4-25Z" fill="currentColor" fillOpacity="0.7" />
      <path d="m64 52 12 36-14-7-4-25Z" fill="currentColor" fillOpacity="0.55" />
      <rect
        x="51"
        y="42"
        width="18"
        height="16"
        rx="7"
        fill="currentColor"
        stroke="white"
        strokeOpacity="0.6"
        strokeWidth="1.5"
      />
      <circle cx="56" cy="47" r="2" fill="white" fillOpacity="0.85" />
    </svg>
  );
}

/** A row of little pearls, used as a soft divider. */
export function PearlDivider({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-1.5', className)} aria-hidden="true">
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-blush-200" />
      {[0, 1, 2, 3].map((index) => (
        <span
          key={index}
          className={cn(
            'rounded-full bg-white shadow-[0_1px_2px_rgba(199,58,102,0.25)] ring-1 ring-blush-100',
            index === 1 || index === 2 ? 'h-2 w-2' : 'h-1.5 w-1.5',
          )}
        />
      ))}
      <span className="h-px w-8 bg-gradient-to-l from-transparent to-blush-200" />
    </div>
  );
}

/** Fixed ambient blobs behind the whole app; purely decorative. */
export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blush-200/50 blur-3xl" />
      <div className="absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-lilac-200/40 blur-3xl" />
      <div className="absolute -bottom-28 left-1/4 h-72 w-72 rounded-full bg-cream-300/50 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.9),transparent_55%)]" />
    </div>
  );
}
