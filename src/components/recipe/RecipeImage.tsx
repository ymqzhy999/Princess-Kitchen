import type { Recipe } from '../../types';
import { useAppStore } from '../../store/AppStore';
import { ImageWithFallback } from '../ui/ImageWithFallback';

/** `./images/recipes/dish_004.jpg` → `./images/recipes/thumbs/dish_004.jpg` */
function toThumb(src: string): string {
  const match = src.match(/^(.*)\/images\/recipes\/([^/]+)$/);
  return match ? `${match[1]}/images/recipes/thumbs/${match[2]}` : src;
}

interface RecipeImageProps {
  recipe: Recipe;
  alt?: string;
  className?: string;
  imageClassName?: string;
  fallbackLabel?: string;
  loading?: 'lazy' | 'eager';
  compact?: boolean;
  /** 列表/卡片用缩略图（480px），详情页用原图 */
  size?: 'thumb' | 'full';
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
  size = 'full',
}: RecipeImageProps) {
  const { recipeImages } = useAppStore();
  const custom = recipeImages[recipe.id];
  const base = custom ?? recipe.coverImage;
  const src = size === 'thumb' && !custom ? toThumb(base) : base;

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
