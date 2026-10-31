import type { Recipe } from '../../types';
import { useAppStore } from '../../store/AppStore';
import { ImageWithFallback } from '../ui/ImageWithFallback';

interface RecipeImageProps {
  recipe: Recipe;
  alt?: string;
  className?: string;
  imageClassName?: string;
  fallbackLabel?: string;
  loading?: 'lazy' | 'eager';
  compact?: boolean;
}

/** Recipe cover that prefers the user's locally uploaded image. */
export function RecipeImage({
  recipe,
  alt,
  className,
  imageClassName,
  fallbackLabel,
  loading,
  compact,
}: RecipeImageProps) {
  const { recipeImages } = useAppStore();
  const src = recipeImages[recipe.id] ?? recipe.coverImage;

  return (
    <ImageWithFallback
      src={src}
      alt={alt ?? recipe.name}
      className={className}
      imageClassName={imageClassName}
      fallbackLabel={fallbackLabel}
      loading={loading}
      compact={compact}
    />
  );
}
