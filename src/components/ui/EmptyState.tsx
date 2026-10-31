import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-4xl border border-dashed border-blush-200 bg-white/60 px-6 text-center',
        compact ? 'py-8' : 'py-12',
        className,
      )}
    >
      <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blush-100 to-lilac-100">
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-white/80" />
        <Icon className="h-7 w-7 text-blush-400" strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-base font-semibold text-ink-800">{title}</h3>
      <p className="mt-1.5 max-w-[260px] text-xs leading-relaxed text-ink-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
