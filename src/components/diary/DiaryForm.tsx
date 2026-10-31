import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { CalendarDays, Camera, Check, ImagePlus, X } from 'lucide-react';
import type { DiaryDraft, DiaryEntry } from '../../types';
import { IMAGE_ACCEPT, compressImageFile } from '../../lib/image';
import { findRecipeByName, RECIPES } from '../../data/recipes';
import { todayISO } from '../../lib/format';
import { Button } from '../ui/Button';
import { StarRating } from '../ui/StarRating';

interface DiaryFormProps {
  initial?: DiaryEntry;
  onSubmit: (draft: DiaryDraft) => void;
  onCancel: () => void;
}

export function DiaryForm({ initial, onSubmit, onCancel }: DiaryFormProps) {
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const [dishName, setDishName] = useState(initial?.dishName ?? '');
  const [content, setContent] = useState(initial?.content ?? '');
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [photo, setPhoto] = useState<string | undefined>(initial?.photo);
  const [error, setError] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setProcessing(true);
    setPhotoError('');
    try {
      const dataUrl = await compressImageFile(file, { maxSize: 900, quality: 0.78 });
      setPhoto(dataUrl);
    } catch (uploadError) {
      setPhotoError(uploadError instanceof Error ? uploadError.message : '照片处理失败，请重试');
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = dishName.trim();
    if (!trimmedName) {
      setError('先写下今天做的菜名吧');
      return;
    }

    setError('');
    onSubmit({
      date,
      dishName: trimmedName,
      content: content.trim(),
      rating,
      photo,
      recipeId: findRecipeByName(trimmedName)?.id,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="diary-date" className="pk-label flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 text-blush-400" />
          日期
        </label>
        <input
          id="diary-date"
          type="date"
          value={date}
          max={todayISO()}
          onChange={(event) => setDate(event.target.value)}
          className="pk-input"
          required
        />
      </div>

      <div>
        <label htmlFor="diary-dish" className="pk-label">
          今天做了什么菜
        </label>
        <input
          id="diary-dish"
          type="text"
          value={dishName}
          onChange={(event) => {
            setDishName(event.target.value);
            if (error) setError('');
          }}
          list="diary-dish-options"
          maxLength={40}
          placeholder="比如：番茄炒蛋"
          className="pk-input"
          required
        />
        <datalist id="diary-dish-options">
          {RECIPES.map((recipe) => (
            <option key={recipe.id} value={recipe.name} />
          ))}
        </datalist>
        <p className="mt-1 text-[10px] text-ink-400">
          写下菜名即可，如果和菜谱同名，会自动关联到那道菜。
        </p>
      </div>

      <div>
        <span className="pk-label">美食照片</span>
        {photo ? (
          <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white">
            <img src={photo} alt="美食照片预览" className="aspect-[16/10] w-full object-cover" />
            <div className="absolute right-2 top-2 flex gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="更换照片"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-ink-600 shadow-soft backdrop-blur transition-colors hover:bg-white"
              >
                <Camera className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setPhoto(undefined)}
                aria-label="移除照片"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-ink-600 shadow-soft backdrop-blur transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={processing}
            className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-blush-200 bg-white/50 text-ink-400 transition-colors hover:border-theme/50 hover:bg-white hover:text-theme-deep disabled:opacity-60"
          >
            {processing ? (
              <>
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-blush-200 border-t-theme" />
                <span className="text-xs">正在处理照片…</span>
              </>
            ) : (
              <>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-50 text-blush-400">
                  <ImagePlus className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <span className="text-xs">添加一张美食照片</span>
                <span className="text-[10px] text-ink-300">支持相册选择，会自动压缩</span>
              </>
            )}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={IMAGE_ACCEPT}
          onChange={handlePhoto}
          className="hidden"
        />
        {photoError && <p className="mt-1.5 text-[11px] text-red-500">{photoError}</p>}
      </div>

      <div>
        <span className="pk-label">今天的味道</span>
        <div className="flex items-center justify-between rounded-2xl border border-blush-100 bg-white/70 px-4 py-3">
          <StarRating value={rating} onChange={setRating} size="lg" />
          <span className="text-xs font-medium text-ink-500">{rating} 星</span>
        </div>
      </div>

      <div>
        <label htmlFor="diary-content" className="pk-label">
          想记下的话
        </label>
        <textarea
          id="diary-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={500}
          rows={4}
          placeholder="今天味道怎么样？下次想改哪里？或者只是想说一句：和你一起吃饭真好。"
          className="pk-input min-h-[110px] resize-none leading-relaxed"
        />
        <div className="mt-1 flex justify-between text-[10px] text-ink-400">
          <span>可以留空，只记录照片和评分</span>
          <span className="tabular-nums">{content.length}/500</span>
        </div>
      </div>

      {error && <p className="text-[11px] text-red-500">{error}</p>}

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
          取消
        </Button>
        <Button type="submit" fullWidth leadingIcon={<Check className="h-4 w-4" />}>
          {initial ? '保存修改' : '收进日记本'}
        </Button>
      </div>
    </form>
  );
}
