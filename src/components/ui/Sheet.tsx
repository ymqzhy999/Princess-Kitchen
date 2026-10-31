import { useEffect, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  panelClassName?: string;
}

/**
 * Bottom sheet on phones / centred dialog on desktop.
 * Locks background scrolling and closes with Escape or a backdrop tap.
 */
export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  panelClassName,
}: SheetProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-ink-900/35 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          'relative flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[32px] border border-white/70 bg-cream-50 shadow-2xl',
          'animate-[pk-sheet-up_0.32s_cubic-bezier(0.22,1,0.36,1)_both] sm:max-h-[86vh] sm:rounded-[32px]',
          panelClassName,
        )}
      >
        <div className="flex justify-center pt-2.5 sm:hidden">
          <span className="h-1 w-10 rounded-full bg-blush-200" />
        </div>

        {(title || description) && (
          <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-4">
            <div className="min-w-0">
              {title && (
                <h2
                  id={titleId}
                  className="font-display text-lg font-semibold tracking-wide text-ink-900"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p id={descriptionId} className="mt-1 text-xs leading-relaxed text-ink-500">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="关闭"
              className="-mr-1 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80 text-ink-500 transition-colors hover:bg-blush-100 hover:text-ink-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">{children}</div>

        {footer && (
          <div className="border-t border-blush-100/80 bg-white/50 px-5 pb-sheet pt-3 sm:pb-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
