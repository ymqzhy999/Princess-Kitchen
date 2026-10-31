import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  /** Hide the back button on top-level tab pages. */
  showBack?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  right,
  showBack = false,
  className,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={cn('mb-5 flex items-start justify-between gap-3', className)}>
      <div className="flex min-w-0 items-start gap-2.5">
        {showBack && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="返回上一页"
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/80 text-ink-600 shadow-soft transition-colors hover:bg-white hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="font-display text-[26px] font-semibold leading-tight tracking-wide text-ink-900">
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-xs leading-relaxed text-ink-500">{subtitle}</p>}
        </div>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </header>
  );
}
