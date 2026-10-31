import { CATEGORIES } from '../../data/categories';
import type { RecipeCategory } from '../../types';
import { cn } from '../../lib/cn';

export type CategoryFilterValue = RecipeCategory | '全部';

interface CategoryFilterProps {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
  counts?: Partial<Record<CategoryFilterValue, number>>;
  className?: string;
}

export function CategoryFilter({ value, onChange, counts, className }: CategoryFilterProps) {
  const items: CategoryFilterValue[] = ['全部', ...CATEGORIES.map((category) => category.name)];

  return (
    <div
      className={cn('-mx-4 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:px-0', className)}
      role="group"
      aria-label="按分类筛选菜谱"
    >
      <div className="flex w-max gap-2">
        {items.map((item) => {
          const active = item === value;
          const count = counts?.[item];
          return (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              aria-pressed={active}
              className={cn(
                'inline-flex h-8 shrink-0 items-center gap-1 rounded-full border px-3.5 text-xs transition-all duration-200',
                active
                  ? 'border-transparent bg-gradient-to-br from-theme to-theme-deep font-medium text-white shadow-float'
                  : 'border-white/80 bg-white/70 text-ink-500 hover:border-blush-200 hover:bg-white hover:text-ink-700',
              )}
            >
              {item}
              {typeof count === 'number' && count > 0 && (
                <span
                  className={cn(
                    'rounded-full px-1 text-[9px] leading-4',
                    active ? 'bg-white/20 text-white' : 'bg-blush-50 text-blush-500',
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
