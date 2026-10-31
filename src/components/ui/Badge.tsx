import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Tone = 'pink' | 'lilac' | 'cream' | 'sage' | 'outline';

const TONES: Record<Tone, string> = {
  pink: 'bg-theme-soft text-theme-deep',
  lilac: 'bg-lilac-100 text-lilac-600',
  cream: 'bg-cream-200 text-ink-600',
  sage: 'bg-emerald-50 text-emerald-700',
  outline: 'border border-blush-200 bg-white/70 text-ink-600',
};

interface BadgeProps {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = 'pink', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium leading-none',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
