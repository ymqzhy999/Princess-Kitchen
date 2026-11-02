import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Clock, Plus } from 'lucide-react';
import type { Recipe } from '../../types';
import { Badge } from '../ui/Badge';
import { RecipeImage } from './RecipeImage';
import { RecipeImageUpload } from './RecipeImageUpload';
import { FavoriteButton } from './FavoriteButton';
import { cn } from '../../lib/cn';

interface RecipeCardProps {
  recipe: Recipe;
  favorite: boolean;
  onToggleFavorite: () => void;
  onAddToOrder?: () => void;
  children?: ReactNode;
  className?: string;
  priority?: boolean;
}

export function RecipeCard({
  recipe,
  favorite,
  onToggleFavorite,
  onAddToOrder,
  children,
  className,
  priority = false,
}: RecipeCardProps) {
  return (
    <article
      className={cn(
        'pk-scroll-card group relative flex flex-col overflow-hidden rounded-[26px] border border-white/80 bg-white shadow-card',
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-blush-50">
        <Link
          to={`/recipe/${recipe.id}`}
          aria-label={`查看 ${recipe.name} 的做法`}
          className="absolute inset-0 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-theme/50"
        >
          <RecipeImage
            recipe={recipe}
            size="thumb"
            loading={priority ? 'eager' : 'lazy'}
            className="h-full w-full"
          />
          <span className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-900/20 to-transparent" />
          <Badge tone="pink" className="absolute left-2.5 top-2.5 bg-white/95">
            {recipe.category}
          </Badge>
        </Link>
        <FavoriteButton
          active={favorite}
          onToggle={onToggleFavorite}
          className="absolute right-2.5 top-2.5"
        />
        <RecipeImageUpload recipe={recipe} className="absolute bottom-2 right-2 z-10" />
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
        <Link
          to={`/recipe/${recipe.id}`}
          className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme/40"
        >
          <h3 className="line-clamp-2 font-display text-[14.5px] font-semibold leading-snug tracking-wide text-ink-900">
            {recipe.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-ink-500">
          {recipe.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2.5">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 text-[10.5px] text-ink-500">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 text-blush-400" strokeWidth={2} />
              {recipe.cookingTime} 分钟
            </span>
            <span className="inline-flex items-center gap-1">
              <ChefHat className="h-3 w-3 text-blush-400" strokeWidth={2} />
              {recipe.difficulty}
            </span>
          </div>
          {onAddToOrder && (
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onAddToOrder();
              }}
              aria-label={`把 ${recipe.name} 加入今日菜单`}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-theme-soft text-theme-deep transition-all hover:bg-theme hover:text-white active:scale-90"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.6} />
            </button>
          )}
        </div>

        {children}
      </div>
    </article>
  );
}
