import { useRef, useState, type ChangeEvent, type MouseEvent } from 'react';
import { ImageOff, ImagePlus, Loader2, RotateCcw } from 'lucide-react';
import type { Recipe } from '../../types';
import { useAppStore } from '../../store/AppStore';
import { useToast } from '../ui/Toast';
import { IMAGE_ACCEPT, compressImageFile } from '../../lib/image';
import { cn } from '../../lib/cn';

interface RecipeImageUploadProps {
  recipe: Recipe;
  className?: string;
  variant?: 'icon' | 'pill';
  /** Show a reset control when a custom image exists (detail page). */
  showReset?: boolean;
}

/**
 * Opens the phone's photo picker, compresses the chosen picture and stores it
 * in localStorage under this recipe only. No server upload is involved.
 */
export function RecipeImageUpload({
  recipe,
  className,
  variant = 'icon',
  showReset = false,
}: RecipeImageUploadProps) {
  const { recipeImages, setRecipeImage, removeRecipeImage } = useAppStore();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const hasCustom = Boolean(recipeImages[recipe.id]);

  const openPicker = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!busy) inputRef.current?.click();
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setBusy(true);
    try {
      const dataUrl = await compressImageFile(file, { maxSize: 1000, quality: 0.76 });
      if (dataUrl.length > 1_600_000) {
        throw new Error('图片压缩后还是太大，请换一张更小的');
      }
      await setRecipeImage(recipe.id, dataUrl);
      showToast(`已为「${recipe.name}」换上你的图片（仅保存在本机）`, {
        icon: <ImagePlus className="h-3.5 w-3.5" />,
      });
    } catch (error) {
      showToast(error instanceof Error ? error.message : '图片处理失败，请换一张试试', {
        icon: <ImageOff className="h-3.5 w-3.5" />,
      });
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await removeRecipeImage(recipe.id);
      showToast(`已恢复「${recipe.name}」的默认图片`, {
        icon: <RotateCcw className="h-3.5 w-3.5" />,
      });
    } catch (error) {
      showToast(error instanceof Error ? error.message : '恢复失败，请稍后再试', {
        icon: <ImageOff className="h-3.5 w-3.5" />,
      });
    }
  };

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        className="hidden"
        onChange={handleFile}
        tabIndex={-1}
      />

      {showReset && hasCustom && (
        <button
          type="button"
          onClick={handleReset}
          aria-label={`恢复 ${recipe.name} 的默认图片`}
          title="恢复默认图片"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/90 text-ink-500 shadow-soft backdrop-blur transition-colors hover:bg-white hover:text-ink-800 active:scale-95"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      )}

      <button
        type="button"
        onClick={openPicker}
        disabled={busy}
        aria-label={`从相册${hasCustom ? '更换' : '上传'} ${recipe.name} 的图片`}
        title="从相册上传"
        className={cn(
          'flex items-center justify-center gap-1.5 border border-white/60 bg-white/92 font-medium text-ink-600 shadow-soft backdrop-blur transition-colors hover:bg-white hover:text-theme-deep active:scale-95 disabled:opacity-60',
          variant === 'icon'
            ? 'h-8 w-8 rounded-full'
            : 'h-9 rounded-full px-3 text-[10px]',
        )}
      >
        {busy ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <ImagePlus className="h-3.5 w-3.5" />
        )}
        {variant === 'pill' && <span>{hasCustom ? '从相册换图' : '从相册上传'}</span>}
      </button>
    </div>
  );
}
