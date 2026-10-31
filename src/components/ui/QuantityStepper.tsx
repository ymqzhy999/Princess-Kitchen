import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/cn';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  className,
}: QuantityStepperProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-blush-200 bg-white p-0.5',
        className,
      )}
    >
      <button
        type="button"
        aria-label="减少一份"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-7 w-7 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-blush-50 active:bg-blush-100 disabled:opacity-30"
      >
        <Minus className="h-3.5 w-3.5" strokeWidth={2.4} />
      </button>
      <span className="min-w-6 text-center text-sm font-semibold tabular-nums text-ink-800">
        {value}
      </span>
      <button
        type="button"
        aria-label="增加一份"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-7 w-7 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-blush-50 active:bg-blush-100 disabled:opacity-30"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
      </button>
    </div>
  );
}
